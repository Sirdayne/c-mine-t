<script setup lang="ts">
import { type CategoryLike } from './types';
import LinkResolver from '~/components/Shared/LinkResolver.vue';

defineProps<{
  category: CategoryLike;
}>();
</script>

<template>
  <div class="flex justify-between items-baseline">
    <LinkResolver
      class="text-headlineMl text-fg-strong !text-[19px]"
      :to="`/${category.slug}`"
      :title="category.title"
    >
      {{ category.title }}
    </LinkResolver>
    <span
      v-if="category.slug === 'press-releases' || category.slug === 'market-releases'"
      class="mix-blend-luminosity text-[#809098] text-xs font-semibold capitalize"
      >Ad</span
    >
  </div>
</template>
