import { AdbutlerCompositeKey } from '~/lib/adbutler';
import { type Banner as GraphQLBanner } from '~/graphql';

export const DEFAULT_ADBUTLER_ACCOUNT_ID = '169476';

export class AdbutlerKeyParser {
  private _createKey(accountId: string, zoneId: string): AdbutlerCompositeKey {
    return new AdbutlerCompositeKey(accountId, zoneId);
  }

  private _createKeyForDefaultAccount(zoneId: string): AdbutlerCompositeKey {
    return this._createKey(DEFAULT_ADBUTLER_ACCOUNT_ID, zoneId);
  }

  /**
   * parses adbutler zone id from generated "<script>" snippet
   */
  private _parseKeyFromSnippet(input: string): AdbutlerCompositeKey | null {
    const matches = /window\.plc(\d+)/g.exec(input);
    const zoneId = matches?.[1];

    if (!zoneId) return null;

    return this._createKeyForDefaultAccount(zoneId);
  }

  /**
   * parses adbutler zone id from url like "adbutler://12345678"
   */
  private _parseKeyFromUrl(input: string): AdbutlerCompositeKey | null {
    const [, zoneId] = input.split('adbutler://');

    if (!zoneId) return null;

    return this._createKeyForDefaultAccount(zoneId);
  }

  private _parseKey(input: unknown): AdbutlerCompositeKey | null {
    const asString = String(input);
    return this._parseKeyFromSnippet(asString) || this._parseKeyFromUrl(asString);
  }

  parseFromBanner(banner: GraphQLBanner): AdbutlerCompositeKey | null {
    for (const bannerKey in banner) {
      // @ts-expect-error fucking typescript
      const value = banner[bannerKey];
      const adbutlerKey = this._parseKey(value);

      if (adbutlerKey) return adbutlerKey;
    }

    return null;
  }
}
