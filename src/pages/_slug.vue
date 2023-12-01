<script setup lang="ts">
import { computed, unref, watchEffect } from 'vue';
import { StaticPageDocument, useQuery } from '~/graphql';
import { useContext, useRoute, useStore } from '~/lib/framework';
import { SeoMeta } from '~/features/meta/SeoMeta';
import PostContent from '~/components/Post/PostContent.vue';

const store = useStore();
const route = useRoute();
const ctx = useContext();
const short = computed(() => store.state.currentLanguage.short);
const slug = computed(() => unref(route).params.slug);

const staticPageQuery = useQuery({
  query: StaticPageDocument,
  variables: {
    short,
    slug,
  },
});

const content = computed(() => unref(staticPageQuery.data)?.locale?.staticPage?.content);

watchEffect(() => {
  if (!unref(content) && !unref(staticPageQuery.fetching)) {
    ctx.error({ statusCode: 404 });
  }
});
</script>

<template>
  <div v-if="content">
    <SeoMeta />
    <PostContent
      :key="slug"
      :post-id="'none'"
      :slug="slug"
      :post="content || ''"
      :without-inline-ad="true"
      :without-live-data="true"
      class="!ml-0"
      :class="$style['static-page-content']"
    />
  </div>

  <span v-else />
</template>

<style module lang="scss">
@import '~/assets/styles/_vars.scss';
@import '~/assets/styles/_mixins.scss';

/**
 * Generates selectors that matches "data-ct-class="a b c"
 * "a", "b" and "c" is like standard HTML "class" values
 * but wrapped in data-attribute to prevent clashing with
 * styles defined in this project
 */
@mixin data-ct-class($value) {
  [data-ct-class~='#{$value}'] {
    @content;
  }
}

.static-page-content {
  @include data-ct-class('page') {
    @apply my-5;
  }

  @include data-ct-class('container') {
    @include legacy-grid-container;
  }

  @include data-ct-class('row') {
    @include legacy-grid-row;
  }

  @include data-ct-class('boxed') {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2);
    background: #fff;
    @apply bg-white p-5;
  }
}
</style>
