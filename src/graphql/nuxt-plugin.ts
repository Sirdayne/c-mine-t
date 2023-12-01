import { cacheExchange, createClient, fetchExchange, ssrExchange as createSsrExchange } from '@urql/core';
import { provideClient } from '@urql/vue';
import { defineNuxtPlugin, onGlobalSetup } from '~/lib/framework';
import { ApolloTransportInteropAdapter } from './apollo-transport-interop';
import { instrumentExchange } from './urql-instrument-exchange';
import { createCrossRequestStateExchange, UniversalCrossRequestStateStore } from '~/graphql/urql-state-exchange';

/**
 * for "__NUXT__"
 */
const URQL_SSR_CACHE_NUXT_STATE_KEY = 'urqlState';

export default defineNuxtPlugin(({ $config, nuxtState, beforeSerialize }, inject) => {
  let graphqlUrl = $config.graphqlUrl;

  if (process.server) graphqlUrl = $config.serverGraphqlUrl || graphqlUrl;

  if (!graphqlUrl.endsWith('/')) graphqlUrl += '/';

  const crossRequestStateStore = new UniversalCrossRequestStateStore();
  const crossRequestStateExchange = createCrossRequestStateExchange(crossRequestStateStore);

  const ssrExchange = createSsrExchange({
    isClient: process.client,
    staleWhileRevalidate: true,
    includeExtensions: true,
  });

  if (process.client) {
    const initialState = nuxtState[URQL_SSR_CACHE_NUXT_STATE_KEY] || {};
    ssrExchange.restoreData(initialState);
  }

  if (process.server) {
    beforeSerialize((nuxtState) => {
      nuxtState[URQL_SSR_CACHE_NUXT_STATE_KEY] = ssrExchange.extractData();
    });
  }

  const client = createClient({
    url: graphqlUrl,
    exchanges: [cacheExchange, ssrExchange, crossRequestStateExchange, instrumentExchange, fetchExchange],
  });

  const apolloTransportInterop = new ApolloTransportInteropAdapter(client);

  inject('urql', client);
  inject('apolloTransport', apolloTransportInterop);

  onGlobalSetup(() => {
    provideClient(client);
  });
});
