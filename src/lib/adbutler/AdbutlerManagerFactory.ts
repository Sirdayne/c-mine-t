import { AdblockDetector } from './AdblockDetector';
import { AdbutlerAdServeApiClient } from './AdbutlerAdServeApiClient';
import { AdbutlerManager } from './AdbutlerManager';

export class AdbutlerManagerFactory {
  constructor(private readonly _adserveUrl: string, private readonly _proxyUrl: string | null) {}

  build(): AdbutlerManager {
    const adblockDetector = new AdblockDetector(this._adserveUrl);
    const apiClient = new AdbutlerAdServeApiClient(this._adserveUrl, this._proxyUrl, adblockDetector);
    const manager = new AdbutlerManager(adblockDetector, apiClient);
    return manager;
  }
}
