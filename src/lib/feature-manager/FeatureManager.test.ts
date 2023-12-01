import { beforeEach, describe, expect, it } from '@jest/globals';
import { type Store } from 'vuex';
import { StaticFeatureManager } from './StaticFeatureManager';

describe('FeatureManager', () => {
  let manager: StaticFeatureManager;

  beforeEach(() => {
    const features = {
      podcasts: ['en'],
      popin: [],
    };

    const store = {
      state: {
        currentLanguage: {
          short: 'en',
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as Store<any>;
    manager = new StaticFeatureManager(features, store);
  });

  it('feature flag should be found', () => {
    const result = manager.isEnabled('podcasts');

    expect(result).toBe(true);
  });

  it('feature flag shouldn`t be found', () => {
    const result = manager.isEnabled('popin');

    expect(result).toBe(false);
  });

  it('feature flag do not exist', () => {
    const result = () => manager.isEnabled('sdgsfg');

    expect(result).toThrow(new Error(`sdgsfg feature does not exist`));
  });
});
