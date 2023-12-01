import { hasAborted, waitMsWithAbort } from './abortUtils';
import { captureError } from '~/lib/telemetry';

export interface ShortPollingHandler {
  (signal?: AbortSignal): void;
}

/**
 * Short-polling helper
 *
 * On init:
 * - Run handler immediately
 * - Re-run handler after given delay
 * - Recovers on handler throws with given delay
 */
export class ShortPolling {
  private _abortController: AbortController | null = null;

  constructor(
    private readonly _pollDelayMs: number,
    private readonly _recoveryDelayMs: number,
    private readonly _handler: ShortPollingHandler
  ) {}

  abort(): void {
    this._abortController?.abort();
  }

  async init(): Promise<void> {
    this.abort();
    this._abortController = new AbortController();
    await this._startLoop(this._abortController.signal);
  }

  private async _startLoop(signal?: AbortSignal): Promise<void> {
    while (!hasAborted(signal)) {
      try {
        await this._handler(signal);
        await waitMsWithAbort(this._pollDelayMs);
      } catch (error) {
        if (hasAborted(signal)) return;

        captureError(error);
        await waitMsWithAbort(this._recoveryDelayMs, signal);
      }
    }
  }
}
