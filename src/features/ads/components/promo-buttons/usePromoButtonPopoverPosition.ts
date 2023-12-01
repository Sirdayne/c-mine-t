import { computed, type Ref, unref } from 'vue';
import { useCurrentElement, useElementBounding, useWindowSize } from '@vueuse/core';

const THRESHOLD = 360;

export const usePromoButtonPopoverPosition = (): Readonly<Ref<'top' | 'bottom'>> => {
  const currentElement = useCurrentElement<HTMLElement>();
  const windowSize = useWindowSize();
  const rect = useElementBounding(currentElement);

  return computed(() => {
    return unref(windowSize.height) - unref(rect.bottom) < THRESHOLD ? 'top' : 'bottom';
  });
};
