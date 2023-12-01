<script setup lang="ts">
import { PropType } from 'vue';
import { StorySlide } from './index';

defineProps({
  slide: {
    type: Object as PropType<StorySlide>,
    required: true,
  },
});
</script>

<template>
  <div
    class="flex flex-col justify-between p-3 md:p-5 lg:p-[30px] bg-white rounded-[10px] text-left w-[300px] sm:w-[304px] md:min-w-[320px] lg:min-w-[534px] xl:min-w-[540px]"
  >
    <div>
      <img
        src="/assets/img/coh/stories/quotes.svg"
        alt="quotes"
        class="w-8 h-6 mb-1 md:mb-2"
      />
      <p
        class="pl-2 pr-2 text-s leading-[21px] lg:text-base font-normal xl:pb-3 lg:pl-5 lg:pr-5"
        v-html="slide.text"
      />
    </div>
    <div class="flex items-center xl:pl-5 xl:pr-5 mt-3">
      <img
        :src="slide.url"
        alt="author"
        class="mr-4"
      />
      <p class="text-[#AFBDC4] text-s leading-[21px] md:text-base font-normal">
        {{ slide.author }}
      </p>
    </div>
  </div>
</template>
