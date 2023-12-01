/**
 * 😮 Some legacy banners using different fields from "Banner"
 *
 * For an example: image field in Dashboard for promo_button type
 * used for tracking pixel
 *
 * Or another example: "widget" type using "code" field for redirect url
 */
export class LegacyCustomRenderingItemParserContext {
  private _redirectUrl: string | null = null;
  private _trackingPixelUrl: string | null = null;
  private _youtubeVideoId: string | null = null;

  setRedirectUrl(redirectUrl: string | null | undefined): void {
    this._redirectUrl = redirectUrl || null;
  }

  setTrackingPixelUrl(trackingPixelUrl: string | null | undefined): void {
    this._trackingPixelUrl = trackingPixelUrl || null;
  }

  setYoutubeVideoId(youtubeVideoId: string | null | undefined): void {
    this._youtubeVideoId = youtubeVideoId || null;
  }

  getRedirectUrl(): string | null {
    return this._redirectUrl;
  }

  getTrackingPixelUrl(): string | null {
    return this._trackingPixelUrl;
  }

  getYoutubeVideoId(): string | null {
    return this._youtubeVideoId;
  }
}
