<template>
  <div>
    <GuidesTopZone
      :selected-category="selectedCategory"
      :search-query="searchQuery"
      @search-input="onSearchUpdate"
    />
    <div class="container mt-6 sm:mt-8">
      <GuidesPostsListingTitle
        :search-query="searchQuery"
        :selected-category="selectedCategory"
        :guides-count="guidesCount"
      />
      <template v-for="(variable, index) in variables">
        <GuidePostsListing
          :key="index"
          :guide-category-slug="selectedCategorySlug"
          :offset="variable.offset"
          :posts-length="postsLength"
          :is-last="index === variables.length - 1"
          :is-first="index === 0"
          :search-query="searchQuery"
          @load-more="handleLoadMore"
          @update-guides-count="onGuidesCountUpdate"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import GuidesTopZone from '../GuidesTopZone.vue';
import { computed, PropType, ref, watch } from 'vue';
import { useStore, defineComponent, useRoute, useMeta } from '~/lib/framework';
import GuidePostsListing from '../GuidePostsListing.vue';
import { type GuideCategory, SeoMetaQueryDocument, useQuery } from '~/graphql';
import { useLayoutUiStore } from '~/lib/layout-store';
import { useDeviceInfo } from '~/lib/device-detector';
import { getGuideCategoryPageMeta } from '~/assets/helpers/meta/guide';
import { ROOT } from '~/store/types';
import { useRouteQuery } from '~/assets/libs/nuxtComposables';
import GuidesPostsListingTitle from '~/components/Guides/GuidesPostsListingTitle.vue';

interface Variables {
  offset: number;
}
export default defineComponent({
  name: 'GuideCategoryView',
  components: {
    GuidesPostsListingTitle,
    GuidesTopZone,
    GuidePostsListing,
  },
  props: {
    selectedCategory: {
      type: Object as PropType<GuideCategory | null | undefined>,
      default: null,
    },
  },
  setup(props) {
    const store = useStore();
    const route = useRoute();
    const layoutUiStore = useLayoutUiStore();
    const deviceInfo = useDeviceInfo();

    const guidesCount = ref<number>(0);
    const searchQuery = useRouteQuery('query', '');

    const currentLanguage = computed(() => store.state.currentLanguage);
    const languages = computed(() => store.state.languages);

    const postsLength = computed(() => (deviceInfo.desktop ? 9 : 6));

    const selectedCategorySlug = computed(() => props.selectedCategory?.slug ?? null);
    const variables = ref<Variables[]>([]);

    const handleLoadMore = (): void => {
      variables.value.push({
        offset: variables.value.length * postsLength.value,
      });
    };

    const onSearchUpdate = (query: string): void => {
      searchQuery.value = query;
    };

    // reset category state and layout ui
    watch(
      () => props.selectedCategory,
      () => {
        layoutUiStore.setHeaderVariant('dark');

        variables.value = [
          {
            offset: 0,
          },
        ];
      },
      { immediate: true }
    );

    const onGuidesCountUpdate = (total: number): void => {
      guidesCount.value = total;
    };

    // Meta section
    const pageMetaQuery = useQuery({
      query: SeoMetaQueryDocument,
      variables: {
        short: store.state.currentLanguage.short,
        url: route.value?.path,
      },
    });
    const meta = computed(() => {
      const localMeta = pageMetaQuery?.data.value?.locale?.seoMeta;
      return {
        url: localMeta?.seoMetaUrl,
        title: localMeta?.seoMetaTitle,
        description: localMeta?.seoMetaDescription,
        keywords: localMeta?.seoMetaKeywords,
      };
    });
    useMeta(() => {
      return getGuideCategoryPageMeta({
        currentLanguage: currentLanguage.value,
        languages: languages.value,
        meta: meta.value,
        routeName: route.value.name,
        isCn: computed(() => store.getters[ROOT.IS_CN]).value,
      });
    });
    return {
      variables,
      handleLoadMore,
      selectedCategorySlug,
      postsLength,
      searchQuery,
      onGuidesCountUpdate,
      onSearchUpdate,
      guidesCount,
    };
  },
  head: {},
});
</script>
