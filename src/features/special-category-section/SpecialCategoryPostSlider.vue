<script setup lang="ts">
import { computed, onMounted, ref, unref, watch } from 'vue';
import { useElementSize } from '@vueuse/core';
import { CtArrow } from '~/lib/ui';
import { type CategoryLike, type GtmLocatorVariant, type PostLike } from './types';
import SpecialCategoryCategoryLink from './SpecialCategoryCategoryLink.vue';
import SpecialCategoryPostCard from './SpecialCategoryPostCard.vue';
import { chunkItemsToSlides } from '~/assets/libs/chunkItemsToSlides';
import { SliderViewModel, useAutoSlide } from '~/lib/slider-view-model';

const AUTO_SLIDE_DELAY = 6000;

const props = defineProps<{
  category: CategoryLike;
  posts: PostLike[];

  // item count per slide
  slideSize: number;

  gtmLocatorVariant: GtmLocatorVariant;
}>();

const containerElRef = ref<HTMLElement | null>(null);

const arrowsVisible = computed(() => props.posts.length > props.slideSize);

const slides = computed(() => chunkItemsToSlides(props.posts, props.slideSize));

const slider = new SliderViewModel(
  containerElRef,
  computed(() => unref(slides).length)
);

useAutoSlide(containerElRef, slider, AUTO_SLIDE_DELAY);

onMounted(() => {
  slider.onScrollEnd();

  const size = useElementSize(containerElRef);

  watch(size.width, (a, b) => {
    if (a !== b) slider.onScrollEnd();
  });
});

const onSlideToPrev = (): void => {
  if (!slider.isOnFirstSlide()) slider.slideToPrev();
};

const onSlideToNext = (): void => {
  if (!slider.isOnLastSlide()) slider.slideToNext();
};
</script>

<template>
  <div
    class="overflow-hidden"
    :data-slide-size="slideSize"
    :style="`--slide-size: ${slideSize}`"
  >
    <SpecialCategoryCategoryLink
      :category="category"
      class="text-gray-600 text-[18px] font-semibold"
    />

    <div class="mt-3 py-4 border border-neutral-300 flex items-center overflow-x-hidden rounded-containerS">
      <CtArrow
        v-if="arrowsVisible"
        :outline="false"
        :disabled="slider.isOnFirstSlide()"
        direction="left"
        size="sm"
        class="w-[1em] h-[1em] !p-0 rtl:rotate-180"
        @click.native="onSlideToPrev"
      />

      <div
        ref="containerElRef"
        class="flex-grow flex flex-nowrap scrollbar-hidden"
        :class="{
          'px-4 overflow-x-hidden': slides.length === 1,
          'overflow-x-auto snap-x snap-mandatory': slides.length > 1,
        }"
        @scrollend="slider.onScrollEnd()"
      >
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="flex shrink-0 flex-grow flex-nowrap basis-full snap-start snap-always mx-1"
        >
          <SpecialCategoryPostCard
            v-for="{ item: post, index: postIndex } in slide"
            :key="post.id"
            :post="post"
            :post-index="postIndex"
            :cover-height="88"
            :gtm-locator-variant="gtmLocatorVariant"
            :large-title="false"
            :class="$style['post-card']"
            class="px-4 first:pl-0 last:pr-0 h-[5.5rem] flex-grow shrink-0 basis-full"
          />
        </div>
      </div>

      <CtArrow
        v-if="arrowsVisible"
        :outline="false"
        :disabled="slider.isOnLastSlide()"
        direction="right"
        size="sm"
        class="w-[1em] h-[1em] mr-1 !p-0 rtl:rotate-180"
        @click.native="onSlideToNext"
      />
    </div>
  </div>
</template>

<style module lang="scss">
.post-card {
  max-width: calc(100% / var(--slide-size));
}
</style>
