import { useTransferRef } from '~/lib/shared';
import { AsyncStore, NO_DATA } from './AsyncStore';
import { onMounted, onServerPrefetch } from 'vue';
import { useAbortSignal } from '~/assets/libs/useAbortSignal';

const NO_DATA_SERIALIZED = '__no_data';

export const useTransferAsyncStore = <S extends AsyncStore<unknown>>(store: S, key: string): void => {
  useTransferRef(store['_ref'], key, {
    serialize({ loading, data, reason }) {
      const noData = data === NO_DATA;

      return JSON.stringify({
        loading,
        reason,
        data: noData ? undefined : data,
        [NO_DATA_SERIALIZED]: noData,
      });
    },

    deserialize(s) {
      s = JSON.parse(s);
      return {
        loading: s.loading,
        reason: s.reason,
        data: s[NO_DATA_SERIALIZED] ? NO_DATA : s['data'],
      };
    },
  });
};

export interface UseAutoRunAsyncStoreOptions {
  /**
   * Run action again
   * @default false
   */
  revalidate?: boolean;

  /**
   * Run action on SSR
   * @default true
   */
  ssr?: boolean;
}

/**
 * Auto-run store action on SSR and CSR
 *
 * @param store
 * @param revalidate Re-run action even when settled during SSR
 */
export const useAutoRunAsyncStore = (store: AsyncStore<unknown>, options?: UseAutoRunAsyncStoreOptions): void => {
  const revalidate = options?.revalidate ?? false;
  const ssr = options?.ssr ?? true;
  const signal = process.client ? useAbortSignal() : undefined;

  const runAndWait = async (): Promise<void> => {
    // enforce revalidation when failed during SSR
    store.run(revalidate || store.isFailed());
    await store.wait(signal);
  };

  if (ssr) onServerPrefetch(runAndWait);
  onMounted(runAndWait);
};
