import { createPromiseWithAbortion } from './createPromiseWithAbortion';

export interface WhenIdle extends IdleRequestOptions {
  signal?: AbortSignal | null;
}

export const whenIdle = (options?: WhenIdle): Promise<IdleDeadline> => {
  return createPromiseWithAbortion(options?.signal, (resolve, _, onCleanup) => {
    const reqId = requestIdleCallback(resolve, options);

    onCleanup(() => {
      cancelIdleCallback(reqId);
    });
  });
};
