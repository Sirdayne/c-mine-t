import { type AsyncComponent, type Component, defineComponent, h } from 'vue';
import { CustomRenderingViews } from './core/CustomRenderingViews';

const MockJsonView: AsyncComponent = () => {
  const C = defineComponent({
    name: 'MockJsonView',

    props: {
      adItem: {
        type: Object,
        required: true,
      },
    },

    setup(props) {
      return () => {
        return h('pre', JSON.stringify(props.adItem, null, 2));
      };
    },
  });

  return Promise.resolve(C);
};

export type CustomRenderingComponentRegistry = Partial<Record<CustomRenderingViews, AsyncComponent | Component>>;

/**
 * Components for custom rendering
 */
export const CUSTOM_RENDERING_COMPONENT_REGISTRY = {
  [CustomRenderingViews.STRETCH_PROMO]: () => import('./components/StretchPromo.vue'),
  [CustomRenderingViews.STRETCH_YOUTUBE]: () => import('./components/StretchYouTube.vue'),
  [CustomRenderingViews.STICKY]: () => import('./components/sticky-banners/StickyBanner.vue'),
  [CustomRenderingViews.YOUTUBE_VIDEO]: () => import('./components/YouTube.vue'),
  [CustomRenderingViews.PROMO_BUTTON]: () => import('./components/promo-buttons/PromoButton.vue'),
  [CustomRenderingViews.PROMO_BUTTON_STACK]: () => import('./components/promo-buttons/PromoButtonStack.vue'),
  [CustomRenderingViews.EDITORS_CHOICE_WIDGET]: () => import('~/components/Sidebar/EditorsChoiceWidget.vue'),
  [CustomRenderingViews.SUBSCRIPTION_WIDGET]: MockJsonView,
  [CustomRenderingViews.COIN360_WIDGET]: MockJsonView,
  [CustomRenderingViews.TRADINGVIEW_WIDGET]: MockJsonView,
  [CustomRenderingViews.PRICE_INDEXES_WIDGET]: MockJsonView,
  [CustomRenderingViews.APP_NEW_SUBSCRIBER]: MockJsonView,
  [CustomRenderingViews.STORY_WIDGET]: () => import('./components/story-widget/StoryWidget.vue'),
  [CustomRenderingViews.TEXT_BANNER]: () => import('./components/TextBanner.vue'),
} satisfies CustomRenderingComponentRegistry;
