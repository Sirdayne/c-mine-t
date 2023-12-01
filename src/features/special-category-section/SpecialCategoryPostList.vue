<script setup lang="ts">
import { computed, ref, unref } from 'vue';
import { useStore } from '~/lib/framework';
import { type CategoryLike, type GtmLocatorVariant, type PostLike } from './types';
import SpecialCategoryPostListAction from './SpecialCategoryPostListAction.vue';
import SpecialCategoryCategoryLink from './SpecialCategoryCategoryLink.vue';
import SpecialCategoryPostCard from './SpecialCategoryPostCard.vue';
import { useDeviceInfo } from '~/lib/device-detector';

const CHUNK_SIZE = 2;

const props = defineProps<{
  category: CategoryLike;
  posts: PostLike[];

  // posts visible initially
  initialCount: number;

  asiaMobileVariant: boolean;

  gtmLocatorVariant: GtmLocatorVariant;
}>();

const visiblePostCount = ref(props.initialCount);
const store = useStore();
const deviceInfo = useDeviceInfo();

const i18n = computed(() => store.state.i18n);
const visiblePosts = computed(() => props.posts.slice(0, unref(visiblePostCount)));
const canLoadMore = computed(() => unref(visiblePostCount) < props.posts.length);
const didLoadMore = computed(() => unref(visiblePostCount) > props.initialCount);

const loadMore = (): void => {
  visiblePostCount.value = Math.min(props.posts.length, unref(visiblePostCount) + CHUNK_SIZE);
};

const hide = (): void => {
  visiblePostCount.value = props.initialCount;
};

const coverHeight = computed(() => (deviceInfo.desktop ? 88 : 64));
</script>

<template>
  <div
    :class="{
      'bg-slate-200 -mx-4 px-4 pt-4 pb-1': asiaMobileVariant,
    }"
  >
    <SpecialCategoryCategoryLink :category="category" />

    <div class="mt-2 p-4 border-default border-border-default rounded">
      <SpecialCategoryPostCard
        v-for="(post, postIndex) in visiblePosts"
        :key="post.id"
        :post="post"
        :post-index="postIndex"
        :cover-height="coverHeight"
        :gtm-locator-variant="gtmLocatorVariant"
        class="pt-4 first:pt-0"
        :class="{
          [$style['post-card']]: true,
        }"
      />
    </div>
    <div class="flex">
      <SpecialCategoryPostListAction
        v-if="canLoadMore"
        :label="i18n.loadMore"
        :icon-class="$style['icon-load-more']"
        @click.native="loadMore"
      />

      <SpecialCategoryPostListAction
        v-if="didLoadMore"
        :label="i18n.hideItems"
        :icon-class="`${$style['icon-hide']} !w-4 !h-4 rotate-180`"
        class="ltr:ml-auto rtl:mr-auto"
        @click.native="hide"
      />
    </div>
  </div>
</template>

<style module lang="scss">
@use '~/assets/styles/_icons-common.scss' as icons;

$secondaryDefault: '#B67304';

.icon-load-more {
  @include icons.arrow-clockwise($secondaryDefault);
}

.icon-hide {
  @include icons.arrow-down-tail($secondaryDefault);
}
</style>
