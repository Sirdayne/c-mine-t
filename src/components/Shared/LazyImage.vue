<template>
  <div
    class="lazy-image"
    :class="[
      (isImageLoaded || didCatchError) && 'lazy-image_loaded',
      immediate && 'lazy-image_immediate',
      noAbsolute && 'lazy-image_no-absolute',
    ]"
  >
    <Pending
      class="lazy-image__pending"
      :is-finished="isImageLoaded || didCatchError"
    />
    <picture v-if="isInViewport && imageHasSources">
      <template v-for="(size, index) in sources">
        <source
          v-if="size.media !== 'default'"
          :key="index"
          :media="`(min-width: ${size.media})`"
          :srcset="size.srcset"
        />
        <img
          v-else
          ref="image"
          :key="index"
          :class="imageClass"
          :srcset="size.srcset"
          class="lazy-image__img"
          :src="imageSrc"
          :alt="alt"
          @load="handleImageLoad"
          @error="handleImageError"
        />
      </template>
    </picture>
    <img
      v-if="isInViewport && !imageHasSources"
      ref="image"
      :class="imageClass"
      class="lazy-image__img"
      :src="imageSrc"
      :srcset="imageSrcSet"
      :alt="alt"
      @load="handleImageLoad"
      @error="handleImageError"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import delay from 'lodash/delay';
import Pending from '~/components/Shared/Pending';

export default {
  name: 'LazyImage',
  components: {
    Pending,
  },
  props: {
    immediate: {
      type: Boolean,
    },
    src: {
      type: String,
      default: '',
    },
    sources: {
      type: Array,
      default: () => [],
    },
    srcset: {
      type: String,
      default: '',
    },
    alt: {
      type: String,
      default: '',
    },
    fallbackImage: {
      type: String,
      default: '',
    },
    noAbsolute: {
      type: Boolean,
    },
    imageClass: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isInViewport: this.immediate,
      isImageLoaded: false,
      didCatchError: false,
      summaryRemainingTime: 0,
    };
  },
  computed: {
    ...mapState('viewport', {
      isWindowActive: ({ isWindowActive }) => isWindowActive,
      viewportWidth: ({ viewportWidth }) => viewportWidth,
      viewportHeight: ({ viewportHeight }) => viewportHeight,
      scrollTop: ({ scrollTop }) => scrollTop,
    }),
    imageSrc() {
      if (!this.isInViewport) {
        return '';
      }
      if (this.didCatchError || !this.src) {
        return this.fallbackImage;
      }
      return this.src;
    },
    imageSrcSet() {
      if (!this.isInViewport) {
        return '';
      }
      return this.srcset;
    },
    imageHasSources() {
      const { sources = [] } = this;
      return Array.isArray(sources) && sources.length;
    },
  },
  watch: {
    src: 'handleInViewport',
    srcset: 'handleInViewport',
    isWindowActive: 'handleViewportChange',
    viewportWidth: 'handleViewportChange',
    viewportHeight: 'handleViewportChange',
    isInViewport(newVal) {
      if (!newVal) {
        return;
      }
      this.$nextTick(() => {
        const image = this.$refs.image;
        if (image.complete) {
          this.handleImageLoad();
        }
      });
    },
  },
  mounted() {
    this.handleMounted();
  },
  beforeDestroy() {
    this.cleanup();
  },
  methods: {
    handleMounted() {
      this.cleanup();
      this.addWindowOnLoadListener();
      this.tryToImmediateLoadingOffscreenImages();
      if (this.isIntersectionObserverExist()) {
        this.initIntersectionObserverCheck();
      } else {
        this.initScrollTopWatcher();
      }
    },
    handleInViewport(IdleDeadline) {
      if (typeof IdleDeadline === 'object' && typeof IdleDeadline.timeRemaining === 'function') {
        const timeRemaining = IdleDeadline.timeRemaining();
        this.summaryRemainingTime += timeRemaining;
        if (this.summaryRemainingTime <= 300) {
          this.loadOffscreenImages();
          return;
        }
      }
      this.isInViewport = true;
    },
    handleImageLoad() {
      if (!this.imageSrc) {
        return;
      }
      this.isImageLoaded = true;
      this.$emit('image-loaded');
      this.cleanup();
    },
    handleImageError() {
      if (!this.imageSrc) {
        return;
      }
      this.didCatchError = true;
      this.cleanup();
    },
    handleViewportChange() {
      if (process.server || this.didCatchError || this.isImageLoaded) {
        return;
      }
      const { top, height } = this.$el.getBoundingClientRect();
      if (top <= this.viewportHeight && top + height >= 0) {
        this.handleInViewport();
      }
    },
    initIntersectionObserverCheck() {
      const options = {
        rootMargin: '220px 0px 220px 0px',
      };
      this.intersectionObserver = new window.IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.handleInViewport();
          }
        });
      }, options);
      this.intersectionObserver.observe(this.$el);
    },
    cleanup() {
      if (this.intersectionObserver) {
        this.intersectionObserver.disconnect();
        this.intersectionObserver = null;
      }
      if (typeof this.unwatchScrollTop === 'function') {
        this.unwatchScrollTop();
        this.unwatchScrollTop = null;
      }
      window.removeEventListener('load', this.addWindowOnLoadListener);
    },
    isIntersectionObserverExist() {
      return typeof window.IntersectionObserver === 'function';
    },
    isRequestIdleExist() {
      return typeof window.requestIdleCallback === 'function';
    },
    initScrollTopWatcher() {
      this.unwatchScrollTop = this.$watch('scrollTop', this.handleViewportChange, { immediate: true });
    },
    tryToImmediateLoadingOffscreenImages() {
      const { isInViewport } = this;
      if (isInViewport || !this.isDocumentReadyStateComplete()) {
        return;
      }
      this.handleInViewport();
    },
    addWindowOnLoadListener() {
      window.addEventListener('load', this.loadOffscreenImages, { passive: true });
    },
    loadOffscreenImages() {
      return this.isRequestIdleExist()
        ? delay(window.requestIdleCallback, 100, this.handleInViewport)
        : this.handleInViewport();
    },
    isDocumentReadyStateComplete() {
      return typeof document === 'object' && document.readyState === 'complete';
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.lazy-image__img {
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #fbfbfb;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.15s;
}
.lazy-image__pending {
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  width: 100%;
  height: 100%;
  transition: opacity 0.15s;
}
.lazy-image_immediate .lazy-image__img,
.lazy-image_loaded .lazy-image__img {
  background-color: transparent;
  opacity: 1;
}
.lazy-image_loaded .lazy-image__pending {
  opacity: 0;
  pointer-events: none;
}
.lazy-image_no-absolute .lazy-image__img {
  position: relative;
}
</style>
