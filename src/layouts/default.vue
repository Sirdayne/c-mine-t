<template>
  <div class="layout">
    <ClientOnly>
      <TopZone />
    </ClientOnly>
    <GlobalMeta />
    <LayoutGlobalMeta />

    <div
      class="layout__wrp"
      :class="isLocked && (isMobileBreakpoint || isOverlayVisible) && 'layout__wrp_locked'"
      :style="{
        top,
        minHeight,
      }"
    >
      <AppHeader
        class="mb-5 layout__header"
        :class="{
          'asia-header-zone-mobile__lb': asiaMobileLayoutEnabled,
          'layout__header--black': !asiaMobileLayoutEnabled && isPodcast,
          'layout__header_without-leaderboard': !asiaMobileLayoutEnabled && !isLeaderboardVisible,
        }"
      />
      <div>
        <main
          :class="{
            'layout--blurred': podcastImageUrl,
            'layout--dark-background': isAdvertisePage || isCaminoPage,
          }"
        >
          <Nuxt :name="namedView" />
        </main>
        <AppFooter
          v-if="isFooterShown"
          :data-testid="footerDataTestId"
        />
        <ClientOnly>
          <ImageModal v-if="asiaMobileLayoutEnabled" />
          <BottomZone />
        </ClientOnly>
      </div>
      <ImageModal v-if="!asiaMobileLayoutEnabled && isPostPage" />
    </div>
    <MenuMobile v-if="!asiaMobileLayoutEnabled && isMobileMenuOpened" />
    <HeaderMobileSearch
      class="layout__mobile-search"
      :class="isSearchOpened && 'layout__mobile-search_visible'"
    />
    <ClientOnly>
      <Subscriptions v-if="!asiaMobileLayoutEnabled && isSubscriptionsModalOpened" />
      <MarketsProLeadFormModal v-if="marketsProLeadFormModalEnabled" />
    </ClientOnly>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { VIEWPORT, MENU } from '~/store/types';
import TopZone from '~/components/Zones/TopZone';
import HeaderMobileSearch from '~/components/Header/HeaderMobileSearch';
import { NAMED_VIEWS, PATH_SLUGS_WITHOUT_LEADERBOARD } from '~/app.config';
import scrollTo from '~/assets/libs/scrollTo';
import GlobalMeta from '~/GlobalMeta.vue';
import { useFeatureManager } from '~/lib/feature-manager';
import { useDeviceInfo } from '~/lib/device-detector';
import { computed } from 'vue';
import { LayoutGlobalMeta } from '~/lib/layout-store';
import { getBackButtonListener } from '~/lib/shared';

const BackButtonListener = getBackButtonListener();

import AppFooter from '~/features/app-footer/AppFooter.vue';
import AppHeader from '~/features/app-header/AppHeader.vue';
import { useRoute } from '~/lib/framework';
import BottomZone from '~/components/Zones/BottomZone.vue';
import MenuMobile from '~/features/app-header/MenuMobile.vue';

export default {
  name: 'DefaultLayout',
  components: {
    MenuMobile,
    BottomZone,
    AppHeader,
    AppFooter,
    LayoutGlobalMeta,
    GlobalMeta,
    TopZone,
    HeaderMobileSearch,
    ImageModal: () => import('~/components/Modals/ImageModal'),
    Subscriptions: () => import('~/components/SubscriptionsModal/Subscriptions'),
    MarketsProLeadFormModal: () => import('~/features/markets-pro-lead-form/MarketsProLeadFormModal'),
  },
  setup() {
    const featureManager = useFeatureManager();
    const deviceInfo = useDeviceInfo();
    const route = useRoute();

    const asiaMobileLayoutEnabled = computed(() => featureManager.isEnabled('asia_mobile_layout') && deviceInfo.mobile);
    const marketsProLeadFormModalEnabled = computed(() => featureManager.isEnabled('markets_pro_lead_form'));

    const isLeaderboardVisible = computed(() => !PATH_SLUGS_WITHOUT_LEADERBOARD.includes(route.value.name));
    const isPodcast = computed(() => route.value.name === 'podcasts' || route.value.name === 'podcasts-slug');

    return {
      isAsia: featureManager.isEnabled('asia_mobile_layout'),
      asiaMobileLayoutEnabled,
      isLeaderboardVisible,
      isPodcast,
      marketsProLeadFormModalEnabled,
    };
  },
  data() {
    return {
      top: '',
      minHeight: '',
    };
  },
  computed: {
    ...mapState({
      currentLanguage: ({ currentLanguage }) => currentLanguage,
    }),
    ...mapState('podcast', {
      podcastImageUrl: ({ podcastImageUrl }) => podcastImageUrl,
    }),
    ...mapState('viewport', {
      isOverlayVisible: ({ isOverlayVisible }) => isOverlayVisible,
      scrollIsLocked: ({ scrollIsLocked }) => scrollIsLocked,
      scrollTop: ({ scrollTop }) => scrollTop,
      viewportHeight: ({ viewportHeight }) => viewportHeight,
      isIosDevice: ({
        userDeviceType: {
          apple: { device },
        },
      }) => device,
    }),
    ...mapState('menu', {
      isSearchOpened: ({ isSearchOpened }) => isSearchOpened,
      isMobileMenuOpened: ({ isMobileMenuOpened }) => isMobileMenuOpened,
      scrollBeforeOpened: ({ scrollBeforeOpened }) => scrollBeforeOpened,
    }),
    ...mapState('subscriptionsModal', {
      isSubscriptionsModalOpened: ({ isModalOpened }) => isModalOpened,
    }),
    ...mapState('footer', {
      isFooterShown: ({ isShown }) => isShown,
    }),
    ...mapGetters('viewport', {
      isMobileBreakpoint: VIEWPORT.IS_MOBILE_BREAKPOINT,
    }),
    backgroundBlurredImage() {
      return `url(${this.podcastImageUrl})`;
    },
    isLocked() {
      return this.scrollIsLocked || this.isMobileMenuOpened || this.isSearchOpened;
    },
    isAdvertisePage() {
      return this.$route.name === 'advertise';
    },
    isCaminoPage() {
      return this.$route.name === 'sponsored-camino-network-hub';
    },
    namedView() {
      const { $route } = this;
      const currentPath = $route.path;
      const paths = ['/category/flash-news', '/category/politics'];

      if (this.isAsia && paths.includes(currentPath)) {
        return NAMED_VIEWS.flashNews;
      }
      return NAMED_VIEWS.default;
    },
    isPostPage() {
      return ['news-slug', 'press-releases-slug', 'market-releases-slug'].includes(this.$route.name);
    },
    footerDataTestId() {
      return `footer-container${this.isAsiaMobile ? '-asia-mobile' : ''}`;
    },
  },
  watch: {},
  async mounted() {
    BackButtonListener.setCallback((route) => {
      this.$router.replace(route);
    });

    this.$router.beforeEach((to, from, next) => {
      if (from) {
        BackButtonListener.setPositions(from.path, to.path, from.name, to.name, globalThis.scrollY);
      }

      next();
    });

    this.listenToWindowActive();
    this.listenToWindowResize();
    this.listenToWindowScroll();

    BackButtonListener.setListenerToBackButton();

    if (this.isIosDevice) {
      this.setAbnormalScrollWatcher();
      this.addAbnormalScrollOnTouchEvent();
    }
  },
  beforeDestroy() {
    this.cleanUp();
  },
  methods: {
    ...mapActions('menu', {
      fetchMobileMenu: MENU.FETCH_MOBILE_MENU,
    }),
    ...mapActions('viewport', {
      listenToWindowActive: VIEWPORT.LISTEN_TO_WINDOW_ACTIVE,
      listenToWindowResize: VIEWPORT.LISTEN_TO_WINDOW_RESIZE,
      listenToWindowScroll: VIEWPORT.LISTEN_TO_WINDOW_SCROLL,
    }),
    lockScroll(isLocked) {
      const { scrollBeforeOpened } = this;
      const top = isLocked && `-${scrollBeforeOpened}px`;
      const minHeight = isLocked && `calc(100vh + ${scrollBeforeOpened}px)`;
      this.top = top || '';
      this.minHeight = minHeight || '';
    },
    resetAbnormalScroll(newPosition, oldPosition) {
      const scrollTopDiff = newPosition - oldPosition;
      const isAbnormalScrollPosition = scrollTopDiff > 0;
      if (!isAbnormalScrollPosition) {
        return;
      }
      scrollTo({
        duration: 0,
      });
      this.removeAbnormalScrollOnTouchEvent();
      this.tryToUnwatchScrollTop();
    },
    setAbnormalScrollWatcher() {
      this.unwatchScrollTop = this.$watch('scrollTop', this.resetAbnormalScroll);
    },
    cleanUp() {
      this.removeAbnormalScrollOnTouchEvent();
      this.tryToUnwatchScrollTop();
      BackButtonListener.removeListenerToBackButton();
    },
    tryToUnwatchScrollTop() {
      if (typeof this.unwatchScrollTop === 'function') {
        this.unwatchScrollTop();
      }
    },
    addAbnormalScrollOnTouchEvent() {
      document.addEventListener('touchstart', this.tryToUnwatchScrollTop, { passive: true });
    },
    removeAbnormalScrollOnTouchEvent() {
      document.removeEventListener('touchstart', this.tryToUnwatchScrollTop, { passive: true });
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

// https://codepen.io/tigt/post/fixing-the-white-glow-in-the-css-blur-filter
@mixin better-blur($radius) {
  filter: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='a' x='0' y='0' width='1' height='1'%3E%3CfeGaussianBlur stdDeviation='#{$radius}' result='b'/%3E%3CfeMorphology operator='dilate' radius='#{$radius}'/%3E %3CfeMerge%3E%3CfeMergeNode/%3E%3CfeMergeNode in='b'/%3E%3C/feMerge%3E%3C/filter%3E%3C/svg%3E#a");
  -webkit-filter: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='a' x='0' y='0' width='1' height='1'%3E%3CfeGaussianBlur stdDeviation='#{$radius}' result='b'/%3E%3CfeMorphology operator='dilate' radius='#{$radius}'/%3E %3CfeMerge%3E%3CfeMergeNode/%3E%3CfeMergeNode in='b'/%3E%3C/feMerge%3E%3C/filter%3E%3C/svg%3E#a");
}

.layout {
  position: relative;
  z-index: 0;
}
.layout__wrp {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.layout__wrp_locked {
  position: fixed;
  left: 0;
  right: 0;
  z-index: -1;
  width: 100%;
  min-height: 100vh;
}
.layout__wrp_locked::after {
  content: '';
  position: absolute;
  left: 0;
  top: 48px;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  background-color: rgba(0, 0, 0, 0.45);
}
.layout__header {
  position: relative;
}

[data-layout-header-variant='dark'] .layout__header,
.layout__header--black {
  background: black;
  margin-bottom: 0;
}

.layout__footer {
  margin-top: auto;
}
.layout__mobile-search {
  display: none;
}
.layout__mobile-search_visible {
  display: block;
}

.layout__header_without-leaderboard {
  margin-bottom: 0;
}

@media (min-width: $sm) {
  .layout__header {
    margin-bottom: 16px;

    [data-layout-header-variant='dark'] &,
    &--black {
      margin: 0;
    }

    &--nft-steez,
    &--hashing-it-out,
    &--crypto-trading-secrets,
    &--agenda {
      margin: 0;
      padding-bottom: 16px;
    }
  }
  .layout__header_without-leaderboard {
    margin-bottom: 0;
  }
}
@media (min-width: $md) {
  .layout__wrp_locked {
    overflow: unset;
  }
  .layout__wrp_locked::after {
    z-index: 3;
  }
  .layout__mobile-search {
    display: none;
  }
}

.layout--blurred {
  position: relative;
}
.layout--blurred > .podcast--blurred {
  background-color: rgba(0, 0, 0, 0.5);
}
.layout--blurred::before {
  content: ' ';
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-image: v-bind(backgroundBlurredImage);
  background-repeat: no-repeat;
  background-size: cover;
  background-color: rgba(0, 0, 0, 0.5);
  background-position: center;
  z-index: -1;
  @include better-blur(97);
  // Detect retina screen, on retina screen bg filter scales
  @media only screen and (-webkit-min-device-pixel-ratio: 2) and (max-width: 2000px),
    only screen and (min--moz-device-pixel-ratio: 2) and (max-width: 2000px),
    only screen and (-o-min-device-pixel-ratio: 2/1) and (max-width: 2000px),
    only screen and (min-device-pixel-ratio: 2) and (max-width: 2000px),
    only screen and (min-resolution: 192dpi) and (max-width: 2000px),
    only screen and (min-resolution: 2dppx) and (max-width: 2000px) {
    filter: none;
  }
}

// Fix white space on ceros iframe scrolling
.layout--dark-background {
  background-color: $color-black;
}

[data-layout-variant='dark'] .header-zone {
  background-color: red !important;
}
</style>
