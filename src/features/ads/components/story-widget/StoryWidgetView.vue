<template>
  <div
    id="story-widget"
    ref="storyElRef"
    class="story"
    @scroll="storySlider.handleScroll()"
  >
    <div class="story-header">
      <div class="story-timeline">
        <button
          v-for="(_, slideIndex) in slideCount"
          :key="slideIndex"
          :class="{
            'story-timeline__track': true,
            'story-timeline__track--active': storySlider.isSlideActive(slideIndex),
          }"
          @click.prevent.stop="storySlider.slideTo(slideIndex)"
          @animationend="storySlider.slideToNext(slideIndex)"
        />
      </div>

      <span class="story-header__badge">{{ badge }}</span>
      <span class="story-header__publication-date">{{ formattedPublicationDate }}</span>
    </div>

    <section
      key="main"
      class="story-slide story-slide--main"
    >
      <h1>{{ title }}</h1>
      <p class="story-slide__leading-text">
        {{ leadingText }}
      </p>
    </section>

    <section
      v-for="(html, index) in bodySlides"
      :key="index"
      class="story-slide"
      :class="{ 'after:!content-none': index === bodySlides.length - 1 }"
    >
      <div
        class="story-slide__content"
        :class="{ 'h-[90%] overflow-y-hidden': index === bodySlides.length - 1 }"
        v-html="html"
      />
      <StoryReadMore
        v-if="isReadMoreVisible(index)"
        :post-url="postUrl"
      />
    </section>

    <div
      ref="slideMeasurerElRef"
      key="measurer"
      class="story-slide story-slide--measurer story-slide__content"
    />

    <img
      v-if="trackingPixelUrl"
      class="visually-hidden"
      :src="trackingPixelUrl"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, unref, toRef, watchPostEffect, nextTick } from 'vue';
import { StorySlidesBuilder } from './StorySlidesBuilder';
import { StorySlider } from './StorySlider';
import StoryReadMore from './StoryReadMore.vue';

const props = defineProps({
  /**
   * Post title
   */
  title: {
    type: String,
    required: true,
  },

  /**
   * Badge in header
   */
  badge: {
    type: String,
    required: true,
  },

  leadingText: {
    type: String,
    required: true,
  },

  /**
   * @example "Aug 15, 2022"
   */
  formattedPublicationDate: {
    type: String,
    required: true,
  },

  /**
   * @example "https://s3.cointelegraph.com/uploads/2022-08/21d58de6-9dd5-44d3-a576-a3ab9bc10ab7.jpg"
   */
  coverImageUrl: {
    type: String,
    required: true,
  },

  /**
   * @example "<p>paragraph <a>link</a></p>
   */
  postBodyHtml: {
    type: String,
    required: true,
  },

  postUrl: {
    type: String,
    required: true,
  },

  trackingPixelUrl: {
    type: String,
    default: null,
  },
});

const storyElRef = ref<HTMLElement | null>(null);
const slideMeasurerElRef = ref<HTMLElement | null>(null);
// Slides HTML
const bodySlides = ref<string[]>([]);
const hasMore = ref(false);

const slideCount = computed(() => unref(bodySlides).length + 1);

const storySlider = new StorySlider(storyElRef, slideCount);

const coverImageUrlCss = computed(() => {
  const { coverImageUrl } = props;
  return coverImageUrl ? `url(${coverImageUrl})` : 'none';
});

const isReadMoreVisible = (bodySlideIndex: number) => unref(hasMore) && storySlider.isLastSlide(bodySlideIndex + 1);

onMounted(() => {
  const postBodyHtmlRef = toRef(props, 'postBodyHtml');

  const buildSlides = async (slideMeasurerEl: HTMLElement, postBodyHtml: string, signal?: AbortSignal) => {
    await nextTick();
    if (signal?.aborted) return;

    const slidesBuilder = new StorySlidesBuilder(slideMeasurerEl, postBodyHtml);
    const result = slidesBuilder.build();

    bodySlides.value = result.bodySlides;
    hasMore.value = result.hasMore;

    if (signal?.aborted) return;

    await nextTick();
    storySlider.slideToFirst();
  };

  watchPostEffect((onCancel) => {
    const postBodyHtml = unref(postBodyHtmlRef);
    const slideMeasurerEl = unref(slideMeasurerElRef);

    if (!slideMeasurerEl) return;

    const ctrl = new AbortController();

    onCancel(() => ctrl.abort());

    buildSlides(slideMeasurerEl, postBodyHtml, ctrl.signal);
  });
});
</script>

<style scoped lang="scss">
@keyframes story-timeline-thumb-fill {
  to {
    background-position: left bottom;
  }
}

.story {
  display: grid;
  grid-template-columns: 100% repeat(v-bind(slideCount), 100%);
  grid-column-start: 2;

  z-index: 0;

  height: 100%;
  position: relative;
  user-select: none;
  overflow-x: scroll;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  touch-action: pan-y;

  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;

  color: white;

  background-color: black;

  &::-webkit-scrollbar {
    display: none;
  }
}

.story-header {
  display: grid;
  grid-template-areas:
    'timeline timeline'
    'badge publication-date';
  row-gap: 10px;
  position: sticky;
  left: 0;
  right: 0;
  height: 0;
  padding: 10px;

  // for ios safari
  z-index: 1;

  &__badge {
    grid-area: badge;
    margin-left: 4px;
  }

  &__publication-date {
    grid-area: publication-date;
    margin-left: auto;
    margin-right: 24px;
  }

  &__badge,
  &__publication-date {
    text-transform: uppercase;
    font-weight: 600;
    font-size: 10px;
    line-height: 14px;
    color: #e3e6e7;
  }

  & .story-timeline {
    grid-area: timeline;
    margin-bottom: 8px;
  }
}

.story-timeline {
  display: grid;
  grid-template-columns: repeat(v-bind(slideCount), 1fr);

  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

  &__track {
    border: none;
    outline: none;

    height: 2px;
    margin: 2px;
    border-radius: 99px;
    overflow: hidden;
    cursor: pointer;
    content: '';

    background-color: rgba(255, 255, 255, 0.5);

    &--active {
      background-color: rgba(255, 255, 255, 1);
    }
  }
}

.story-slide {
  // to keep height equal to container
  // 44px is vertical padding
  height: calc(100% - 68px);
  box-sizing: content-box;

  position: relative;

  padding-top: 48px;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
  overflow-y: hidden;

  scroll-snap-align: start;
  scroll-snap-stop: always;

  &::after {
    content: ' ';
    background: linear-gradient(360deg, #000000 0%, rgba(0, 0, 0, 0) 100%);
    position: absolute;
    bottom: 0;
    height: 60px;
    left: 0;
    right: 0;
  }

  &--measurer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -9999;
    background: none;
    transform: translate3d(-100%, 0, 0);
    overflow-y: scroll;
    overflow-x: hidden;
  }

  &--main {
    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    &::before {
      display: block;
      content: '';

      z-index: -1;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      background-color: black;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      background-image: linear-gradient(360deg, rgba(0, 0, 0, 0.8) 42.29%, rgba(0, 0, 0, 0) 68.96%),
        linear-gradient(180deg, rgba(0, 0, 0, 0.6) 2.29%, rgba(0, 0, 0, 0) 8.54%), v-bind(coverImageUrlCss);
    }

    h1 {
      margin-bottom: 0;
      font-size: 18px;
      line-height: 24px;
      letter-spacing: -0.02em;
    }

    p {
      margin-top: 12px;
    }

    &::after {
      content: none;
    }
  }

  // increase specifity to override post content styles
  .story &__content {
    color: white;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 140%;

    &:first-child {
      margin-top: auto;
    }

    :deep(p, h1, h2) {
      margin-top: 12px;
      margin-bottom: 12px;
    }

    :deep(a) {
      color: #fabf2c;
      border: none;
      transition: none;
      text-decoration: none;
    }

    :deep(h1) {
      font-weight: 700;
      font-size: 20px;
      line-height: 140%;
      letter-spacing: -0.02em;
    }

    :deep(h2) {
      font-weight: 700;
      font-size: 16px;
      line-height: 140%;
      letter-spacing: -0.02em;
    }

    :deep(blockquote) {
      margin-top: 12px;
      margin-bottom: 12px;
      display: flex;
      flex-direction: column;

      &::before {
        content: '';
        display: block;
        width: 20px;
        height: 20px;

        background-repeat: no-repeat;

        background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M19.36 11.2949V20H11.7056V13.1177C11.7056 9.40057 12.14 6.69086 12.985 5.036C14.0822 2.80571 15.8411 1.12743 18.2406 0L20 2.92571C18.5378 3.54914 17.4639 4.50857 16.7778 5.77943C16.0928 7.05029 15.7044 8.87314 15.6356 11.2949H19.36ZM7.65444 11.2949V20H0V13.1177C0 9.40057 0.433889 6.69086 1.27944 5.036C2.37611 2.80571 4.13556 1.12743 6.535 0L8.27167 2.92571C6.80944 3.57314 5.735 4.50857 5.04944 5.77943C4.36444 7.05029 3.97611 8.87314 3.90722 11.2949H7.65444Z' fill='%23E3E6E7'/%3E%3C/svg%3E%0A");
      }
    }

    :deep(figure > img) {
      min-height: 200px;
      height: 200px;
      max-height: 200px;
    }

    &__leading-text {
      font-size: 15px;
      line-height: 140%;
    }

    // Removes _defined global styles
    :deep([data-ct-widget='content-block']) {
      counter-increment: none !important;
      background: none;
      border: none;
      border-radius: unset;
      padding: unset;

      &:before {
        content: none;
      }
    }
  }
}
</style>
