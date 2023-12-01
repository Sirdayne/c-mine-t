export interface AdSlotConfig {
  /**
   * for responsive ads
   *
   * expected to be a height divided by width (both in pixels)
   */
  aspectRatio: number | null;

  /**
   * hides disclaimer both on popover and below
   */
  promoButtonDisclaimerHidden: boolean;

  /**
   * Change promo button stack background from white to transparent
   */
  promoButtonStackTransparentBackground: boolean;

  /**
   * promo buttons will take full width when truthy
   */
  promoButtonFullWidth: boolean;

  /**
   * promo button content order
   */
  promoButtonContentReversed: boolean;

  /**
   * Disables Adblock fallback - the funny ghost image
   */
  adblockFallbackDisabled: boolean;

  /**
   * Disables auto-refresh when navigating between pages
   */
  refetchOnRouteChangeDisabled: boolean;

  /**
   * Post slug containing AdSlot
   */
  postSlug: string | null;

  /**
   * Add border to text banner inline/after article
   */
  textBannerBordered: boolean;

  /**
   *  Hide promo button disclaimer tooltip, show default disclaimer instead
   * */
  promoButtonWithOutToolTip: boolean;

  /**
   * Add or hide close button
   * */
  closable: boolean;

  /**
   * Hide promo button stack disclaimer underneath
   * */
  promoButtonStackWithoutDisclaimer: boolean;
}

export const DEFAULT_AD_SLOT_CONFIG: AdSlotConfig = {
  aspectRatio: null,
  promoButtonFullWidth: false,
  promoButtonContentReversed: false,
  promoButtonDisclaimerHidden: false,
  promoButtonStackTransparentBackground: false,
  adblockFallbackDisabled: false,
  refetchOnRouteChangeDisabled: false,
  postSlug: null,
  textBannerBordered: false,
  promoButtonWithOutToolTip: false,
  closable: false,
  promoButtonStackWithoutDisclaimer: false,
};
