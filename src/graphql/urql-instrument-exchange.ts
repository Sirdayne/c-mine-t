import { mapExchange, type OperationContext, type OperationType } from '@urql/core';
import { finishSpan, getTracingHeaders, startSpan, createFetchWithSpan } from '~/lib/telemetry';
import { getOperationName } from './getOperationName';

const injectTracingHeaders = (context: OperationContext): void => {
  const fetchOptions = typeof context.fetchOptions === 'function' ? context.fetchOptions() : context.fetchOptions || {};

  context.fetchOptions = {
    ...fetchOptions,
    headers: {
      ...fetchOptions?.headers,
      ...getTracingHeaders(),
    },
  };
};

const shouldSkipOperationByType = (type: OperationType) => type === 'teardown';

export const instrumentExchange = mapExchange({
  onOperation({ kind, query, variables, context }) {
    // teardown operations is useless
    if (shouldSkipOperationByType(kind)) return;

    const operationName = getOperationName(query);
    const span = startSpan({
      op: `http.graphql.${kind}`,
      description: `${kind} ${operationName}`,
      tags: {
        'graphql.kind': kind,
        'graphql.operationName': operationName,
      },
      data: {
        kind,
        operationName,
        variables,
      },
    });

    context.fetch = createFetchWithSpan(span);
    context.span = span;

    injectTracingHeaders(context);
  },

  onResult(result) {
    const { span } = result.operation.context;

    if (span)
      finishSpan(span, {
        status: result.error ? 'internal_error' : 'ok',
      });
  },
});
