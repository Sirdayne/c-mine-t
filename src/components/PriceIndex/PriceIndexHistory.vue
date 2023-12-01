<!-- eslint-disable vue/html-self-closing vue/no-mutating-props-->
<template>
  <div
    :class="[isRtl && 'price-index-history_rtl', 'price-index-history_has-button']"
    class="price-index-history"
  >
    <h2
      v-if="hasValue(localI18n.historyBlockTitle)"
      class="price-index-history__title"
    >
      {{ localI18n.historyBlockTitle }}
    </h2>

    <div
      v-if="hasValue(localI18n.price_index_texts_history)"
      class="price-index-about__text price-index-history__text"
      v-html="localI18n.price_index_texts_history"
    ></div>

    <div
      v-if="!loading && historyExist"
      class="price-index-history__wrap"
    >
      <div
        v-if="!loading"
        class="price-index-history__row price-index-history__row_button"
      >
        <div class="price-index-history__block">
          <div class="price-index-history__label">
            {{ localI18n.historyFromLabel }}
          </div>
          <ClientOnly>
            <Datepicker
              v-model="datepicker.period.from"
              :format="datepickerValueFormatter"
              :disabled-dates="datepicker.disabledFromDates"
              :highlighted="datepicker.highlightedFrom"
              :language="datepickerLocale"
              data-gtm-locator="markets_priceindex_clickon_history_data_from"
              class="price-index-history__datepicker"
              @selected="selectedDateHandler"
            />
          </ClientOnly>
        </div>
        <div class="price-index-history__block">
          <div class="price-index-history__label">
            {{ localI18n.historyToLabel }}
          </div>
          <ClientOnly>
            <Datepicker
              v-model="datepicker.period.to"
              :format="datepickerValueFormatter"
              :disabled-dates="datepicker.disabledToDates"
              :highlighted="datepicker.highlightedTo"
              :language="datepickerLocale"
              data-gtm-locator="markets_priceindex_clickon_history_data_to"
              class="price-index-history__datepicker"
              @selected="selectedDateHandler"
            />
          </ClientOnly>
        </div>
        <div class="price-index-history__block price-index-history__block_button">
          <AdSlot
            :place="adSlotPlace"
            class="price-index-history__promo-button"
          />
        </div>
      </div>
      <table
        v-if="!loading"
        class="price-index-history__table"
      >
        <caption class="hidden">
          {{
            localI18n.historyBlockTitle
          }}
        </caption>
        <thead>
          <tr>
            <th
              v-for="(item, index) in theadList"
              :key="index"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(historyDay, index) in readyHistory"
            :key="index"
          >
            <td>{{ historyDay.time }}</td>
            <td>{{ historyDay.weighted }}</td>
            <td>
              <span class="price-index-history__full">
                {{ historyDay.volumeQuote }}
              </span>
              <span class="price-index-history__shirt">
                {{ historyDay.volumeQuoteNumeral }}
              </span>
            </td>
            <td
              :class="[
                historyDay.percentChange.includes('+') && `price-index-history__positive`,
                historyDay.percentChange.includes('-') && `price-index-history__negative`,
              ]"
            >
              {{ historyDay.percentChange }}
            </td>
          </tr>
        </tbody>
      </table>
      <div
        v-if="loading"
        class="price-index-history__loading"
      >
        {{ loadingText }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import numeral from 'numeral';
import { mapGetters, mapState } from 'vuex';
import * as DatepickerLocales from 'vuejs-datepicker/dist/locale';
import { fetchNewHistoryWithCancelation } from '~/api/modules/priceIndex';
import { ROOT, TICKERS } from '~/store/types';
import sleep from '~/assets/libs/sleep';
import { formatPercentage, formatPrice, getCoinDecimalsByCurrency } from '~/assets/helpers/tickers';
import { addDays, differenceInDays, endOfDay, format, fromUnixTime, getTime, intlFormat, startOfDay } from 'date-fns';
import { localeFormatter } from '~/assets/libs/dateTimeUtils';
import { AdSlot } from '~/features/ads';

export default {
  name: 'PriceIndexHistory',
  components: {
    AdSlot,
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
    datepicker: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    rawHistory: [],
    readyHistory: [],
    errorMessage: '',
    loading: true,
    cancelToken: null,
    historyExist: true,
  }),
  computed: {
    ...mapState('tickers', {
      currencies: ({ currencies }) => currencies,
    }),
    ...mapState({
      currentLanguage: ({ currentLanguage }) => currentLanguage,
      i18n: ({ i18n }) => i18n,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
    ...mapGetters('tickers', {
      coins: TICKERS.META_COINS,
    }),
    ...mapState('viewport', {
      isMobile: ({ userDeviceType: { phone } }) => phone,
    }),
    datepickerLocale() {
      if (this.currentLanguage.short === 'pt') {
        return DatepickerLocales.ptBR;
      }
      return DatepickerLocales[localeFormatter(this.currentLanguage.short)];
    },
    loadingText() {
      const {
        errorMessage,
        localI18n: { historyLoadingLabel },
      } = this;
      return errorMessage.length ? errorMessage : historyLoadingLabel;
    },
    limitInDays() {
      const from = this.datepicker.period.from;
      const to = this.datepicker.period.to;
      return this.calculateLimitInDays(from, to);
    },
    requestFromTill() {
      const from = this.datepicker.period.from;
      const to = this.datepicker.period.to;
      return {
        time_from: parseInt(format(getTime(startOfDay(addDays(from, -1))), 't'), 10),
        time_till: parseInt(format(getTime(endOfDay(to)), 't'), 10),
      };
    },
    currencySymbol() {
      return this.currencies.find((c) => c.name === this.currency)?.sign || '';
    },
    languageId() {
      return parseInt(this.currentLanguage.id);
    },
    instruments() {
      return `${this.coin}${this.currency}`;
    },
    theadList() {
      const { localI18n } = this;
      return [
        localI18n.historyDateLabel,
        localI18n.historyPriceLabel,
        localI18n.historyVolumeLabel,
        localI18n.historyChangeLabel,
      ];
    },
    adSlotPlace() {
      return this.isMobile ? 'promo_button_price_index_history_mobile' : 'promo_button_price_index_history_desktop';
    },
  },
  watch: {
    'datepicker.period': {
      handler() {
        this.attempt(this.loadHistory);
      },
      deep: true,
    },
    currency() {
      this.attempt(this.loadHistory);
    },
  },
  mounted() {
    this.attempt(this.loadHistory);
  },
  methods: {
    hasValue(value) {
      return value.indexOf('price_index') === -1 && value.indexOf('price.index') === -1 && !!value.trim();
    },
    datepickerValueFormatter(date) {
      return intlFormat(
        date,
        {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        },
        { locale: localeFormatter(this.currentLanguage.short) }
      );
    },
    selectedDateHandler() {
      this.$emit('preset-change', false);
    },
    calculateLimitInDays(from, to) {
      // +1 because before we took day with 23:59 hours and Math.round it
      return differenceInDays(to, from) + 1;
    },
    async loadHistory() {
      this.errorMessage = '';
      this.loading = true;
      this.cancelCurrentRequest();
      const { limitInDays: limit, coin, currency } = this;
      const { fetch, cancel } = fetchNewHistoryWithCancelation({
        coin,
        currency,
        period: 'D1',
        ...this.requestFromTill,
        limit: limit + 1,
      });
      this.cancelToken = cancel;
      const { status, data, error, thrown } = await fetch();

      if (thrown) {
        return Promise.resolve({ status, error, thrown });
      }
      if (status === 'error' && error.length) {
        this.errorMessage = error;
        return Promise.resolve({ status, error });
      }
      if (status === 'success' && !data.length) {
        /**
         * Hide chart if no coin data
         * */
        this.historyExist = false;
      }
      if (status === 'success' && data.length) {
        this.rawHistory = data;
        this.readyHistory = this.prepareNewHistoryForRender(this.rawHistory);
        this.loading = false;
      }
      return Promise.resolve({ status, error });
    },
    prepareNewHistoryForRender(rawHistory) {
      const history = rawHistory.sort((a, b) => {
        return b.t - a.t;
      });
      return history
        .map((item, index, arr) => {
          const {
            currencySymbol,
            currency,
            coin,
            currentLanguage: { code: languageCode },
          } = this;
          let newData = {};
          const prevDay = arr[index + 1];
          if (prevDay) {
            const formatPriceString = (value = '') => {
              if (this.languageId === 23 || this.languageId === 5) {
                return value
                  .replace(/\./g, 'PLACEHOLDER')
                  .replace(/,/, '.')
                  .replace(/PLACEHOLDER/, ',');
              }
              return value;
            };

            const change24hr = ((item.p - prevDay.p) / item.p) * 100;
            const percentChange = formatPercentage(change24hr, {
              defaultValue: parseFloat(change24hr).toFixed(2),
              languageCode,
            });

            const weighted = formatPrice(item.p, {
              defaultValue: item.p,
              forceDecimals: this.getDecimalsFromOptions(),
              languageCode,
              currency,
              coin,
            });

            const volumeQuote = formatPrice(item.q, {
              defaultValue: item.q,
              forceDecimals: 0,
              languageCode,
              currency,
              coin,
            });

            newData = {
              percentChange,
              volumeQuoteNumeral: formatPriceString(numeral(item.q).format('0.00 a')),
              volumeQuote: `${currencySymbol}${volumeQuote}`,
              weighted: `${currencySymbol}${weighted}`,
              time: this.dateFromSeconds(item.t),
            };
          }
          return {
            ...item,
            ...newData,
          };
        })
        .slice(0, rawHistory.length - 1);
    },
    async attempt(fn) {
      let isSuccess = false;
      let isCanceled = false;
      while (!isSuccess && !isCanceled) {
        const isOnlineExist = 'onLine' in window.navigator;
        const isOnline = isOnlineExist ? window.navigator.onLine : true;
        if (isOnline) {
          // eslint-disable-next-line no-await-in-loop
          const { status, thrown } = await fn();
          if (axios.isCancel(thrown)) {
            isCanceled = true;
            return;
          }
          isSuccess = status === 'success';
          if (!isSuccess) {
            // eslint-disable-next-line no-await-in-loop
            await sleep(500);
          }
        } else {
          // eslint-disable-next-line no-await-in-loop
          await sleep(2000);
        }
      }
    },
    cancelCurrentRequest() {
      if (typeof this.cancelToken !== 'function') {
        return;
      }
      this.cancelToken();
    },
    getDecimalsFromOptions() {
      const { coins, coin, currency } = this;
      const currentCoin = coins.find(({ name }) => name === coin);
      const decimals = getCoinDecimalsByCurrency({
        currency,
        coin: currentCoin,
      });
      return decimals;
    },
    dateFromSeconds(timestamp) {
      return intlFormat(
        fromUnixTime(timestamp),
        {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        },
        { locale: localeFormatter(this.currentLanguage.short) }
      );
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';
@import '~/assets/styles/_mixins.scss';

.price-index-history__table {
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
}

.price-index-history_rtl th {
  text-align: right;
}

.price-index-history__table th {
  font-size: 12px;
  padding: 5px 8px;
  font-weight: normal;
  border-bottom: 1px solid #afbdc4;
  text-align: left;
}

.price-index-history__table td {
  font-size: 10px;
  padding: 5px 8px;
  box-sizing: border-box;
}

.price-index-history__table tr:nth-of-type(odd) td {
  background: rgba(245, 166, 35, 0.1);
}

.price-index-history__full {
  display: none;
}

.price-index-history__positive {
  color: #219653;
}

.price-index-history__negative {
  color: #eb5757;
}

.price-index-history__title {
  margin: 0;
  color: #253137;
  font-size: 15px;
  font-weight: 700;
}

.price-index-history__wrap {
  box-shadow: #dddddd 0 0 10px;
  background: #ffffff;
  margin-top: 16px;
}

.price-index-history__row {
  display: flex;
  padding: 15px 15px 0;
  margin: 0 -10px 16px;
}

.price-index-history__block {
  padding: 0 10px;
}

.price-index-history__label {
  font-size: 12px;
  margin-bottom: 4px;
}

.price-index-history__datepicker input {
  border-radius: 2px;
  border: 1px solid #afbdc4;
  background-color: #ffffff;
  line-height: normal;
  color: #324149;
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  box-sizing: border-box;
  padding: 4px 8px;
  max-width: 120px;
}

.price-index-history__loading {
  align-items: center;
  color: #c0c0c0;
  display: flex;
  font-size: 12px;
  font-weight: 600;
  height: 140px;
  justify-content: center;
}

.price-index-history__text {
  & > :not(div) a {
    @include link-color-accent();
  }

  & > p {
    margin: 18px 0;
  }
}

.price-index-history__block_button {
  align-self: flex-end;
  display: none;
  margin-left: auto;
}

.price-index-history_has-button .price-index-history__row_button {
  display: flex;
}

.price-index-history_rtl .price-index-history__table td:nth-child(4) {
  direction: ltr;
}

@media (min-width: $sm) {
  .price-index-history__table th {
    font-size: 14px;
    padding: 8px 16px;
  }
  .price-index-history__table td {
    font-size: 14px;
    padding: 5px 16px;
  }
  .price-index-history__full {
    display: inline;
  }
  .price-index-history__shirt {
    display: none;
  }
  .price-index-history__title {
    font-size: 22px;
  }
  .price-index-history__datepicker input {
    max-width: 145px;
  }
  .price-index-history__loading {
    font-size: 16px;
    height: 200px;
  }
}

@media (max-width: $xs) {
  .price-index-history__row {
    position: relative;
  }
  .price-index-history__row .vdp-datepicker {
    position: static;
  }
  .price-index-history__row .vdp-datepicker__calendar {
    width: 260px;
    left: 25px;
  }
}

@media (min-width: $md) {
  .price-index-history__block_button {
    display: block;
  }
  .price-index-history__promo-button {
    width: 261px;
  }
  .price-index-history_rtl .price-index-history__block_button {
    margin-left: 0;
    margin-right: auto;
  }
}
</style>
