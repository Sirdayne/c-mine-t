<template>
  <section :class="$style['carousel']">
    <div :class="$style['carousel--header']">
      <h3
        :class="$style['carousel--title']"
        data-testid="podcast-carousel-title"
      >
        {{ sectionTitle }}
      </h3>
      <div
        v-if="isArrowsVisible"
        :class="$style['carousel--arrows']"
      >
        <SliderArrow
          :class="{
            [$style['carousel--prev']]: true,
            [$style['active-counter-arrow']]: prevArrowActive,
          }"
          data-testid="podcast-carousel-arrow"
          @click.native="prevSlide"
        />
        <SliderArrow
          :class="{
            [$style['carousel--next']]: true,
            [$style['active-counter-arrow']]: nextArrowActive,
          }"
          data-testid="podcast-carousel-arrow"
          @click.native="nextSlide"
        />
      </div>
    </div>
    <div :class="$style['carousel--wrapper']">
      <template v-for="carouselItem in carouselItems">
        <PodcastCarouselItem
          :key="carouselItem.buzzsproutPodcast.artworkUrl"
          :carousel-item="carouselItem"
          :class="{
            [$style['carousel--item-margin']]: true,
            [$style['hidden-last-carousel-item']]: isArrowsVisible && !nextArrowActive,
          }"
        />
      </template>
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import PodcastCarouselItem from '~/components/Podcast/PodcastCarouselItem.vue';
import SliderArrow from '~/components/Icons/Podcasts/SliderArrow.vue';
import { useStore } from '~/lib/framework';

const MOBILE_SCREEN_BREAKPOINT_MAX = 550;
const TABLET_SCREEN_BREAKPOINT_MIN = 730;
const TABLET_SCREEN_BREAKPOINT_MAX = 766;
const MEDIUM_SCREEN_BREAKPOINT = 1024;
const LARGE_SCREEN_BREAKPOINT = 1200;
export default defineComponent({
  name: 'PodcastsCarousel',
  components: { SliderArrow, PodcastCarouselItem },
  props: {
    otherPodcasts: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const store = useStore<any>();
    const carouselItems = ref(props.otherPodcasts);
    let counter = ref(0);

    const sectionTitle = computed(() => store.state.i18n.podcastCarouselHeading);
    const isMobileWidth = computed(() => store.getters['viewport/IS_MOBILE_WIDTH']);
    const viewportWidth = computed(() => store.getters['viewport/VIEWPORT_WIDTH']);

    const slidesInViewPort = computed(() => {
      if (viewportWidth.value >= TABLET_SCREEN_BREAKPOINT_MIN && viewportWidth.value <= TABLET_SCREEN_BREAKPOINT_MAX) {
        return 4;
      }
      if (viewportWidth.value >= MOBILE_SCREEN_BREAKPOINT_MAX && viewportWidth.value < TABLET_SCREEN_BREAKPOINT_MIN) {
        return 3;
      }
      if (
        !isMobileWidth.value &&
        viewportWidth.value >= MEDIUM_SCREEN_BREAKPOINT &&
        viewportWidth.value <= LARGE_SCREEN_BREAKPOINT
      ) {
        return 2;
      }

      return isMobileWidth.value ? 2 : 3;
    });
    const prevArrowActive = computed(() => {
      return counter.value !== 0;
    });
    const nextArrowActive = computed(() => {
      return counter.value < carouselItems.value.length - slidesInViewPort.value;
    });
    const isArrowsVisible = computed(() => {
      return carouselItems.value.length > slidesInViewPort.value;
    });
    const nextSlide = () => {
      if (counter.value < carouselItems.value.length - slidesInViewPort.value) {
        counter.value++;
        let first = carouselItems.value.shift();
        if (first) {
          carouselItems.value = carouselItems.value.concat(first);
        }
      }
    };
    const prevSlide = () => {
      if (counter.value > 0) {
        counter.value--;
        let last = carouselItems.value.pop();
        if (last) {
          carouselItems.value = [last].concat(carouselItems.value);
        }
      }
    };
    return {
      carouselItems,
      nextSlide,
      counter,
      prevSlide,
      prevArrowActive,
      nextArrowActive,
      isArrowsVisible,
      sectionTitle,
    };
  },
});
</script>

<style module lang="scss">
@import '~/assets/styles/_mixins.scss';
@import '~/assets/styles/_vars.scss';
.carousel {
  &--header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &--title {
    margin: 0 0 24px 0;
    @include section-title;
  }
  &--wrapper {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: hidden;
  }
  &--item-margin:not(:last-child) {
    margin-right: 24px;
  }
  &--prev {
    transform: rotate(180deg);
    margin-right: 8px;
  }
  &--prev,
  &--next {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    cursor: pointer;
    opacity: 0.5;
    border-radius: 50%;
    fill: $color-white;
    pointer-events: none;
    background-color: rgba(0, 0, 0, 0.05);

    &:active {
      fill: $color-orange-500;
      background-color: $color-black-950;
      opacity: 1;
    }
  }
  &--arrows {
    display: flex;
  }
}
.active-counter-arrow {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.1);
  pointer-events: all;
}
.hidden-last-carousel-item:nth-child(3) {
  visibility: hidden;
}
@media screen and (min-width: $xs--tablet) {
  .hidden-last-carousel-item:nth-last-child(-n + 2) {
    visibility: hidden;
  }
  .hidden-last-carousel-item:nth-child(3) {
    visibility: visible;
  }
}
@media screen and (min-width: $md) and (max-width: $lg) {
  .hidden-last-carousel-item:nth-last-child(-n + 2) {
    visibility: hidden;
  }
  .hidden-last-carousel-item:nth-child(3) {
    visibility: hidden;
  }
}
</style>
