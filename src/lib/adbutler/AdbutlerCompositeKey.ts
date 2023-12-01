import { type AdbutlerAccountId, type AdbutlerZoneId } from './types';

/**
 * Used for identifying slot usage
 */
export class AdbutlerCompositeKey {
  constructor(private readonly _accountId: AdbutlerAccountId, private readonly _zoneId: AdbutlerZoneId) {}

  getAccountId(): AdbutlerAccountId {
    return this._accountId;
  }

  getZoneId(): AdbutlerZoneId {
    return this._zoneId;
  }

  toString(): string {
    return `${this.getAccountId()}:${this.getZoneId()}`;
  }

  toJSON(): Record<string, string> {
    return {
      zoneId: this.getZoneId(),
      accountId: this.getAccountId(),
    };
  }

  equals(another: AdbutlerCompositeKey): boolean {
    return this.getAccountId() === another.getAccountId() && this.getZoneId() === another.getZoneId();
  }
}
