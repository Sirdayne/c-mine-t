<template>
  <div
    class="youtube-autoplay"
    :class="isVideoShown && 'youtube-autoplay_shown'"
  >
    <div
      :id="id"
      class="youtube-autoplay__iframe"
      data-testid="youtube-iframe"
    />
    <LazyImage
      v-if="!isVideoShown"
      class="youtube-autoplay__cover"
      :theme="theme"
      :src="cover"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { ROOT } from '~/store/types';
import LazyImage from '~/components/Shared/LazyImage.vue';

export default {
  name: 'YoutubeAutoplay',
  components: {
    LazyImage,
  },
  props: {
    shouldVideoAutoplay: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      default: 'dark',
    },
    videoId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isVideoShown: false,
    };
  },
  computed: {
    ...mapState({
      isYoutubeApiReady: ({ isYoutubeApiReady }) => isYoutubeApiReady,
    }),
    ...mapState('viewport', {
      scrollTop: ({ scrollTop }) => scrollTop,
      breakpoint: ({ breakpoint }) => breakpoint,
      viewportHeight: ({ viewportHeight }) => viewportHeight,
    }),
    id() {
      return `youtube-${this.videoId}-${this.$parent.$options.name}`;
    },
    cover() {
      return `https://img.youtube.com/vi/${this.videoId}/maxresdefault.jpg`;
    },
  },
  watch: {
    isYoutubeApiReady: 'handleYoutubeApiReady',
  },
  mounted() {
    this.player = null;
    this.raf = null;
    this.observer = null;
    this.unwatchScrollTop = null;
    this.unwatchBreakpoint = null;
    this.prepareWatchersObservers();
  },
  beforeDestroy() {
    if (this.player && typeof this.player.destroy === 'function') {
      this.player.destroy();
    }
    this.player = null;
    this.cleanWatchersObservers();
  },
  methods: {
    ...mapActions({
      setYoutubeApiReady: ROOT.SET_YOUTUBE_API_READY,
    }),
    handleScrollChange() {
      if (typeof window.requestAnimationFrame === 'function') {
        this.raf = window.requestAnimationFrame(this.isInView);
      } else {
        this.isInView();
      }
    },
    handleIntersecting(entries) {
      const entry = entries[0];
      if (!entry || entry.intersectionRatio === 0) {
        return;
      }
      this.loadYoutubeAPI();
      this.cleanWatchersObservers();
    },
    initObserver() {
      if (typeof this.$el.getBoundingClientRect !== 'function') {
        return;
      }
      this.observer = new window.IntersectionObserver(this.handleIntersecting);
      this.observer.observe(this.$el);
    },
    isInView() {
      if (typeof this.$el.getBoundingClientRect !== 'function') {
        return;
      }
      const { height, top } = this.$el.getBoundingClientRect();
      if (top <= this.viewportHeight && top + height >= 0) {
        this.loadYoutubeAPI();
        this.cleanWatchersObservers();
      }
    },
    prepareWatchersObservers() {
      if (typeof window.IntersectionObserver === 'function') {
        this.initObserver();
      } else {
        this.unwatchScrollTop = this.$watch('scrollTop', this.handleScrollChange);
        this.unwatchBreakpoint = this.$watch('breakpoint', this.handleScrollChange);
        this.handleScrollChange();
      }
    },
    cleanWatchersObservers() {
      if (this.observer && typeof this.observer.disconnect === 'function') {
        this.observer.disconnect();
      }
      this.observer = null;
      if (this.raf && typeof window.cancelAnimationFrame === 'function') {
        window.cancelAnimationFrame(this.raf);
      }
      if (typeof this.unwatchScrollTop === 'function') {
        this.unwatchScrollTop();
      }
      this.unwatchScrollTop = null;
      if (typeof this.unwatchBreakpoint === 'function') {
        this.unwatchBreakpoint();
      }
      this.unwatchBreakpoint = null;
    },
    handleYoutubeApiReady() {
      if (
        !this.videoId ||
        this.isVideoShown ||
        typeof window.YT !== 'object' ||
        typeof window.YT.Player !== 'function'
      ) {
        return;
      }
      try {
        this.player = new window.YT.Player(this.id, {
          width: '300',
          height: '200',
          videoId: this.videoId,
          playerVars: {
            autoplay: 1,
            cc_load_policy: 3, // Undocumented
            controls: 1,
            disablekb: 1,
            iv_load_policy: 3,
            modestbranding: 1,
            loop: 1, // Works when used in conjunction with the playlist parameter
            playlist: this.videoId,
            rel: 0,
          },
          events: {
            onReady: this.handleVideoReady,
            onStateChange: this.handleStateChange,
          },
        });
      } catch (e) {
        //
      }
    },
    handleVideoReady(e = {}) {
      const { target: player } = e;
      if (!player) {
        return;
      }
      this.isVideoShown = true;
      if (typeof player.mute === 'function') {
        player.mute();
      }
      if (typeof player.playVideo === 'function') {
        player.playVideo();
      }
    },
    handleStateChange({ data }) {
      if (data === 1) {
        this.$emit('playing');
      }
    },
    loadYoutubeAPI() {
      if (this.isYoutubeApiReady || typeof window.YT === 'object') {
        this.handleYoutubeApiReady();
        return;
      }
      window.onYouTubePlayerAPIReady = this.setYoutubeApiReady;
      const script = window.document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      window.document.head.appendChild(script);
    },
  },
};
</script>

<style lang="scss">
.youtube-autoplay {
  // default styles
  /*position: relative;
    width: 100%;
    margin: 0;
    height: 0;
    padding-top: 56.25%;*/
  overflow: hidden;
}
.youtube-autoplay__iframe {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.15s;
}
.youtube-autoplay__cover {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding-top: 0;
  background-color: #fbfbfb;
  transition: opacity 0.15s;
}
.youtube-autoplay_shown .youtube-autoplay__iframe {
  opacity: 1;
}
.youtube-autoplay_shown .youtube-autoplay__cover {
  opacity: 0;
  pointer-events: none;
}
</style>
