<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute, useStore } from '~/lib/framework';
import { useQuery } from '~/graphql';
import tagPageQuery from '~/graphql/queries/tagPage.graphql';
import { useAutoLoadMore } from '~/components/useAutoLoadMore';
import Breadcrumbs from '~/components/Shared/Breadcrumbs.vue';
import Sidebar from '~/components/Sidebar/Sidebar';
import { OptimizedImage } from '~/lib/image';
import TagDescription from '~/features/tags/TagDescription.vue';
import TagPostList from '~/features/tags/TagPostList.vue';
import TagSpinner from '~/features/tags/TagSpinner.vue';
import { AdSlot } from '~/features/ads';
import { VIEWPORT } from '~/store/types';

const store = useStore();
const short = computed(() => store.state.currentLanguage.short);
const route = useRoute();

const breadCrumbs = computed(() => {
  return [
    {
      name: route.value.params.slug,
      path: '/tags' + route.value.params.slug,
    },
  ];
});

const postsRef = ref([]);
const length = ref(15);

const tagQuery = useQuery({
  query: tagPageQuery,
  variables: {
    cacheTimeInMS: 300000,
    short,
    order: 'postPublishedTime',
    slug: route.value.params.slug,
    offset: 0,
    length,
  },
});

onMounted(() => {
  useAutoLoadMore({
    target: postsRef,
    callback: increaseLength,
  });
});

const increaseLength = () => {
  if (!tagQuery.fetching.value) {
    length.value = length.value + 15;
  }
};

const tagQueryResponse = computed(() => tagQuery?.data?.value?.locale?.tag);

const tag = computed(() => tagQueryResponse.value?.tagTranslates?.[0]);

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

const title = computed(() => tag?.value?.pageTitle ?? tag?.value?.title);

const isMobileBreakpoint = computed(() => store.getters[`viewport/${VIEWPORT.IS_MOBILE_BREAKPOINT}`]);
</script>

<template>
  <div class="container">
    <Breadcrumbs
      :breadcrumbs="breadCrumbs"
      data-test-id="tag-breadcrumb-link"
    />

    <div class="flex justify-between mb-8">
      <div>
        <div class="flex items-center justify-between">
          <h1 class="font-semibold md:text-[41px] text-[29px] text-fg-strong break-words">
            {{ title }}
          </h1>
          <AdSlot
            v-if="!isMobileBreakpoint"
            place="promo_button_tag_desktop"
          />
        </div>
        <TagDescription :description="tag && tag.description ? tag.description : ''" />

        <div v-if="isMobileBreakpoint" class="flex justify-center my-6">
          <OptimizedImage
            :src="tagQueryResponse && tagQueryResponse.avatar ? tagQueryResponse.avatar : ''"
            :width="240"
            :height="240"
          />
        </div>

        <AdSlot
          v-if="isMobileBreakpoint"
          place="promo_button_stack_tag_mobile"
        />

        <TagPostList
          ref="postsRef"
          :posts="posts"
        />
        <TagSpinner v-if="tagQuery?.fetching" />
      </div>
      <div v-if="!isMobileBreakpoint" class="w-[360px] ml-6">
        <div class="flex justify-center">
          <OptimizedImage
            :src="tagQueryResponse && tagQueryResponse.avatar ? tagQueryResponse.avatar : ''"
            :width="240"
            :height="240"
          />
        </div>
        <div
          class="mt-8"
        >
          <Sidebar />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
