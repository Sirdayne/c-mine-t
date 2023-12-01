<script setup lang="ts">
import { computed } from 'vue';
import { Guide } from '~/graphql';
import LinkResolver from '~/components/Shared/LinkResolver.vue';
import { OptimizedImage } from '~/lib/image';
import { useDeviceInfo } from '~/lib/device-detector';

const DESKTOP_IMAGE_HEIGHT = 252;
const DESKTOP_IMAGE_WIDTH = 374;

const MOBILE_IMAGE_HEIGHT = 204;
const MOBILE_IMAGE_WIDTH = 370;

const TABLET_IMAGE_WIDTH = 344;

const props = defineProps<{
  guide: Guide;
}>();
const guideUrl = computed(() => `/learn/${props.guide.slug}`);
const deviceInfo = useDeviceInfo();

const imageSize = computed(() => {
  if (deviceInfo.desktop)
    return {
      width: DESKTOP_IMAGE_WIDTH,
      height: DESKTOP_IMAGE_HEIGHT,
    };
  if (deviceInfo.tablet)
    return {
      width: TABLET_IMAGE_WIDTH,
      height: MOBILE_IMAGE_HEIGHT,
    };

  return {
    width: MOBILE_IMAGE_WIDTH,
    height: MOBILE_IMAGE_HEIGHT,
  };
});

const title = computed(() => props.guide.translate?.title ?? '');
</script>

<template>
  <LinkResolver
    :href="guideUrl"
    :class="[`max-w-[${imageSize.width}]`]"
    class="flex flex-col decoration-0 text-inherit relative h-full text-[#27282d] bg-white rounded-[5px] shadow-[0_2px_32px_0_#00000014] transition-shadow rounded-lg"
  >
    <OptimizedImage
      :src="guide.coverImg"
      :height="imageSize.height"
      :width="imageSize.width"
      data-testid="guide-image"
      class="rounded-ss-lg rounded-se-lg object-cover"
    />
    <span
      data-testid="guide-title"
      class="block overflow-hidden px-5 py-4 text-base text-left text-[#111619] font-semibold"
    >
      {{ title }}
    </span>
  </LinkResolver>
</template>
