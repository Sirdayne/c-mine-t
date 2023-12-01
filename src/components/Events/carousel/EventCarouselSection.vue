<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import EventModalCarousel from '../modal/EventModalCarousel.vue';
import EventActiveSlide from './EventActiveSlide.vue';
import { SliderViewModel, useAutoSlide } from '~/lib/slider-view-model';
import EventCarousel from './EventCarousel.vue';
import { Event } from '~/graphql';
import { useDeviceInfo } from '~/lib/device-detector';

const SLIDER_AUTOPLAY_DELAY = 7000;

const props = defineProps<{
  events: Event[];
}>();

const deviceInfo = useDeviceInfo();
const modalVisible = ref<boolean>(false);

const hideModal = (): void => {
  modalVisible.value = false;
};

const openModalWithSlideByIndex = (index: number): void => {
  modalSliderVM.slideTo(index);
  modalVisible.value = true;
};

const eventsCount = computed(() => props.events.length);

const pageSliderContainerElRef = ref<HTMLElement | null>(null);

const pageSliderVM = new SliderViewModel(
  pageSliderContainerElRef,
  eventsCount,
  computed(() => (deviceInfo.mobile ? 3 : 7))
);
const modalSliderVM = new SliderViewModel(null, eventsCount, 1, true);

useAutoSlide(pageSliderContainerElRef, pageSliderVM, SLIDER_AUTOPLAY_DELAY);
const setPageSliderContentRef = (content: HTMLElement): void => {
  pageSliderContainerElRef.value = content;
};

const getEventByIndex = (index: number): Event | null => {
  return props.events[index] ?? null;
};

const currentPageSliderEvent = computed(() => getEventByIndex(pageSliderVM.getCurrentSlideIndex()));

const currentModalSliderEvent = computed(() => getEventByIndex(modalSliderVM.getCurrentSlideIndex()));

watch(props.events, () => {
  pageSliderVM.slideTo(0);
  modalSliderVM.slideTo(0);
});
</script>

<template>
  <div>
    <template v-if="currentPageSliderEvent">
      <EventActiveSlide
        :event="currentPageSliderEvent"
        @openModal="openModalWithSlideByIndex(pageSliderVM.getCurrentSlideIndex())"
      />
      <EventCarousel
        :page-slider-vm="pageSliderVM"
        :events="events"
        @contentReady="setPageSliderContentRef"
      />
    </template>
    <EventModalCarousel
      v-if="modalVisible && currentModalSliderEvent"
      :event="currentModalSliderEvent"
      :modal-slider-vm="modalSliderVM"
      @close="hideModal"
    />
  </div>
</template>
