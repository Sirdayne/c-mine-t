import { AsyncStore, useAutoRunAsyncStore, useTransferAsyncStore } from '~/lib/async-store';
import { ConpletusApi, useConpletusApi } from '~/lib/conpletus-api';
import { createInjection } from '~/lib/shared';

/**
 * TODO: Introduce User session with extra data
 */
export class UserCountryStore extends AsyncStore<string | null> {
  constructor(private readonly _conpletusApi: ConpletusApi) {
    super(() => this._loadCountry());
  }

  getCountry(): string | null {
    try {
      return this.unwrap();
    } catch (error) {
      return null;
    }
  }

  private async _loadCountry(): Promise<string | null> {
    const { country } = await this._conpletusApi.getUserCountry();
    return country;
  }
}

const ij = createInjection<UserCountryStore>('user-country-store');

export const provideUserCountryStore = (): void => {
  const conpletusApi = useConpletusApi();
  const store = new UserCountryStore(conpletusApi);

  useAutoRunAsyncStore(store, { ssr: false });
  useTransferAsyncStore(store, 'user-country');
  ij.provide(store);
};

export const useUserCountryStore = ij.use;
