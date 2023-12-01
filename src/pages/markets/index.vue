<template>
  <div class="container">
    <div
      :class="{ 'markets-page_rtl': isRtl }"
      class="flex flex-wrap justify-between -mx-[10px] pb-10"
    >
      <div
        v-if="isLocalI18nExist"
        class="px-[10px] w-full md:w-[62.5%] markets-page__content"
      >
        <MarketsHeader
          :i18n="localI18n"
          :post="lastPost"
          :currency="currency"
          :selected-coins="populatedCoins"
          @select-currency="handleCurrencySelect"
        />
        <MarketsTrading101
          v-if="trading101Posts.length"
          :i18n="localI18n"
          :posts="trading101Posts"
        />
        <MarketsNews
          :local-i18n="localI18n"
          :postdata="postData"
        />
        <MarketsDisclaimer :i18n="localI18n" />
      </div>
      <div
        class="px-[10px] hidden md:!block w-[31.25%] ml-[6.25%] markets-page__sidebar"
        :class="{ 'md:mr-[6.25%] md:ml-0': isRtl }"
      >
        <Sidebar />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { ROOT, TICKERS } from '~/store/types';
import { fetchMarketsPageInitialState } from '~/api/modules/markets';
import { getAlternateLinks, getMarketsPageMeta } from '~/assets/helpers/meta';
import getProperty from '~/assets/libs/getProperty';
import { fetchCharts } from '~/api/modules/charts';
import { DEFAULT_CURRENCY } from '~/app.config';
import MarketsHeader from '~/components/Markets/MarketsHeader.vue';
import MarketsNews from '~/components/Markets/MarketsNews.vue';
import MarketsTrading101 from '~/components/Markets/MarketsTrading101.vue';
import MarketsDisclaimer from '~/components/Markets/MarketsDisclaimer.vue';
import Sidebar from '~/components/Sidebar/Sidebar';
import { computed, onBeforeUnmount, onMounted, watch, watchEffect } from 'vue';
import { Timer } from '~/assets/libs/Timer';
import { useMeta, useRoute, useStore, defineComponent } from '~/lib/framework';
import { useQuery } from '@urql/vue';
import { SeoMetaQueryDocument } from '~/graphql';
import { getMappedMeta } from '~/assets/helpers/seo';

// once per minute
const MARKETS_HISTORICAL_DATA_POLL_DELAY_MS = 60000;

class MarketsHistoricalDataPoller {
  _pollFn;
  _predicateFn;
  _timer;
  _abortController;
  _initialized;

  constructor(predicateFn, pollFn) {
    this._initialized = false;
    this._pollFn = pollFn;
    this._predicateFn = predicateFn;
    this._timer = new Timer(MARKETS_HISTORICAL_DATA_POLL_DELAY_MS, this._poll.bind(this));
    this._abortController = new AbortController();

    this._abortController.signal.addEventListener('aborted', () => {
      this._timer.cancel();
    });
  }

  _wasAborted() {
    return this._abortController.signal.aborted;
  }

  async _waitPredicate() {
    if (this._predicateFn()) return;

    await new Promise((resolve) => {
      const stopWatch = watch(this._predicateFn, (value) => {
        if (value) {
          stopWatch();
          resolve();
        }
      });
    });
  }

  async _poll() {
    if (!this._initialized) return;
    if (this._wasAborted()) return;

    this._timer.cancel();
    await this._pollFn();
    this._timer.schedule();
  }

  abort() {
    this._abortController.abort();
  }

  trigger() {
    this._poll();
  }

  async init() {
    await this._waitPredicate();
    this._initialized = true;
    await this._poll();
  }
}

export default defineComponent({
  name: 'MarketsPage',
  components: {
    MarketsHeader,
    MarketsNews,
    MarketsTrading101,
    MarketsDisclaimer,
    Sidebar,
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    const isRtl = computed(() => store.getters[ROOT.IS_RTL]);

    const currentLanguage = computed(() => store.state.currentLanguage);
    const languages = computed(() => store.state.languages);

    const pageMetaQuery = useQuery({
      query: SeoMetaQueryDocument,
      variables: {
        short: computed(() => currentLanguage.value.short),
        url: computed(() => route.value.path),
      },
    });

    const meta = computed(() => {
      const localMeta = pageMetaQuery?.data.value?.locale?.seoMeta;
      return getMappedMeta(localMeta);
    });

    const alternates = computed(() => {
      return getAlternateLinks({
        languages: languages.value,
        meta: meta.value,
      });
    });

    watchEffect(() => {
      if (alternates.value.length) {
        store.dispatch(ROOT.SET_ALTERNATES, { alternates: alternates.value, url: meta.value.url });
      }
    });

    useMeta(() => {
      return getMarketsPageMeta({
        currentLanguage,
        languages,
        meta: meta.value,
        alternates: alternates.value,
        routeName: route.value.name,
      });
    });
    return {
      isRtl,
    };
  },
  data() {
    return {
      postData: [],
      marketNewsTag: null,
      trading101Posts: [],
      localI18n: {},
      lastPost: {},
      historicalData: null,
      currency: DEFAULT_CURRENCY,
    };
  },
  async fetch() {
    const route = this.$route;
    const currentLanguage = this.currentLanguage;
    const initialPageState = await fetchMarketsPageInitialState({
      languages: this.languages,
      languageDomain: currentLanguage.domain,
      languageCode: currentLanguage.code,
      timeZone: currentLanguage.timezone,
      pathname: route.path,
      languageShort: currentLanguage.short,
      apolloTransport: this.$apolloTransport,
    });
    this.currency = this.tickersCurrency ?? DEFAULT_CURRENCY;
    this.postData = initialPageState.postData;
    this.trading101Posts = initialPageState.trading101Posts;
    this.localI18n = initialPageState.localI18n;
    this.lastPost = initialPageState.lastPost;
  },
  fetchOnServer: true,

  computed: {
    ...mapState({
      currentLanguage: ({ currentLanguage }) => currentLanguage,
      languages: ({ languages }) => languages,
      i18n: ({ i18n }) => i18n,
    }),
    ...mapState('tickers', {
      tickers: ({ coins }) => coins,
      currencies: ({ currencies }) => currencies,
      tickersCurrency: ({ currency }) => currency,
      coins: ({ meta: { coins } }) => coins,
    }),
    ...mapGetters('tickers', {
      metaCoins: TICKERS.META_COINS,
    }),
    populatedCoins() {
      const { currency, historicalData, tickers } = this;
      const populatedCoins = this.getSelectedCoins();
      return populatedCoins
        .map((coin) => ({
          ...coin,
          charts: getProperty(historicalData, `${coin.name}-${currency}`, null),
          tickers: getProperty(tickers, currency, []).find(({ name }) => name === coin.name),
        }))
        .filter((coin) => coin.tickers);
    },
    isLocalI18nExist() {
      return !!Object.keys(this.localI18n).length;
    },
  },
  mounted() {
    this.sendChartBeatPageView();

    this.initPolling();
  },
  methods: {
    sendChartBeatPageView() {
      this.$chartBeat.sendPageView();
      this.$meta().refresh();
    },
    getSelectedCoins() {
      if (this.coins && this.coins.length) return this.coins.slice(0, 3);

      return [];
    },
    handleCurrencySelect(payload) {
      this.currency = payload;
    },

    async initPolling() {
      const predicateFn = () => this.populatedCoins.length > 0;
      const pollFn = async () => {
        const { currency, populatedCoins } = this;
        const pairs = populatedCoins.map(({ name }) => `${name}-${currency}`);
        const { data, errors } = await fetchCharts({
          pairs,
        });

        if (!errors) {
          this.historicalData = data;
        }
      };

      const poller = new MarketsHistoricalDataPoller(predicateFn, pollFn);

      onBeforeUnmount(() => {
        poller.abort();
      });

      await poller.init();

      watch(
        () => this.currency,
        () => poller._poll()
      );
    },
  },
  head: {},
});
</script>
<style scoped lang="scss">
.markets-page_rtl {
  direction: rtl;
}
</style>
