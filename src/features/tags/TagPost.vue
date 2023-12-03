<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '~/lib/framework';
import { TagPostI } from './TagPostI';
import LinkResolver from '~/components/Shared/LinkResolver';
import { OptimizedImage } from '~/lib/image';
import { VIEWPORT } from '~/store/types';

defineProps<{
  post: TagPostI;
}>();

const store = useStore();
const i18n = computed(() => store.state.i18n);
const isMobileBreakpoint = computed(() => store.getters[`viewport/${VIEWPORT.IS_MOBILE_BREAKPOINT}`]);
</script>

<template>
  <article class="mb-4 border-default border rounded shadow-md ring-1 ring-gray-100">
    <div class="flex flex-col xs:flex-row">
      <div class="relative">
        <LinkResolver
          :href="`/news/${post.slug}`"
          class="block xs:w-[250px] xs:w-[170px] sm:w-[304px] sm:h-[206px] max-w-[368px] max-h-[240px] w-auto h-auto"
        >
          <OptimizedImage
            :src="post.img"
            :width="isMobileBreakpoint ? 250 : 304"
            :height="isMobileBreakpoint ? 170 : 206"
            :fill="isMobileBreakpoint"
          />
          <span class="absolute bottom-2 right-2 px-2 py-1 bg-bg-primary text-[#192024] text-s font-bold uppercase">
            {{ post.label }}
          </span>
        </LinkResolver>
      </div>

      <div>
        <div class="py-4 pl-5 pr-6 flex flex-col justify-between xs:h-[170px] sm:h-[206px]">
          <div>
            <div class="font-semibold xs:text-[19px] xs:max-sm:text-sm text-lg">
              <LinkResolver :href="`/news/${post.slug}`">
                {{ post.title }}
              </LinkResolver>
            </div>
            <span class="hidden lg:block xs:mt-3">{{ post.description }}</span>
          </div>

          <div class="flex justify-between mt-6 xs:mt-0">
            <div class="text-fg-default text-s font-semibold">
              <LinkResolver :href="post.authorUrl"> {{ i18n.by }} {{ post.author }} </LinkResolver>
            </div>
            <time class="text-fg-default text-s uppercase">{{ post.publishedTime }}</time>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss"></style>
