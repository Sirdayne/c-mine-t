import { withSpanInScope } from './tracing';

/**
 * Creates wrapped "fetch" function with given span in scope,
 * for better parent-child relationship
 *
 * Helper for Sentry instrumentation
 *
 * @param {Span|null|undefined} span
 * @param {typeof fetch} [originalFetch] fetch API. from global by default
 * @returns {typeof fetch}
 *
 * @example
 *
 * ```javascript
 * const rootSpan = startSpan(...); // from ~/lib/telemetry
 * const fetch = createFetchWithSpan(rootSpan);
 *
 * // all fetches below would have span bound to "rootSpan"
 * // so in sentry view it would be like: transaction -> root span op => "http.client"
 * fetch(...);
 * fetch(...);
 * ```
 */
export const createFetchWithSpan = (span, originalFetch = fetch) => {
  if (!span) return originalFetch;

  return function fetchWithSpan(...args) {
    return new Promise((resolve, reject) => {
      withSpanInScope(span, () => {
        originalFetch(...args)
          .then(resolve)
          .catch(reject);
      });
    });
  };
};
