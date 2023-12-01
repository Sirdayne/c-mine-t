/**
 * Marks errors to not be reported
 * @param error
 */
export declare function doNotReport(error: unknown): void;

/**
 * Creates error with any data attached
 * @param message Helpful message
 * @param extra Extra data to add to error
 */
export declare function createErrorWithExtra<Extra>(message: string, extra: Extra): Error & Extra;

/**
 * Capture error and send to errors service
 *
 * @param error captured error
 * @param extra optional data
 */
export declare function captureError<Extra>(error: Error | unknown, extra?: Extra): void;

/**
 * Set tags on error
 * so they parsed on Sentry
 * @param error
 * @param tags
 */
export declare function setTags(error: Error, tags: Record<string, unknown>): void;
