import { DeviceType } from './DeviceType';

const MOBILE_RE =
  /(?:phone|windows\s+phone|ipod|blackberry|(?:android|bb\d+|meego|silk|googlebot) .+? mobile|palm|windows\s+ce|opera mini|avantgo|mobilesafari|docomo)/i;
const TABLE_RE = /(?:ipad|playbook|(?:android|bb\d+|meego|silk)(?! .+? mobile))/i;

/**
 * cloudflare device detection algo
 * @see https://developers.cloudflare.com/automatic-platform-optimization/reference/cache-device-type/
 */
export const detectDeviceTypeByUserAgent = (userAgent: string): DeviceType => {
  if (MOBILE_RE.test(userAgent)) return DeviceType.MOBILE;
  if (TABLE_RE.test(userAgent)) return DeviceType.TABLET;
  return DeviceType.DESKTOP;
};
