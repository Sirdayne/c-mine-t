<template>
  <div
    class="youtube-header"
    :class="[isRtl && 'youtube-header_rtl']"
  >
    <span
      class="youtube-header__headline"
      :title="i18n.youtubeBannerHeadline"
    >
      {{ i18n.youtubeBannerHeadline }}
    </span>
    <a
      class="btn youtube-header__btn"
      target="_blank"
      rel="noopener"
      data-gtm-locator="article_youtube_clickon_subscribed"
      :href="i18n.youtubeBannerChannelUrl"
      data-testid="youtube-subscribe-button"
    >
      <span class="btn__wrp">
        <span class="btn__icon youtube-header__icon" />
        <span class="btn__cap">
          {{ i18n.youtubeBannerButtonLabel }}
        </span>
      </span>
    </a>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ROOT } from '~/store/types';

export default {
  name: 'YoutubeHeader',
  props: {
    i18n: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
  },
};
</script>

<style scoped lang="scss">
@use '~/assets/styles/_icons-socials.scss' as social-icons;
@import '~/assets/styles/_vars.scss';

.youtube-header {
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: 0 10px;
  box-sizing: border-box;
  background-color: #000000;
}
.youtube-header__headline {
  flex-grow: 1;
  display: block;
  min-width: 0;
  margin-right: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #ffffff;
}
.youtube-header__btn {
  flex-shrink: 0;
  display: block;
  padding: 2px 8px;
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 700;
  color: #ffffff;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background-color: rgba(236, 32, 39, 1);
  transition: background-color 0.15s;
}
.youtube-header__btn:hover {
  text-decoration: none;
  color: #ffffff;
  background-color: rgba(236, 32, 39, 0.8);
}
.youtube-header__icon {
  @include social-icons.youtube-play-white;
  width: 16px;
  height: 12px;
  margin-right: 4px;
  margin-bottom: 2px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
.youtube-header_rtl {
  direction: rtl;
}
.youtube-header_rtl .youtube-header__headline {
  margin-left: 10px;
  margin-right: 0;
}
.youtube-header_rtl .youtube-header__icon {
  margin-left: 4px;
  margin-right: 0;
}
</style>
