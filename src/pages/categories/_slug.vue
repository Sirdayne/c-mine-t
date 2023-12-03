<script lang="ts">
import { computed, ref, onMounted } from 'vue';
import { defineComponent, useContext, useMeta, useRoute, useStore } from '~/lib/framework';
import { useQuery } from '~/graphql';
import { useAutoLoadMore } from '~/components/useAutoLoadMore';
import TagPostList from '~/features/tags/TagPostList.vue';
import TagPage from '~/pages/tags/TagPage.vue';
import { ROOT } from '~/store/types';
import { getCategoryPageMeta } from '~/assets/helpers/meta';
import categoryPageQuery from '~/graphql/queries/categoryPage.graphql';
import { getFormattedDateString } from '~/assets/helpers/dateTime';
import { pushVirtualPageView } from '~/assets/helpers/dataLayerEvents';

export default defineComponent({
  name: 'CategoriesPage',
  components: {
    TagPostList,
    TagPage
  },
  setup() {
    const store = useStore();
    const currentLanguage = computed(() => store.state.currentLanguage);
    const languages = computed(() => store.state.languages);
    const short = computed(() => store.state.currentLanguage.short);
    const route = useRoute();
    const isRtl = computed(() => store.getters[ROOT.IS_RTL]);
    const context = useContext();
    const postsRef = ref([]);
    const length = ref(15);
    const CRYPTOPEDIA_CATEGORIES = ['explained'];

    const categoryQuery = useQuery({
      query: categoryPageQuery,
      variables: {
        short,
        slug: route.value.params.slug,
        offset: 0,
        length,
      },
    });

    onMounted(() => {
      if (hasMore.value) {
        useAutoLoadMore({
          target: postsRef,
          callback: increaseLength,
        });
      }

      virtualPageView();
      sendChartBeatPageView();
    });

    const increaseLength = () => {
      if (!categoryQuery.fetching.value) {
        length.value = length.value + 15;
      }
    };

    const categoryQueryResponse = computed(() => categoryQuery?.data?.value?.locale?.category);

    const category = computed(() => categoryQueryResponse.value?.categoryTranslates?.[0]);

    const mappedCategory = computed(() => {
      return {
        title: category?.value?.pageTitle ?? category?.value?.title,
        description: category?.value?.description,
        imgUrl: categoryQueryResponse?.value?.avatar
      }
    })

    const postsData = computed(() => categoryQueryResponse.value?.posts?.data);

    const posts = computed(() => {
      const originalPosts = postsData.value || [];
      return originalPosts.map((post: any) => ({
        id: post.id,
        slug: post.slug,
        title: post.postTranslate?.title,
        img: post.postTranslate?.avatar,
        description: post.postTranslate?.leadText,
        author: post.author?.authorTranslates?.[0]?.name,
        authorUrl: `/authors/${post.author?.slug}`,
        label: post.postBadge?.postBadgeTranslates?.[0]?.title,
        publishedTime: post.postTranslate?.publishedHumanFormat,
      }));
    });

    const postsAmount = computed(() => categoryQueryResponse?.value?.posts?.postsCount)

    const postsOffset = computed(() => posts?.value && posts?.value?.length)

    const hasMore = computed(() => postsAmount.value > 0 && postsOffset.value < postsAmount.value)

    const alternates = computed(() => categoryQueryResponse?.value?.alternates);

    const meta = computed(() => {
      return {
        url: route?.value?.path,
        title: category?.value?.metaTitle,
        description: category?.value?.metaDescription,
        keywords: category?.value?.keywords,
        image:  categoryQueryResponse?.value?.avatar,
        datePublished: getFormattedDateString(category?.value?.createdAt),
        dateModified: getFormattedDateString(category?.value?.updatedAt),
      }
    });

    useMeta(() => {
      return getCategoryPageMeta({
        currentLanguage: currentLanguage.value,
        amphtmlDisabled: route.value.name === 'market-releases',
        languages: languages.value,
        meta: meta.value,
        posts: posts.value,
        alternates: alternates.value,
        routeName: route.value.name
      });
    });

    const virtualPageView = () => {
      pushVirtualPageView({
        url: currentLanguage?.value?.url + route?.value?.path,
        title: category?.value?.metaTitle,
        category: '',
        tags: [],
      });
    }

    const sendChartBeatPageView = () => {
      if (CRYPTOPEDIA_CATEGORIES.includes(route?.value?.params?.slug)) {
        context?.$chartBeat.sendPageView({
          title: document?.title,
          path: route?.value?.path,
          sections: route?.value?.params?.slug,
        });
      } else {
        context?.$chartBeat.sendPageView();
      }
    }

    return {
      mappedCategory,
      posts,
      categoryQuery,
      postsRef,
      isRtl
    }
  }
});
</script>

<template>
  <TagPage
      v-if="mappedCategory && mappedCategory.title"
      :entity="mappedCategory"
  >
    <TagPostList
        v-if="posts && posts.length > 0"
        ref="postsRef"
        :posts="posts"
        :fetching="categoryQuery.fetching.value"
    />
  </TagPage>
</template>

<style scoped lang="scss"></style>
