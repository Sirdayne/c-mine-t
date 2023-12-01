<template>
  <div class="price-indexes">
    <div class="price-indexes__wrap">
      <div
        :class="[
          `price-indexes_language_${currentLanguage.short}`,
          `price-indexes_currency_${curr}`,
          'price-indexes_currency_promo-button',
        ]"
        class="price-indexes"
      >
        <template v-if="currentLanguage.short !== 'jp'">
          <div class="price-indexes__row price-indexes__row_type_wrap">
            <div class="price-indexes__col price-indexes__col_type_content">
              <div class="price-indexes__row price-indexes__row_type_title">
                <div class="price-indexes__col price-indexes__col_page-header">
                  <h1 class="b-title price-indexes__page-title default-parent__block default-parent__block_title">
                    {{ i18n.priceIndexesPageTitle }}
                  </h1>
                  <CurrencySelect
                    v-if="hasCoins"
                    :language="currentLanguage.short"
                    :currency="curr"
                    class="price-indexes__currency-selector"
                  />
                  <div class="price-indexes__promo__wrap">
                    <AdSlot
                      :place="adSlotPlace"
                      class="price-indexes__promo-button"
                    />
                  </div>
                </div>
              </div>
              <div class="price-indexes__row price-indexes__row_type_indexes">
                <div class="price-indexes__col price-indexes__col_type_indexes">
                  <PriceIndexesList
                    v-if="hasCoins"
                    :currency="curr"
                    :language="currentLanguage.short"
                    :coins="coins"
                  />
                </div>
              </div>
              <template v-if="posts && posts.length">
                <div class="price-indexes__row price-indexes__row_type_sub-title">
                  <div class="price-indexes__col price-indexes__col_type_sub-title">
                    <div class="price-indexes__sub-title">
                      {{ i18n.blockNewsTitle }}
                    </div>
                  </div>
                </div>
                <div class="price-indexes__row price-indexes__row_type_posts">
                  <div class="price-indexes__col price-indexes__col_type_posts">
                    <PostsListing
                      class="price-indexes__posts"
                      theme="double-column"
                      :pending="postsLoading"
                      :has-more="hasMorePosts"
                      :posts="posts"
                      :i18n="i18n"
                      @load-more="handleLoadMore"
                    />
                  </div>
                </div>
              </template>
            </div>
            <div
              v-if="!isMounted || !isMobileBreakpoint"
              class="price-indexes__col price-indexes__col_type_sidebar affix-sidebar-col"
            >
              <Sidebar />
            </div>
          </div>
        </template>
        <template v-else>
          <div class="price-indexes__row price-indexes__row_type_wrap">
            <div class="price-indexes__col">
              <div class="price-indexes__row price-indexes__row_type_title">
                <div class="price-indexes__col price-indexes__col_type_title">
                  <h1 class="b-title price-indexes__page-title default-parent__block default-parent__block_title">
                    {{ i18n.priceIndexesPageTitle }}
                  </h1>
                </div>
                <client-only>
                  <div
                    v-if="hasCoins"
                    class="price-indexes__col price-indexes__col_type_currency"
                  >
                    <CurrencySelect
                      :language="currentLanguage.short"
                      :currency="curr"
                      theme="jp"
                      class="price-indexes__block"
                    />
                  </div>
                </client-only>
              </div>
              <template v-if="hasCoins">
                <div class="price-indexes__row price-indexes__row_type_indexes">
                  <div class="price-indexes__col price-indexes__col_type_indexes">
                    <PriceIndexesList
                      :currency="curr"
                      :language="currentLanguage.short"
                      :coins="coins"
                    />
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="price-indexes__row price-indexes__row_type_wrap">
            <div class="price-indexes__col price-indexes__col_type_content">
              <template v-if="posts && posts.length">
                <div class="price-indexes__row price-indexes__row_type_sub-title">
                  <div class="price-indexes__col price-indexes__col_type_sub-title">
                    <div class="price-indexes__sub-title">
                      {{ i18n.blockNewsTitle }}
                    </div>
                  </div>
                </div>
                <div class="price-indexes__row price-indexes__row_type_posts">
                  <div class="price-indexes__col price-indexes__col_type_posts">
                    <PostsListing
                      theme="main"
                      :pending="postsLoading"
                      :has-more="hasMorePosts"
                      :posts="posts"
                      :i18n="i18n"
                      @load-more="handleLoadMore"
                    />
                  </div>
                </div>
              </template>
            </div>
            <div
              v-if="!isMounted || !isMobileBreakpoint"
              class="price-indexes__col price-indexes__col_type_sidebar affix-sidebar-col"
            >
              <Sidebar />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { ROOT, VIEWPORT, TICKERS } from '~/store/types';
import getProperty from '~/assets/libs/getProperty';
import PriceIndexesList from '~/components/PriceIndexes/PriceIndexesList';
import CurrencySelect from '~/components/PriceIndexes/CurrencySelect';
import PostsListing from '~/components/PostsListing/PostsListing';
import { fetchPriceIndexesPageData, fetchPriceIndexPageMeta } from '~/api/modules/priceIndexes';
import { fetchMainPosts } from '~/api/modules/main';
import { getPriceIndexPageMeta } from '~/assets/helpers/meta';
import { AdSlot } from '~/features/ads';

export default {
  name: 'PriceIndexes',
  components: {
    AdSlot,
    PostsListing,
    PriceIndexesList,
    CurrencySelect,
    Sidebar: () => import('~/components/Sidebar/Sidebar'),
  },
  async asyncData({ store, app, route }) {
    const { state } = store;
    const [initialPageData, meta] = await Promise.all([
      fetchPriceIndexesPageData({
        languages: state.languages,
        pathname: route.path,
        languageDomain: state.currentLanguage.domain,
        languageCode: state.currentLanguage.code,
        timeZone: state.currentLanguage.timezone,
        languageShort: state.currentLanguage.short,
        apolloTransport: app.$apolloTransport,
      }),
      fetchPriceIndexPageMeta({
        pathname: route.path,
        languageShort: state.currentLanguage.short,
        apolloTransport: app.$apolloTransport,
      }),
      store.dispatch(`tickers/${TICKERS.FETCH_TICKERS_DATA}`),
    ]);
    return { ...initialPageData, ...meta };
  },
  data: () => ({
    meta: null,
    isMounted: false,
    alternates: [],
    postsLoading: false,
    hasMorePosts: true,
  }),
  computed: {
    ...mapState({
      currentLanguage: ({ currentLanguage }) => currentLanguage,
      languages: ({ languages }) => languages,
      i18n: ({ i18n }) => i18n,
    }),
    ...mapState('viewport', {
      isMobile: ({ userDeviceType: { phone } }) => phone,
    }),
    ...mapState('tickers', {
      defaultCurrency: ({ meta: { defaultCurrency } }) => defaultCurrency,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
    ...mapGetters('viewport', {
      isMobileBreakpoint: VIEWPORT.IS_MOBILE_BREAKPOINT,
    }),
    ...mapGetters('tickers', {
      coins: TICKERS.META_COINS,
      curr: TICKERS.GET_CURRENCY_SELECTED,
    }),
    hasCoins() {
      return this.coins?.length > 0 ?? false;
    },
    adSlotPlace() {
      return this.isMobile ? 'promo_button_price_indexes_mobile' : 'promo_button_price_indexes_desktop';
    },
  },
  mounted() {
    this.setAlternates({
      alternates: this.alternates,
      url: getProperty(this.meta, 'url', ''),
    });
  },
  methods: {
    ...mapActions({
      setAlternates: ROOT.SET_ALTERNATES,
    }),
    async handleLoadMore() {
      this.postsLoading = true;
      const {
        data: { posts, hasMorePosts },
      } = await fetchMainPosts({
        offset: this.posts.length,
        languageDomain: this.currentLanguage.domain,
        languageCode: this.currentLanguage.code,
        timeZone: this.currentLanguage.timezone,
        languageShort: this.currentLanguage.short,
        apolloTransport: this.$apolloTransport,
      });
      this.postsLoading = false;
      this.posts = this.posts.concat(posts);
      this.postsOffset += posts.length;
      this.hasMorePosts = hasMorePosts;
    },
  },
  head() {
    const { currentLanguage, languages, meta, alternates, $route } = this;
    return getPriceIndexPageMeta({
      currentLanguage,
      languages,
      meta,
      alternates,
      routeName: $route.name,
    });
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.price-indexes__col_page-header div:nth-child(2) {
  margin: 8px auto 0;
  @media screen and (min-width: $xs) {
    margin: 0 0 0 auto;
    max-height: 40px;
  }
  @media screen and (min-width: $xs--tablet) {
    order: 3;
    margin: 0;
  }
  @media screen and (min-width: $sm) {
    order: 3;
    margin: 0;
  }
}
.price-indexes__col_page-header div:nth-child(3) {
  margin: 8px auto 0;
  width: 100%;
  @media (min-width: $xs--tablet) {
    width: unset;
  }
  @media screen and (min-width: $xs--tablet) {
    order: 2;
    margin: 0;
    margin-left: auto;
    max-width: 380px;
    margin-right: 16px;
  }
  @media screen and (min-width: $sm) {
    order: 2;
    margin: 0;
    margin-left: auto;
    margin-right: 16px;
    max-width: 380px;
    & div {
      & div {
        display: block;
      }
    }
  }
  @media (min-width: $md) {
    margin-right: 3px;
  }
  @media (min-width: $lg) {
    margin-right: 16px;
  }
}
.price-indexes__currency-selector {
  @media screen and (min-width: $sm) {
    margin: 0 0 0 auto;
    order: 3;
  }
}
.price-indexes {
  margin: 15px 0;
}
.price-indexes__wrap {
  margin-right: auto;
  margin-left: auto;
  padding-left: 10px;
  padding-right: 10px;
}
.price-indexes__row {
  margin-left: -10px;
  margin-right: -10px;
}
.price-indexes__row:before,
.price-indexes__row:after {
  content: ' ';
  display: table;
}
.price-indexes__row:after {
  clear: both;
}
.price-indexes__row:not(:first-child) {
  margin-top: 15px;
}
.price-indexes__row_type_wrap,
.price-indexes__row_type_title {
  display: flex;
}
.price-indexes__row_type_title {
  align-items: center;
}
.price-indexes__col {
  width: 100%;
  min-height: 1px;
  padding-left: 10px;
  padding-right: 10px;
}
.price-indexes__col_type_content {
  position: relative;
  min-height: 1px;
  padding-left: 10px;
  padding-right: 10px;
}
.price-indexes__col_type_title {
  position: relative;
  float: left;
  width: 75%;
  min-height: 1px;
  padding-left: 10px;
  padding-right: 10px;
}
.price-indexes__col_type_sub-title {
  box-sizing: border-box;
}
.price-indexes__col_type_indexes {
  width: initial;
}
.price-indexes__col_type_posts {
  width: initial;
  & .posts-listing__list {
    @media (min-width: $xs--tablet) {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }
    @media (min-width: $sm) {
      display: flex;
    }
  }
}
.price-indexes__col_type_currency {
  position: relative;
  float: left;
  width: 25%;
  min-height: 1px;
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  justify-content: flex-end;
}
.price-indexes__col_type_sidebar {
  position: relative;
  min-height: 1px;
  padding-left: 10px;
  padding-right: 10px;
  display: none;
}
.price-indexes__sub-title {
  color: #253137;
  font-size: 18px;
  line-height: 1.2;
  font-weight: 900;
}
.price-indexes_language_ar {
  direction: rtl;
}
.price-indexes__col_page-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  @media (min-width: $md) {
    display: grid;
    grid-template-columns: 1fr 1fr 77px;
    & .currency-select {
      justify-self: flex-end;
    }
  }
}
.price-indexes__page-title {
  flex-grow: 1;
  margin: 0 16px 0 0;
  color: #253137;
  font-weight: 900;
  font-size: 22px;
  line-height: 1.2;
  width: 60%;
  @media (min-width: $xs--tablet) {
    width: initial;
  }
  @media (min-width: $md) {
    margin: 0;
  }
}
.price-indexes__promo-button {
  margin: 0 !important;
}
.price-indexes__currency-selector {
  @media (min-width: 390px) {
    margin-left: auto;
  }
}
.price-indexes_language_ar .price-indexes__page-title {
  margin: 0 30px 0 0;
}
.price-indexes_language_ar .price-indexes__currency-selector {
  margin-left: 0;
  margin-right: auto;
}
body.jp .price-indexes__col_type_indexes {
  padding: 0;
}
.b-title {
  color: #253137;
  font-weight: 900;
  font-size: 22px;
  line-height: 1.2;
}
@media (min-width: 630px) {
  .price-indexes__page-title {
    width: auto;
    flex-grow: initial;
  }
}
@media (min-width: $sm) {
  .b-title {
    font-size: 36px;
  }
}
@media (min-width: $md) {
  .price-indexes {
    margin: 0 0 30px;
  }
  .price-indexes__wrap {
    width: 740px;
  }
  .price-indexes__row:not(:first-child) {
    margin-top: 30px;
  }
  .price-indexes__sub-title {
    font-size: 26px;
  }
}
@media (min-width: $md) {
  .price-indexes__wrap {
    width: 960px;
  }
  .price-indexes__col_type_content {
    float: left;
    width: 66.66666667%;
  }
  .price-indexes__col_type_sidebar {
    float: left;
    width: 33.33333333%;
    display: block;
  }
}
@media (min-width: $lg) {
  .price-indexes__wrap {
    width: 1160px;
  }
}
</style>
