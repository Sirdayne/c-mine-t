<template>
  <div ref="wrapper">
    <slot :is-in-viewport="isInViewport" />
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'InViewportObserver',
  props: {
    once: {
      type: Boolean,
    },
  },
  data() {
    return {
      isInViewport: false,
    };
  },
  computed: {
    ...mapState('viewport', {
      scrollTop: ({ scrollTop }) => scrollTop,
      viewportWidth: ({ viewportWidth }) => viewportWidth,
      viewportHeight: ({ viewportHeight }) => viewportHeight,
    }),
  },
  mounted() {
    this.initObserver();
  },
  methods: {
    initObserver() {
      const { wrapper } = this.$refs;
      if (!(wrapper instanceof Element)) {
        return;
      }
      this.intersectionObserver = null;
      // eslint-disable-next-line no-unused-expressions
      'IntersectionObserver' in window ? this.initIntersectionObserverCheck() : this.initViewportChangeCheck();
    },
    notInViewportHandler() {
      if (!this.isInViewport) {
        return;
      }
      this.isInViewport = false;
    },
    inViewportHandler() {
      const { once } = this;
      this.isInViewport = true;
      if (once) {
        this.cleanup();
      }
    },
    initIntersectionObserverCheck() {
      const { wrapper } = this.$refs;
      if (!(wrapper instanceof Element)) {
        return;
      }
      this.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.inViewportHandler();
          } else {
            this.notInViewportHandler();
          }
        });
      });
      this.intersectionObserver.observe(wrapper);
    },
    initViewportChangeCheck() {
      this.handleViewportChange();
      this.isIntersectionObserverPolyfill = true;
      this.scrollTopWatcher = this.$watch('scrollTop', this.handleViewportChange);
      this.viewportWidthWatcher = this.$watch('viewportWidth', this.handleViewportChange);
      this.viewportHeightWatcher = this.$watch('viewportHeight', this.handleViewportChange);
    },
    handleViewportChange() {
      const { wrapper } = this.$refs;
      const { top, bottom } = wrapper.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const isEntirelyInViewport = top > 0 && bottom < viewportHeight;
      const isTopInViewport = top > 0 && top < viewportHeight && bottom > viewportHeight;
      const isBottomInViewport = top < 0 && bottom > 0;
      if (isEntirelyInViewport || isTopInViewport || isBottomInViewport) {
        this.inViewportHandler();
      } else {
        this.notInViewportHandler();
      }
    },
    cleanup() {
      if (this.intersectionObserver) {
        this.intersectionObserver.disconnect();
        this.intersectionObserver = null;
      }
      if (this.isIntersectionObserverPolyfill) {
        this.scrollTopWatcher();
        this.viewportWidthWatcher();
        this.viewportHeightWatcher();
        this.isIntersectionObserverPolyfill = null;
        this.scrollTopWatcher = null;
        this.viewportWidthWatcher = null;
        this.viewportHeightWatcher = null;
      }
    },
  },
};
</script>
