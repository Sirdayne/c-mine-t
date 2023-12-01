<script lang="ts">
import {
  computed,
  defineComponent,
  h,
  type PropType,
  unref,
  useCssModule,
  useSlots,
  type VNode,
  VNodeChildren,
} from 'vue';
import {
  CUSTOM_RENDERING_COMPONENT_REGISTRY,
  CustomRenderingComponentRegistry,
} from './custom-rendering-component-registry';
import TrackingPixel from './components/TrackingPixel.vue';
import RawBody from './components/RawBody.vue';
import ImageLink from './components/ImageLink.vue';
import AdblockFallback from './components/AdblockFallback.vue';
import { type AdItem } from './core/AdItem';
import { type AdSlotConfig, DEFAULT_AD_SLOT_CONFIG } from './adslot/AdSlotConfig';
import { AdSlotFailureReason, type AdSlotState, AdSlotStatus } from './adslot/AdSlotState';
import { provideAdSlotContext } from './adslot/useAdSlotContext';
import { AdItemKeyGenerator } from './AdItemKeyGenerator';
import CloseAdButton from './CloseAdButton.vue';
import { CustomRenderingViews } from './core/CustomRenderingViews';

export default defineComponent({
  name: 'AdSlotView',

  props: {
    state: {
      type: Object as PropType<AdSlotState>,
      required: true,
    },

    place: {
      type: String,
      required: true,
    },

    config: {
      type: Object as PropType<Partial<AdSlotConfig>>,
      default: null,
    },

    /**
     * Only for overriding custom rendering views in tests or stories!
     */
    componentRegistry: {
      type: Object as PropType<CustomRenderingComponentRegistry>,
      default: null,
    },
  },

  emits: ['close'],

  setup(props, { emit }) {
    const keyGen = new AdItemKeyGenerator();
    const classes = useCssModule();
    const configWithDefaults = computed(() => ({
      ...DEFAULT_AD_SLOT_CONFIG,
      ...props.config,
    }));

    const renderAd = (adItem: AdItem, config: AdSlotConfig): VNode | null => {
      const customRenderingItem = adItem.getCustomRenderingItem();
      const imageUrl = adItem.getImageUrl();
      const body = adItem.getBody();
      const redirectUrl = adItem.getRedirectUrl();

      const onClose = (): void => {
        emit('close');
      };

      if (customRenderingItem) {
        const { view } = customRenderingItem;

        provideAdSlotContext(adItem, props.place, config);

        // @ts-expect-error unsafe, but validated but AdItem
        return h(CUSTOM_RENDERING_COMPONENT_REGISTRY[view], {
          key: keyGen.for(adItem),
          on: {
            close: onClose,
          },
        });
      }

      if (body)
        return h(RawBody, {
          props: {
            body,
          },
        });

      if (imageUrl)
        return h(ImageLink, {
          props: {
            imageUrl,
            redirectUrl,
            place: props.place,
          },
        });

      // no ads
      return null;
    };

    const renderTrackingPixel = (adItem: AdItem): VNode | null => {
      const trackingPixelUrl = adItem.getTrackingPixelUrl();

      if (!trackingPixelUrl) return null;

      return h(TrackingPixel, {
        props: {
          trackingPixelUrl,
        },
      });
    };

    const renderCloseButton = (adItem: AdItem, config: AdSlotConfig): VNode | null => {
      const stretchYoutube = adItem?.getCustomRenderingItem()?.view === CustomRenderingViews.STRETCH_YOUTUBE;
      const youtube = adItem?.getCustomRenderingItem()?.view === CustomRenderingViews.YOUTUBE_VIDEO;
      const storyWidget = adItem?.getCustomRenderingItem()?.view === CustomRenderingViews.STORY_WIDGET;

      if (!config.closable || youtube || stretchYoutube) return null;

      const onClose = (): void => {
        emit('close');
      };

      return h(CloseAdButton, {
        props: {
          labelHidden: storyWidget,
        },
        on: {
          close: onClose,
        },
      });
    };

    const renderFragment = (state: AdSlotState, config: AdSlotConfig): VNodeChildren => {
      if (state.status === AdSlotStatus.LOADED) {
        const { adItem } = state;
        const adVNode = renderAd(adItem, config);

        if (adVNode === null) return [];

        const slots = useSlots();
        const defaultSlot = slots.default?.() ?? null;

        return [adVNode, defaultSlot, renderTrackingPixel(adItem), renderCloseButton(adItem, config)];
      }

      if (state.reason === AdSlotFailureReason.ADBLOCKED && !config.adblockFallbackDisabled)
        return [h(AdblockFallback)];

      return [];
    };

    return () => {
      const { state } = props;
      const config = unref(configWithDefaults);

      if (state.reason === AdSlotFailureReason.NO_CONTENT) return null;

      return h(
        'div',
        {
          class: {
            [classes['ad-slot']]: true,
            [classes['ad-slot--aspect-ratio']]: Boolean(config.aspectRatio),
          },
          // for SSR
          style: {
            '--aspect-ratio': String(config.aspectRatio),
          },
        },
        renderFragment(state, config)
      );
    };
  },
});
</script>

<style module lang="scss">
.ad-slot {
  position: relative;

  /// @see https://github.com/takamoso/postcss-aspect-ratio-polyfill/blob/master/index.js
  &--aspect-ratio {
    &::before {
      content: '';
      padding-top: calc(100% * var(--aspect-ratio));
      float: left;
    }

    &::after {
      content: '';
      display: block;
      clear: both;
    }
  }
}
</style>
