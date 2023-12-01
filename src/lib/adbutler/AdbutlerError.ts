import { AdbutlerCompositeKey } from './AdbutlerCompositeKey';

export const enum AdbutlerErrorReason {
  NO_PROXY_URL = 'adbutler proxy url not set',

  FAILED_TO_FETCH_ADBUTLER = 'failed to fetch adbutler',

  BAD_RESPONSE = 'adbutler respond with invalid status. expected NO_ADS or SUCCESS',
}

export interface AdbutlerErrorExtra {
  key?: AdbutlerCompositeKey;
}

export class AdbutlerError extends Error {
  static is(error: unknown): error is AdbutlerError {
    return error instanceof this;
  }

  constructor(public readonly reason: AdbutlerErrorReason, public readonly extra?: AdbutlerErrorExtra) {
    super(reason);
    this.name = 'AdbutlerError';
  }
}
