<template>
  <LinkResolver
    :href="categoryUrl"
    preserve-query-params
    :data-testid="selected ? 'learn-category-selected' : 'learn-category'"
    class="group max-w-full active:bg-bg-primary focus:bg-bg-primary flex justify-center mt-2 mr-2 text-base font-semibold items-center pt-2 pb-2 pr-4 pl-4 border border-[#afbac0]/25 rounded-full pointer focus:bg-[#afbac0]/25"
    :class="{
      'bg-[#fabc2c]': selected,
      'bg-transparent': !selected,
      'hover:bg-[#afbac0]/25': !selected,
    }"
  >
    <span
      class="text-[#e3e6e7] truncate mr-[6px] rtl:ml-[6px] rtl:mr-auto group-active:text-black group-focus:text-black capitalize"
      :class="{ 'text-black': selected }"
      data-testid="learn-category-title"
    >
      {{ categoryTitle }}
    </span>
    <span
      :class="{ 'text-black': selected }"
      class="text-[#fabf2c] group-active:text-black group-focus:text-black"
    >
      {{ guidesCount }}
    </span>
  </LinkResolver>
</template>
<script setup lang="ts">
import LinkResolver from '~/components/Shared/LinkResolver.vue';
import { computed } from 'vue';

const props = defineProps<{
  categorySlug?: string | null | undefined;
  categoryTitle: string;
  guidesCount: number;
  selected: boolean;
}>();
const categoryUrl = computed(() => (props.categorySlug ? `/learn/${props.categorySlug}` : '/learn'));
</script>
