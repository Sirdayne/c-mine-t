<script setup lang="ts">
import { OptimizedImage } from '~/lib/image';
import { computed } from 'vue';
import { useDeviceInfo } from '~/lib/device-detector';
import { CtButton } from '~/lib/ui';
import { useStore } from '~/lib/framework';
import { type Event } from '~/graphql';

const TABLET_IMAGE_WIDTH = 728;
const TABLET_IMAGE_HEIGHT = 400;

const DESKTOP_IMAGE_WIDTH = 1192;
const DESKTOP_IMAGE_HEIGHT = 464;

const emit = defineEmits<{
  (e: 'openModal'): void;
}>();

defineProps<{
  event: Event;
}>();

const store = useStore();
const deviceInfo = useDeviceInfo();

const imageSize = computed(() => {
  if (deviceInfo.desktop) {
    return {
      width: DESKTOP_IMAGE_WIDTH,
      height: DESKTOP_IMAGE_HEIGHT,
    };
  }
  // Fix after events images will have same sizes => add mobile sizes
  return {
    width: TABLET_IMAGE_WIDTH,
    height: TABLET_IMAGE_HEIGHT,
  };
});
const openModal = (): void => {
  emit('openModal');
};

const visitWebsiteLabel = computed(() => store.state.i18n.eventsVisitWebsite);

const learnMore = computed(() => store.state.i18n.eventsLearnMore);

const aspectRatio = computed(() => {
  if (deviceInfo.desktop) return DESKTOP_IMAGE_WIDTH / DESKTOP_IMAGE_HEIGHT;

  return TABLET_IMAGE_WIDTH / TABLET_IMAGE_HEIGHT;
});
</script>

<template>
  <div
    class="mb-5 md:mb-6"
    data-testid="events-page-active-slide "
  >
    <div
      :class="$style['image-wrapper']"
      class="relative before:content-[''] before:float-left after:content-[''] after:block after:clear-both"
    >
      <OptimizedImage
        :src="event.imageUrl"
        :width="imageSize.width"
        :height="imageSize.height"
        :fill="!deviceInfo.desktop"
        class="rounded-t-lg absolute sm:static"
      />
    </div>
    <div class="bg-black py-2 pr-2 pl-5 items-center flex flex-wrap rounded-b-lg">
      <p
        v-if="!deviceInfo.mobile"
        class="text-white text-l md:text-xl leading-6 md:leading-[29px] mr-auto rtl:mr-4 rtl:ml-auto"
        data-testid="events-page-active-slide-title"
      >
        {{ event.title }}
      </p>
      <CtButton
        icon-name="information"
        icon-position="left"
        type="tertiary"
        :label="learnMore"
        class="text-[#DEE5E8] mr-auto rtl:ml-4 rtl:mr-auto sm:mx-4 hover:bg-transparent !px-0"
        data-testid="events-page-active-slide-learn-more"
        @click.native="openModal"
      />
      <CtButton
        link
        :href="event.website"
        round="default"
        target="_blank"
        :label="visitWebsiteLabel"
        class="min-w-[130px] justify-center"
        data-testid="events-page-active-slide-visit-website"
      />
    </div>
  </div>
</template>
<style module>
.image-wrapper {
  &:before {
    padding-top: calc(100% / v-bind(aspectRatio));
  }
}
</style>
