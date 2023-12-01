<template>
  <div
    :class="[
      currency && `price-indexes-list_currency_${currency}`,
      language && `price-indexes-list_language_${language}`,
    ]"
    class="price-indexes-list"
  >
    <template v-if="language !== 'jp'">
      <PriceIndexesListItem
        v-for="(coin, index) in mappedCoins"
        :key="index"
        :url="coin.url"
        :currency="currency"
        :currency-sign="currencySign"
        :language="language"
        :symbol-name="coin.label"
        :symbol="coin.name"
        :symbol-svg="coin.logo"
        :price="coin.price"
        :change-percent="coin.changePercent"
        :ssr-charts-graphic="getChartSVG(coin.name, currency)"
      />
    </template>
    <template v-else>
      <JapanPriceIndexesListItem
        v-for="(coin, index) in mappedCoins"
        :key="index"
        :url="coin.url"
        :currency="currency"
        :currency-sign="currencySign"
        :language="language"
        :symbol-name="coin.label"
        :symbol="coin.name"
        :price="coin.price"
        :market-cap="coin.marketCap"
        :vol24-hour="coin.vol24Hour"
        :change-percent="coin.changePercent"
        :history="history"
      />
    </template>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import { fetchTickersGraphs } from '~/api/modules/tickers';
import PriceIndexesListItem from '~/components/PriceIndexes/PriceIndexesListItem';
import JapanPriceIndexesListItem from '~/components/PriceIndexes/JapanPriceIndexesListItem';
import { RATES_HISTORY_URL } from '~/app.config';
import { addDays, format } from 'date-fns';

export default {
  name: 'PriceIndexesList',
  components: {
    PriceIndexesListItem,
    JapanPriceIndexesListItem,
  },
  props: {
    currency: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    coins: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    currencySign: '$',
    charts: [],
    history: {},
  }),
  computed: {
    ...mapState('tickers', {
      tickerCoins: ({ coins }) => coins,
      currencies: ({ currencies }) => currencies,
    }),
    mappedCoins() {
      const { coins } = this;
      return coins
        .map((coin) => {
          return {
            ...coin,
            price: this.extractVal(coin, 'valueAltGlobal'),
            changePercent: this.extractVal(coin, 'changePercentage'),
            marketCap: this.extractVal(coin, 'mktcapFormatted'),
            vol24Hour: this.extractVal(coin, 'volume24hourFormatted'),
          };
        })
        .filter((coin) => Boolean(coin.price))
        .sort((a, b) => a.priority - b.priority);
    },
  },
  watch: {
    currency: {
      immediate: true,
      handler(currency) {
        this.currencySign = this.currencies.find((c) => c.name === currency)?.sign;

        if (this.language === 'jp') {
          this.getHistoryData();
        }
      },
    },
  },
  async created() {
    if (this.language !== 'jp') {
      // need charts from server only for non jp version
      const { data } = await fetchTickersGraphs({
        graphType: 'main',
        languageShort: this.language,
        apolloTransport: this.$apolloTransport,
      });
      this.charts = data;
    }
  },
  methods: {
    historyRequestOptions() {
      const instruments = this.mappedCoins.map((c) => `${c.name}-${this.currency}`).join(',');
      const isJapan = this.language === 'jp';

      const daysRevert = isJapan ? -1 : -7;
      const period = isJapan ? 'M15' : 'H1';
      const limit = isJapan ? 24 * 4 : 168;

      const from = format(addDays(new Date(), daysRevert), 't');
      const to = format(new Date(), 't');

      return {
        instruments,
        period,
        limit,
        from,
        to,
      };
    },
    historyArrayToObject(data) {
      const historyData = {};
      if (!Object.keys(data).length) return historyData;
      // eslint-disable-next-line
      for (const x in data) {
        historyData[x] = data[x][this.currency]?.INDEX;
      }
      return historyData;
    },
    async getHistoryData() {
      try {
        const { instruments, period, limit, from, to } = this.historyRequestOptions();
        const { data, errors } = await axios({
          method: 'get',
          url: RATES_HISTORY_URL,
          params: {
            pairs: instruments,
            period,
            time_from: from,
            time_till: to,
            limit,
          },
        });
        if (errors) {
          console.warn("Can't load history data");
          return;
        }
        const historydata = this.historyArrayToObject(data.data);
        this.history = historydata;
      } catch (e) {
        console.warn(e);
      }
    },
    extractVal(coin, prop) {
      const { tickerCoins } = this;
      const currencyCoins = tickerCoins[this.currency];
      const currencyCoin = currencyCoins.find((c) => c.id === coin.id);
      return currencyCoin ? currencyCoin[prop] : '';
    },
    getChartSVG(coin, currency) {
      return this.charts[`${coin}-${currency}`] || '';
    },
  },
};
</script>

<style scoped lang="scss">
@import '~/assets/styles/_vars.scss';

.price-indexes-list__item:not(:first-child) {
  margin-top: 8px;
}
.price-indexes-list_language_jp {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -8px;
}
@media (max-width: 480px) {
  .price-indexes-list_language_jp {
    margin: 0;
  }
}
@media (min-width: $sm) {
  .price-indexes-list__item:not(:first-child) {
    margin-top: 16px;
  }
}
</style>
