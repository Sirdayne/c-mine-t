<template>
  <GuideCategoryView
    v-if="!error && !selectedGuide"
    :selected-category="selectedCategory"
  />
  <GuidePostView
    v-else-if="!error && selectedGuide"
    :guide="selectedGuide"
  />
  <span v-else />
</template>

<script setup lang="ts">
import { GuideCategoryOrGuideDocument, useQuery, type GuideCategory, type Guide } from '~/graphql';
import { useContext, useRoute, useStore } from '~/lib/framework';
import { computed, watchEffect } from 'vue';
import GuidePostView from '~/components/Guides/RouterView/GuidePostView.vue';
import GuideCategoryView from '~/components/Guides/RouterView/GuideCategoryView.vue';
import { provideTOCViewModel } from '~/lib/table-of-contents';
import { TableOfContentsViewModel } from '~/lib/table-of-contents';

const route = useRoute();
const store = useStore();
const context = useContext();

const tocVM = new TableOfContentsViewModel();
provideTOCViewModel(tocVM);

const { data, error } = useQuery({
  query: GuideCategoryOrGuideDocument,
  pause: computed(() => !route.value.params.slug),
  variables: {
    slug: computed(() => route.value.params.slug),
    short: computed(() => store.state.currentLanguage.short),
  },
});

const isCategory = computed(
  () => !route.value.params.slug || data.value?.locale?.guideCategoryOrGuide?.__typename === 'GuideCategory'
);

const selectedGuide = computed(() => {
  if (isCategory.value) return null;

  return data.value?.locale?.guideCategoryOrGuide as Guide;
});

const selectedCategory = computed(() => {
  if (!isCategory.value) return null;

  return data.value?.locale?.guideCategoryOrGuide as GuideCategory;
});

watchEffect(() => {
  if (data.value?.locale?.guideCategoryOrGuide === null && route.value.params.slug) {
    context.error({ statusCode: 404 });
  }
});
</script>
