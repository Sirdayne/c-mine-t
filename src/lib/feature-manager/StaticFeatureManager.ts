import { type Store } from 'vuex';
import { FeatureManager } from './index';
import { FeatureFlags } from './types';

export class StaticFeatureManager implements FeatureManager {
  constructor(
    private features: FeatureFlags,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private store: Store<any>
  ) {}

  isEnabled(name: keyof FeatureFlags): boolean {
    if (!(name in this.features)) {
      throw new Error(`${name} feature does not exist`);
    }
    if (Array.isArray(this.features[name])) {
      return (this.features[name] as string[]).includes(this.store.state.currentLanguage.short);
    }
    return this.features[name] as boolean;
  }
}
