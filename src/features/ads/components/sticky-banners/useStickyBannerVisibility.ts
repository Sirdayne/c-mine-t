import { useCookies } from '~/lib/cookies';
import { ref, unref } from 'vue';

const COOKIE_NAME = 'sticky_hide';
const DAY = 60 * 60 * 24;

/**
 * Show or hide sticky banner depends on cookie (hide if cookie exist)
 */
export interface StickyBannerVisibility {
  hide(): void;
  isVisible(): boolean;
}

export const useStickyBannerVisibility = (key: string): StickyBannerVisibility => {
  const cookies = useCookies();
  const cookieName = `${COOKIE_NAME}_${key}`;
  const visibleRef = ref(!cookies.get(cookieName));

  const isVisible = (): boolean => {
    return unref(visibleRef);
  };

  const hide = (): void => {
    if (cookieName)
      cookies.set(cookieName, 1, {
        maxAge: DAY * 30,
        httpOnly: false,
        secure: false,
      });

    visibleRef.value = false;
  };

  return {
    hide,
    isVisible,
  };
};
