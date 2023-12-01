<script setup lang="ts">
import { STORIES_SLIDES } from '~/components/Coh/index';
import { ref } from 'vue';
import CohStorySlide from '~/components/Coh/CohStorySlide.vue';

let slides = ref(STORIES_SLIDES);
const counter = ref(0);
const swipeDirection = ref('carousel-next');
const nextSlide = () => {
  counter.value++;
  let first = slides.value.shift();
  swipeDirection.value = 'carousel-next';
  if (first) {
    slides.value = slides.value.concat(first);
  }
};
const prevSlide = () => {
  counter.value--;
  let last = slides.value.pop();
  swipeDirection.value = 'carousel-prev';
  if (last) {
    slides.value = [last].concat(slides.value);
  }
};
</script>

<template>
  <div class="bg-[#252B31] pb-20">
    <div class="container items-center text-center flex flex-col justify-between">
      <h2 class="mt-20 mb-8 text-white leading-[40px] text-[28px] md:text-[32px] md:leading-[48px] font-bold">
        Our success stories
      </h2>
      <div class="flex w-full">
        <button
          class="mr-2 sm:md-5 basis-6"
          @click="prevSlide"
        >
          <img
            src="/assets/img/coh/stories/arrow.svg"
            alt=""
            class="max-w-[24px]"
          />
        </button>

        <div class="flex flex-nowrap overflow-x-hidden">
          <transition-group
            :name="swipeDirection"
            class="flex"
          >
            <template v-for="slide in slides">
              <CohStorySlide
                :key="slide.id"
                :slide="slide"
                class="mr-2 ml-2 md:mr-2.5 md:ml-2.5"
              />
            </template>
          </transition-group>
        </div>
        <button
          class="rotate-180 ml-2 sm:ml-5 basis-6"
          @click="nextSlide"
        >
          <img
            src="/assets/img/coh/stories/arrow.svg"
            alt=""
            class="max-w-[24px]"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.carousel-wrapper {
  max-width: calc(100% - 20px);
}

.carousel-prev-enter-active,
.carousel-prev-leave-active,
.carousel-next-enter-active,
.carousel-next-leave-active {
  transition: transform 1s cubic-bezier(0.215, 0.61, 0.355, 1);
  will-change: transform;
}
.carousel-next-enter,
.carousel-prev-leave-to {
  transform: translateX(100%);
}
.carousel-next-leave-to,
.carousel-prev-enter {
  transform: translateX(-100%);
}
</style>
