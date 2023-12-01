import { FeatureFlags } from './types';

export abstract class FeatureManager {
  abstract isEnabled(name: keyof FeatureFlags): boolean;
}
