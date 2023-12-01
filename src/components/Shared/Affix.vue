<template>
  <div
    ref="affix"
    class="affix"
  >
    <slot />
  </div>
</template>

<script>
import ResizeObserver from 'resize-observer-polyfill';
import { mapState } from 'vuex';

const MAGIC_SPACE = 20;

export default {
  name: 'Affix',
  props: {
    observeChildrenSizes: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState('viewport', {
      currentBreakpoint: ({ breakpoint }) => breakpoint,
      bottomZoneHeight: ({ bottomZoneHeight }) => bottomZoneHeight || 0,
    }),
  },
  watch: {
    currentBreakpoint: 'handleSizeChange',
    bottomZoneHeight: 'handleSizeChange',
  },
  mounted() {
    this.isInitialized = false;
    this.resizeObserver = null;
    this.affixInner = null;
    this.affix = null;
    this.lastType = null;
    this.lastScrollTop = null;
    this.stickyValue = this.getStickyValue();
    this.$nextTick(this.initializeStickyScrolling);
    this.initializeFullscreenListener();
  },
  beforeDestroy() {
    this.clearStickyScrolling();
    this.clearFullscreenListener();
  },
  methods: {
    handleSizeChange(entries) {
      if (!('requestAnimationFrame' in window)) {
        this.$nextTick(this.resetScrollingState);
        return;
      }
      window.requestAnimationFrame(() => {
        if (!Array.isArray(entries) || !entries.length) {
          return;
        }
        this.$nextTick(this.resetScrollingState);
      });
    },
    handleFullscreenChange() {
      if (window.document.webkitFullscreenElement || window.document.fullscreenElement) {
        this.affixInner.style.transform = 'unset';
        this.affixInner.style.backfaceVisibility = 'unset';
        this.affixInner.style.willChange = 'unset';
        this.affix.style.willChange = 'unset';
        return;
      }
      this.resetScrollingState();
    },
    handleScroll() {
      if (!this.isInitialized) {
        this.initializeStickyScrolling();
        return;
      }
      let type = this.lastType;
      const affix = this.affix;
      const affixInner = this.affixInner;
      const viewportHeight = window.innerHeight;
      const topSpacing = MAGIC_SPACE;
      const bottomSpacing = MAGIC_SPACE + this.bottomZoneHeight;
      const scrollTop = window.pageYOffset || window.document.documentElement.scrollTop;
      const isScrollingDown = scrollTop > this.lastScrollTop;
      const {
        top: affixTop,
        bottom: affixBottom,
        width: affixWidth,
        height: affixHeight,
      } = affix.getBoundingClientRect();
      const { paddingLeft, paddingRight } = getComputedStyle(affix);
      const affixLeftPadding = parseInt(paddingLeft);
      const affixRightPadding = parseInt(paddingRight);
      const affixInnerWidth = affixWidth - affixLeftPadding - affixRightPadding;
      const {
        top: affixInnerTop,
        bottom: affixInnerBottom,
        height: affixInnerHeight,
      } = affixInner.getBoundingClientRect();
      affix.style.minHeight = `${affixInnerHeight}px`;
      affixInner.style.width = `${affixInnerWidth}px`;
      const isShort = affixInnerHeight < viewportHeight - topSpacing - bottomSpacing;
      if (affixHeight === affixInnerHeight) {
        return;
      }
      if (type === 'INITIAL') {
        if (isShort && affixInnerBottom >= affixBottom) {
          type = 'END';
        } else if (isShort && affixTop >= topSpacing) {
          type = 'START';
        } else if (isShort && affixInnerTop <= topSpacing) {
          type = 'TOP';
        } else if (!isShort && affixBottom <= viewportHeight - bottomSpacing) {
          type = 'END';
        } else if (!isShort && affixInnerBottom <= viewportHeight - bottomSpacing) {
          type = 'BOTTOM';
        } else if (!isShort && affixTop >= topSpacing) {
          type = 'START';
        } else if (!isShort && affixInnerTop >= topSpacing) {
          type = 'TOP';
        }
      } else if (isScrollingDown) {
        if (
          (!isShort && affixBottom <= viewportHeight - bottomSpacing) ||
          (isShort && affixInnerBottom >= affixBottom)
        ) {
          type = 'END';
        } else if (!isShort && affixInnerBottom <= viewportHeight - bottomSpacing) {
          type = 'BOTTOM';
        } else if (isShort && affixInnerTop <= topSpacing) {
          type = 'TOP';
        } else if (type === 'TOP') {
          type = 'UNTOP';
        }
      } else if (affixTop >= topSpacing) {
        type = 'START';
      } else if (affixInnerTop >= topSpacing) {
        type = 'TOP';
      } else if (type === 'BOTTOM') {
        type = 'UNBOTTOM';
      }
      this.lastScrollTop = scrollTop;
      if (type === this.lastType) {
        return;
      }
      if (type === 'START') {
        affixInner.style.position = 'relative';
        affixInner.style.top = 'auto';
        affixInner.style.bottom = 'auto';
        affixInner.style.transform = 'translate3d(0, 0, 0)';
      } else if (type === 'TOP') {
        affixInner.style.position = this.stickyValue;
        affixInner.style.top = `${topSpacing}px`;
        affixInner.style.bottom = 'auto';
        affixInner.style.transform = 'translate3d(0, 0, 0)';
      } else if (type === 'UNTOP') {
        affixInner.style.position = 'relative';
        affixInner.style.top = 'auto';
        affixInner.style.bottom = 'auto';
        affixInner.style.transform = `translate3d(0, ${Math.abs(affixTop - affixInnerTop)}px, 0)`;
      } else if (type === 'BOTTOM') {
        affixInner.style.position = 'fixed';
        affixInner.style.top = 'auto';
        affixInner.style.bottom = `${bottomSpacing}px`;
        affixInner.style.transform = 'translate3d(0, 0, 0)';
      } else if (type === 'UNBOTTOM') {
        affixInner.style.position = 'relative';
        affixInner.style.top = 'auto';
        affixInner.style.bottom = 'auto';
        affixInner.style.transform = `translate3d(0, ${Math.abs(affixTop - affixInnerTop)}px, 0)`;
      } else if (type === 'END') {
        affixInner.style.position = 'relative';
        affixInner.style.top = 'auto';
        affixInner.style.bottom = 'auto';
        affixInner.style.transform = `translate3d(0, ${affixHeight - affixInnerHeight}px, 0)`;
      }
      this.lastType = type;
    },
    getStickyValue() {
      let sticky = 'fixed';
      try {
        if (window.CSS.supports('position: -webkit-sticky')) {
          sticky = '-webkit-sticky';
        } else if (window.CSS.supports('position: sticky')) {
          sticky = 'sticky';
        }
        return sticky;
      } catch (e) {
        return sticky;
      }
    },
    setResizeObserver() {
      if (!this.isInitialized) {
        this.initializeStickyScrolling();
        return;
      }
      this.clearResizeObserver();
      this.resizeObserver = new ResizeObserver(this.handleSizeChange);
      this.resizeObserver.observe(this.affixInner);
    },
    clearResizeObserver() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
    },
    initializeStickyScrolling() {
      if (this.isInitialized || !(this.$el instanceof HTMLElement) || !(this.$el.parentNode instanceof HTMLElement)) {
        return;
      }
      this.affixInner = this.$el;
      this.affix = this.$el.parentNode;
      this.isInitialized = true;
      if (this.observeChildrenSizes) {
        this.setResizeObserver();
      }
      window.addEventListener('scroll', this.handleScroll, { passive: true, capture: false });
      this.resetScrollingState();
    },
    clearStickyScrolling() {
      this.isInitialized = false;
      this.clearResizeObserver();
      window.removeEventListener('scroll', this.handleScroll, { passive: true, capture: false });
    },
    resetScrollingState() {
      if (!this.isInitialized) {
        this.initializeStickyScrolling();
        return;
      }
      this.affixInner.style.position = 'relative';
      this.affixInner.style.top = 'auto';
      this.affixInner.style.bottom = 'auto';
      this.affixInner.style.width = 'auto';
      this.affixInner.style.transform = 'translate3d(0, 0, 0)';
      this.affixInner.style.backfaceVisibility = 'hidden';
      this.affixInner.style.willChange = 'position, transform';
      this.affix.style.minHeight = '0';
      this.affix.style.willChange = 'min-height';
      this.lastType = 'INITIAL';
      this.handleScroll();
    },
    initializeFullscreenListener() {
      window.document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange, false);
    },
    clearFullscreenListener() {
      window.document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange, false);
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.affix {
  width: 100%;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
  will-change: position, transform;
}
</style>
