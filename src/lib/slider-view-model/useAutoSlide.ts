import { onBeforeUnmount, onMounted, unref, watchEffect } from 'vue';
import { type MaybeRef, useElementVisibility } from '@vueuse/core';
import { SliderViewModel } from './SliderViewModel';

export const useAutoSlide = (
  containerElRef: MaybeRef<HTMLElement | null>,
  slider: SliderViewModel,
  delay: number
): void => {
  // scheduled slide to right action
  let scheduledSlide: unknown = null;

  const cancelScheduledSlide = (): void => {
    // @ts-expect-error clearTimeout accepts everything
    clearTimeout(scheduledSlide);
  };

  const scheduleSlide = () => {
    cancelScheduledSlide();
    scheduledSlide = setTimeout(() => {
      slider.slideToNext();
    }, delay);
  };

  onBeforeUnmount(cancelScheduledSlide);

  onMounted(() => {
    const containerVisible = useElementVisibility(containerElRef);

    watchEffect(() => {
      slider.getCurrentSlideIndex();

      if (unref(containerVisible)) {
        scheduleSlide();
      } else {
        cancelScheduledSlide();
      }
    });
  });
};
