<script setup lang="ts">
import { useStore } from '~/lib/framework';
import { TagPagePostsQueryDocument, useQuery } from '~/graphql';
import { computed } from 'vue';
import PostsListing from '~/components/PostsListing/PostsListing.vue';
import { getMappedPostPreview } from '~/assets/helpers/posts';

const store = useStore();

const currentLanguage = computed(() => store.state.currentLanguage);

const { data } = useQuery({
  query: TagPagePostsQueryDocument,
  variables: {
    slug: 'event',
    short: computed(() => store.state.currentLanguage.short),
    length: 6,
    offset: 0,
  },
});

const posts = computed(() => {
  const localPosts = data.value?.locale?.tag?.posts?.data;

  return localPosts?.map((item) =>
    getMappedPostPreview(item, {
      languageDomain: currentLanguage.value.domain,
      languageCode: currentLanguage.value.languageCode,
      timeZone: currentLanguage.value.timeZone,
      languageShort: currentLanguage.value.short,
    })
  );
});

const sectionTitle = computed(() => store.state.i18n.eventsPostsTitle);
</script>

<template>
  <div class="container pb-8 md:pb-11">
    <h3
      class="text-headlineXxl md:leading-[1.2em] md:text-[34px] mb-5 md:mb-6 font-semibold text-fg-strong"
      data-testid="events-page-posts-section-title"
    >
      {{ sectionTitle }}
    </h3>
    <PostsListing
      v-if="posts"
      :posts="posts"
      data-testid="events-page-posts-block"
      theme="main"
    />
  </div>
</template>
