<template>
  <Transition
    appear
    name="fade"
  >
    <Component
      :is="bannerComponent"
      v-if="stickerBannerVisibility.isVisible() && bannerComponent"
      :redirect-url="adItem.getRedirectUrl()"
      @close="handleClose"
    />
  </Transition>
</template>

<script setup lang="ts">
import { pushDataLayerEvent, stickyAdsEvents } from '~/assets/helpers/dataLayerEvents';
import { AsyncComponent, onMounted } from 'vue';
import { useAdSlotContext, useCustomRenderingProps } from '~/features/ads/adslot/useAdSlotContext';
import { useStickyBannerVisibility } from '~/features/ads/components/sticky-banners/useStickyBannerVisibility';
import { CustomRenderingViews } from '~/features/ads/core/CustomRenderingViews';

const TradeSantaBanner = () =>
  import(/* webpackChunkName: "trade-santa-banner" */ '~/features/ads/components/sticky-banners/TradeSantaBanner.vue');

const XGOBanner = () =>
  import(/* webpackChunkName: "xgo-banner"  */ '~/features/ads/components/sticky-banners/XGOBanner.vue');

const events = {
  'trade-santa-banner': 'Santa',
  'pionex-sticky-banner': 'Pionex',
  'xgo-banner': 'xGo',
} satisfies Record<string, string>;

const components = {
  'trade-santa-banner': TradeSantaBanner,
  'xgo-banner': XGOBanner,
} satisfies Record<string, AsyncComponent>;

const { adItem } = useAdSlotContext();
const props = useCustomRenderingProps(CustomRenderingViews.STICKY);
const stickerBannerVisibility = useStickyBannerVisibility(props.componentName);

const bannerComponent = components[props.componentName];
const eventName = events[props.componentName];
const dataLayerEventData = events[props.componentName] && stickyAdsEvents(eventName);

const handleClose = (): void => {
  stickerBannerVisibility.hide();
  if (dataLayerEventData) {
    pushDataLayerEvent({
      type: 'hide',
      dataLayerEventData: dataLayerEventData,
    });
  }
};

onMounted(() => {
  if (dataLayerEventData && stickerBannerVisibility.isVisible()) {
    pushDataLayerEvent({
      type: 'impression',
      dataLayerEventData: dataLayerEventData,
    });
  }
});
</script>
