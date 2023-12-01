import { type Client } from '@urql/core';

/**
 * Provides Urql as implementation for legacy "$apolloTransport"
 * Should be dropped when all components refactored to `useQuery` hook
 */
export class ApolloTransportInteropAdapter {
  constructor(private readonly _urqlClient: Client) {}

  // disabled as this is temporary, no need to strict type-check
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query({ query, variables, context }: any): Promise<any> {
    return this._urqlClient
      .query(query, variables, {
        ...context,
        requestPolicy: 'network-only',
      })
      .toPromise();
  }
}
