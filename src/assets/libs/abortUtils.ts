import { Timer } from './Timer';
import { execUnsafeCallbacks } from '~/lib/telemetry';

export type OptionalAbortSignal = AbortSignal | null | undefined;

export const hasAborted = (signal?: OptionalAbortSignal) => Boolean(signal?.aborted);

/**
 * `new Promise()` constructor wrapped with abortion signal and cleanup helper
 *
 * @param signal optional abortion signal
 * @param executor Same for promise constructor with third arg `onCleanup`
 * @returns instantiated promise
 *
 * `onCleanup` accepts callback to be called on resolve or reject call
 * can be called multiple times
 *
 * @deprecated use "createPromiseWithAbortion" from "~/lib/shared"
 */
export const createPromiseWithSignal = <T>(
  signal: OptionalAbortSignal,
  executor: (
    resolve: (value: T | PromiseLike<T>) => void,
    // copy-paste from Promise constructor type defs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reject: (reason?: any) => void,
    onCleanup: (cleanup: VoidFunction) => void
  ) => void
): Promise<T> =>
  new Promise((resolve, reject) => {
    const cleanupCallbacks = new Set<VoidFunction>();

    const doCleanup = () => execUnsafeCallbacks(cleanupCallbacks);

    const onCleanup = (callback: VoidFunction) => {
      cleanupCallbacks.add(callback);
    };

    if (signal) {
      signal.throwIfAborted?.();

      const abortHandler = () => {
        doCleanup();
        reject(signal.reason);
      };

      signal.addEventListener('abort', abortHandler, { once: true });

      onCleanup(() => {
        signal.removeEventListener('abort', abortHandler);
      });
    }

    executor(
      (value) => {
        doCleanup();
        return resolve(value);
      },
      (reason) => {
        doCleanup();
        return reject(reason);
      },
      onCleanup
    );
  });

/**
 * Promisified setTimeout with abortion
 */
export const waitMsWithAbort = (ms: number, signal?: OptionalAbortSignal): Promise<void> =>
  createPromiseWithSignal(signal, (resolve, _, onCleanup) => {
    const timer = new Timer(ms, resolve);

    onCleanup(() => {
      timer.cancel();
    });

    timer.schedule();
  });
