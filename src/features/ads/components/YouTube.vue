<!-- simple youtube ad with subscribe button -->
<template>
  <div
    class="banner-youtube"
    data-testid="youtube-banner"
  >
    <youtube-header
      class="banner-youtube__header"
      :i18n="i18n"
    />
    <YoutubeAutoplay
      class="banner-youtube__video"
      :video-id="props.youtubeVideoId"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import YoutubeHeader from '~/components/Shared/YoutubeHeader.vue';
import YoutubeAutoplay from '~/components/Shared/YoutubeAutoplay.vue';
import { useStore } from '~/lib/framework';
import { useCustomRenderingProps } from '../adslot/useAdSlotContext';
import { CustomRenderingViews } from '../core/CustomRenderingViews';

const store = useStore();
const i18n = computed(() => store.state.i18n);
const props = useCustomRenderingProps(CustomRenderingViews.YOUTUBE_VIDEO);
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
