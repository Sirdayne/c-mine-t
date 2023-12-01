<template>
  <div
    :id="$route.path.substr(1)"
    :class="['bb-price-index', isRtl && 'bb-price-index_rtl']"
  >
    <div
      v-if="isLocalI18nExist"
      id="price-index-page"
      :class="`container price-index-page-${currentLanguage.short}`"
    >
      <div class="bb-price-index__flex-rows">
        <div :class="['bb-price-index__links-col', isRtl && 'bb-price-index__links-col_rtl']">
          <LinkResolver to="/">
            {{ localI18n.homePage }}
          </LinkResolver>
          /
          <LinkResolver to="/price-indexes">
            {{ localI18n.priceIndexesPage }}
          </LinkResolver>
          /
          <span>{{ localI18n.title }}</span>
        </div>
        <div :class="['bb-price-index__price-col', isRtl && 'bb-price-index__price-col_rtl']">
          <div class="bb-price-index__title-col">
            <span class="bb-price-index__title-icon">
              <span
                v-if="coinLogo"
                class="price-index-title__icon"
                v-html="coinLogo"
              />
              <CoinIcon
                v-else
                :symbol="cryptoSymbol"
                class="price-index-title__icon"
              />
            </span>
            <h1 class="bb-price-index__title">
              {{ localI18n.title }}
            </h1>

            <PriceIndexSummary
              :coin="cryptoSymbol.toUpperCase()"
              :currency="currency"
              :local-i18n="localI18n"
              class="bb-price-index__coinserve"
              @change-currency="changeCurrencyHandler"
            />
            <div
              v-if="isMobile"
              class="bb-price-index__button-stack promo-buttons-stack"
            >
              <AdSlot
                place="promo_button_price_index_overview_mobile"
                class="promo-buttons-stack__button"
                :config="{
                  promoButtonDisclaimerHidden: true,
                }"
              />

              <AdSlot
                place="promo_button_price_index_mobile"
                class="promo-buttons-stack__button"
                :config="{
                  promoButtonDisclaimerHidden: true,
                }"
              />

              <AdSlot
                place="promo_button_price_index_history_mobile"
                class="promo-buttons-stack__button"
                :config="{
                  promoButtonDisclaimerHidden: true,
                }"
              />

              <div
                v-if="disclaimer"
                class="promo-buttons-stack__disclaimer"
              >
                {{ disclaimer }}
              </div>
            </div>
            <CryptoConverter
              v-if="isMobileBreakpoint"
              from-crypto-to-fiat
              :to-coin="fiatValue"
              :from-coin="cryptoSymbol"
              from-price-index
              from-sidebar
              class="bb-price-index__calculator"
              @updateTo="updateToCoinValue"
            />
            <PriceIndexCharts
              v-if="chartVisible"
              :currency="currency"
              :local-i18n="localI18n"
              :is-preset="isPreset"
              :datepicker="datepicker"
              :coin="cryptoSymbol.toUpperCase()"
              class="bb-price-index__coinchart"
              @preset-change="presetChangeHandler"
              @change-from-to="changeFromToHandler"
              @change-currency="changeCurrencyHandler"
              @hide-chart="hideChart"
            />
            <PriceIndexHistory
              :coin="cryptoSymbol.toUpperCase()"
              :currency="currency"
              :local-i18n="localI18n"
              :datepicker="datepicker"
              class="bb-price-index__history-block"
              @preset-change="presetChangeHandler"
            />

            <PriceIndexAbout
              :local-i18n="localI18n"
              class="bb-price-index__about-block"
            />

            <PriceIndexOtherIndexes
              :currency="currency"
              :crypto-symbol="cryptoSymbol"
              :local-i18n="localI18n"
              class="bb-price-index__others-block"
            />

            <PriceIndexGuides
              :posts="posts101"
              :block-title="localI18n.guidesBlockTitle"
              class="bb-price-index__guides-block"
            />
          </div>

          <PriceIndexNews
            :post-data="postData"
            :coin-slug="coinSlug"
            :local-i18n="localI18n"
          />
        </div>
        <div
          v-if="!isMobileBreakpoint"
          class="bb-price-index__sidebar-col affix-sidebar-col"
        >
          <Sidebar :crypto-symbol="cryptoSymbol" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sampleSize from 'lodash/sampleSize';
import { mapActions, mapGetters, mapState } from 'vuex';
import { ROOT, VIEWPORT } from '~/store/types';
import { getThumbnail } from '~/assets/libs/getThumbnail';
import { fetchPriceIndexPageInitialState } from '~/api/modules/priceIndex';
import { DEFAULT_CURRENCY } from '~/app.config';
import { getPriceIndexPageMeta } from '~/assets/helpers/meta';
import LinkResolver from '~/components/Shared/LinkResolver';
import getProperty from '~/assets/libs/getProperty';
import CoinIcon from '~/components/Shared/CoinIcon';
import PriceIndexNews from '~/components/PriceIndex/PriceIndexNews';
import PriceIndexAbout from '~/components/PriceIndex/PriceIndexAbout';
import PriceIndexOtherIndexes from '~/components/PriceIndex/PriceIndexOtherIndexes';
import PriceIndexCharts from '~/components/PriceIndex/PriceIndexCharts';
import PriceIndexSummary from '~/components/PriceIndex/PriceIndexSummary';
import PriceIndexHistory from '~/components/PriceIndex/PriceIndexHistory';
import PriceIndexGuides from '~/components/PriceIndex/PriceIndexGuides';
import { fetchPriceIndexPageMeta, getCoinPriceIndexMetaDescription } from '~/api/modules/priceIndexes';
import CryptoConverter from '~/components/CryptoConverter/CryptoConverter.vue';
import { addDays, endOfDay } from 'date-fns';
import { AdSlot } from '~/features/ads';
import { ref } from 'vue';

const NOW = new Date();
const FROM = addDays(NOW, -7);

const TO = endOfDay(NOW);

export default {
  name: 'PriceIndex',
  components: {
    AdSlot,
    CryptoConverter,
    CoinIcon,
    LinkResolver,
    PriceIndexSummary,
    PriceIndexCharts,
    PriceIndexHistory,
    PriceIndexAbout,
    PriceIndexNews,
    PriceIndexGuides,
    PriceIndexOtherIndexes,
    Sidebar: () => import('~/components/Sidebar/Sidebar'),
  },

  setup() {
    const chartVisible = ref(true);

    const hideChart = () => {
      chartVisible.value = false;
    };
    return {
      chartVisible,
      hideChart,
    };
  },
  async asyncData({ store, app, route, error }) {
    const { state } = store;
    const slug = route.path.split('-price')[0].replace('/', '');
    const options = {
      pathname: route.path,
      languageShort: state.currentLanguage.short,
      apolloTransport: app.$apolloTransport,
    };
    const isEn = store.getters.IS_EN;
    const [{ meta }, description] = await Promise.all([
      fetchPriceIndexPageMeta(options),
      isEn && getCoinPriceIndexMetaDescription(options, slug, error),
    ]);
    if (description) meta.description = description;
    return { meta };
  },

  data: () => ({
    postData: {},
    meta: null,
    localI18n: {},
    lastPost: {},
    alternates: [],
    currency: DEFAULT_CURRENCY,
    isPreset: true,
    coinSlug: null,
    cryptoSymbol: null,
    coinLabel: null,
    guideSlug: null,
    coinLogo: null,
    fiatValue: 'USD',
    period: {
      from: FROM,
      to: TO,
    },
  }),
  async fetch() {
    await this.$store.dispatch('tickers/FETCH_TICKERS_DATA');
    if (this.coins && this.coins.length) {
      const currentCoin = this.coins.find((coin) => coin.url === this.$route.path);

      if (!currentCoin) this.error({ statusCode: 404 });

      const coinTagSlug = currentCoin?.tagSlug;
      const cryptoSymbol = currentCoin?.name.toLowerCase();
      const coinLabel = currentCoin?.label;
      const guideSlug = currentCoin?.guideSlug;
      const coinLogo = currentCoin?.logo;

      const route = this.$route;
      const currentLanguage = this.currentLanguage;
      const initialPageState = await fetchPriceIndexPageInitialState({
        languages: this.languages,
        languageDomain: currentLanguage.domain,
        languageCode: currentLanguage.code,
        timeZone: currentLanguage.timezone,
        pathname: route.path,
        guideSlug,
        coinSlug: coinTagSlug || 'bitcoin',
        cryptoSymbol: cryptoSymbol || 'btc',
        languageShort: currentLanguage.short,
        apolloTransport: this.$apolloTransport,
      });
      this.postData = initialPageState.postData;
      this.localI18n = initialPageState.localI18n;
      this.coinSlug = coinTagSlug || 'bitcoin';
      this.cryptoSymbol = cryptoSymbol || 'btc';
      this.currency = this.selectedCurrency;
      this.coinLabel = coinLabel;
      this.guideSlug = guideSlug;
      this.coinLogo = coinLogo;
    }
  },
  fetchOnServer: true,
  computed: {
    ...mapState({
      currentLanguage: ({ currentLanguage }) => currentLanguage,
      languages: ({ languages }) => languages,
      i18n: ({ i18n }) => i18n,
      banners: ({ banners }) => banners,
    }),
    ...mapState('viewport', {
      isMobile: ({ userDeviceType: { phone } }) => phone,
    }),
    ...mapState('tickers', {
      defaultCurrency: ({ meta: { defaultCurrency } }) => defaultCurrency,
      selectedCurrency: ({ currency }) => currency,
      currencies: ({ currencies }) => currencies,
      coins: ({ meta: { coins } }) => coins,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
    ...mapGetters('viewport', {
      isMobileBreakpoint: VIEWPORT.IS_MOBILE_BREAKPOINT,
    }),
    isLocalI18nExist() {
      return this.localI18n && Object.keys(this.localI18n).length;
    },
    disclaimer() {
      return this.i18n['promo-buttons-group.disclaimer'];
    },
    posts101() {
      return sampleSize(this.guides, 3).map((guide) => ({
        url: new URL(`${this.guideSlug}/${guide.slug}`, this.currentLanguage.url).href,
        title: guide.translate.title,
        img: getThumbnail({ imageUrl: guide.coverImg, width: 850 }),
        thumb: getThumbnail({ imageUrl: guide.coverImg, width: 425 }),
        thumbCaption: guide.coverImgCaption,
      }));
    },
    datepicker() {
      const { period, disabledToDates, disabledFromDates, highlightedFrom, highlightedTo } = this;
      return {
        period,
        disabledToDates,
        disabledFromDates,
        highlightedFrom,
        highlightedTo,
        now: TO,
      };
    },
    disabledToDates() {
      const {
        period: { from },
      } = this;
      return {
        to: from,
        from: TO,
      };
    },
    disabledFromDates() {
      const {
        period: { to },
      } = this;
      return {
        from: to,
      };
    },
    highlightedFrom() {
      const to = this.period.to;
      return {
        dates: [to],
      };
    },
    highlightedTo() {
      const from = this.period.from;
      return {
        dates: [from],
      };
    },
  },
  watch: {
    coins() {
      if (this.coins.length) this.$fetch();
    },
    selectedCurrency() {
      this.fiatValue = this.selectedCurrency;
    },
  },
  created() {
    this.currency = this.selectedCurrency || this.defaultCurrency;
  },
  mounted() {
    this.setAlternates({
      alternates: this.alternates,
      url: getProperty(this.meta, 'url', ''),
    });
    this.fiatValue = this.selectedCurrency;
  },
  methods: {
    ...mapActions({
      setAlternates: ROOT.SET_ALTERNATES,
    }),
    updateToCoinValue(newFiatValue) {
      this.fiatValue = newFiatValue;
    },
    changeFromToHandler({ from, to }) {
      this.period = { from, to };
    },
    changeCurrencyHandler(currency) {
      this.currency = currency;
    },
    presetChangeHandler(status) {
      this.isPreset = status;
    },
  },
  head() {
    const { currentLanguage, languages, meta, alternates, localI18n, currencies, coinLabel, cryptoSymbol, $route } =
      this;
    return getPriceIndexPageMeta({
      currentLanguage,
      languages,
      meta,
      alternates,
      localI18n,
      currencies,
      coinLabel,
      cryptoSymbol,
      routeName: $route.name,
    });
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.bb-price-index {
  padding-bottom: 40px;
  min-height: 100vh;

  &_rtl {
    direction: rtl;
  }

  &__loader {
    text-align: center;
  }
}

.bb-price-index__flex-rows {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
}

.bb-price-index__links-col {
  display: flex;
  margin-top: 16px;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 600;
  opacity: 0.4;
  width: 100%;

  @media (min-width: $sm) {
    margin-top: 8px;
  }
}

.bb-price-index__links-col a,
.bb-price-index__links-col span {
  display: inline-block;
  color: #253137;
  margin-left: 5px;
  margin-right: 5px;
  text-decoration: none;
}

.bb-price-index__links-col a:first-child {
  margin-left: 0;
}

.bb-price-index__links-col_rtl a:first-child {
  margin-right: 0;
  margin-left: 5px;
}

.bb-price-index__links-col a:hover {
  color: #ffbb00;
  text-decoration: underline;
}

.bb-price-index__price-col {
  width: 100%;

  @media (min-width: $md) {
    padding-right: 1.45rem;
    width: calc(66.66666667% - 1rem);
  }
}

.bb-price-index__price-col_rtl {
  padding-right: 0;
  padding-left: 1.45rem;
}

.bb-price-index__sidebar-col {
  width: 100%;

  @media (min-width: $md) {
    width: calc(33.33333333% - 1rem);
  }
}

.bb-price-index__price-col_rtl .bb-price-index__title-icon {
  margin-right: 0;
  margin-left: 8px;
}

.bb-price-index__price-col_rtl .price-index-socials__item {
  margin-right: 0;
  margin-left: 5px;
}

.bb-price-index__title-col {
  min-height: 600px;
  margin-bottom: 12px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.bb-price-index__title-wrp {
  display: flex;
}

.bb-price-index__title-icon {
  width: 42px;
  height: 42px;
  margin-right: 8px;
  flex-shrink: 0;
}

.price-index-title__icon {
  color: #ffc200;
  fill: #ffc200;
  display: block;
  object-fit: contain;
}

.bb-price-index__title {
  font-size: 30px;
  font-weight: 600;
  margin: 0;
  line-height: inherit;
  width: calc(100% - 42px - 8px);
}

.bb-price-index__coinserve,
.bb-price-index__others-block,
.bb-price-index__coinchart,
.bb-price-index__history-block,
.bb-price-index__about-block,
.bb-price-index__description-block,
.bb-price-index__guides-block,
.bb-price-index__posts-by-tag {
  margin-top: 36px;
  width: 100%;
}

.bb-price-index__posts-by-tag .post-preview-list-navigation__btn_top {
  display: none;
}

.bb-price-index__promo-button_mobile {
  margin: 20px 0;
  @media (min-width: $lg) {
    display: none;
  }
}

.bb-price-index__button-stack {
  margin-top: 10px;
}

.bb-price-index__button-stack div div a {
  display: flex !important;
  align-items: center !important;
}

.bb-price-index__button-stack:first-child {
  margin-top: 0;
}

@media (min-width: 630px) {
  .bb-price-index__button-stack {
    display: none;
  }
}

.price-index-page-ar {
  direction: rtl;
}

///
.promo-buttons-stack {
  box-sizing: border-box;
  background: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  padding: 12px;
}

.promo-buttons-stack:empty {
  padding: 0;
}

.promo-buttons-stack__button {
  //display: block !important;
  margin-top: 10px;
}

.promo-buttons-stack__disclaimer {
  color: #92989b;
  font-size: 10px;
  font-weight: 400;
  line-height: 1.7;
  margin-top: 15px;
  text-align: center;
  @media (min-width: $sm) {
    font-size: 12px;
  }
}

.bb-price-index--calculator {
  display: flex;
  @media (min-width: $sm) {
    display: none;
  }
}

.bb-price-index__calculator {
  margin-top: 32px;
}
</style>
