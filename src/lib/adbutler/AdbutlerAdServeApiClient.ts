import { createFetchWithSpan, type Span } from '~/lib/telemetry';
import { type AdblockDetector } from './AdblockDetector';
import { type AdbutlerCompositeKey } from './AdbutlerCompositeKey';
import { type AdbutlerResponse } from './types';
import { AdbutlerError, AdbutlerErrorReason } from '~/lib/adbutler/AdbutlerError';

const VALID_STATUSES: AdbutlerResponse['status'][] = ['SUCCESS', 'NO_ADS'];

export interface AdbutlerRequestInit {
  key: AdbutlerCompositeKey;
  signal?: AbortSignal;
  span?: Span;
}

type AdbutlerParamsIterable = Iterable<[string, unknown]>;

/**
 * renaming params for proxy
 *
 * original param => proxy param name
 */
const PROXY_PARAM_NAME_MAPPING: Record<string, string> = {
  ID: 'MID',
  setID: 'setID',
};

export class AdbutlerAdServeApiClient {
  constructor(
    /**
     * Adbutler Adserve API URL
     */
    private readonly _adserveUrl: string,

    /**
     * Adbutler proxy url
     */
    private readonly _proxyUrl: string | null | undefined,

    private readonly _adblockDetector: AdblockDetector
  ) {}

  private _buildProxyUrl(params: AdbutlerParamsIterable): string {
    if (!this._proxyUrl) throw new AdbutlerError(AdbutlerErrorReason.NO_PROXY_URL);

    const searchParams = new URLSearchParams();

    for (const [param, value] of params) {
      const renamedParam = PROXY_PARAM_NAME_MAPPING[param];

      if (renamedParam) {
        searchParams.append(renamedParam, String(value));
      }
    }

    return `${this._proxyUrl}?${searchParams}`;
  }

  private _buildAdbutlerUrl(params: Iterable<[string, unknown]>): string {
    let url = this._adserveUrl;

    if (!url.endsWith('/')) url += '/';

    for (const [param, value] of params) {
      url += `;${param}=${value}`;
    }

    return url;
  }

  async getOne({ key, signal, span }: AdbutlerRequestInit): Promise<AdbutlerResponse> {
    const params = new Map<string, unknown>();

    params.set('ID', key.getAccountId()).set('setID', key.getZoneId()).set('size', '0x0').set('type', 'json');

    const adblockDetected = await this._adblockDetector.tryDetect();

    const url = adblockDetected ? this._buildProxyUrl(params) : this._buildAdbutlerUrl(params);
    const request = new Request(url, { signal });

    const fetch = createFetchWithSpan(span);
    let result: AdbutlerResponse;

    try {
      const response = await fetch(request);
      result = await response.json();
    } catch (error) {
      throw new AdbutlerError(AdbutlerErrorReason.FAILED_TO_FETCH_ADBUTLER);
    }

    if (!VALID_STATUSES.includes(result.status)) {
      throw new AdbutlerError(AdbutlerErrorReason.BAD_RESPONSE);
    }

    // unsafe cast
    return result;
  }
}
