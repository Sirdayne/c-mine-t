/**
 * Adbutler batched api docs:
 * @see {@link https://www.adbutler.com/help/article/batched-ad-requests}
 */

export type AdbutlerZoneId = string;

export type AdbutlerAccountId = string;

export interface AdbutlerPlacement {
  banner_id: string | number;
  // that fuckers saying that placement widget and height is number,
  // but they are strings!
  width: string | number;
  height: string | number;
  alt_text: string;
  accompanied_html: string;
  target: string;
  tracking_pixel: string;
  body: string;
  redirect_url: string;
  refresh_url: string;
  refresh_time: string | number;
  image_url: string;
  accupixel_url?: string;
  eligible_url: string;
  viewable_url: string;
  [x: string]: unknown;
}

export type AdbutlerResponseStatus = 'SUCCESS' | 'NO_ADS';

export interface AdbutlerResponse {
  status: AdbutlerResponseStatus;
  placements: {
    [K in string | 'placement_1']: AdbutlerPlacement;
  };
}
