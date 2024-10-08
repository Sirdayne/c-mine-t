<script lang="ts">
import { computed, ref, onMounted } from 'vue';
import { defineComponent, useContext, useMeta, useRoute, useStore } from '~/lib/framework';
import { useQuery } from '~/graphql';
import tagPageQuery from '~/graphql/queries/tagPage.graphql';
import { useAutoLoadMore } from '~/components/useAutoLoadMore';
import TagPostList from '~/features/tags/TagPostList.vue';
import TagPage from '~/pages/tags/TagPage.vue';
import { ROOT } from '~/store/types';
import { getTagsPageMeta } from '~/assets/helpers/meta';
import { getFormattedDateString } from '~/assets/helpers/dateTime';
import { pushVirtualPageView } from '~/assets/helpers/dataLayerEvents';

export default defineComponent({
  name: 'TagsPage',
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
    const CRYPTOPEDIA_TAGS = ['how-to-crypto'];

    const tagQuery = useQuery({
      query: tagPageQuery,
      variables: {
        short,
        order: 'postPublishedTime',
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
      if (!tagQuery.fetching.value) {
        length.value = length.value + 15;
      }
    };

    const tagQueryResponse = computed(() => tagQuery?.data?.value?.locale?.tag);

    const tag = computed(() => tagQueryResponse?.value?.tagTranslates?.[0]);

    const mappedTag = computed(() => {
      return {
        title: tag?.value?.pageTitle ?? tag?.value?.title,
        description: tag?.value?.description,
        imgUrl: tagQueryResponse?.value?.avatar
      }
    })

    const postsData = computed(() => tagQueryResponse.value?.posts?.data);

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

    const postsAmount = computed(() => tagQueryResponse?.value?.posts?.postsCount)

    const postsOffset = computed(() => posts?.value && posts?.value?.length)

    const hasMore = computed(() => postsAmount.value > 0 && postsOffset.value < postsAmount.value)

    const alternates = computed(() => tagQueryResponse?.value?.alternates);

    const meta = computed(() => {
      return {
        url: route?.value?.path,
        title: tag?.value?.metaTitle,
        description: tag?.value?.metaDescription,
        keywords: tag?.value?.keywords,
        image:  tagQueryResponse?.value?.avatar,
        datePublished: getFormattedDateString(tag?.value?.createdAt),
        dateModified: getFormattedDateString(tag?.value?.updatedAt),
      }
    });

    useMeta(() => {
      return getTagsPageMeta({
        currentLanguage: currentLanguage.value,
        languages: languages.value,
        meta: meta.value,
        alternates: alternates.value,
        routeName: route.value.name
      });
    });

    const virtualPageView = () => {
      pushVirtualPageView({
        url: currentLanguage?.value?.url + route?.value?.path,
        title: tag?.value?.metaTitle,
        category: '',
        tags: [],
      });
    }

    const sendChartBeatPageView = () => {
      if (CRYPTOPEDIA_TAGS.includes(route?.value?.params?.slug)) {
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
      mappedTag,
      posts,
      tagQuery,
      postsRef,
      isRtl
    }
  }
});
</script>

<template>
  <TagPage
      v-if="mappedTag && mappedTag.title"
      :entity="mappedTag"
  >
    <TagPostList
        v-if="posts && posts.length > 0"
        ref="postsRef"
        :posts="posts"
        :fetching="tagQuery.fetching.value"
    />
  </TagPage>
</template>

<style scoped lang="scss"></style>
