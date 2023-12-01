<template>
  <div
    :class="[
      isAsia && isMobile && 'category-page_asia',
      isRtl && 'category-page_rtl',
      'category-page_has-promo-button',
    ]"
    class="category-page"
  >
    <div class="container">
      <div class="category-page__row">
        <div class="category-page__content-col">
          <div
            v-if="category"
            class="category-page__meta"
          >
            <div class="category-page__title-wrap">
              <h1
                v-if="category.title"
                class="category-page__title"
              >
                {{ category.title }}
              </h1>

              <AdSlot
                :place="adSlotPlace"
                :config="{ closable: true }"
                class="category-page__promo-button"
              />
            </div>
            <div
              v-if="category.description"
              class="category-page__description"
              v-html="category.description"
            />
          </div>
          <PostsListing
            class="category-page__posts"
            :theme="isWithoutImageTheme ? 'without-image' : 'inline'"
            :pending="isPending"
            :has-more="hasMore"
            :posts="posts"
            :i18n="i18n"
            gtm-prefix="market_analysis"
            gtm-suffix="clickon_author"
            @load-more="handleLoadMore"
          />
        </div>
        <div
          v-if="!isMounted || !isMobileBreakpoint"
          class="category-page__sidebar-col"
        >
          <Sidebar />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { ROOT, VIEWPORT } from '~/store/types';
import getProperty from '~/assets/libs/getProperty';
import { getCategoryPageMeta } from '~/assets/helpers/meta';
import { pushVirtualPageView } from '~/assets/helpers/dataLayerEvents';
import { pathValidator } from '~/assets/helpers/utils';
import { AdSlot } from '~/features/ads';

const CRYPTOPEDIA_CATEGORIES = ['explained'];

export default {
  name: 'CategoryPage',
  components: {
    AdSlot,
    PostsListing: () => import('~/components/PostsListing/PostsListing'),
    Sidebar: () => import('~/components/Sidebar/Sidebar'),
  },
  validate: pathValidator,
  async asyncData() {
    return {
      category: {},
      posts: [],
    };
  },
  data() {
    return {
      isPending: false,
      category: null,
      posts: [],
      alternates: [],
      postsOffset: 0,
      postsAmount: 0,
      meta: null,
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
    ...mapGetters('viewport', {
      isMobileBreakpoint: VIEWPORT.IS_MOBILE_BREAKPOINT,
    }),
    ...mapGetters({
      isAsia: ROOT.IS_ASIA,
      isRtl: ROOT.IS_RTL,
    }),
    hasMore() {
      return this.postsAmount > 0 && this.postsOffset < this.postsAmount;
    },
    adSlotPlace() {
      return this.isMobile ? 'promo_button_category_mobile' : 'promo_button_category_desktop';
    },
  },
  mounted() {
    this.isMounted = true;
    this.setAlternates({
      alternates: this.alternates,
      url: getProperty(this.meta, 'url', ''),
    });
    this.pushVirtualPageView();
    this.sendChartBeatPageView();
  },
  methods: {
    ...mapActions({
      setAlternates: ROOT.SET_ALTERNATES,
    }),
    async handleLoadMore() {
      return undefined;
    },
    pushVirtualPageView() {
      const { title, url } = this.meta || {};
      const { url: domain } = this.currentLanguage;
      return pushVirtualPageView({
        url: domain + url,
        title,
        category: '',
        tags: [],
      });
    },
    sendChartBeatPageView() {
      if (CRYPTOPEDIA_CATEGORIES.includes(this.$route.name)) {
        this.$chartBeat.sendPageView({
          title: document.title,
          path: this.$route.path,
          sections: this.$route.name,
        });
      } else {
        this.$chartBeat.sendPageView();
      }

      this.$meta().refresh();
    },
  },
  head() {
    const { meta, currentLanguage, posts, alternates, $route } = this;

    return getCategoryPageMeta({
      currentLanguage,
      amphtmlDisabled: this.$route.name === 'market-releases',
      meta,
      posts,
      alternates,
      routeName: $route.name,
    });
  },
};
</script>

<style scoped lang="scss">
@import '~/assets/styles/_vars.scss';

.category-page {
  margin-bottom: 40px;
}
.category-page__row {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  margin-left: -$gutter;
  margin-right: -$gutter;
}
.category-page__content-col {
  width: 100%;
  padding-right: $gutter;
  padding-left: $gutter;
  box-sizing: border-box;
}
.category-page__sidebar-col {
  display: none;
}
.category-page__meta {
  margin-bottom: 24px;
}
.category-page__title {
  position: relative;
  margin: 0;
  padding-bottom: 12px;
  font-size: 1.875rem;
  line-height: 1.1;
  color: #010101;
  font-weight: 600;
}
.category-page__title::after {
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
.category-page__promo-button > * {
  width: 243px;
}
.category-page__description:not(:first-child),
.category-page__posts:not(:first-child) {
  margin-top: 24px;
}
.category-page__submit-link {
  padding: 4px 18px;
  text-decoration: none;
  line-height: 25px;
  color: #ffcd04;
  background-color: #27282d;
  border: 2px solid #27282d;
  border-radius: 4px;
  transition: color 0.15s, background-color 0.15s, border-color 0.15s;
}
.category-page__submit-link:hover {
  color: #27282d;
  background-color: #ffcd04;
  border-color: #ffcd04;
}
.category-page_asia {
  margin-top: 20px;
}
.category-page_has-promo-button .category-page__title-wrap {
  display: flex;
  flex-wrap: wrap;
}
.category-page_has-promo-button .category-page__title {
  margin-bottom: 16px;
  margin-right: 15px;
}
.category-page_rtl.category-page_has-promo-button .category-page__title {
  margin-right: 0;
  margin-left: 15px;
}
.category-page_rtl .category-page__row {
  flex-direction: row-reverse;
}
.category-page_rtl .category-page__meta {
  direction: rtl;
}
.category-page_rtl .category-page__title::after {
  right: 0;
}
@media (min-width: $md) {
  .category-page__content-col {
    width: 66.66666667%;
  }
  .category-page__sidebar-col {
    display: block;
    width: 33.33333333%;
    padding-right: $gutter;
    padding-left: $gutter;
    box-sizing: border-box;
    z-index: 1;
    padding-top: 5px;
  }
  .category-page__description:not(:first-child),
  .category-page__posts:not(:first-child) {
    margin-top: 32px;
  }
  .category-page_has-promo-button .category-page__title {
    margin-bottom: 0;
  }
}
</style>

<style lang="scss">
.category-page__description p {
  font-size: 0.875rem;
  margin: 0;
}
.category-page__description p:not(:first-child) {
  margin-top: 8px;
}
</style>
