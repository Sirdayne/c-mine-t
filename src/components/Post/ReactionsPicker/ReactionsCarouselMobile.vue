<script setup lang="ts">
import ReactionItem from './ReactionItem.vue';
import { computed, ref } from 'vue';
import values from 'lodash/values';
import { chunkItemsToSlides } from '~/assets/libs/chunkItemsToSlides';

const MAX_ITEMS_PER_SLIDE = 8;
const props = defineProps({
  reactions: {
    type: Object,
    required: true,
  },
});

const slides = computed(() => chunkItemsToSlides(values(props.reactions), MAX_ITEMS_PER_SLIDE));
const currentTabIndex = ref(0);
const slider = ref(null);
const swipeToNext = () => {
  if (currentTabIndex.value < slides.value.length - 1) {
    currentTabIndex.value++;
    slider.value?.classList.add('slider-wrapper--next');
    slider.value?.classList.remove('slider-wrapper--prev');
  }
};
const swipeToPrevious = () => {
  if (currentTabIndex.value > 0) {
    currentTabIndex.value--;
    slider.value?.classList.remove('slider-wrapper--next');
    slider.value?.classList.add('slider-wrapper--prev');
  }
};
</script>

<template>
  <div
    v-touch:swipe.right="swipeToPrevious"
    v-touch:swipe.left="swipeToNext"
    v-touch-class="'active'"
    class="overflow-hidden min-h-[88px] flex flex-col"
  >
    <div
      ref="slider"
      class="flex"
    >
      <template v-for="(slide, index) in slides">
        <div
          :key="index"
          class="grid grid-cols-4 gap-x-4 gap-y-2 grow shrink-0 basis-full"
        >
          <template v-for="reaction in slide">
            <span
              v-if="reaction.item.imageURL"
              :key="reaction.item.symbol"
              class="flex justify-center"
            >
              <ReactionItem
                :symbol="reaction.item.symbol"
                :image-url="reaction.item.imageURL"
                @handleSelectReaction="$emit('handleSelectReaction', reaction.item.symbol)"
              />
            </span>
          </template>
        </div>
      </template>
    </div>
    <div class="flex justify-center mt-3">
      <span
        v-for="(_, index) in slides"
        :key="index"
        class="w-2 h-2 bg-[#C8D0D3] rounded-full mr-1"
        :class="{
          'bg-[#FABF2C]': index === currentTabIndex,
          'mr-1': index === 0,
        }"
      />
    </div>
  </div>
</template>
<style lang="scss">
.slider-wrapper {
  &--next {
    transform: translateX(-100%);
    transition: transform 0.6s;
  }
  &--prev {
    transform: translateX(0);
    transition: transform 0.6s;
  }
}
</style>
