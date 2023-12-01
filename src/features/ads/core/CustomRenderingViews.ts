/**
 * enumartion of all views for custom rendering
 */
export enum CustomRenderingViews {
  /**
   * Stretch banners aka 24 hours
   */
  STRETCH_PROMO = 'stretchPromo',
  STRETCH_YOUTUBE = 'stretchYoutube',

  /**
   * sticky promo for footer
   */
  STICKY = 'sticky',

  /**
   * just youtube video player
   */
  YOUTUBE_VIDEO = 'youtubeVideo',

  /**
   * promo CTAs
   */
  PROMO_BUTTON = 'promoButton',

  /**
   * stack of promo CTAs
   */
  PROMO_BUTTON_STACK = 'promoButtonStack',

  /**
   * sidebar widgets
   */
  EDITORS_CHOICE_WIDGET = 'editorsChoiceWidget',
  SUBSCRIPTION_WIDGET = 'subscriptionWidget',
  COIN360_WIDGET = 'coin360Widget',
  TRADINGVIEW_WIDGET = 'tradingviewWidget',
  PRICE_INDEXES_WIDGET = 'priceIndexesWidget',
  APP_NEW_SUBSCRIBER = 'appNewSubscriber',

  /**
   * @see https://www.notion.so/cointelegraph/Story-Widget-HTML-JSON-2d5115f944cc4a599d02ef1a5ebdc41b?pvs=4
   */
  STORY_WIDGET = 'storyWidget',

  /**
   * @see https://www.notion.so/cointelegraph/Text-banner-with-disclaimer-16847824feac4a0b86b0694df2f4166d?pvs=4
   */
  TEXT_BANNER = 'textBanner',
}
