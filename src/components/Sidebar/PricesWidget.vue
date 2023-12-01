<template>
  <div
    class="price-indexes-widget"
    data-testid="price-index-widget"
  >
    <template v-for="item in coins">
      <PricesWidgetItem
        :key="item.id"
        class="price-indexes-widget__item"
        :is-rtl="isRtl"
        :currency="currency"
        :coin="item"
      />
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { ROOT, TICKERS } from '~/store/types';
import { COINS_SIDEBAR } from '~/app.config';
import PricesWidgetItem from './PricesWidgetItem';

export default {
  name: 'PricesWidget',
  components: {
    PricesWidgetItem,
  },
  computed: {
    ...mapState('tickers', {
      currency: ({ currency }) => currency,
      coins: ({ coins, currency, graphs }) => {
        const byCurrency = coins[currency] || [];
        return byCurrency
          .filter(({ name }) => COINS_SIDEBAR.includes(name))
          .map((coin) => ({
            ...coin,
            graph: graphs[`${coin.name}-${currency}`],
          }));
      },
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
  },
  mounted() {
    this.fetchGraphs();
  },
  methods: {
    ...mapActions('tickers', {
      fetchGraphs: TICKERS.FETCH_TICKERS_GRAPHS,
    }),
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.price-indexes-widget {
  display: table;
  width: 100%;
}
.price-indexes-widget__item {
  border-bottom: 1px solid #eceff1;
}
.price-indexes-widget__item:last-child {
  border: 0;
}
</style>
