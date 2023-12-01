<template>
  <div class="bottom-zone">
    <ToTopButton
      v-if="isNotPostPage"
      class="bottom-zone__to-top"
      :style="`bottom: calc(100% + ${topBtnBottomOffset});`"
    />
    <AdSlot
      v-if="stickyBanner && isStickyBannerVisible"
      place="index_sticky"
      class="bottom-zone__banner bottom-zone__banner_type-sticky"
      :style="`bottom: calc(100% + ${stickyBannerOffset}px);`"
    />
    <Transition
      name="privacy-policy-appear"
      @after-enter="handleViewportWidthChange"
      @after-leave="handleViewportWidthChange"
    >
      <PrivacyPolicy
        v-if="isPrivacyPolicyShown"
        :i18n="i18n"
        class="bottom-zone__privacy-policy"
      />
    </Transition>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { VIEWPORT } from '~/store/types';
import { BANNER_PLACES } from '~/app.config';
import ToTopButton from '~/components/Shared/ToTopButton.vue';
import PrivacyPolicy from '~/components/Banners/PrivacyPolicy.vue';
import AdSlot from '~/features/ads/AdSlot.vue';

export default {
  name: 'BottomZone',
  components: {
    AdSlot,
    ToTopButton,
    PrivacyPolicy,
  },
  data: () => ({
    topBtnBottomOffset: '15px',
    stickyBannerOffset: 24,
    showStickyFooter: false,
  }),
  computed: {
    ...mapState({
      i18n: ({ i18n }) => i18n,
      languageShort: ({ currentLanguage: { short } }) => short,
      stickyBanner: ({ banners }) => banners[BANNER_PLACES.MAIN_STICKY]?.[0] ?? null,
    }),
    ...mapState('viewport', {
      viewportWidth: ({ viewportWidth }) => viewportWidth,
    }),
    ...mapState('settings', {
      isPrivacyPolicyHidden: ({ isPrivacyPolicyHidden }) => isPrivacyPolicyHidden,
    }),
    ...mapGetters('viewport', {
      isDesktopWidth: VIEWPORT.IS_DESKTOP_WIDTH,
    }),
    isPrivacyPolicyShown() {
      return !this.isPrivacyPolicyHidden && this.i18n && this.i18n.privacyPolicyCap && this.i18n.privacyPolicyText;
    },
    isFrontPage() {
      return this.$route.name === 'index';
    },
    isNotPostPage() {
      return !['news-slug', 'press-releases-slug', 'market-releases-slug', 'learn-slug', 'explained-slug'].includes(
        this.$route.name
      );
    },
    isStickyBannerVisible() {
      return this.isFrontPage && this.isDesktopWidth;
    },
  },
  watch: {
    viewportWidth: 'handleViewportWidthChange',
  },
  methods: {
    ...mapActions('viewport', {
      setBottomZoneHeight: VIEWPORT.SET_BOTTOM_ZONE_HEIGHT,
    }),
    handleViewportWidthChange() {
      this.$nextTick(() => {
        const height = this.$el instanceof HTMLElement ? this.$el.offsetHeight : 0;
        this.setBottomZoneHeight(height);
      });
    },
  },
};
</script>
<style lang="scss">
@import '~/assets/styles/_vars.scss';

.bottom-zone {
  position: fixed;
  position: sticky;
  bottom: 0;
  z-index: 1;
  backface-visibility: hidden;
}
.bottom-zone__to-top {
  position: absolute;
  left: 50%;
}
.bottom-zone__banner_type-sticky {
  display: none;
}

@media (min-width: $sm) {
  .bottom-zone__to-top {
    left: 10px;
    bottom: calc(100% + 10px) !important;
  }
}
@media (min-width: $md) {
  .bottom-zone__to-top {
    left: 20px;
    bottom: calc(100% + 20px) !important;
  }
  .bottom-zone__banner_type-sticky {
    position: absolute;
    right: 50px;
    bottom: calc(100% + 20px);
    display: block;
  }
}
</style>
