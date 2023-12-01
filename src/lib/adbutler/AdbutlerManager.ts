import { type AdbutlerPlacement } from './types';
import { type AdbutlerCompositeKey } from './AdbutlerCompositeKey';
import { type AdblockDetector } from './AdblockDetector';
import { type AdbutlerAdServeApiClient } from './AdbutlerAdServeApiClient';
import { captureError, updateSpan, withSpan } from '~/lib/telemetry';

export class AdbutlerManager {
  constructor(
    private readonly _adblockDetector: AdblockDetector,
    private readonly _adServeApiClient: AdbutlerAdServeApiClient
  ) {}

  /**
   * Runs Adblock test in background
   */
  detectAdblock(): void {
    this._adblockDetector.tryDetect().then();
  }

  async getPlacement(
    key: AdbutlerCompositeKey,
    signal?: AbortSignal,
    throwOnError?: boolean
  ): Promise<AdbutlerPlacement | null> {
    return withSpan(
      {
        op: 'adbutler.get',
        description: `get adbutler item for ${key}`,
        data: {
          zoneId: key.getZoneId(),
          accountId: key.getAccountId(),
        },
      },
      async (span) => {
        try {
          const result = await this._adServeApiClient.getOne({ key, signal, span });
          return result?.placements?.placement_1 || null;
        } catch (error) {
          captureError(error, {
            zoneId: key.getZoneId(),
            accountId: key.getAccountId(),
          });

          updateSpan(span, {
            status: 'internal_error',
          });

          if (throwOnError) throw error;

          return null;
        }
      }
    );
  }
}
