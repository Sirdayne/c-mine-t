<template>
  <div>
    <p>
      Keyword:
      <input
        v-model="keyword"
        name="keyword"
      />
    </p>

    <p>Results:</p>
    <pre>
      {{ JSON.stringify(result.data, null, 2) }}
    </pre>

    <!-- always use this component for on-the-fly optimized image -->
    <OptimizedImage
      :src="someImgUrl"
      height="300"
      width="300"
    />
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
// always import query documents and useQuery hook from this
import { SearchPagePostsQueryDocument, useQuery } from '~/graphql';
// always import stuff from lib/framework because it abstracts from vendors
import { defineComponent, useMeta } from '~/lib/framework';
// and do not import from lib internals. use only things that exported in index.ts
import { OptimizedImage } from '~/lib/image';

// always use defineComponent with TS for safety
export default defineComponent({
  name: 'ExamplePage',
  components: { OptimizedImage },

  // always use setup()
  setup() {
    const keyword = ref('');

    // always use this composable for GraphQL data
    // instead of legacy asyncData + fetchQuery
    //
    // also you can define multiple "useQuery" in component
    // they all be fetched in parallel
    const result = useQuery({
      query: SearchPagePostsQueryDocument,
      variables: {
        short: 'en',
        offset: 0,
        length: 2,
        // variables can be reactive
        // useQuery aborts requests before unmount or when new value set
        query: keyword,
      },
    });

    // use this composable for head management
    // instead of legacy head() method in options
    useMeta(() => ({
      script: [
        {
          vmid: 'json-schema',
          type: 'application/ld+json',
          json: {
            '@context': 'schema-org',
          },
        },
      ],
    }));

    // and use meta can be used multiple times per setup
    // like useQuery
    useMeta(() => ({
      script: [
        {
          vmid: 'random-stuff',
          type: 'application/json',
          json: {
            loool: 154,
          },
        },
      ],
    }));

    return {
      result,
      keyword,
      someImgUrl: 'https://s3.cointelegraph.com/storage/uploads/view/b047f51d2b432d557098db927fc5dc48.png',
    };
  },
});
</script>

<style module lang="scss">
// make sure all component styles in SCSS module
</style>
