<script setup lang="ts">
import { useDeviceInfo } from '~/lib/device-detector';
import { type CategoryLike, type GtmLocatorVariant, type PostLike } from './types';
import SpecialCategoryPostList from './SpecialCategoryPostList.vue';
import SpecialCategoryPostSlider from './SpecialCategoryPostSlider.vue';

defineProps<{
  category: CategoryLike;
  posts: PostLike[];
  chunkSize: number;
  gtmLocatorVariant: GtmLocatorVariant;
  asiaMobileVariant: boolean;
}>();

const deviceInfo = useDeviceInfo();
</script>

<template>
  <SpecialCategoryPostList
    v-if="deviceInfo.mobile || deviceInfo.tablet"
    :initial-count="chunkSize"
    :category="category"
    :posts="posts"
    :asia-mobile-variant="asiaMobileVariant"
    :gtm-locator-variant="gtmLocatorVariant"
  />

  <SpecialCategoryPostSlider
    v-else
    :slide-size="chunkSize"
    :category="category"
    :posts="posts"
    :gtm-locator-variant="gtmLocatorVariant"
  />
</template>
