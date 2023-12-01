<script setup lang="ts">
import Sidebar from '~/components/Sidebar/Sidebar';
import { OptimizedImage } from '~/lib/image';
import TagDescription from '~/features/tags/TagDescription.vue';
import TagPostList from '~/features/tags/TagPostList.vue';
import TagSpinner from '~/features/tags/TagSpinner.vue';
import { AdSlot } from '~/features/ads';
import { TagPostI } from '~/features/tags/TagPostI';

defineProps<{
  title: string;
  description: string;
  posts: TagPostI[];
  fetching: boolean;
  imgUrl: string;
}>();
</script>

<template>
  <div class="flex justify-between mb-8">
    <div class="w-[760px]">
      <div class="flex items-center justify-between">
        <h1 class="font-semibold text-[41px] text-[#111619] break-words">
          {{ title }}
        </h1>
        <AdSlot
          place="promo_button_tag_desktop"
        />
      </div>
      <TagDescription :description="description" />
      <TagPostList
        ref="postsRef"
        :posts="posts"
      />
      <TagSpinner v-if="fetching" />
    </div>
    <div class="max-w-[360px]">
      <div class="flex justify-center">
        <OptimizedImage
          :src="imgUrl"
          :width="240"
          :height="240"
        />
      </div>
      <div class="mt-8">
        <Sidebar />
      </div>
    </div>
  </div>
</template>
