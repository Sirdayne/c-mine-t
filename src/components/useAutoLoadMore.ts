import { type MaybeComputedElementRef, unrefElement, useEventListener } from '@vueuse/core';

const DEFAULT_BOTTOM_THRESHOLD = 1500;

export interface UseAutoLoadMoreOptions {
  target: MaybeComputedElementRef;
  callback: VoidFunction;
  // on which bottom callback should be triggerred
  threshold?: number;
}

/**
 * Calls callback when "bottom" of target reaches threshold
 */
export const useAutoLoadMore = (options: UseAutoLoadMoreOptions): void => {
  useEventListener(
    'scroll',
    () => {
      const { callback, target, threshold = DEFAULT_BOTTOM_THRESHOLD } = options;
      const bottom = unrefElement(target)?.getBoundingClientRect()?.bottom || 0;
      // bottom can be below zero when scrolled to footer
      // so do not trigger load to prevent spam of XHRs
      const shouldLoad = bottom > 0 && bottom <= threshold;

      if (shouldLoad) callback();
    },
    {
      passive: true,
    }
  );
};
