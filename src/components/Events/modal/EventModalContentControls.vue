<script setup lang="ts">
import { CtArrow } from '~/lib/ui';
import { useDeviceInfo } from '~/lib/device-detector';
import { SliderViewModel } from '~/lib/slider-view-model';

const props = defineProps<{
  modalSliderVm: SliderViewModel;
}>();

const deviceInfo = useDeviceInfo();

const onSlideToPrev = (): void => {
  if (!props.modalSliderVm.isOnFirstSlide()) props.modalSliderVm.slideToPrev();
};

const onSlideToNext = (): void => {
  if (!props.modalSliderVm.isOnLastSlide()) props.modalSliderVm.slideToNext();
};
</script>

<template>
  <div>
    <CtArrow
      :outline="!deviceInfo.mobile"
      :disabled="modalSliderVm.isOnFirstSlide()"
      direction="left"
      arrow-color="white"
      :size="deviceInfo.mobile ? 'md' : 'lg'"
      class="bg-black absolute !outline-[#273036]"
      data-testid="event-modal-desktop-prev-arrow"
      :class="{
        'px-1 py-2 sm:px-0 sm:py-0 !rounded !h-10 bg-opacity-50 top-[calc(50%_-_30px)] left-7': deviceInfo.mobile,
        'top-1/2 left-4': !deviceInfo.mobile,
      }"
      @click.native="onSlideToPrev"
    />

    <CtArrow
      :outline="!deviceInfo.mobile"
      direction="right"
      :disabled="modalSliderVm.isOnLastSlide()"
      arrow-color="white"
      :size="deviceInfo.mobile ? 'md' : 'lg'"
      class="bg-black absolute !outline-[#273036]"
      data-testid="event-modal-desktop-prev-next"
      :class="{
        'px-1 py-2 !rounded sm:rounded-full !h-10 bg-opacity-50 md:rounded-containerM top-[calc(50%_-_30px)] right-7':
          deviceInfo.mobile,
        'mr-1 top-1/2 right-4': !deviceInfo.mobile,
      }"
      @click.native="onSlideToNext"
    />
  </div>
</template>
