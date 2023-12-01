<script setup lang="ts">
import { TagPostI } from './TagPostI';
import TagPost from './TagPost.vue';

defineProps<{
  posts: TagPostI[];
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
  </div>
</template>

<style scoped lang="scss"></style>
