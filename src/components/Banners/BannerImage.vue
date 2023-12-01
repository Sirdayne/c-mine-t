<template>
  <a
    :class="[$style.link, 'banner-image']"
    :href="href"
    :target="target"
    :data-hash="hash"
    :data-link="urlBase64"
    rel="noopener"
  >
    <LazyImage
      :theme="theme"
      :src="src"
      :srcset="srsset"
      :alt="alt"
      :no-absolute="noAbsolute"
      :class="[$style.image, isImageLoaded && noAbsolute && $style.imageLoadedAndNotAbsolute]"
      @image-loaded="imageLoadedHandler"
    />
    <CloseAdButton
      v-if="closable"
      @close="$emit('close')"
    />
  </a>
</template>

<script>
import LazyImage from '~/components/Shared/LazyImage.vue';
import { CloseAdButton } from '~/features/ads';

export default {
  name: 'BannerImage',
  components: {
    CloseAdButton,
    LazyImage,
  },
  props: {
    theme: {
      type: String,
      default: 'dark',
    },
    url: {
      type: String,
      default: '',
    },
    src: {
      type: String,
      default: '',
    },
    srsset: {
      type: String,
      default: '',
    },
    alt: {
      type: String,
      default: '',
    },
    target: {
      type: String,
      default: '_blank',
    },
    urlBase64: {
      type: String,
      default: '',
    },
    place: {
      type: String,
      default: '',
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
      isImageLoaded: false,
    };
  },
  computed: {
    href() {
      return this.urlBase64
        ? // eslint-disable-next-line no-script-url
          'javascript:void(0);'
        : this.url;
    },
    hash() {
      return this.urlBase64 ? 'true' : 'false';
    },
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
.link {
  text-decoration: none;
  color: inherit;
}
.image {
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  width: 100%;
  height: 100%;
  padding-top: 0;
}
.imageLoadedAndNotAbsolute {
  position: relative;
  height: auto;
}
</style>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.banner-image .lazy-image__img {
  @media (min-width: $md) {
    object-fit: contain;
  }
}
</style>
