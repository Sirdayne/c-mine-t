<script setup lang="ts">
import { computed } from 'vue';
import PostMeta from '~/components/Post/PostMeta.vue';
import Breadcrumbs, { type Breadcrumb } from '~/components/Shared/Breadcrumbs.vue';

const props = defineProps<{
  post: any;
}>();

const backgroundUrl = computed(() => `url(${props.post.cover})`);

const explainedCrumbs = computed(() => {
  const { post } = props;
  const postTitle = post?.title;

  const result: Breadcrumb[] = [
    {
      name: 'explained',
      path: '/explained',
    },
  ];
  if (postTitle) result.push({ name: postTitle, path: null });

  return result;
});
</script>

<template>
  <div
    :style="{
      backgroundImage: backgroundUrl,
    }"
    :class="$style['preview']"
    class="bg-no-repeat bg-cover bg-[center_top] relative h-[360px] sm:h-[560px] after:content-[''] after:pointer-events-none after:absolute after:top-0 after:bottom-0 after:right-0 after:left-0 after:bg-top-bottom-darken-gradient"
  >
    <div class="container flex flex-col justify-between h-full">
      <Breadcrumbs
        :breadcrumbs="explainedCrumbs"
        data-test-id="explained-breadcrumb-link"
        link-color="white"
        class="z-[1]"
      />
      <div class="text-white mb-6 z-[1]">
        <PostMeta
          :post="post"
          explained
          class="!mb-2"
          data-testid="explained-post-meta"
        />
        <h1
          class="text-headlineXxxl text-[29px] md:text-[41px]"
          data-testid="explained-post-title"
        >
          {{ post.title }}
        </h1>
      </div>
    </div>
  </div>
</template>
<style module>
.preview {
  @media screen(md) {
    height: calc(100vh - theme('height.headerDesktop'));
  }
}
</style>
