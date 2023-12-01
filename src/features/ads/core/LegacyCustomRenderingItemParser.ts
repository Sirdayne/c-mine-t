import { type Banner as GraphQLBanner } from '~/graphql';
import { CustomRenderingViews } from './CustomRenderingViews';
import { type LegacyCustomRenderingItemParserContext } from './LegacyCustomRenderingItemParserContext';
import { type CustomRenderingItemParser } from './CustomRenderingItemParser';
import { type CustomRenderingItem } from './CustomRenderingItem';
import { type AdItemErrorCollector, AdItemErrors } from './AdItemErrorCollector';
import { findStaticPromoButtonDefinition } from './static-promo-buttons-registry';
import { type InferCustomRenderingViewProps } from './custom-rendering-props-schema-registry';

// promo buttons in sidebar is widgets named like "${promoButtonType}-button"
const PROMO_BUTTON_WIDGET_TYPE_SUFFIX = '-button';

/**
 * promo_button_stack_something => promo_button_something
 */
const PROMO_BUTTON_STACK_PLACE_INFIX = '_stack';

// map dashboard sidebar widget names to views
const SIDEBAR_WIDGET_VIEWS = {
  'editors-choice-widget': CustomRenderingViews.EDITORS_CHOICE_WIDGET,
  'subscriptions-widget': CustomRenderingViews.SUBSCRIPTION_WIDGET,
  'coin-360-widget': CustomRenderingViews.COIN360_WIDGET,
  tradingview: CustomRenderingViews.TRADINGVIEW_WIDGET,
  'price-indexes-widget': CustomRenderingViews.PRICE_INDEXES_WIDGET,
  'app-new-subscriber': CustomRenderingViews.APP_NEW_SUBSCRIBER,
} as const;

const tryParseYoutubeVideoId = (input: string): string | null => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = input.match(regExp);
  return match && match[7].length === 11 ? match[7] : '';
};

/**
 * Legacy dashboard banners factory like stretch, static promo buttons, etc
 */
export class LegacyCustomRenderingItemParser {
  constructor(
    private readonly _parserContext: LegacyCustomRenderingItemParserContext,
    private readonly _customRenderingItemParser: CustomRenderingItemParser,
    private readonly _errorCollector: AdItemErrorCollector
  ) {}

  getContext(): LegacyCustomRenderingItemParserContext {
    return this._parserContext;
  }

  parse(banner: GraphQLBanner): CustomRenderingItem | null {
    this._parseYoutubeVideoId(banner);

    /**
     * This is legacy banner parser
     *
     * 😪 Sorry, over the years, many unsuccessful decisions have accumulated
     */
    switch (banner.bannerType) {
      case 'stretch': {
        const result = this._parseStretch(banner);

        if (result) return result;

        break;
      }

      case 'sticky': {
        this._parserContext.setTrackingPixelUrl(banner.bannerImage);
        this._parserContext.setRedirectUrl(banner.bannerCode);
        return this._create(CustomRenderingViews.STICKY, {
          componentName: banner.bannerUrl,
        });
      }

      // all sidebar banners is widgets
      case 'widget':
        return this._parseSidebarWidget(banner);

      case 'promo_button': {
        this._parserContext.setRedirectUrl(banner.bannerCode);
        this._parserContext.setTrackingPixelUrl(banner.bannerImage);
        // WARN: unsafe cast to string
        return this._resolveStaticPromoButton(String(banner.bannerUrl));
      }

      case 'promo_button_stack': {
        const promoButtonPlace = banner.bannerPlace.replace(PROMO_BUTTON_STACK_PLACE_INFIX, '');
        return this._create(CustomRenderingViews.PROMO_BUTTON_STACK, {
          promoButtonPlace,
        });
      }

      default:
        break;
    }

    const youtubeVideoId = this._parserContext.getYoutubeVideoId();

    if (youtubeVideoId) {
      return this._create(CustomRenderingViews.YOUTUBE_VIDEO, {
        youtubeVideoId,
      });
    }

    return null;
  }

  private _parseYoutubeVideoId(banner: GraphQLBanner): void {
    if (banner.bannerUrl) {
      const youtubeVideoId = tryParseYoutubeVideoId(banner.bannerUrl);

      if (youtubeVideoId) {
        this._parserContext.setYoutubeVideoId(youtubeVideoId);
      }
    }
  }

  private _parseSidebarWidget(banner: GraphQLBanner): CustomRenderingItem | null {
    this._parserContext.setRedirectUrl(banner.bannerCode);
    this._parserContext.setTrackingPixelUrl(banner.bannerImage);

    const widgetType = String(banner.bannerUrl);

    // sidebar promo buttons
    const promoButton = this._resolveStaticPromoButton(widgetType);
    if (promoButton) return promoButton;

    // legacy sidebar widgets like editors' choice, price indexes, etc
    for (const definedWidgetType in SIDEBAR_WIDGET_VIEWS) {
      if (definedWidgetType === widgetType) {
        // @ts-expect-error typescript at all
        return this._create(SIDEBAR_WIDGET_VIEWS[definedWidgetType], {});
      }
    }

    this._errorCollector.add(AdItemErrors.UNKNOWN_WIDGET_TYPE);
    return null;
  }

  private _parseStretch(banner: GraphQLBanner): CustomRenderingItem | null {
    /**
     * stretch type = banner.bannerComment
     */
    switch (banner.bannerComment) {
      case 'promo': {
        return this._create(CustomRenderingViews.STRETCH_PROMO, {
          title: banner.bannerTitle,
          description: banner.bannerCode,
        });
      }

      case 'youtube': {
        this._parserContext.setRedirectUrl(banner.bannerImage);
        return this._create(CustomRenderingViews.STRETCH_YOUTUBE, {
          title: banner.bannerTitle || '',
          description: banner.bannerCode || '',
          youtubeVideoId: this._parserContext.getYoutubeVideoId(),
        });
      }

      default: {
        this._errorCollector.add(AdItemErrors.UNKNOWN_STRETCH_TYPE);
        return null;
      }
    }
  }

  /**
   * @param promoButtonType static promo button type like "xgo", "changelly"
   */
  private _resolveStaticPromoButton(promoButtonType: string): CustomRenderingItem | null {
    promoButtonType = promoButtonType.replace(PROMO_BUTTON_WIDGET_TYPE_SUFFIX, '');
    const staticPromoButtonDefinition = findStaticPromoButtonDefinition(promoButtonType);

    if (!staticPromoButtonDefinition) return null;

    return this._create(CustomRenderingViews.PROMO_BUTTON, {
      // WARN: duplicates same strings from "static-promo-buttons-registry.ts"
      labelText: `${promoButtonType}.btn.label`,
      tooltipText: `${promoButtonType}.btn.text`,
      labelColor: staticPromoButtonDefinition.labelColor || '#ffffff',
      backgroundColor: staticPromoButtonDefinition.backgroundColor || '#000000',
      backgroundImage: staticPromoButtonDefinition.backgroundImage || '',
      logoFullUrl: `/icons/promo-buttons/${promoButtonType}-full.svg`,
      logoSmallUrl: `/icons/promo-buttons/${promoButtonType}-mini.svg`,
    });
  }

  /**
   * facade for type-safe legacy custom rendering item creation
   */
  private _create<View extends CustomRenderingViews>(
    view: View,
    props: Record<keyof InferCustomRenderingViewProps<View>, unknown>
  ): CustomRenderingItem<View> | null {
    return this._customRenderingItemParser.parse(view, props) as CustomRenderingItem<View> | null;
  }
}
