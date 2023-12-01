/**
 * Programmable timer with manual start/stop
 */
export class Timer {
  private _timeoutId: unknown = null;

  constructor(private readonly _ms: number, private readonly _callback: () => void) {}

  cancel(): void {
    // @ts-expect-error bad clearTimeout typings
    clearTimeout(this._timeoutId);
  }

  schedule(): void {
    this.cancel();
    this._timeoutId = setTimeout(this._callback, this._ms);
  }
}
