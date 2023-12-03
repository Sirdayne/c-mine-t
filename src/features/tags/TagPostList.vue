<script setup lang="ts">
import { TagPostI } from './TagPostI';
import TagPost from './TagPost.vue';
import TagSpinner from '~/features/tags/TagSpinner.vue';

defineProps<{
  posts: TagPostI[];
  fetching: boolean;
}>();
</script>

<template>
  <div class="mt-12">
    <div
      v-for="post in posts"
      :key="post.id"
    >
      <TagPost :post="post" />
    </div>
    <TagSpinner v-if="fetching" />
  </div>
</template>

<style scoped lang="scss"></style>
