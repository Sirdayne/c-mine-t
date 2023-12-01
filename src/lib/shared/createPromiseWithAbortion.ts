export type PromiseWithAbortionExecutor<T> = (
  resolve: (value: T) => void,
  reject: (reason?: any) => void,

  /**
   * registers callback to run before settle
   */
  onCleanup: (callback: VoidFunction) => void,

  /**
   * is given signal aborted?
   * always `false` when no signal provided
   */
  isAborted: () => boolean
) => void;

/**
 * runs callback out of current context
 * to prevent thrown errors
 * break current execution flow
 */
const runUnsafeCallback = (callback: VoidFunction): void => {
  Promise.resolve().then(callback);
};

/**
 * Creates Promise that handles abortion and cleanup gracefully
 *
 * 1. Executor can register callback to run when promise settled
 * 2. Executor can check that signal aborted by provided "isAborted" argument
 * 3. Promise rejects immediately when aborted before execution
 * 4. Cleanup callback run immediately on settle
 * 5. Abortion rejects promise immediately
 */
export const createPromiseWithAbortion = <T>(
  signal: AbortSignal | null | undefined,
  executor: PromiseWithAbortionExecutor<T>
): Promise<T> =>
  new Promise((resolve, reject) => {
    const cleanupCallbacks = new Set<VoidFunction>();

    const isAborted = (): boolean => Boolean(signal?.aborted);

    const onCleanup = (callback: VoidFunction): void => {
      if (isAborted()) {
        runUnsafeCallback(callback);
      } else {
        cleanupCallbacks.add(callback);
      }
    };

    const doCleanup = (): void => {
      signal?.removeEventListener('abort', rejectIfAborted);

      for (const callback of cleanupCallbacks) runUnsafeCallback(callback);
    };

    const rejectIfAborted = (): void => {
      if (!isAborted()) return;

      doCleanup();
      reject(signal!.reason);
    };

    rejectIfAborted();

    if (!isAborted()) {
      signal?.addEventListener('abort', rejectIfAborted);
      executor(
        (value) => {
          if (isAborted()) return;
          doCleanup();
          resolve(value);
        },
        (reason) => {
          if (isAborted()) return;
          doCleanup();
          reject(reason);
        },
        onCleanup,
        isAborted
      );
    }
  });
