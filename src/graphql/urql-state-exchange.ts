/**
 * Cross-request GraphQL state
 *
 * As Cookie do not work because Conpletus is third-party resource,
 * and users with strict blocking third-party cookies may encounter lost state,
 * this exchanges helps to persist state between requests even during SSR
 *
 * WARN: Temporary shitty solution, should be replaced with Cookies
 *  by https://jira.cointelegraph.com/browse/CDT-2957
 */

import { mapExchange, type Exchange, type Operation, type OperationContext, type OperationResult } from '@urql/core';
import { getOperationName } from './getOperationName';

export type CrossRequestState = string | null;

export const CROSS_REQUEST_STATE_HEADER = 'X-Gql-State';
export const CROSS_REQUEST_STATE_GRAPHQL_EXTENSION = 'state';

export const CROSS_REQUEST_STATE_STORAGE_KEY = 'graphql-cross-request-state';

/**
 * graphql operations that allowed to pass and store state
 */
export const GRAPHQL_STATEFUL_OPERATION_NAME_ALLOWLIST = ['InfiniteScrollArticlesQuery'];

export abstract class CrossRequestStateStore {
  abstract persist(state: CrossRequestState): void;
  abstract load(): CrossRequestState;
}

export class InMemoryCrossRequestStateStore extends CrossRequestStateStore {
  private _state: CrossRequestState = null;

  persist(state: CrossRequestState): void {
    this._state = state;
  }

  load(): CrossRequestState {
    return this._state;
  }
}

export class LocalStorageCrossRequestStateStore extends CrossRequestStateStore {
  persist(state: CrossRequestState): void {
    if (state === null) {
      localStorage.removeItem(CROSS_REQUEST_STATE_STORAGE_KEY);
    } else {
      localStorage.setItem(CROSS_REQUEST_STATE_STORAGE_KEY, state);
    }
  }

  load(): CrossRequestState {
    return localStorage.getItem(CROSS_REQUEST_STATE_STORAGE_KEY) ?? null;
  }
}

export class UniversalCrossRequestStateStore extends CrossRequestStateStore {
  private _impl: CrossRequestStateStore;

  constructor() {
    super();
    this._impl = process.server ? new InMemoryCrossRequestStateStore() : new LocalStorageCrossRequestStateStore();
  }

  persist(state: CrossRequestState): void {
    this._impl.persist(state);
  }

  load(): CrossRequestState {
    return this._impl.load();
  }
}

const injectStateHeader = (context: OperationContext, state: CrossRequestState): void => {
  const fetchOptions = typeof context.fetchOptions === 'function' ? context.fetchOptions() : context.fetchOptions || {};

  context.fetchOptions = {
    ...fetchOptions,
    headers: {
      ...fetchOptions?.headers,
      [CROSS_REQUEST_STATE_HEADER]: state || '',

      /**
       * skip Conpletus cache for all stateful operations
       */
      'Cache-Control': 'no-store',
    },
  };
};

const isOperationStateful = (operation: Operation): boolean => {
  const operationName = getOperationName(operation.query);
  return typeof operationName === 'string' && GRAPHQL_STATEFUL_OPERATION_NAME_ALLOWLIST.includes(operationName);
};

export const createCrossRequestStateExchange = (store: CrossRequestStateStore): Exchange => {
  return mapExchange({
    onOperation(operation: Operation): void {
      if (isOperationStateful(operation)) {
        injectStateHeader(operation.context, store.load());
      }
    },

    onResult(result: OperationResult): void {
      if (
        isOperationStateful(result.operation) &&
        result.extensions &&
        CROSS_REQUEST_STATE_GRAPHQL_EXTENSION in result.extensions
      ) {
        store.persist(result.extensions[CROSS_REQUEST_STATE_GRAPHQL_EXTENSION]);
      }
    },
  });
};
