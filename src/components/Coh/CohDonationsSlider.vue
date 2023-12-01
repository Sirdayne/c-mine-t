<script setup lang="ts">
import { type CohDonation } from './types';
import CohDonationCard from './CohDonationCard.vue';
import { computed, ref, unref } from 'vue';
import { SliderViewModel } from '~/lib/slider-view-model/index';
import { chunkItemsToSlides } from '~/assets/libs/chunkItemsToSlides';
import { useDeviceInfo } from '~/lib/device-detector';
import ArrowIcon from '~/assets/icons/arrow-lg.svg';
import { useWindowSize } from '@vueuse/core';

const props = defineProps<{
  donations: CohDonation[];
}>();
const MOBILE_SLIDES_PER_VIEW = 1;
const TABLET_SLIDES_PER_VIEW = 3;
const SMALL_SCREEN_SLIDES_PER_VIEW = 4;
const DESKTOP_SLIDES_PER_VIEW = 5;

const deviceInfo = useDeviceInfo();
const { width } = useWindowSize();
const isSmallDesktop = computed(() => width.value > 992 && width.value < 1270);
const slidesPerView = computed(() =>
  deviceInfo.desktop && !isSmallDesktop.value
    ? DESKTOP_SLIDES_PER_VIEW
    : deviceInfo.tablet
    ? TABLET_SLIDES_PER_VIEW
    : isSmallDesktop.value
    ? SMALL_SCREEN_SLIDES_PER_VIEW
    : MOBILE_SLIDES_PER_VIEW
);
const containerElRef = ref<HTMLElement | null>(null);
const arrowsVisible = computed(() => props.donations.length > unref(slidesPerView));

const slides = computed(() => chunkItemsToSlides(props.donations, unref(slidesPerView)));

const slider = new SliderViewModel(
  containerElRef,
  computed(() => unref(slides).length)
);

const showPrevArrow = computed(() => slider.getCurrentSlideIndex() > 0);
const showNextArrow = computed(() => slider.getCurrentSlideIndex() < unref(slides).length - 1);
const onSlideToPrev = (): void => {
  if (!slider.isOnFirstSlide()) slider.slideToPrev();
};

const onSlideToNext = (): void => {
  if (!slider.isOnLastSlide()) slider.slideToNext();
};
</script>

<template>
  <div
    class="flex w-full items-center overflow-x-hidden relative scrollbar-hidden"
    :class="{
      [$style['unset-overflow']]: true,
    }"
  >
    <div
      v-if="arrowsVisible"
      class="p-xs w-xxl h-xxl rounded-containerPill group mx-1 sm:mx-0 sm:absolute sm:left-1 lg:-left-10 bg-black outline outline-1 !outline-[#50575F]"
      :class="{
        'cursor-not-allowed': slider.isOnFirstSlide(),
        'cursor-pointer': !slider.isOnFirstSlide(),
        invisible: !showPrevArrow,
      }"
      @click="onSlideToPrev"
    >
      <ArrowIcon
        name="arrow"
        class="text-fg-muted w-xl h-xl group-hover:text-[#FFE207]"
      />
    </div>
    <div
      ref="containerElRef"
      class="flex-grow flex flex-nowrap scrollbar-hidden"
      :class="{
        'px-4 overflow-x-hidden': donations.length === 1,
        'overflow-x-auto snap-x snap-mandatory': donations.length > 1,
        'basis-[100%] shrink-0': deviceInfo.desktop && !isSmallDesktop,
      }"
      @scrollend="slider.onScrollEnd()"
    >
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="flex shrink-0 flex-grow flex-nowrap snap-start snap-always mx-1 w-full justify-center"
      >
        <CohDonationCard
          v-for="{ item: donation, indexSlide } in slide"
          :key="indexSlide"
          :donation="donation"
          class="w-full grow mx-1 sm:max-w-[224px]"
        />
      </div>
    </div>
    <div
      v-if="arrowsVisible"
      class="p-xs w-xxl h-xxl rounded-containerPill group mx-1 sm:mx-0 sm:absolute sm:right-1 lg:-right-10 bg-black outline outline-1 !outline-[#50575F]"
      :class="{
        'cursor-not-allowed': slider.isOnLastSlide(),
        'cursor-pointer': !slider.isOnLastSlide(),
        invisible: !showNextArrow,
      }"
      @click="onSlideToNext"
    >
      <ArrowIcon
        name="arrow"
        class="text-fg-muted w-xl h-xl rotate-180 group-hover:text-[#FFE207]"
      />
    </div>
  </div>
</template>

<style module lang="scss">
@import '~/assets/styles/_vars.scss';

.unset-overflow {
  @media (min-width: $lg) {
    overflow-x: unset;
  }
}
</style>
