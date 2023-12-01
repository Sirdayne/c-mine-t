# graphql

## Getting started

Plz learn GraphQL from [Official GraphQL site](https://graphql.org/)

### Stack:

- Urql
- graphql-codegen
- graphql typed-document-node
- [.graphqlconfig](.graphqlconfig) in project

GraphQL queries located in `src/graphql/queries/*.graphql`

Generated code (typings and documents) in `src/graphql/generated.ts` (re-exported in `index.ts`)

Re-run codegen on graphql code changes using `npm run graphql-codegen` (requires enabled VPN)

⚠️ plz do not use "$apolloTransport" and "fetchQuery", this is ugly legacy

❗️do not change generated code.

👍 [There is extension for IDEA for GraphQL (introspection, execution and suggestions)](https://plugins.jetbrains.com/plugin/index?xmlId=com.intellij.lang.jsgraphql)

Example:

```typescript
import { defineComponent } from 'vue';
// all graphql related stuff from barrel
import { useQuery, ArticleQueryDocument } from '~/graphql';

export default defineComponent({
  setup() {
    // query would be prefetched on SSR and waited before response,
    //  so u can forget bout asyncData or await
    // for client-side only queries just wrap component with "<ClientOnly>"
    const result = useQuery({
      // for "ArticleQuery" operation
      query: ArticleQueryDocument,
      variables: {
        // IDE suggestions by codegen
        short: 'en',
        slug: 'buy-at-high-sell-at-low',
      },
    });

    // use result of query in template. fully reactive
    return { result };
  },
});
```
