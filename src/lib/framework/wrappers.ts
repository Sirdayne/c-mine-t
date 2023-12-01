import { computed, ref, type Ref, unref, watch } from 'vue';
import { type NuxtRuntimeConfig } from '@nuxt/types/config/runtime';
import {
  shallowSsrRef,
  ssrRef,
  defineComponent as defineComponentImpl,
  useContext,
  useStore as useStoreImpl,
  useRoute,
  useRouter,
} from '@nuxtjs/composition-api';
import { type Store } from 'vuex';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useStore = useStoreImpl as () => Store<any>;

/**
 * Enhance Vue "defineComponent"
 * with "@nuxtjs/composition-api" magic
 * for "useMeta" composable
 */
export const defineComponent = ((options: object) => {
  return defineComponentImpl({
    head: {},
    ...options,
  });
}) as typeof defineComponentImpl;

/**
 * State that transferred from server to client
 */
export const useState = <T>(key: string | number, initialValue: T | (() => T), shallow?: boolean): Ref<T> => {
  const impl = shallow ? shallowSsrRef : ssrRef;
  return impl(initialValue, String(key));
};

export const useRuntimeConfig = (): NuxtRuntimeConfig => useContext().$config;
