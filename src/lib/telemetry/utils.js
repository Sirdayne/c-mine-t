import { captureError } from './errors';

/**
 * Executes all callbacks with capturing
 * @param {Iterable<VoidFunction>} callbacks
 *
 * @deprecated extract to lib
 */
export const execUnsafeCallbacks = (callbacks) => {
  for (const callback of callbacks) {
    Promise.resolve().then(callback).catch(captureError);
  }

  if ('clear' in callbacks && typeof callbacks.clear === 'function') callbacks.clear();
};
