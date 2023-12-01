import { type MaybeRefOrGetter } from '@vueuse/core';
import { useUserCountryStore } from '~/features/user-country';
import { useChangellyCoinMappingsStore } from './ChangellyCoinMappingsStore';
import { ChangellyWidgetViewModel } from './ChangellyWidgetViewModel';

export interface ChangellyWidgetPendingState {
  loaded: false;
  targetCoin: null;
}

export interface ChangellyWidgetUnresolvedState {
  loaded: true;
  targetCoin: null;
}

export interface ChangellyWidgetResolvedState {
  loaded: true;
  targetCoin: string;
}

export type ChangellyWidgetState =
  | ChangellyWidgetPendingState
  | ChangellyWidgetResolvedState
  | ChangellyWidgetUnresolvedState;

/**
 * @param postRef Vue Ref to "this.post" from Post.vue
 */
export const useChangellyWidgetViewModel = (postRef: MaybeRefOrGetter<any>): ChangellyWidgetViewModel => {
  const mappingsStore = useChangellyCoinMappingsStore();
  const userCounryStore = useUserCountryStore();

  return new ChangellyWidgetViewModel(mappingsStore, userCounryStore, postRef);
};
