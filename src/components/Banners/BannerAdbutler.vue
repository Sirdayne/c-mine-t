<template>
  <div :class="isImageLoaded && noAbsolute && $style.imageLoadedAndNotAbsolute">
    <Pending
      v-if="isLoading"
      :class="$style.component"
      :theme="theme"
    />
    <BannerImage
      v-else-if="adbutlerData && adbutlerData.isImage"
      :class="[$style.component, noAbsolute && $style.notAbsolute]"
      :theme="theme"
      :url="adbutlerData.redirectUrl"
      :url-base64="adbutlerData.redirectBase64Url"
      :target="bannerTarget"
      :src="adbutlerData.imageUrl"
      :srsset="adbutlerData.imageRetinaUrl"
      :alt="adbutlerData.imageAlt"
      :place="bannerOptions.place"
      :no-absolute="noAbsolute"
      :closable="closable"
      @image-loaded="imageLoadedHandler"
      @close="$emit('close')"
    />
    <BannerHtml
      v-else-if="adbutlerData && adbutlerData.isHtml"
      :class="$style.component"
      :theme="theme"
      :html="adbutlerData.code"
    />
    <BannerBlocked
      v-else
      :class="$style.component"
    />
    <img
      v-if="adbutlerData && adbutlerData.trackingPixelUrl"
      class="visually-hidden"
      alt="Pixel Image"
      :src="adbutlerData.trackingPixelUrl"
    />
  </div>
</template>

<script>
import getProperty from '~/assets/libs/getProperty';
import Pending from '~/components/Shared/Pending';
import BannerImage from '~/components/Banners/BannerImage.vue';
import BannerHtml from '~/components/Banners/BannerHtml.vue';
import BannerBlocked from '~/components/Banners/BannerBlocked.vue';
import { useFetchAdbutlerInterop } from '~/components/Banners/Adbutler/useFetchAdbutlerInterop';
import { captureError } from '~/lib/telemetry';

export default {
  name: 'BannerAdbutler',
  components: {
    Pending,
    BannerImage,
    BannerHtml,
    BannerBlocked,
  },
  props: {
    theme: {
      type: String,
      default: 'dark',
    },
    bannerOptions: {
      type: Object,
      default: () => ({}),
    },
    sentryTagPostfix: {
      type: String,
      default: 'adbutler',
    },
    noAbsolute: {
      type: Boolean,
    },
    closable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLoading: true,
      adbutlerData: null,
      isImageLoaded: false,
    };
  },

  computed: {
    bannerTarget() {
      const defaultTarget = '_self';
      return getProperty(this, 'adbutlerData.target', defaultTarget);
    },
  },

  mounted() {
    const fetchAdbutler = useFetchAdbutlerInterop();

    const doGet = async () => {
      try {
        this.adbutlerData = await fetchAdbutler(this.bannerOptions);
      } catch (error) {
        this.isLoading = false;

        captureError(error, {
          legacyBannerPlace: this.bannerOptions.place,
        });
      } finally {
        this.isLoading = false;
      }
    };

    doGet();
  },

  methods: {
    imageLoadedHandler() {
      this.isImageLoaded = true;
      this.$emit('image-loaded');
    },
  },
};
</script>

<style module>
.imageLoadedAndNotAbsolute {
  padding-top: 0;
  height: auto;
}
.component {
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  width: 100%;
  height: 100%;
  padding-top: 0;
}
.notAbsolute {
  position: relative;
}
</style>
