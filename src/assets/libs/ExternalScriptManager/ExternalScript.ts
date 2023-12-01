import { createPromiseWithSignal } from '../abortUtils';
import { createErrorWithExtra, execUnsafeCallbacks } from '~/lib/telemetry';

// key to store ExternalScript instance in element (like multiton pattern)
const EXTERNAL_SCRIPT_ELEMENT_KEY = Symbol('external script state');

export const enum ExternalScriptLoadingState {
  PENDING = 'pending',
  LOADED = 'loaded',
  FAILED = 'failed',
  ABORTED = 'aborted',
}

export class ExternalScript {
  static for(scriptElement: HTMLScriptElement): ExternalScript {
    // @ts-expect-error unsafe read persisted instance from element
    let externalScript: ExternalScript = scriptElement[EXTERNAL_SCRIPT_ELEMENT_KEY];

    if (!externalScript) {
      // @ts-expect-error unsafe set instance to element
      externalScript = scriptElement[EXTERNAL_SCRIPT_ELEMENT_KEY] = new ExternalScript(scriptElement);
      externalScript.init();
    }

    return externalScript;
  }

  private _loadingState = ExternalScriptLoadingState.PENDING;
  private readonly _stateChangeCallbacks = new Set<VoidFunction>();

  constructor(public readonly scriptElement: HTMLScriptElement) {}

  getLoadingState(): ExternalScriptLoadingState {
    return this._loadingState;
  }

  isPending(): boolean {
    return this.getLoadingState() === ExternalScriptLoadingState.PENDING;
  }

  isLoaded(): boolean {
    return this.getLoadingState() === ExternalScriptLoadingState.LOADED;
  }

  isFailed(): boolean {
    return this.getLoadingState() === ExternalScriptLoadingState.FAILED;
  }

  waitLoaded(signal?: AbortSignal): Promise<void> {
    return createPromiseWithSignal(signal, (resolve, reject, onCleanup) => {
      const onStateChange = () => {
        switch (this.getLoadingState()) {
          case ExternalScriptLoadingState.ABORTED: {
            reject(
              createErrorWithExtra('external script load aborted', {
                src: this.scriptElement.src,
              })
            );

            break;
          }

          case ExternalScriptLoadingState.FAILED: {
            reject(
              createErrorWithExtra('failed to load external script', {
                src: this.scriptElement.src,
              })
            );

            break;
          }

          case ExternalScriptLoadingState.LOADED: {
            resolve();
            break;
          }

          case ExternalScriptLoadingState.PENDING: {
            this._stateChangeCallbacks.add(onStateChange);
            break;
          }
        }
      };

      onCleanup(() => this._stateChangeCallbacks.delete(onStateChange));
      onStateChange();
    });
  }

  init(): void {
    if (this.getLoadingState() !== ExternalScriptLoadingState.PENDING) return;

    this.scriptElement.addEventListener('load', () => {
      this._dispatchLoadingState(ExternalScriptLoadingState.LOADED);
    });

    this.scriptElement.addEventListener('error', () => {
      this._dispatchLoadingState(ExternalScriptLoadingState.FAILED);
    });
  }

  destroy(): void {
    // @ts-expect-error unsafe set instance to element
    this.scriptElement[EXTERNAL_SCRIPT_ELEMENT_KEY] = null;
    this.scriptElement.remove();

    this._dispatchLoadingState(ExternalScriptLoadingState.ABORTED);
  }

  private _dispatchLoadingState(nextLoadingState: ExternalScriptLoadingState): void {
    this._loadingState = nextLoadingState;
    execUnsafeCallbacks(this._stateChangeCallbacks);
  }
}
