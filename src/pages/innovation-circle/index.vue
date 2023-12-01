<template>
  <div
    class="innovation-circle-page"
    :class="[isAsia && isMobile && 'innovation-circle-page_asia', isRtl && 'innovation-circle-page_rtl']"
  >
    <div class="container">
      <div class="innovation-circle-page__title-wrap">
        <h1 class="innovation-circle-page__title">Innovation Circle</h1>

        <AdSlot
          v-if="!isMobileBreakpoint"
          place="promo_button_tag_desktop"
          class="innovation-circle-page__promo-button"
        />
      </div>
      <InnovationCircleAbout
        class="innovation-circle-page__about"
        :i18n="i18n"
      />

      <AdSlot
        v-if="isMobileBreakpoint"
        place="promo_button_stack_tag_mobile"
        class="innovation-circle-page__promo-button"
      />

      <div class="innovation-circle-page__rows">
        <div class="innovation-circle-page__posts-col">
          <InnovationCirclePostsListing
            theme="inline"
            :pending="postData.isPending"
            :has-more="postData.hasMore"
            :posts="postData.posts"
            :i18n="i18n"
            @load-more="handleLoadMore()"
          />
        </div>
        <div
          v-if="!isMounted || !isMobileBreakpoint"
          class="innovation-circle-page__sidebar-col"
        >
          <Sidebar />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import { ROOT, VIEWPORT } from '~/store/types';
import { fetchInnovationCirclePageInitialState, fetchInnovationCirclePage } from '~/api/modules/innovation-circle';
import { getInnovationCirclePageMeta } from '~/assets/helpers/meta';
import { pushVirtualPageView } from '~/assets/helpers/dataLayerEvents';
import { pathValidator } from '~/assets/helpers/utils';
import getProperty from '~/assets/libs/getProperty';
import { AdSlot } from '~/features/ads';
import { fetchPriceIndexPageMeta } from '~/api/modules/priceIndexes';

export default {
  name: 'InnovationCirclePage',
  components: {
    AdSlot,
    InnovationCircleAbout: () => import('~/components/InnovationCircle/InnovationCircleAbout'),
    InnovationCirclePostsListing: () =>
      import('~/components/InnovationCirclePostsListing/InnovationCirclePostsListing'),
    Sidebar: () => import('~/components/Sidebar/Sidebar'),
  },
  validate: pathValidator,
  async asyncData({ store: { state }, route, app }) {
    const data = await fetchInnovationCirclePageInitialState({
      languageDomain: state.currentLanguage.domain,
      languageCode: state.currentLanguage.code,
      timeZone: state.currentLanguage.timezone,
      pathname: route.path,
      languageShort: state.currentLanguage.short,
      apolloTransport: app.$apolloTransport,
    });
    const meta = await fetchPriceIndexPageMeta({
      pathname: route.path,
      languageShort: state.currentLanguage.short,
      apolloTransport: app.$apolloTransport,
    });

    return { ...data, ...meta };
  },
  data() {
    return {
      posts: null,
      meta: null,
      alternates: [],
      isMounted: false,
    };
  },
  computed: {
    ...mapState({
      currentLanguage: ({ currentLanguage }) => currentLanguage,
      languages: ({ languages }) => languages,
      i18n: ({ i18n }) => i18n,
    }),
    ...mapState('viewport', {
      isMobile: ({ userDeviceType: { any } }) => any,
    }),
    ...mapGetters({
      isAsia: ROOT.IS_ASIA,
      isRtl: ROOT.IS_RTL,
    }),
    ...mapGetters('viewport', {
      isMobileBreakpoint: VIEWPORT.IS_MOBILE_BREAKPOINT,
    }),
    hasMore() {
      return this.postData && this.postData.postsAmount > 0 && this.postData.postsOffset < this.postData.postsAmount;
    },
  },
  mounted() {
    this.isMounted = true;
    this.setAlternates({
      alternates: this.alternates,
      url: getProperty(this.meta, 'url', ''),
    });
    this.pushVirtualPageView();
  },
  methods: {
    ...mapActions({
      setAlternates: ROOT.SET_ALTERNATES,
    }),
    async handleLoadMore() {
      if (!this.postData) {
        return;
      }
      this.postData.isPending = true;
      const {
        data: { posts, postsCount },
      } = await fetchInnovationCirclePage({
        order: this.postData.order,
        offset: this.postData.postsOffset,
        languageDomain: this.currentLanguage.domain,
        languageCode: this.currentLanguage.code,
        timeZone: this.currentLanguage.timezone,
        languageShort: this.currentLanguage.short,
        apolloTransport: this.$apolloTransport,
      });
      this.postData.isPending = false;
      this.postData.posts = this.postData.posts.concat(posts);
      this.postData.postsOffset += posts.length;
      if (postsCount > 0) {
        this.postData.postsAmount = postsCount;
      }
    },
    pushVirtualPageView() {
      const { url: domain } = this.currentLanguage;
      return pushVirtualPageView({
        url: `${domain}/innovation-circle`,
        title: '',
        category: '',
        tags: [],
      });
    },
  },
  head() {
    const { currentLanguage, languages, meta, alternates, $route } = this;
    return getInnovationCirclePageMeta({
      currentLanguage,
      languages,
      meta,
      alternates,
      routeName: $route.name,
    });
  },
};
</script>

<style scoped lang="scss">
@import '~/assets/styles/_vars.scss';

.innovation-circle-page {
  margin-bottom: 40px;
}
.innovation-circle-page__title {
  position: relative;
  margin: 0 0 24px;
  padding-bottom: 12px;
  font-size: 1.875rem;
  line-height: 1.1;
  color: #010101;
  font-weight: 600;
  margin-right: 16px;
}
.innovation-circle-page__title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 15%;
  height: 2px;
  max-width: 50px;
  min-width: 30px;
  background-color: #ffcd04;
}
.innovation-circle-page__about {
  margin-bottom: 24px;
}
.innovation-circle-page__rows {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  margin-left: -$gutter;
  margin-right: -$gutter;
}
.innovation-circle-page__posts-col {
  width: 100%;
  padding-right: $gutter;
  padding-left: $gutter;
  box-sizing: border-box;
}
.innovation-circle-page__sidebar-col {
  display: none;
}
.innovation-circle-page__tabs {
  display: flex;
  width: 100%;
  height: 40px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.innovation-circle-page__tab {
  width: 100%;
  padding: 0;
}
.innovation-circle-page__tab-btn {
  display: block;
  width: 100%;
  min-width: 0;
  height: 40px;
  font-size: 0.875rem;
  color: #555555;
  border-bottom: 1px solid transparent;
  transition: border-color 0.15s;
}
.innovation-circle-page__tab-btn:hover,
.innovation-circle-page__tab-btn_selected,
.innovation-circle-page__tab-btn.innovation-circle-page__tab-btn_selected:hover {
  border-color: #ffcd04;
  cursor: default;
}
.innovation-circle-page__tab-btn:hover {
  cursor: pointer;
}
.innovation-circle-page__promo-button {
  width: 100%;
  margin-bottom: 10px;
}

.innovation-circle-page_asia {
  margin-top: 20px;
}
.innovation-circle-page_rtl {
  direction: rtl;
}
.innovation-circle-page_rtl .innovation-circle-page__title {
  margin-right: 0;
  margin-left: 16px;
}
.innovation-circle-page_rtl .innovation-circle-page__title::after {
  right: 0;
}
.innovation-circle-page__title-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
}

@media (min-width: $sm) {
  .innovation-circle-page__tabs {
    width: auto;
  }
  .innovation-circle-page__tab {
    width: auto;
    margin-right: 8px;
  }
  .innovation-circle-page__tab-btn {
    width: auto;
    padding-left: 6px;
    padding-right: 6px;
  }
  .innovation-circle-page__promo-button {
    display: inline-block;
    width: auto;
    // margin-bottom: 0;
  }
  .innovation-circle-page_rtl .innovation-circle-page__promo-button {
    margin-left: 0;
    // margin-right: auto;
  }
}
@media (min-width: $md) {
  .innovation-circle-page__sidebar-col {
    display: block;
    width: 33.33333333%;
    padding-right: $gutter;
    padding-left: $gutter;
    box-sizing: border-box;
    z-index: 1;
  }
  .innovation-circle-page__posts-col {
    width: 66.66666667%;
  }
  .innovation-circle-page__sidebar-col_with-top-padding {
    padding-top: 5px;
  }
}
</style>
