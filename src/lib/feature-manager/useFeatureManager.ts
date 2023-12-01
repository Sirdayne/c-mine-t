import { useStore } from '~/lib/framework';
import { FeatureManager, features, StaticFeatureManager } from './index';

export function useFeatureManager(): FeatureManager {
  const store = useStore();
  return new StaticFeatureManager(features, store);
}
