import { computed, type Ref } from 'vue';
import { type MaybeRefOrGetter, toValue } from '@vueuse/core';
import { buildOptimizedImageUrl, type OptimizedImageOptions } from './buildOptimizedImageUrl';

export const useOptimizedImageUrl = (options: MaybeRefOrGetter<OptimizedImageOptions>): Readonly<Ref<string>> => {
  return computed(() => buildOptimizedImageUrl(toValue(options)));
};
