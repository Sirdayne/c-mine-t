import { type Ref, unref, ref, watch, onMounted } from 'vue';
import { type MaybeRef } from '@vueuse/core';
import { useStore, useRoute as fwUseRoute, useRouter as fwUseRouter } from '~/lib/framework';

/**
 * @deprecated use "useStore" from "~/lib/framework"
 */
export const useVuex = useStore;

/**
 * @deprecated use "useRouter" from "~/lib/framework"
 */
export const useRoute = () => unref(fwUseRoute());

/**
 * @deprecated use "useRouter" from "~/lib/framework"
 */
export const useRouter = () => fwUseRouter();

/**
 * Accessor for route query param
 * - reads vue-router's query params reactively
 * - ❗ but writes changes to history API directly
 *
 * @param param Name of parameter
 * @param defaultValue Fallback value when no param in vue-router's query
 * @returns ref which value synced with query params
 */
export const useRouteQuery = (param: MaybeRef<string>, defaultValue: MaybeRef<string>): Ref<string> => {
  const route = useRoute();

  const readQueryParamValue = (): string => {
    const value = route.query[unref(param)];

    if (typeof value === 'string') return value;

    if (Array.isArray(value) && typeof value[0] === 'string') return value[0];

    return unref(defaultValue);
  };

  const reflectParamValueInQuery = (value: string): void => {
    const url = new URL(globalThis.location.href);
    url.searchParams.set(unref(param), value);

    globalThis.history.replaceState(null, '', url);
  };

  const inputValueRef = ref(readQueryParamValue());

  onMounted(() => {
    watch(inputValueRef, reflectParamValueInQuery, { flush: 'post' });

    watch(readQueryParamValue, (queryValue) => {
      inputValueRef.value = queryValue;
    });
  });

  return inputValueRef;
};
