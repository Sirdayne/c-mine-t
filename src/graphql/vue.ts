import { onServerPrefetch, getCurrentInstance } from 'vue';
import { useQuery as realUseQuery, provideClient } from '@urql/vue';
import { type Client } from '@urql/core';

export { provideClient };

export const useQuery: typeof realUseQuery = (args) => {
  const result = realUseQuery(args);

  const prefetchQuery = async () => {
    await result;
  };

  onServerPrefetch(prefetchQuery);

  return result;
};

export const useClient = (): Client => {
  const inst = getCurrentInstance();

  // @ts-expect-error urql provided in "nuxt-plgin"
  const client = inst?.proxy.$urql;

  if (!client) throw new Error('no $urql in current Vue instance');

  return client;
};
