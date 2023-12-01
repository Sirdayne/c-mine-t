import { type Banner as GraphQLBanner } from '~/graphql';
import { type AdbutlerManager, type AdbutlerPlacement } from '~/lib/adbutler';
import { type AdItem } from './AdItem';
import { AdItemBuilder } from './AdItemBuilder';
import { LegacyCustomRenderingItemParser } from './LegacyCustomRenderingItemParser';
import { type AdbutlerKeyParser } from './AdbutlerKeyParser';
import { type AdItemOptionsParser } from './AdItemOptionsParser';
import { HtmlJsonCustomRenderingItemParser } from './HtmlJsonCustomRenderingItemParser';

/**
 * Resolves AdItem from different sources
 */
export class AdItemResolver {
  constructor(
    private readonly _adbutlerManager: AdbutlerManager,
    private readonly _adbutlerKeyParser: AdbutlerKeyParser,
    private readonly _adItemOptionsParser: AdItemOptionsParser,
    private readonly _legacyCustomRenderingItemParser: LegacyCustomRenderingItemParser,
    private readonly _htmlJsonCustomRenderingItemParser: HtmlJsonCustomRenderingItemParser
  ) {}

  async resolveFromBanner(banner: GraphQLBanner, signal?: AbortSignal): Promise<AdItem> {
    const builder = new AdItemBuilder();

    const adbutlerKey = this._adbutlerKeyParser.parseFromBanner(banner);
    const options = this._adItemOptionsParser.parse(banner);

    builder.appendOptions(options);

    if (adbutlerKey) {
      const placement = await this._adbutlerManager.getPlacement(adbutlerKey, signal, true);
      if (placement) {
        this._fillBuilderFromAdbutlerPlacement(placement, builder);
      }
    } else {
      this._fillBuilderFromBanner(banner, builder);
    }

    return builder.build();
  }

  private _fillBuilderFromAdbutlerPlacement(placement: AdbutlerPlacement, builder: AdItemBuilder): void {
    if (placement.body) builder.setBody(placement.body);
    if (placement.tracking_pixel) builder.setTrackingPixelUrl(placement.tracking_pixel);
    if (placement.redirect_url) builder.setRedirectUrl(placement.redirect_url);
    if (placement.image_url) builder.setImageUrl(placement.image_url);

    for (const item of this._htmlJsonCustomRenderingItemParser.parseFromHtml(placement.body)) {
      builder.appendCustomRenderingItem(item);
    }
  }

  private _fillBuilderFromBanner(banner: GraphQLBanner, builder: AdItemBuilder): void {
    const customRenderingItem = this._legacyCustomRenderingItemParser.parse(banner);
    const parserContext = this._legacyCustomRenderingItemParser.getContext();
    const ctxRedirectUrl = parserContext.getRedirectUrl();
    const ctxTrackingPixelUrl = parserContext.getTrackingPixelUrl();

    if (banner.bannerUrl) builder.setRedirectUrl(banner.bannerUrl);
    if (banner.bannerCode) builder.setBody(banner.bannerCode);
    if (banner.bannerImage) builder.setImageUrl(banner.bannerImage);

    if (customRenderingItem) {
      builder.appendCustomRenderingItem(customRenderingItem);

      if (ctxRedirectUrl) builder.setRedirectUrl(ctxRedirectUrl);
      if (ctxTrackingPixelUrl) builder.setTrackingPixelUrl(ctxTrackingPixelUrl);
    }
  }
}
