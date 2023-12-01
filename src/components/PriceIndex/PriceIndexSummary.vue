<template>
  <!-- eslint-disable vue/html-self-closing -->
  <div
    v-if="coinData"
    class="coinserve"
    itemprop="mainContentOfPage"
  >
    <div
      id="widget-summary"
      class="ccc-widget ccc-summary price-index-summary"
      :class="[isRtl && 'price-index-summary_rtl']"
    >
      <h2
        v-if="hasValue(localI18n.summaryBlockTitle)"
        class="ccc-summary__title"
      >
        {{ localI18n.summaryBlockTitle }}
      </h2>
      <div
        v-if="hasValue(localI18n.price_index_texts_market)"
        class="price-index-about__text"
        v-html="localI18n.price_index_texts_market"
      ></div>
      <div class="ccc-wrapper ccc-summary__block">
        <PriceIndexCurrencyTabs
          :with-ad-slot="true"
          :selected-currency="currency"
          @change-currency="(currencyLabel) => $emit('change-currency', currencyLabel)"
        >
          <PriceIndexCurrencyTab
            v-for="item in currencies"
            :key="item.name"
            :tab-currency="item.name"
            :selected-currency="currency"
          >
            <div
              :id="`${item.name}Summary`"
              class="tabContent"
            >
              <div class="summaryData">
                <div class="summaryData__highlights">
                  <table>
                    <caption class="hidden">
                      {{
                        localI18n.summaryBlockTitle
                      }}
                    </caption>
                    <tbody>
                      <tr>
                        <td
                          colspan="2"
                          class="highlights"
                        >
                          <span class="price-value">
                            {{ item.sign + coinData.valueAltGlobal }}
                          </span>
                        </td>
                      </tr>
                      <tr v-if="isContainNumber(coinData.changePercentage)">
                        <td class="change-title">DAY</td>
                        <td
                          class="day-percent"
                          :class="[getClass(coinData.changePercentage)]"
                        >
                          <span class="change-value change-value-day">
                            {{ coinData.changePercentage }}
                          </span>
                        </td>
                      </tr>
                      <tr v-if="isContainNumber(coinData.changeForWeek)">
                        <td class="change-title">WEEK</td>
                        <td
                          class="day-percent"
                          :class="[getClass(coinData.changeForWeek)]"
                        >
                          <span class="change-value change-value-day">
                            {{ coinData.changeForWeekFormatted }}
                          </span>
                        </td>
                      </tr>
                      <tr v-if="isContainNumber(coinData.changeForMonth)">
                        <td class="change-title">MONTH</td>
                        <td
                          class="day-percent"
                          :class="[getClass(coinData.changeForMonth)]"
                        >
                          <span class="change-value change-value-day">
                            {{ coinData.changeForMonthFormatted }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="summaryData__table">
                  <table>
                    <tbody>
                      <tr>
                        <td class="title">Open 24H</td>
                        <td class="value open-value">
                          {{ item.sign + coinData.openFormatted }}
                        </td>
                      </tr>
                      <tr>
                        <td class="title">High 24H</td>
                        <td class="value high-value">
                          {{ item.sign + coinData.highFormatted }}
                        </td>
                      </tr>
                      <tr>
                        <td class="title">Low 24H</td>
                        <td class="value low-value">
                          {{ item.sign + coinData.lowFormatted }}
                        </td>
                      </tr>
                      <tr>
                        <td class="title">Last Price</td>
                        <td class="value last-value">
                          {{ item.sign + coinData.value }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="summaryData__table">
                  <table>
                    <tbody>
                      <tr v-if="isContainNumber(coinData.supply)">
                        <td class="title">Total</td>
                        <td class="value supply-value">
                          {{ coin }}
                          {{ coinData.supplyFormatted.toUpperCase() }}
                        </td>
                      </tr>
                      <tr v-if="isContainNumber(coinData.mktcap)">
                        <td class="title">Mkt. Cap</td>
                        <td class="value market-value">
                          {{ item.sign + coinData.mktcapFormatted.toUpperCase() }}
                        </td>
                      </tr>
                      <tr v-if="isContainNumber(coinData.coinTradeVol)">
                        <td class="title">Vol 24H</td>
                        <td class="value volume-value">
                          {{ coin }}
                          {{ coinData.coinTradeVolFormatted.toUpperCase() }}
                        </td>
                      </tr>
                      <tr v-if="isContainNumber(coinData.volume24hour)">
                        <td class="title">Vol.24H</td>
                        <td class="value volume-to-value">
                          {{ item.sign + coinData.volume24hourFormatted.toUpperCase() }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </PriceIndexCurrencyTab>
        </PriceIndexCurrencyTabs>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { ROOT } from '~/store/types';
import PriceIndexCurrencyTab from '~/components/PriceIndex/PriceIndexCurrencyTab';
import PriceIndexCurrencyTabs from '~/components/PriceIndex/PriceIndexCurrencyTabs';

export default {
  name: 'PriceIndexSummary',
  components: {
    PriceIndexCurrencyTab,
    PriceIndexCurrencyTabs,
  },
  props: {
    coin: {
      type: String,
      default: 'BTC',
    },
    currency: {
      type: String,
      default: 'USD',
    },
    localI18n: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    coinData: null,
  }),
  computed: {
    ...mapState('tickers', {
      currencies: ({ currencies }) => currencies,
      tickerCoins: ({ coins }) => coins,
    }),
    ...mapState({
      currentLanguage: ({ currentLanguage }) => currentLanguage,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
  },
  watch: {
    currency: {
      immediate: true,
      handler(newCurrency) {
        const { tickerCoins, coin, currency: initialCurrency } = this;
        const currency = newCurrency || initialCurrency;
        this.coinData = tickerCoins[currency].find(({ name }) => name === coin);
      },
    },
    tickerCoins(coins) {
      const { coin, currency } = this;
      this.coinData = coins[currency].find(({ name }) => name === coin);
    },
  },
  methods: {
    hasValue(value) {
      return value.indexOf('price_index') === -1 && value.indexOf('price.index') === -1 && !!value.trim();
    },
    getClass(value) {
      const {
        currentLanguage: { short },
      } = this;

      let negativeClass = 'negative';
      let positiveClass = 'positive';
      if (short === 'cn' || short === 'hk') {
        negativeClass = 'positive';
        positiveClass = 'negative';
      }
      if (parseFloat(value) > 0) {
        return positiveClass;
      }
      if (parseFloat(value) < 0) {
        return negativeClass;
      }
      return false;
    },
    isContainNumber(value) {
      const parsed = parseFloat(value);
      return !isNaN(parsed);
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

$gutter: 20px;

.ccc-summary__title {
  margin: 0;
  color: #253137;
  font-size: 15px;
  font-weight: 700;
  @media (min-width: $sm) {
    font-size: 22px;
  }
}

.ccc-summary__block {
  &:not(:first-child) {
    margin-top: 16px;
  }
}

.coinserve {
  width: 100%;

  #widget-summary {
    display: block;

    .ccc-wrapper {
      background: rgb(255, 255, 255);
      border: 0;
      padding: 15px;
      border-radius: 0;
      color: rgb(0, 0, 0);
      box-shadow: rgb(221, 221, 221) 0 0 10px;

      .tabContainer {
        display: block;
        overflow: hidden;

        .tabLinksCointainer {
          background: #fafafa;
          display: inline-block;
          text-align: center;
          user-select: none;

          .tablinks {
            vertical-align: top;
            padding: 0 5px;
            margin: 0 5px;
            height: 40px;
            text-align: center;
            display: inline-block;
            cursor: pointer;
            font-size: 10px;
            font-weight: bold;
            color: black;
            text-decoration: none;

            &.active {
              background-color: #eceff1;
              box-shadow: 6px 1px 13px -5px rgba(0, 0, 0, 0.2);
            }

            &:first-child {
              margin-left: 0;
            }

            &:last-child {
              margin-right: 0;
            }
          }

          &__title {
            line-height: 40px;
          }
        }
      }

      .tabContent {
        font-size: 16px;
        line-height: 23px;
        overflow: hidden;
        display: block;
      }
    }
  }
}

.summaryData {
  margin-top: 32px;

  table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
  }

  .price-value {
    font-weight: 400;
    font-size: 40px;
    white-space: nowrap;
  }

  .change-title {
    color: rgb(70, 90, 101);
    font-weight: 400;
    font-size: 16px;
  }

  .negative {
    color: rgb(207, 89, 111);
  }

  .positive {
    color: rgb(15, 199, 62);
  }

  .change-value {
    font-weight: 400;
    font-size: 16px;
  }

  .highlights {
    padding: 24px 0;
  }

  .day-percent,
  .week-percent,
  .month-percent {
    text-align: right;
    direction: ltr;
  }
}

.summaryData__table tr:nth-of-type(even) td {
  background: rgba(245, 166, 35, 0.1);
}

.summaryData__table td {
  padding: 10px;
}

.summaryData__table .title {
  font-size: 12px;
  color: #253137;
  white-space: nowrap;
}

.summaryData__table .value {
  font-size: 12px;
  font-weight: 700;
  text-align: right;
}

.summaryData__highlights td {
  padding: 2% 0;
}

@media (min-width: $sm) {
  .summaryData__highlights {
    flex: 1.2 0 0;
    padding: 0 2%;
  }
  .summaryData__table {
    flex: 1 0 0;
    border-left: 1px solid #afbdc4;
    padding: 8px 2%;
  }
  .summaryData__table td {
    padding: 5% 5%;
  }
  .summaryData {
    display: flex;
    margin: 32px -2% 0;
  }
}

@media (min-width: $md) and (max-width: $lg - 1) {
  .summaryData .price-value {
    font-size: 32px;
  }
  .summaryData__table td {
    padding: 5% 3%;
  }
  .summaryData__highlights {
    padding: 0 1%;
  }
  .summaryData__table {
    padding: 8px 1%;
  }
  .summaryData {
    margin: 32px -1% 0;
  }
}
</style>
