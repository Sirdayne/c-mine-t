import { NuxtState } from '@nuxt/types/app';
import { type Ref, unref } from 'vue';
import { useContext } from '~/lib/framework';

const TRANSFER_STATE_KEY = 'transferState';

interface Serializer {
  serialize(value: any): string;
  deserialize(value: any): any;
}

const defaultSerializer: Serializer = {
  serialize: JSON.stringify,
  deserialize: JSON.parse,
};

const getTransferState = (nuxtState: NuxtState): Record<string, string> => {
  return nuxtState[TRANSFER_STATE_KEY] || (nuxtState[TRANSFER_STATE_KEY] = {});
};

/**
 * Make Ref state transferable over SSR
 *
 * @param ref
 * @param key
 * @param serializer
 */
export const useTransferRef = (ref: Ref<unknown>, key: string, serializer: Serializer = defaultSerializer): void => {
  const ctx = useContext();

  // TODO: handle serializer errors

  if (process.server) {
    ctx.beforeSerialize((nuxtState) => {
      const transferState = getTransferState(nuxtState);
      transferState[key] = serializer.serialize(unref(ref));
    });
  }

  if (process.client) {
    const transferState = getTransferState(ctx.nuxtState);
    const transferred = transferState[key];

    if (typeof transferred !== 'undefined') ref.value = serializer.deserialize(transferred);
  }
};
