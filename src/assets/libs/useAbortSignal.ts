import { tryOnScopeDispose } from '@vueuse/core';

type OnCancel = (callback: VoidFunction) => void;

/**
 * @param onCancel callback from watchEffect or other Vue composables. onScopeDispose by-default
 * @returns abort signal that emits when current scope disposed
 */
export const useAbortSignal = (onCancel: OnCancel = tryOnScopeDispose): AbortSignal => {
  const ctrl = new AbortController();

  onCancel(() => ctrl.abort());

  return ctrl.signal;
};
