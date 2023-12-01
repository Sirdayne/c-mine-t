import { jest } from '@jest/globals';
import { AdbutlerManager } from '~/lib/adbutler';

const noop: VoidFunction = () => {};
const noopGetPlacement: AdbutlerManager['getPlacement'] = () => Promise.resolve(null);

// @ts-expect-error wtf? how can I implement private props?
export class MockAdbutlerManager implements AdbutlerManager {
  detectAdblock = jest.fn(noop);

  getPlacement = jest.fn(noopGetPlacement);
}
