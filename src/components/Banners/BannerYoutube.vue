<template>
  <div class="banner-youtube">
    <youtube-header
      class="banner-youtube__header"
      :i18n="i18n"
    />
    <YoutubeAutoplay
      class="banner-youtube__video"
      :theme="theme"
      :video-id="videoId"
    />
  </div>
</template>

<script>
import YoutubeHeader from '~/components/Shared/YoutubeHeader.vue';
import YoutubeAutoplay from '~/components/Shared/YoutubeAutoplay.vue';

export default {
  name: 'BannerYoutube',
  components: {
    YoutubeHeader,
    YoutubeAutoplay,
  },
  props: {
    theme: {
      type: String,
      default: '',
    },
    videoId: {
      type: String,
      default: '',
    },
    i18n: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.banner-youtube__video {
  position: relative;
  width: 100%;
  margin: 0;
  height: 0;
  padding-top: 56.25%;
}
</style>
