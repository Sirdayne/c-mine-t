<script setup lang="ts">
import { CtArrow } from '~/lib/ui';
import { OptimizedImage } from '~/lib/image';
import { useDeviceInfo } from '~/lib/device-detector';
import { SliderViewModel } from '~/lib/slider-view-model';
import { computed, onMounted, ref } from 'vue';
import { Event } from '~/graphql';

const DESKTOP_IMAGE_HEIGHT = 80;
const DESKTOP_IMAGE_WIDTH = 146;

const TABLET_IMAGE_WIDTH = 90;
const TABLET_IMAGE_HEIGHT = 56;

const MOBILE_IMAGE_WIDTH = 104;
const MOBILE_IMAGE_HEIGHT = 56;

const props = defineProps<{
  pageSliderVm: SliderViewModel;
  events: Event[];
}>();

const emit = defineEmits<{
  (event: 'contentReady', ref: HTMLElement): void;
}>();

const imageSize = computed(() => {
  if (deviceInfo.desktop) {
    return {
      width: DESKTOP_IMAGE_WIDTH,
      height: DESKTOP_IMAGE_HEIGHT,
    };
  } else if (deviceInfo.tablet) {
    return {
      width: TABLET_IMAGE_WIDTH,
      height: TABLET_IMAGE_HEIGHT,
    };
  }

  return {
    width: MOBILE_IMAGE_WIDTH,
    height: MOBILE_IMAGE_HEIGHT,
  };
});

const deviceInfo = useDeviceInfo();

const pageSliderContainerElRef = ref<HTMLElement | null>(null);

const maxSliderPerView = computed(() => {
  if (deviceInfo.mobile) return 3;

  return 7;
});

const arrowsVisible = computed(() => props.events.length > maxSliderPerView.value);
const onPageSlideToPrev = (): void => {
  if (!props.pageSliderVm.isOnFirstSlide()) props.pageSliderVm.slideToPrev();
};

const onPageSlideToNext = (): void => {
  if (props.pageSliderVm.isOnLastSlide()) props.pageSliderVm.slideTo(-1);
  if (!props.pageSliderVm.isOnLastSlide()) props.pageSliderVm.slideToNext();
};

onMounted(() => {
  if (pageSliderContainerElRef.value) {
    emit('contentReady', pageSliderContainerElRef.value);
  }
});
</script>

<template>
  <div
    class="overflow-hidden"
    data-testid="events-page-carousel-wrapper"
  >
    <div class="flex items-center overflow-x-hidden">
      <CtArrow
        v-if="arrowsVisible"
        :outline="false"
        direction="left"
        :disabled="pageSliderVm.isOnFirstSlide()"
        size="md"
        arrow-color="subtle"
        class="!p-0 rtl:rotate-180 -ml-[6px] sm:ml-0 md:mr-1"
        data-testid="events-page-carousel-prev-arrow"
        @click.native="onPageSlideToPrev"
      />
      <div
        ref="pageSliderContainerElRef"
        class="flex-grow flex flex-nowrap scrollbar-hidden"
        :class="{
          'px-4 overflow-x-hidden': events.length === 1,
          'overflow-x-auto snap-x snap-mandatory': events.length > 1,
          '[&>*:nth-child(3n)]:px-2': !deviceInfo.mobile,
          'justify-center': events.length <= maxSliderPerView,
        }"
      >
        <div
          v-for="(event, index) in events"
          :key="index"
          class="px-2 first:pl-0 md:first:pl-2 opacity-50 cursor-pointer w-full grow shrink-0 basis-[116px] max-w-[116px] h-14"
          :class="{
            '!opacity-100': index === pageSliderVm.getCurrentSlideIndex(),
            '!last:!pr-2 first:pl-2': deviceInfo.mobile && events.length < 3,
            '!basis-[162px] !max-w-[162px] h-20': deviceInfo.desktop,
            '!basis-[106px] !max-w-[106px] h-[56px]': deviceInfo.tablet,
            '!basis-[108px] !max-w-[108px]': deviceInfo.mobile && (index === 0 || index === events.length - 1),
          }"
          data-testid="events-page-carousel-slide"
          @click="pageSliderVm.slideTo(index, true)"
        >
          <OptimizedImage
            :width="imageSize.width"
            :height="imageSize.height"
            :src="event.imageUrl"
            class="rounded-containerM h-full"
            data-testid="events-page-carousel-slide-image"
          />
        </div>
      </div>

      <CtArrow
        v-if="arrowsVisible"
        :outline="false"
        direction="right"
        size="md"
        arrow-color="subtle"
        class="!p-0 rtl:rotate-180 -mr-[6px] sm:mr-0 mr:ml-1"
        data-testid="events-page-carousel-next-arrow"
        @click.native="onPageSlideToNext"
      />
    </div>
  </div>
</template>
