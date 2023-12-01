import { MaybeRefOrGetter, toValue } from '@vueuse/core';
import { type Ref, shallowRef, watchPostEffect, onMounted } from 'vue';
import { createInjection } from '~/lib/shared';
import { AdbutlerManager } from './AdbutlerManager';
import { AdbutlerCompositeKey } from './AdbutlerCompositeKey';
import { AdbutlerPlacement } from './types';
import { useAbortSignal } from '~/assets/libs/useAbortSignal';

export const { provide: provideAdbutlerManager, use: useAdbutlerManager } =
  createInjection<AdbutlerManager>('adbutler-manager');

export const useAdbutlerPlacement = (
  key: MaybeRefOrGetter<AdbutlerCompositeKey | null>
): Readonly<Ref<AdbutlerPlacement | null>> => {
  const manager = useAdbutlerManager();
  const placement = shallowRef<AdbutlerPlacement | null>(null);

  onMounted(() => {
    watchPostEffect(async (onCleanup) => {
      const _key = toValue(key);

      if (!_key) return;

      const signal = useAbortSignal(onCleanup);
      placement.value = await manager.getPlacement(_key, signal);
    });
  });

  return placement;
};
