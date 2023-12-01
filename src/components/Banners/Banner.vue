<template>
  <div :class="containerClass">
    <BannerImage
      v-if="bannerOptions.isImage"
      :class="$style.component"
      :theme="theme"
      :url="bannerOptions.url"
      :url-base64="bannerOptions.base64"
      :src="bannerOptions.image"
    />
    <BannerYoutube
      v-else-if="bannerOptions.isHtml && bannerOptions.youtubeVideoId"
      :class="$style.componentYoutube"
      :theme="theme"
      :video-id="bannerOptions.youtubeVideoId"
      :i18n="i18n"
    />
    <BannerHtml
      v-else-if="bannerOptions.isHtml"
      :class="$style.component"
      :widget-height="bannerOptions.options && bannerOptions.options.widgetHeight"
      :theme="theme"
      :html="bannerOptions.code"
    />
    <BannerAdbutler
      v-else-if="bannerOptions.isAdbutler"
      :class="dynamicClass"
      :theme="theme"
      :banner-options="bannerOptions"
      :no-absolute="false"
      :closable="closable"
      @close="$emit('close')"
    />

    <AdSlot
      v-else-if="bannerOptions.isPromoButtonStack"
      :place="bannerOptions.graphqlBanner.bannerPlace"
    />

    <BannerBlocked
      v-else
      :class="$style.component"
    />
    <img
      v-if="bannerOptions.trackingPixelUrl"
      class="visually-hidden"
      alt="Pixel Image"
      :src="bannerOptions.trackingPixelUrl"
    />
  </div>
</template>

<script>
import { BANNER_PLACES } from '~/app.config';
import BannerImage from '~/components/Banners/BannerImage.vue';
import BannerYoutube from '~/components/Banners/BannerYoutube.vue';
import BannerHtml from '~/components/Banners/BannerHtml.vue';
import BannerAdbutler from '~/components/Banners/BannerAdbutler.vue';
import BannerBlocked from '~/components/Banners/BannerBlocked.vue';
import { AdSlot } from '~/features/ads';

export default {
  name: 'Banner',
  components: {
    AdSlot,
    BannerImage,
    BannerYoutube,
    BannerHtml,
    BannerAdbutler,
    BannerBlocked,
  },
  props: {
    theme: {
      type: String,
      default: 'dark',
    },
    bannerOptions: {
      type: [Object, undefined],
      default: () => ({}),
    },
    i18n: {
      type: Object,
      default: () => ({}),
    },
    closable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isAllIndexPlaces() {
      const { bannerOptions } = this;
      return ['index', 'index_mobile'].includes(bannerOptions.place);
    },
    isNotStretchMobilePlace() {
      const { bannerOptions } = this;
      return bannerOptions.place === BANNER_PLACES.MAIN_POSTS_NON_STRETCH_MOBILE;
    },
    containerClass() {
      const { $style } = this;
      return [
        this.isAllIndexPlaces && $style.containerAllIndex,
        this.isNotStretchMobilePlace && $style.containerNonStretchBanner,
      ];
    },
    dynamicClass() {
      return [this.$style.component, this.$style.componentAdbutler];
    },
  },
};
</script>

<style module lang="scss">
@import '~/assets/styles/_vars.scss';
@import '~/assets/styles/_mixins.scss';
.component {
  position: relative;
  display: block;
  width: 100%;
  height: 0;
}
.componentYoutube {
  position: relative;
}
.containerAllIndex .component {
  @include aspect-ratio-box($width: 373, $height: 395);
  @media (min-width: $xs) and (max-width: $md) {
    @include aspect-ratio-box($width: 334, $height: 374);
  }
}
.containerHeader .component {
  @include aspect-ratio-box($width: 75, $height: 64);
}

.containerImageLoadedNotAbsolute .componentAdbutler {
  padding-top: 0;
}
.containerNonStretchBanner {
  width: 300px;
  margin: 0 auto;
}
.containerNonStretchBanner .component {
  padding-top: 250px;
}
</style>
