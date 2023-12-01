import { inject, type InjectionKey, provide } from 'vue';
import { type CustomRenderingViews } from '../core/CustomRenderingViews';
import { type InferCustomRenderingViewProps } from '../core/custom-rendering-props-schema-registry';
import { type AdItem } from '../core/AdItem';
import { type AdSlotConfig, DEFAULT_AD_SLOT_CONFIG } from './AdSlotConfig';
import { AdSlotContextError, AdSlotContextErrorReason } from './AdSlotContextError';

export interface AdSlotContext {
  readonly adItem: AdItem;
  readonly place: string;
  readonly config: AdSlotConfig;
}

const AD_SLOT_CONTEXT_INJECTION_KEY: InjectionKey<AdSlotContext> = Symbol('ad slot context');

export const provideAdSlotContext = (adItem: AdItem, place: string, config: Partial<AdSlotConfig>): void => {
  provide(AD_SLOT_CONTEXT_INJECTION_KEY, {
    adItem,
    place,
    config: {
      ...DEFAULT_AD_SLOT_CONFIG,
      ...config,
    },
  });
};

export const useAdSlotContext = (): AdSlotContext => {
  const context = inject(AD_SLOT_CONTEXT_INJECTION_KEY);

  if (!context) throw new AdSlotContextError(AdSlotContextErrorReason.NO_CONTEXT_PROVIDED);

  return context;
};

export const useCustomRenderingProps = <View extends CustomRenderingViews>(
  view: View
): InferCustomRenderingViewProps<View> => {
  const item = useAdSlotContext().adItem.getCustomRenderingItem();

  if (!item) throw new AdSlotContextError(AdSlotContextErrorReason.NO_CUSTOM_RENDERING_ITEM);
  if (item.view !== view) throw new AdSlotContextError(AdSlotContextErrorReason.VIEW_MISMATCH);

  // @ts-expect-error already validated by parsers
  return item.props;
};
