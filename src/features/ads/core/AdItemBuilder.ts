import { AdItem } from './AdItem';
import { type CustomRenderingItem } from './CustomRenderingItem';
import { type AdItemOptions } from './AdItemOptions';

export class AdItemBuilder {
  private _redirectUrl: string | null = null;
  private _trackingPixelUrl: string | null = null;
  private _imageUrl: string | null = null;
  private _body: string | null = null;
  private _customRenderingItems: CustomRenderingItem[] = [];
  private _options: AdItemOptions = {
    widgetHeight: null,
    categorySlug: null,
  };

  setRedirectUrl(redirectUrl: string): this {
    this._redirectUrl = redirectUrl;
    return this;
  }

  setTrackingPixelUrl(trackingPixelUrl: string): this {
    this._trackingPixelUrl = trackingPixelUrl;
    return this;
  }

  setImageUrl(imageUrl: string): this {
    this._imageUrl = imageUrl;
    return this;
  }

  setBody(body: string): this {
    this._body = body;
    return this;
  }

  appendOptions(options: AdItemOptions): this {
    Object.assign(this._options, options);
    return this;
  }

  appendCustomRenderingItem(item: CustomRenderingItem): this {
    this._customRenderingItems.push(item);
    return this;
  }

  build(): AdItem {
    return new AdItem(
      this._redirectUrl,
      this._trackingPixelUrl,
      this._imageUrl,
      this._body,
      this._options,
      this._customRenderingItems
    );
  }
}
