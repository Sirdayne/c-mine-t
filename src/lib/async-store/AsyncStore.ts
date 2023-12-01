import { shallowRef, unref } from 'vue';
import { waitFor } from '../shared';

export const NO_DATA = Symbol('no data');

export type AsyncLoadingState = 'idle' | 'pending' | 'done' | 'failed';

export type AsyncAction<T> = () => PromiseLike<T>;

export interface AsyncState<T> {
  loading: AsyncLoadingState;
  data: T | typeof NO_DATA;
  // failure reason
  reason: unknown | null;
}

const INITIAL_STATE: AsyncState<any> = {
  loading: 'idle',
  data: NO_DATA,
  reason: null,
};

/**
 * Runs async action and tracks execution state
 *
 * Execution state is reactive
 *
 * Example:
 * ```typescript
 * const s = new AsyncStore(() => getDataFromApi());
 *
 * // schedule action
 * s.run();
 *
 * // wait execution settle
 * const data = await s.wait();
 *
 * // or watch state in reactive Vue context
 * watchEffect(() => s.isDone() && console.log('got data:', s.unwrap());
 * ```
 */
export class AsyncStore<T> {
  private readonly _ref = shallowRef(INITIAL_STATE);

  /**
   * @param _action Async action to be run
   */
  constructor(private readonly _action: AsyncAction<T>) {}

  isIdle(): boolean {
    return this._is('idle');
  }

  isPending(): boolean {
    return this._is('pending');
  }

  isDone(): boolean {
    return this._is('done');
  }

  isFailed(): boolean {
    return this._is('failed');
  }

  isSettled(): boolean {
    return this.isDone() || this.isFailed();
  }

  /**
   * Run async action
   *
   * Noop when action pending or done
   *
   * @param revalidate Force run even if done
   */
  run(revalidate = false): void {
    if (this.isPending()) return;
    if (!revalidate && this.isDone()) return;

    this._executeAction();
  }

  unwrap(): T {
    return this._tryUnwrap(this._getState());
  }

  /**
   * Wait when action settles
   * @param signal Abort waiting
   */
  async wait(signal?: AbortSignal): Promise<void> {
    await waitFor(() => this.isSettled(), signal);
  }

  private _is(loadingState: AsyncLoadingState): boolean {
    return this._getState().loading === loadingState;
  }

  private _getState(): AsyncState<T> {
    return unref(this._ref);
  }

  private _tryUnwrap(state: AsyncState<T>): T {
    switch (state.loading) {
      case 'idle':
        throw new Error('AsyncStore: idle state');
      case 'pending':
        throw new Error('AsyncStore: pending state');
      case 'failed':
        if (state.reason === null) throw new Error('AsyncStore: failed without reason');

        throw state.reason;

      case 'done':
        if (state.data === NO_DATA) throw new Error('AsyncStore: no data set');

        return state.data;

      default:
        throw new Error('AsyncStore: invalid loading state');
    }
  }

  private _updateState(changes: Partial<AsyncState<T>>): void {
    this._ref.value = {
      ...this._getState(),
      ...changes,
    };
  }

  private async _executeAction(): Promise<void> {
    try {
      this._updateState({ loading: 'pending' });
      const data = await this._action();
      this._updateState({ loading: 'done', data });
    } catch (error) {
      this._updateState({ loading: 'failed', reason: error });
    }
  }
}
