import axios from 'axios';
import { defineNuxtPlugin, onGlobalSetup } from '~/lib/framework';
import { AdbutlerManagerFactory, provideAdbutlerManager } from '~/lib/adbutler';
import { provideDeviceInfo } from '~/lib/device-detector';
import { provideLayotUiStore } from '~/lib/layout-store';
import { provideConpletusApi } from '~/lib/conpletus-api';
import { provideUserCountryStore } from '~/features/user-country';
import { provideChangellyCoinMappingsStore } from '~/features/changelly-widget';
import { ROOT } from './store/types';

/**
 * Provide stuff to Vue context and start background processes
 */
export default defineNuxtPlugin(({ $config, store }) => {
  const { adbutlerUrl, adbutlerProxyUrl, graphqlUrl: clientGraphqlUrl, serverGraphqlUrl } = $config;
  const adbutlerManager = new AdbutlerManagerFactory(adbutlerUrl, adbutlerProxyUrl || null).build();
  const conpletusApiUrl = (process.server && serverGraphqlUrl) || clientGraphqlUrl;
  const conpletusApiAxios = axios.create({ baseURL: conpletusApiUrl });

  onGlobalSetup(() => {
    provideAdbutlerManager(adbutlerManager);
    provideDeviceInfo();
    provideLayotUiStore();
    provideConpletusApi(conpletusApiAxios);
    provideUserCountryStore();
    provideChangellyCoinMappingsStore();
  });

  if (process.client) {
    // eager start adblock detection on client
    adbutlerManager.detectAdblock();
  }

  store.dispatch(ROOT.INIT_CLIENT);
});
