<template>
  <div v-if="bannerOptions">
    <template v-if="isVisible">
      <Banner
        v-if="bannerOptions"
        :banner-options="bannerOptions"
      />
      <button
        v-if="showCloseBtn"
        class="banner-close"
        @click="handleClose"
      >
        &times;
      </button>
    </template>
  </div>
</template>

<script>
import Banner from '~/components/Banners/Banner.vue';

const DAY = 60 * 60 * 24;
const COOKIE_KEY = 'sticky_footer_hide';

export default {
  name: 'StickyFooterBanner',
  components: {
    Banner,
  },
  props: {
    bannerOptions: {
      type: Object,
      default: undefined,
    },
  },
  data: () => ({
    isVisible: false,
    showCloseBtn: false,
  }),
  computed: {
    cookieKey() {
      let cookieKeyString = `${COOKIE_KEY}`;
      if (this.bannerOptions) {
        cookieKeyString = `${cookieKeyString}_${this.bannerOptions.id}`;
      }
      return cookieKeyString;
    },
  },
  watch: {
    isVisible: {
      immediate: true,
      handler(visible) {
        this.$emit('visibilityChanged', visible);
        if (visible) {
          setTimeout(() => {
            this.showCloseBtn = true;
          }, 2000);
        }
      },
    },
  },
  created() {
    const isBannerHidden = this.$cookies.get(this.cookieKey);
    if (!isBannerHidden) {
      this.isVisible = true;
    }
  },
  methods: {
    handleClose() {
      this.isVisible = false;
      this.setCookie();
    },
    setCookie() {
      const { cookieKey } = this;
      this.$cookies.set(cookieKey, 1, {
        maxAge: DAY * 14,
        httpOnly: false,
        secure: false,
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import '~/assets/styles/_vars.scss';
.banner-close {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: black;
  z-index: 1;
  border-radius: 100%;
  border: 2px solid white;
  font-size: 1rem;
  position: absolute;
  top: 0;
  right: 6px;
  transform: translate(40%, -40%);
  cursor: pointer;
  @media (max-width: 767px) {
    right: 0;
  }
  @media (min-width: $md) {
    right: 0;
  }
}
</style>
