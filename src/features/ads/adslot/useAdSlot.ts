import { computed, onMounted, type Ref, shallowRef } from 'vue';
import { type MaybeRefOrGetter, toValue, watchTriggerable } from '@vueuse/core';
import { useAbortSignal } from '~/assets/libs/useAbortSignal';
import { useStore } from '~/lib/framework';
import { AdbutlerError, useAdbutlerManager } from '~/lib/adbutler';
import { captureError } from '~/lib/telemetry';
import { Banner as GraphQLBanner } from '~/graphql';
import { AdItemErrorCollector } from '../core/AdItemErrorCollector';
import { CustomRenderingItemParser } from '../core/CustomRenderingItemParser';
import { AdItemResolver } from '../core/AdItemResolver';
import { AdbutlerKeyParser } from '../core/AdbutlerKeyParser';
import { AdItemOptionsParser } from '../core/AdItemOptionsParser';
import { LegacyCustomRenderingItemParser } from '../core/LegacyCustomRenderingItemParser';
import { LegacyCustomRenderingItemParserContext } from '../core/LegacyCustomRenderingItemParserContext';
import { HtmlJsonCustomRenderingItemParser } from '../core/HtmlJsonCustomRenderingItemParser';
import { VuexBannerRepository } from './VuexBannerRepository';
import {
  AdSlotFailureReason,
  type AdSlotState,
  createFailedState,
  createLoadedState,
  createPendingState,
} from './AdSlotState';
import { whenIdle } from '~/lib/shared';

export type UseAdSlot = Readonly<Ref<AdSlotState>> & {
  // trigger fetch/refetch if not fetching
  trigger(): void;
  // resets ad slot to empty (no content) state
  reset(): void;
};

export const useAdSlot = (
  place: MaybeRefOrGetter<string>,
  index: MaybeRefOrGetter<string | number | null | undefined>
): UseAdSlot => {
  const stateRef = shallowRef<AdSlotState>(createPendingState());
  const adbutlerManager = useAdbutlerManager();
  const store = useStore();
  const bannerRepository = new VuexBannerRepository(store);

  const graphqlBannerRef = computed<GraphQLBanner | null>(() => {
    const _place = toValue(place);
    const _index = toValue(index) || 0;
    const banners = bannerRepository.getBannersByPlace(_place);
    // @ts-expect-error strings also can be used for indexing arrays. WTF TS?
    return banners[_index] ?? null;
  });

  const doFetch = async (graphqlBanner: GraphQLBanner | null, signal?: AbortSignal) => {
    if (!graphqlBanner) {
      stateRef.value = createFailedState(AdSlotFailureReason.NO_CONTENT);
      return;
    }

    try {
      await whenIdle({ signal });

      const errorCollector = new AdItemErrorCollector();
      const customRenderingItemParser = new CustomRenderingItemParser(errorCollector);
      const resolver = new AdItemResolver(
        adbutlerManager,
        new AdbutlerKeyParser(),
        new AdItemOptionsParser(),
        new LegacyCustomRenderingItemParser(
          new LegacyCustomRenderingItemParserContext(),
          customRenderingItemParser,
          errorCollector
        ),
        new HtmlJsonCustomRenderingItemParser(customRenderingItemParser, errorCollector)
      );

      const adItem = await resolver.resolveFromBanner(graphqlBanner, signal);
      const errors = errorCollector.collect();

      if (adItem === null) {
        if (errors.length === 0) {
          stateRef.value = createFailedState(AdSlotFailureReason.NO_CONTENT);
        } else {
          stateRef.value = createFailedState(AdSlotFailureReason.UNKNOWN);
        }
      } else if (adItem.hasContent()) {
        stateRef.value = createLoadedState(adItem);
      } else {
        stateRef.value = createFailedState(AdSlotFailureReason.NO_CONTENT);
      }
    } catch (error) {
      if (AdbutlerError.is(error)) {
        stateRef.value = createFailedState(AdSlotFailureReason.ADBLOCKED);
        return;
      }

      captureError(error);
    }
  };

  const bannersLoadedRef = computed(() => store.state.bannersLoaded);

  const { trigger } = watchTriggerable(
    [graphqlBannerRef, bannersLoadedRef],
    async ([graphqlBanner, bannersLoaded], _, onCleanup) => {
      const signal = useAbortSignal(onCleanup);

      // to prevent CLS until banners loaded
      if (!bannersLoaded) return;

      await doFetch(graphqlBanner, signal);
    }
  );
  const reset = (): void => {
    stateRef.value = createFailedState(AdSlotFailureReason.NO_CONTENT);
  };

  onMounted(trigger);

  return Object.assign(stateRef, { trigger, reset });
};
