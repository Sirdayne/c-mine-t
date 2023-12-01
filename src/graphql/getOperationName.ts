import { type DocumentNode } from 'graphql';

/**
 * copy-paste from urql
 * @see https://github.com/urql-graphql/urql/blob/47fdb665f26974a0b6cbc1040addfdcce5bf2659/packages/core/src/utils/request.ts#L167
 */
export const getOperationName = (query: DocumentNode): string | undefined => {
  for (const node of query.definitions) {
    if (node.kind === 'OperationDefinition' && node.name) {
      return node.name.value;
    }
  }
};
