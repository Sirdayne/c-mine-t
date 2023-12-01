import { type AdItemOptions } from './AdItemOptions';
import { type CustomRenderingItem } from './CustomRenderingItem';

export class AdItem {
  constructor(
    private readonly _redirectUrl: string | null,
    private readonly _trackingPixelUrl: string | null,
    private readonly _imageUrl: string | null,
    private readonly _body: string | null,
    private readonly _options: AdItemOptions,
    private readonly _customRenderingItems: readonly CustomRenderingItem[]
  ) {}

  getRedirectUrl(): string | null {
    return this._redirectUrl;
  }

  getTrackingPixelUrl(): string | null {
    return this._trackingPixelUrl;
  }

  getImageUrl(): string | null {
    return this._imageUrl;
  }

  getBody(): string | null {
    return this._body;
  }

  getCustomRenderingItem(): CustomRenderingItem | null {
    return this._customRenderingItems[0] || null;
  }

  getOption<K extends keyof AdItemOptions>(key: K): AdItemOptions[K] | null {
    return this._options[key] ?? null;
  }

  hasContent(): boolean {
    const hasBody = Boolean(this.getBody());
    const hasImage = Boolean(this.getImageUrl());
    const hasCustomRendering = Boolean(this.getCustomRenderingItem());
    return hasBody || hasImage || hasCustomRendering;
  }

  toJSON(): object {
    const item = this.getCustomRenderingItem();

    return {
      redirectUrl: this._redirectUrl,
      trackingPixelUrl: this._trackingPixelUrl,
      imageUrl: this._imageUrl,
      body: this._body,
      customRenderingItems: item,
    };
  }
}
