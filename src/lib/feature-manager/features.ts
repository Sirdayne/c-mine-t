import { FeatureFlags } from './types';

export const features = {
  asia_mobile_layout: ['jp', 'cn', 'kr'],
  rtl: ['ar'],
  change_theme_enabled: false,
  links_event_active: ['en'],
  markets_pro_lead_form: ['en'],

  /**
   * Remove viewer counter in the Hot Stories section for all of the regional versions,
   * EXCEPT for English and Japanese.
   * */
  hot_stories_viewer_counter: ['en', 'jp'],

  /**
   * Show post action
   * */
  posts_actions_visible: ['en'],

  /**
   * Subscribe to newsletter widget in Post content
   */
  subscription_widget: ['en'],
} satisfies FeatureFlags;
