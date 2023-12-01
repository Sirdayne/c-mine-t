import { waitMsWithAbort } from '~/assets/libs/abortUtils';

const POLL_INTERVAL_MS = 1000 / 15;

/**
 * Polls condition peridocially until it become truthy
 */
export const waitFor = async (condition: () => boolean, signal?: AbortSignal): Promise<void> => {
  do {
    await waitMsWithAbort(POLL_INTERVAL_MS, signal);
  } while (!condition() && !signal?.aborted);
};
