import * as t from 'typed';
import { CustomRenderingViews } from './CustomRenderingViews';

// for views without props
const noPropsSchema: t.Struct = () => t.ok({});

/**
 * "typed" schemas for runtime validation
 * of custom rendering views props
 */
export const CUSTOM_RENDERING_PROPS_SCHEMA_REGISTRY = {
  [CustomRenderingViews.STRETCH_PROMO]: t.object({
    title: t.string(),
    description: t.string(),
  }),

  [CustomRenderingViews.STRETCH_YOUTUBE]: t.object({
    title: t.string(),
    description: t.string(),
    youtubeVideoId: t.string(),
  }),

  [CustomRenderingViews.PROMO_BUTTON]: t.object({
    labelColor: t.string(),
    backgroundColor: t.string(),
    backgroundImage: t.defaulted(t.string(), ''),
    logoSmallUrl: t.string(),
    logoFullUrl: t.string(),
    labelText: t.string(),
    tooltipText: t.string(),
  }),

  [CustomRenderingViews.PROMO_BUTTON_STACK]: t.object({
    promoButtonPlace: t.string(),
  }),

  [CustomRenderingViews.EDITORS_CHOICE_WIDGET]: noPropsSchema,
  [CustomRenderingViews.APP_NEW_SUBSCRIBER]: noPropsSchema,
  [CustomRenderingViews.SUBSCRIPTION_WIDGET]: noPropsSchema,
  [CustomRenderingViews.PRICE_INDEXES_WIDGET]: noPropsSchema,
  [CustomRenderingViews.TRADINGVIEW_WIDGET]: noPropsSchema,
  [CustomRenderingViews.COIN360_WIDGET]: noPropsSchema,
  [CustomRenderingViews.STICKY]: t.object({
    componentName: t.string(),
  }),

  [CustomRenderingViews.YOUTUBE_VIDEO]: t.object({
    youtubeVideoId: t.string(),
  }),

  [CustomRenderingViews.STORY_WIDGET]: t.object({
    postSlug: t.string(),
    badge: t.optional(t.string()),
  }),

  [CustomRenderingViews.TEXT_BANNER]: t.object({
    bannerURL: t.string(),
    bannerText: t.string(),
    disclaimerText: t.string(),
    disclaimerImg: t.string(),
  }),
} satisfies Record<CustomRenderingViews, t.Struct>;

export type CustomRenderingPropsSchemaRegistry = typeof CUSTOM_RENDERING_PROPS_SCHEMA_REGISTRY;

export type InferCustomRenderingViewProps<View> = View extends CustomRenderingViews
  ? t.Infer<CustomRenderingPropsSchemaRegistry[View]>
  : Record<string, unknown>;
