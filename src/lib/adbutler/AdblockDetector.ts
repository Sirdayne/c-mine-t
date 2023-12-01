import { withSpan, createFetchWithSpan } from '~/lib/telemetry';

export interface AdblockTestResult {
  // true when adblock blocks requests
  detected: boolean;
  // maybe error from "fetch()"
  reason: unknown | null;
}

export class AdblockDetector {
  private _lastPromise: Promise<void> | null = null;
  private _lastResult: AdblockTestResult | null = null;

  constructor(private readonly _adserveUrl: string) {}

  private async _doTest(): Promise<void> {
    return withSpan(
      {
        op: 'adbutler.detect-adblock',
        description: 'adblock detection routine',
      },
      async (span) => {
        const fetch = createFetchWithSpan(span);

        try {
          // adbutler ad serve api returns NO_ADS for empty JSON request
          // method POST required to prevent CORS errors
          const testUrl = `${this._adserveUrl}/;type=json`;
          const response = await fetch(testUrl, { method: 'POST' });

          const result = await response.json();
          const resultContainsNoAds = typeof result === 'object' && result?.status === 'NO_ADS';

          this._lastResult = {
            detected: !resultContainsNoAds,
            reason: null,
          };
        } catch (error) {
          this._lastResult = {
            detected: true,
            reason: error,
          };
        }
      }
    );
  }

  private async _waitResult(): Promise<void> {
    if (!this._lastPromise) {
      this._lastPromise = this._doTest();
    }

    await this._lastPromise;
  }

  isDetected(): boolean {
    return this._lastResult?.detected ?? false;
  }

  /**
   * @param force discards last settled run
   * @returns is adblock detected
   */
  async tryDetect(force = false): Promise<boolean> {
    if (force || !this._lastResult) {
      await this._waitResult();
    }

    return this.isDetected();
  }
}
