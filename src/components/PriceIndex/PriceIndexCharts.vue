<template>
  <div class="coinchart">
    <div :class="['ccc-widget ccc-chart-v3 price-index-charts', isRtl && 'price-index-charts_rtl']">
      <h2
        v-if="hasValue(localI18n.chartBlockTitle)"
        class="ccc-widget__title"
      >
        {{ localI18n.chartBlockTitle }}
      </h2>

      <div
        v-if="hasValue(localI18n.price_index_texts_value)"
        class="price-index-about__text"
        v-html="localI18n.price_index_texts_value"
      />

      <div class="ccc-widget__inner">
        <div class="ccc-widget__types">
          <PriceIndexChartTypes @select_type="select_type">
            <PriceIndexChartTypeItem
              v-for="(typeData, index) in types"
              :key="index + 10"
              :selected="index === 0"
              :name="typeData"
            />
          </PriceIndexChartTypes>
        </div>
        <div class="ccc-widget__etoro-button ccc-widget__etoro-button_desktop">
          <AdSlot
            :place="adSlotPlace"
            class="price-index__promo-button"
          />
        </div>
      </div>

      <div class="ccc-widget__wrapper">
        <div
          v-show="show"
          style="display: none"
        >
          <PriceIndexCurrencyTabs
            :with-ad-slot="false"
            :selected-currency="currency"
            @change-currency="(currencyLabel) => $emit('change-currency', currencyLabel)"
          >
            <PriceIndexCurrencyTab
              v-for="item in currencies"
              :key="item.name"
              :tab-currency="item.name"
              :selected-currency="currency"
              class="ccc-widget__market-list tabcontent"
            >
              <template v-for="(exchange, key) in exchange_markets[currency]">
                <div
                  v-if="type === 'LINE'"
                  :key="key"
                  class="ccc-widget__market-item"
                  :style="{ color: colors[key] }"
                >
                  <div class="cccCustomContainer ccc-widget__market-wrp">
                    <input
                      :id="exchange + '_' + currency + '_checkbox'"
                      v-model="markets[type][currency]"
                      class="ccc-widget__market-checkbox"
                      type="checkbox"
                      :data-color="colors[key]"
                      :data-market="exchange"
                      :value="{ Name: exchange, Color: colors[key] }"
                      :data-tsym="currency"
                      @change="loadTimeData"
                    />
                    <label
                      class="ccc-widget__market-label"
                      :for="exchange + '_' + currency + '_checkbox'"
                    >
                      <div
                        class="checkbox ccc-widget__market-cap"
                        v-html="exchange"
                      />
                    </label>
                  </div>
                </div>
                <div
                  v-else
                  :key="key"
                  class="ccc-widget__market-item"
                  :style="{ color: colors[key] }"
                >
                  <div class="cccCustomRadioContainer ccc-widget__market-wrp">
                    <input
                      :id="exchange + '_' + currency + '_radio'"
                      v-model="markets[type][currency]"
                      class="ccc-widget__market-radio"
                      type="radio"
                      :value="[{ Name: exchange, Color: colors[key] }]"
                      :data-color="colors[key]"
                      :data-market="exchange"
                      :data-tsym="currency"
                      @change="selectRadioMarket"
                    />
                    <label
                      class="ccc-widget__market-label"
                      :for="exchange + '_' + currency + '_radio'"
                    >
                      <div
                        class="radio ccc-widget__market-cap"
                        v-html="exchange"
                      />
                    </label>
                  </div>
                </div>
              </template>
            </PriceIndexCurrencyTab>
          </PriceIndexCurrencyTabs>
          <div>
            <div class="dateRangeChart">
              <div class="dateRangeChart__icon" />
              <div class="dateRangeChart__title">Date Range</div>
            </div>

            <div
              v-if="localDatePicker.period"
              class="chart-filter active"
            >
              <div class="chart-filter__inputContainer">
                <span class="chart-filter__title">From</span>
                <ClientOnly>
                  <Datepicker
                    v-model="localDatePicker.period.from"
                    :format="customFormatter"
                    :disabled-dates="localDatePicker.disabledFromDates"
                    :highlighted="localDatePicker.highlightedFrom"
                    :language="datepickerLocale"
                    data-gtm-locator="markets_priceindex_daterange_from"
                    @select="selectDate"
                  />
                </ClientOnly>
              </div>
              <div class="chart-filter__inputContainer">
                <span class="chart-filter__title">To</span>
                <ClientOnly>
                  <Datepicker
                    v-model="localDatePicker.period.to"
                    :format="customFormatter"
                    :disabled-dates="localDatePicker.disabledToDates"
                    :highlighted="localDatePicker.highlightedTo"
                    :language="datepickerLocale"
                    data-gtm-locator="markets_priceindex_daterange_to"
                    @select="selectDate"
                  />
                </ClientOnly>
              </div>
            </div>
            <div class="amcharts-export-menu amcharts-export-menu-top-right amExportButton active">
              <ul>
                <li class="export-main" />
              </ul>
            </div>
            <div
              class="tabsPeriodsContainer"
              style="overflow: auto"
            >
              <a
                v-for="(period, i) in periods"
                :key="i"
                class="tabperiods"
                :class="{
                  tabperiods_active: i === currentPeriodIndex && isPreset,
                }"
                :data-gtm-locator="`markets_priceindexes_${currency}_graph-${period.toLowerCase()}`"
                @click="changeDates(period, i)"
                v-html="period"
              />
            </div>
            <div style="height: 0; clear: both" />
            <div class="ccc-widget__chart-container">
              <div
                :id="'cccChartDiv' + coin"
                class="ccc-widget__chart"
              />
              <div
                v-if="showPlaceholder"
                class="ccc-widget__no-data"
                v-html="errorMessage"
              />
            </div>
          </div>
        </div>
        <div
          v-if="!show || updating"
          id="loaderccc"
          class="loader-ccc"
        >
          <div class="loader-ccc-logo" />
          <div class="loader-ccc-sides" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapState } from 'vuex';
import * as DatepickerLocales from 'vuejs-datepicker/dist/locale';
import sleep from '~/assets/libs/sleep';
import loadScript from '~/assets/libs/loadScripts';
import { getCoinDecimalsByCurrency } from '~/assets/helpers/tickers';
import { fetchCoinExchanges, fetchNewHistoryBulkedWithCancelation } from '~/api/modules/priceIndex';
import PriceIndexChartTypes from '~/components/PriceIndex/PriceIndexChartTypes';
import PriceIndexChartTypeItem from '~/components/PriceIndex/PriceIndexChartTypeItem';
import PriceIndexCurrencyTabs from '~/components/PriceIndex/PriceIndexCurrencyTabs';
import PriceIndexCurrencyTab from '~/components/PriceIndex/PriceIndexCurrencyTab';
import { PRICE_INDEX_CHART_TYPES } from '~/app.config';
import { ROOT, TICKERS } from '~/store/types';
import { ticker } from './mixins/ticker';
import { tabs } from './mixins/tabs';
import {
  addDays,
  addHours,
  addMonths,
  addYears,
  differenceInDays,
  endOfDay,
  format,
  getTime,
  startOfDay,
} from 'date-fns';
import { localeFormatter } from '~/assets/libs/dateTimeUtils';
import { AdSlot } from '~/features/ads';

export default {
  name: 'PriceIndexCharts',
  components: {
    AdSlot,
    PriceIndexChartTypes,
    PriceIndexChartTypeItem,
    PriceIndexCurrencyTabs,
    PriceIndexCurrencyTab,
  },
  mixins: [ticker, tabs],
  props: {
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
    isPreset: {
      type: Boolean,
      default: true,
    },
    coin: {
      type: String,
      default: 'BTC',
    },
  },
  data: () => ({
    localDatePicker: {},
    rawOptions: {
      limit: 168,
      period: 'H1',
    },
    show: false,
    loading_counter: 0,
    updating: true,
    global_data: {},
    colors: [
      '#FABF2C',
      '#8F2BFA',
      '#006098',
      '#F89017',
      '#000000',
      '#398439',
      '#9b59b6',
      '#e74c3c',
      '#2c3e50',
      '#d35400',
      '#16a085',
    ],
    types: PRICE_INDEX_CHART_TYPES,
    type: PRICE_INDEX_CHART_TYPES[0],
    periods: ['1D', '1W', '1M', '3M', '1Y', 'ALL'],
    currentPeriodIndex: 1,
    markets: {},
    exchanges: {},
    exchange_markets: {},
    market: {},
    defaults: {
      position: 'top-right',
      fileName: 'amCharts',
      action: 'download',
      overflow: true,
      formats: {
        JPG: {
          mimeType: 'image/jpg',
          extension: 'jpg',
          capture: true,
        },
        PNG: {
          mimeType: 'image/png',
          extension: 'png',
          capture: true,
        },
        SVG: {
          mimeType: 'text/xml',
          extension: 'svg',
          capture: true,
        },
        PDF: {
          mimeType: 'application/pdf',
          extension: 'pdf',
          capture: true,
        },
        CSV: {
          mimeType: 'text/plain',
          extension: 'csv',
        },
        JSON: {
          mimeType: 'text/plain',
          extension: 'json',
        },
        XLSX: {
          mimeType: 'application/octet-stream',
          extension: 'xlsx',
        },
      },
    },
    dataAmount: 0,
    noResultMessage: 'No Results..',
    ajaxError: '',
    showPlaceholder: false,
    cancelToken: null,
    chartDataExist: true,
  }),
  computed: {
    ...mapState('tickers', {
      currencies: ({ currencies }) => currencies,
    }),
    ...mapState({
      currentLanguage: ({ currentLanguage }) => currentLanguage,
      i18n: ({ i18n }) => i18n,
    }),
    ...mapState('viewport', {
      isMobile: ({ userDeviceType: { phone } }) => phone,
    }),
    ...mapGetters('tickers', {
      coins: TICKERS.META_COINS,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
    decimalSeparator() {
      switch (this.currentLanguage.id) {
        case '5':
        case '7':
        case '23':
        case '27':
          return ',';
        default:
          return '.';
      }
    },
    thousandsSeparator() {
      switch (this.currentLanguage.id) {
        case '5':
        case '7':
        case '23':
        case '27':
          return '.';
        default:
          return ',';
      }
    },
    datepickerLocale() {
      if (this.currentLanguage.short === 'pt') {
        return DatepickerLocales.ptBR;
      }
      if (this.currentLanguage.short === 'ar') {
        return DatepickerLocales.en;
      }
      return DatepickerLocales[localeFormatter(this.currentLanguage.short)];
    },
    errorMessage() {
      return this.dataAmount === 0 && !this.ajaxError ? this.noResultMessage : this.ajaxError;
    },
    daysFromNow() {
      const {
        datepicker: {
          now,
          period: { from },
        },
      } = this;
      return Math.round(differenceInDays(now, from));
    },
    sortedExchanges() {
      const { exchanges } = this;
      const sortedExchanges = {};
      Object.keys(exchanges).forEach((key) => {
        sortedExchanges[key] = exchanges[key].sort(this.sortExchanges);
      });
      return sortedExchanges;
    },
    minPeriod() {
      const { period } = this.rawOptions;
      const presets = new Map([
        ['M15', '15mm'],
        ['H1', 'hh'],
        ['H4', '4hh'],
        ['D1', 'DD'],
      ]);
      return presets.get(period);
    },
    limitInDays() {
      const from = this.datepicker.period.from;
      const to = this.datepicker.period.to;
      return this.calculateLimitInDays(from, to);
    },
    limit() {
      let interval;
      const days = this.limitInDays;
      switch (this.rawOptions.period) {
        case 'M1':
          interval = days * 24 * 60;
          break;
        case 'M15':
          interval = days * 24 * 4;
          break;
        case 'H1':
          interval = days * 24;
          break;
        case 'H4':
          interval = days * 6;
          break;
        case 'D1':
          interval = days;
          break;
        default:
          interval = days;
          break;
      }
      return interval;
    },
    requestOptions: {
      get() {
        const {
          rawOptions,
          coin,
          currency,
          limit,
          isPreset,
          datepicker: {
            period: { from, to },
          },
        } = this;
        const period = {
          from: isPreset
            ? parseInt(format(getTime(from), 't'), 10)
            : parseInt(format(getTime(startOfDay(from)), 't'), 10),
          to: parseInt(format(getTime(endOfDay(to)), 't'), 10),
        };
        return {
          ...rawOptions,
          limit,
          instruments: coin + currency,
          pairs: `${coin}-${currency}`,
          time_from: period.from,
          time_till: period.to,
          ...period,
        };
      },
    },
    adSlotPlace() {
      return this.isMobile ? 'promo_button_price_index_mobile' : 'promo_button_price_index_desktop';
    },
  },
  watch: {
    datepicker: {
      handler() {
        this.processPeriod();
        this.loadTimeData();
      },
      deep: true,
    },
    currency() {
      this.processPeriod();
      this.loadTimeData();
    },
    sortedExchanges() {
      this.processPeriod();
      this.loadTimeData();
    },
  },
  async created() {
    this.exchanges = await fetchCoinExchanges(this.coin);
  },
  async mounted() {
    this.localDatePicker = this.datepicker;
    this.show = true;
    let isLoaded = false;
    // TODO: properly do dynamic imports
    while (!isLoaded) {
      // eslint-disable-next-line no-await-in-loop
      ({ isLoaded } = await this.tryToLoadAmCharts());
      // eslint-disable-next-line no-await-in-loop
      await sleep(1000);
    }
    this.initMarkets(this.type);
    this.loadTimeData();
  },
  methods: {
    hasValue(value) {
      return value.indexOf('price_index') === -1 && value.indexOf('price.index') === -1 && !!value.trim();
    },
    initMarkets(type) {
      this.markets[type] = {};
      this.currencies.forEach((currency) => {
        this.markets[type][currency.name] = [];
      });
    },
    select_type(response) {
      this.type = response.type.name;
      this.loadTimeData();
    },
    async tryToLoadAmCharts() {
      const { counter } = await loadScript([
        '/assets/amstock/amcharts.js',
        '/assets/amstock/serial.js',
        '/assets/amstock/amstock.js',
        '/assets/amstock/plugins/export/export.js',
      ]);
      return {
        isLoaded: this.isAmChartLoaded() && counter === 4,
      };
    },
    isAmChartLoaded() {
      return typeof window.AmCharts === 'object' && typeof window.AmCharts.AmStockChart === 'function';
    },
    cancelCurrentRequest() {
      if (typeof this.cancelToken !== 'function') {
        return;
      }
      this.cancelToken();
    },
    updateDataAmount() {
      const {
        global_data,
        currency,
        rawOptions: { period },
      } = this;
      this.dataAmount = Object.keys(global_data[currency][period]).length;
    },
    async loadHistory() {
      this.updating = true;
      this.cancelCurrentRequest();
      const { requestOptions } = this;
      const markets = this.exchange_markets[this.currency].join(',');
      const { fetch, cancel } = fetchNewHistoryBulkedWithCancelation({
        ...requestOptions,
        markets,
      });
      this.cancelToken = cancel;
      const { status, data, error, thrown } = await fetch();
      if (thrown) {
        return Promise.resolve({ status, error, thrown });
      }
      if (!data && status === 'error' && error.length) {
        this.ajaxError = error;
        this.showPlaceholder = true;
        this.updating = false;
        return Promise.resolve({ status, error });
      }
      this.formatDataForRender(data);
      this.updateDataAmount();
      if (this.dataAmount === 0) {
        this.showPlaceholder = true;
        this.updating = false;
        return Promise.resolve({ status, error });
      }
      /**
       * Hide chart if no coin data
       * */
      if (status === 'success' && !this.chartDataExist) {
        this.$emit('hide-chart');
      }
      this.showPlaceholder = false;
      await this.redrawChart();
      return Promise.resolve({ status, error });
    },
    formatDataForRender(allData) {
      const {
        currency,
        rawOptions: { period },
      } = this;
      Object.keys(allData[this.coin][currency]).forEach((market) => {
        const data = allData[this.coin][currency][market];
        const marketIndex = market === 'INDEX' ? 'COMMON' : market;
        if (!data.length) {
          this.chartDataExist = false;
        }
        this.global_data[currency][period][marketIndex] = {
          timeout: new Date(),
          data,
        };
      });
    },
    actualMarkets() {
      const { type, currency, markets } = this;
      return markets[type][currency];
    },
    selectRadioMarket() {
      this.$nextTick(() => {
        this.loadTimeData();
      });
    },
    loadTimeData() {
      // don't load data if exchanges are not loaded from api
      if (!this.sortedExchanges[this.currency]) return;

      if (!this.markets[this.type]) {
        this.initMarkets(this.type);
      }
      this.global_data[this.currency] = {};
      this.global_data[this.currency][this.rawOptions.period] = {};

      this.exchange_markets[this.currency] =
        this.type !== 'LINE'
          ? this.sortedExchanges[this.currency].filter((value, index, array) => {
              if (array.length === 1 && array[0] === 'Index') {
                return value;
              }
              return value !== 'Index';
            })
          : this.sortedExchanges[this.currency];

      if (this.actualMarkets().length === 0) {
        this.markets[this.type][this.currency][0] = {
          Name: this.exchange_markets[this.currency][0],
          Color: this.colors[0],
        };
      }
      this.attempt(this.loadHistory);
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
    getDecimalsFromOptions() {
      const { coins, coin, currency } = this;
      const currentCoin = coins.find(({ name }) => name === coin);
      const decimals = getCoinDecimalsByCurrency({
        currency,
        coin: currentCoin,
      });
      return decimals;
    },
    sortExchanges(a, b) {
      if (a === 'Index') {
        return -1;
      }
      if (b === 'Index') {
        return 1;
      }
      if (a > b) {
        return 1;
      }
      if (a < b) {
        return -1;
      }
      return 0;
    },
    processPeriod() {
      const { limitInDays, isPreset, daysFromNow } = this;
      if (isPreset) {
        return;
      }
      if (limitInDays <= 2 && daysFromNow < 7) {
        this.rawOptions.period = 'M15';
        return;
      }
      if (limitInDays > 32) {
        this.rawOptions.period = 'D1';
        return;
      }

      this.rawOptions.period = 'H1';
    },
    selectDate() {
      this.$emit('preset-change', false);
    },
    changeDates(period, i) {
      const now = new Date();
      const to = now;
      const presets = new Map();
      presets
        .set('1D', {
          from: addHours(now, -24),
          period: 'M15',
        })
        .set('1W', {
          from: addDays(now, -7),
          period: 'H1',
        })
        .set('1M', {
          from: addMonths(now, -1),
          period: 'H1',
        })
        .set('3M', {
          from: addMonths(now, -3),
          period: 'D1',
        })
        .set('1Y', {
          from: addYears(now, -1),
          period: 'D1',
        })
        .set('ALL', {
          from: addYears(now, -10),
          period: 'D1',
        });

      this.$emit('preset-change', true);
      const currentPresetOptions = presets.get(period);

      this.rawOptions.period = currentPresetOptions.period;
      this.currentPeriodIndex = i;
      this.rawOptions = {
        ...currentPresetOptions,
      };

      this.$emit('change-from-to', {
        from: currentPresetOptions.from,
        to,
      });
    },
    calculateLimitInDays(from, to) {
      const isPreset = this.isPreset;
      const fromDate = isPreset ? from : startOfDay(from);
      const toDate = isPreset ? to : endOfDay(to);

      return Math.round(differenceInDays(toDate, fromDate));
    },
    async redrawChart() {
      const {
        currency,
        rawOptions: { period },
      } = this;

      const markets = this.actualMarkets();
      const global = this.global_data[currency][period];

      const formatOptions = {
        precision: this.getDecimalsFromOptions(),
        decimalSeparator: this.decimalSeparator,
        thousandsSeparator: this.thousandsSeparator,
      };

      let dataSets = [];
      let fillAlphas = 0.4;
      let maxPoints = 400;

      [].forEach.call(markets, (market) => {
        const name = market.Name === 'Index' ? 'COMMON' : market.Name.toUpperCase();
        if (global[name]) {
          const newChartData = [];
          const points = global[name].data;
          if (points) {
            [].forEach.call(points, (point) => {
              newChartData.push({
                date: new Date(point.t * 1000),
                weighted: parseFloat(parseFloat(point.q / point.v).toFixed(2)),
                close: parseFloat(point.p),
                high: parseFloat(point.h),
                low: parseFloat(point.l),
                open: parseFloat(point.o),
                volume: parseFloat(point.q),
              });
            });
          }

          maxPoints = Math.max(maxPoints, newChartData.length);

          if (this.type === 'LINE') {
            dataSets.push({
              title: this.currency,
              color: market.Color,
              fieldMappings: [
                {
                  fromField: 'weighted',
                  toField: 'weighted',
                },
                {
                  fromField: 'volume',
                  toField: 'volume',
                },
              ],
              dataProvider: newChartData,
              categoryField: 'date',
            });
          } else {
            dataSets = [
              {
                title: this.currency,
                color: market.Color,
                fieldMappings: [
                  {
                    fromField: 'close',
                    toField: 'close',
                  },
                  {
                    fromField: 'open',
                    toField: 'open',
                  },
                  {
                    fromField: 'high',
                    toField: 'high',
                  },
                  {
                    fromField: 'low',
                    toField: 'low',
                  },
                  {
                    fromField: 'volume',
                    toField: 'volume',
                  },
                ],
                dataProvider: newChartData,
                categoryField: 'date',
              },
            ];
          }
        }
      });

      if (dataSets.length > 1) {
        [].forEach.call(dataSets, (set, set_index) => {
          if (set_index !== 0) {
            dataSets[set_index].compared = true;
          }
        });
        fillAlphas = 0;
      }

      const graphs = [];
      let negativeColor;
      let positiveColor;

      const {
        currentLanguage: { short },
      } = this;

      if (short === 'cn' || short === 'hk') {
        negativeColor = '#5cb85c';
        positiveColor = '#A11B0A';
      } else {
        negativeColor = '#A11B0A';
        positiveColor = '#5cb85c';
      }

      if (this.type === 'LINE') {
        graphs.push(
          {
            id: 'g1',
            lineThickness: '2',
            fillAlphas,
            valueField: 'weighted',
            comparable: true,
            compareField: 'weighted',
            compareGraphLineThickness: 2,
            balloonText: '[[title]] [[value]]',
            compareGraphBalloonText: '[[title]] [[value]]',
          },
          {
            id: 'g2',
            lineThickness: '2',
            fillAlphas: 1,
            valueField: 'weighted',
            hidden: 'false',
            visibleInLegend: false,
          }
        );
      } else {
        graphs.push(
          {
            type: 'candlestick',
            id: 'g1',
            openField: 'open',
            closeField: 'close',
            highField: 'high',
            lowField: 'low',
            valueField: 'close',
            lineColor: positiveColor,
            fillColors: positiveColor,
            negativeLineColor: negativeColor,
            negativeFillColors: negativeColor,
            fillAlphas: 1,
            balloonText:
              '<b>Open:</b> [[open]] <br /> <b>High:</b> [[high]] <br /> <b>Low:</b> [[low]] <br /> <b>Close:</b> [[close]]',
            useDataSetColors: false,
            proCandlesticks: false,
          },
          {
            id: 'g2',
            lineThickness: '2',
            fillAlphas: 1,
            valueField: 'close',
            hidden: 'true',
            visibleInLegend: false,
          }
        );

        if (this.type === 'OHLC') {
          graphs[0].type = 'ohlc';
          graphs[0].lineThickness = 2;
        }
      }

      const currentChartObject = {
        type: 'stock',
        path: '/assets/amstock/',
        theme: 'light',
        dataSets,
        panels: [
          {
            title: 'Value',
            showCategoryAxis: true,
            recalculateToPercents: 'never',
            percentHeight: 150,
            stockGraphs: graphs,
            stockLegend: {
              periodValueTextComparing: '[[value.close]]',
              periodValueTextRegular: '[[value.close]]',
            },
            ...formatOptions,
          },
          {
            title: 'Volume',
            percentHeight: 100,
            stockGraphs: [
              {
                valueField: 'volume',
                type: 'column',
                showBalloon: false,
                balloonText: '[[date]]',
                legendValueText: '[[date]]',
                balloonFunction(item) {
                  return `
                  <div style="text-align:left">
                    <table>
                      <tr>
                        <td style="padding:10px;"><b>Date:</b></td><td>
                        ${window.AmCharts.formatDate(item.category, 'DD-MM-YYYY JJ:NN')}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:10px;">
                          <b>Volume: &nbsp;&nbsp;</b>
                        </td>
                        <td>
                        ${item.graph.title} ${window.AmCharts.formatNumber(item.values.value, formatOptions)}
                        </td>
                      </tr>
                    </table>
                  </div>`;
                },
                fillAlphas: 1,
              },
            ],
            stockLegend: {
              periodValueTextRegular: '[[value.close]]',
            },
            ...formatOptions,
            precision: -1,
          },
        ],
        decimalSeparator: formatOptions.decimalSeparator,
        thousandsSeparator: formatOptions.thousandsSeparator,
        chartScrollbarSettings: {
          enabled: true,
          graph: 'g2',
          graphType: 'line',
          updateOnReleaseOnly: true,
          oppositeAxis: false,
          backgroundColor: '#444',
          backgroundAlpha: 0.7,
          graphFillAlpha: 0.5,
          graphLineAlpha: 0.5,
          selectedBackgroundColor: '#ffffff',
          selectedBackgroundAlpha: 0.4,
          selectedGraphFillAlpha: 0,
          selectedGraphLineAlpha: 1,
          autoGridCount: true,
          gridAlpha: 0.15,
          height: 30,
        },
        categoryAxesSettings: {
          minPeriod: this.minPeriod,
          maxSeries: maxPoints + 50,
        },
        export: {
          enabled: true,
          dateFormat: 'YYYY-MM-DD HH:MM:SS',
          menu: [
            {
              class: 'export-main',
              menu: [
                {
                  label: 'Download as ...',
                  menu: ['PNG', 'JPG', 'SVG', 'PDF'],
                },
                {
                  label: 'Save as ...',
                  menu: ['CSV', 'XLSX', 'JSON'],
                },
                {
                  label: 'Annotate',
                  action: 'draw',
                  menu: [
                    {
                      class: 'export-drawing',
                      menu: ['PNG', 'JPG'],
                    },
                  ],
                },
                {
                  label: 'Print',
                  action: 'print',
                  format: 'PRINT',
                },
              ],
            },
          ],
        },
        chartCursorSettings: {
          valueBalloonsEnabled: true,
          fullWidth: true,
          cursorAlpha: 0.1,
          valueLineBalloonEnabled: true,
          valueLineEnabled: true,
          valueLineAlpha: 0.5,
        },
      };
      const chartDiv = document.querySelector(`#cccChartDiv${this.coin}`);
      if (this.isAmChartLoaded() && chartDiv) {
        await window.AmCharts.makeChart(`cccChartDiv${this.coin}`, currentChartObject);
        this.updating = false;
      }
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';
@import 'amstock3/amcharts/plugins/export/export.css';

$gutter: 20px;

.coinchart {
  .ccc-widget {
    &__title {
      margin: 0;
      color: #253137;
      font-size: 15px;
      font-weight: 700;
      @media (min-width: $sm) {
        font-size: 22px;
      }
    }

    &__etoro-button {
      flex-grow: 0;
      max-width: 325px;
      @media (min-width: $md) {
        max-width: 250px;
      }
      @media (min-width: $lg) {
        max-width: 325px;
      }
    }

    &__etoro-button_desktop {
      display: none;
      @media (min-width: $sm) {
        display: block;
      }
    }

    &__inner:not(:first-child) {
      margin-top: 16px;
    }

    &__inner {
      display: flex;
      justify-content: space-between;
      min-height: 40px;

      .chartTypeTabLinks {
        font-size: 10px;
        width: 120px;
        @media (max-width: ($xs - 1)) {
          width: 80px;
        }
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        color: black;
        background-color: rgb(236, 239, 241);
        margin-right: 1px;
        font-weight: 700;
        cursor: pointer;
        float: left;

        &.cTypeTabActive {
          background-color: rgb(250, 191, 44);
          box-shadow: rgba(0, 0, 0, 0.2) 0 2px 4px 0;
        }
      }
    }

    &__wrapper {
      background: rgb(255, 255, 255);
      text-align: left;
      border: 0 solid rgb(224, 230, 239);
      padding: 15px;
      color: rgb(0, 0, 0);
      position: relative;
      box-shadow: rgb(221, 221, 221) 0 0 10px;
      min-height: 250px;

      .tabContainer {
        overflow: auto;

        .price-index-logo {
          @media (max-width: ($xs - 1)) {
            padding: 8px;
          }
        }

        .tabLinksCointainer {
          background: #fafafa;
          display: inline-block;
          text-align: center;
          user-select: none;

          &__title {
            line-height: 40px;
          }

          .tablinks {
            vertical-align: top;
            height: 40px;
            padding: 0 5px;
            margin: 0 5px;
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
        }
      }

      .tabcontent {
        display: flex;
        overflow-x: auto;
        margin: 15px 4px;
        -webkit-overflow-scrolling: touch;

        .cccCustomRadioContainer {
          padding-left: 19px;
          padding-right: 10px;
          padding-top: 2px;
          padding-bottom: 2px;
          line-height: 16px;
        }

        .cccCustomContainer {
          padding-left: 19px;
          padding-right: 10px;
          padding-top: 2px;
          padding-bottom: 2px;
          line-height: 16px;

          label {
            position: relative;
            cursor: pointer;
          }

          span.radio {
            font-size: 14px;
          }

          span.checkbox {
            font-size: 14px;

            &::before {
              width: 15px;
              height: 15px;
              background-color: rgb(255, 255, 255);
              left: -19px;
              box-sizing: border-box;
              border-width: 1px;
              border-style: solid;
              border-color: rgb(204, 204, 204);
              border-image: initial;
              transition: border-color 0.2s;
            }
          }
        }

        &.tabcontent-candle {
          display: none;
          overflow: auto;
          margin: 15px 4px;
        }
      }

      .dateRangeChart {
        cursor: pointer;
        user-select: none;
        margin-right: 11px;
        margin-left: 4px;

        @media (min-width: $sm) {
          height: 60px;
          float: left;
        }

        &__icon {
          width: 16px;
          height: 16px;
          background: url(/assets/img/small-calendar@2x.svg);
          display: inline-block;
          vertical-align: -2px;
        }

        &__title {
          display: inline-block;
          margin-left: 6px;
          color: #010101;
          font-weight: 100;
        }
      }

      .chart-filter {
        display: none;
        font-weight: 100;
        outline: none;
        margin-left: 4px;
        font-size: 14px;

        @media (max-width: ($xs - 1)) {
          font-size: 12px;
        }
        @media (min-width: $sm) {
          position: absolute;
          margin-top: 32px;
        }

        &.active {
          display: block;
        }

        &__title {
          opacity: 0.8;
          display: inline-block;
          margin-right: 4px;
        }

        .vdp-datepicker {
          display: inline-block;
          padding: 10px 0;
          margin-right: 4px;
        }

        .vdp-datepicker__calendar {
          @media (max-width: ($xs - 1)) {
            width: 230px;
          }
        }

        .vdp-datepicker input {
          padding: 2px 0;
          border: 1px solid #e0e6ef;
          border-radius: 0;
          box-shadow: none;
          text-align: center;

          &:focus {
            outline: none;
          }
        }
      }

      .tabsPeriodsContainer {
        overflow: auto;

        .tabperiods {
          cursor: pointer;
          user-select: none;
          color: black;
          display: block;
          float: left;
          font-size: 12px;
          text-align: center;
          margin-right: 5px;
          line-height: 22px;
          width: 54px;
          height: 22px;
          text-decoration: none;
          @media (max-width: ($xs - 1)) {
            width: 24px;
            font-size: 8px;
          }

          &_active {
            font-weight: 600;
            text-decoration: underline;
          }
        }
      }

      .amcharts-chart-div {
        a[href*='amcharts.com'] {
          display: none !important;
        }
      }

      .amcharts-export-menu-top-right {
        top: -84px;
        right: 0;
      }
    }
  }
}

.ccc-widget__chart-container {
  position: relative;
  margin-top: 10px;
}

.ccc-widget__chart {
  height: 500px;
  overflow: visible;
}

.ccc-widget__no-data {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #c0c0c0;
  background-color: #ffffff;
  overflow-wrap: break-word;
  word-break: break-word;
  word-wrap: break-word;
}

.ccc-widget__market-list {
  @media (min-width: $md) {
    flex-wrap: wrap;
  }
}

.ccc-widget__market-item {
  margin-right: 18px;
  @media (min-width: $md) {
    width: 110px;
    margin-right: 0;
  }
}

.ccc-widget__market-wrp {
  display: flex;
  align-items: center;
  padding: 4px 0 !important;
  line-height: normal !important;
}

.ccc-widget__market-checkbox,
.ccc-widget__market-radio {
  display: block;
  margin: 0 !important;
  padding: 4px 0 !important;
}

.ccc-widget__market-label {
  display: block;
  margin: 0;
  padding: 4px 0 4px 4px;
  font-weight: bold;
}

.ccc-widget__market-cap {
  display: block;
  margin: 0;
  padding: 0;
  font-size: 14px;
}

// .price-index-charts {
// }
.price-index-charts .chart-filter__inputContainer {
  display: block;

  @media (min-width: $sm) {
    display: inline-block;
  }
}

.price-index-charts .chart-filter__inputContainer .vdp-datepicker__calendar {
  left: 0;
  right: auto;
  overflow: hidden;
}

.price-index-charts_rtl {
  direction: rtl;
}

.price-index-charts_rtl .tabContainer {
  text-align: right;
}

.price-index-charts_rtl .ccc-widget__market-label {
  padding-left: 0;
  padding-right: 4px;
}

.price-index-charts_rtl .dateRangeChart__title {
  margin-left: 0;
  margin-right: 6px;
}

.price-index-charts_rtl .chart-filter__inputContainer .vdp-datepicker__calendar {
  @media (min-width: $sm) {
    left: auto;
    right: 0;
  }
}

.price-index-charts_rtl .amcharts-export-menu,
.price-index-charts_rtl .amcharts-stock-div {
  direction: ltr;
}

.loader-ccc {
  display: block;
  position: absolute;
  width: 120px;
  height: 120px;
  top: 50%;
  left: 50%;
  margin-left: -60px;
  margin-top: -60px;
}

.loader-ccc-logo {
  position: absolute;
  left: 20px;
  right: 20px;
  top: 20px;
  bottom: 20px;
  z-index: 5;
  background: url(data:image/png;base64,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)
    center no-repeat;

  border-radius: 50%;
  border-width: 1px;
  border-style: solid;

  border-color: rgb(255, 187, 0);
  border-image: initial;
}

@keyframes loader-ccc-sides {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes move-left {
  0% {
    opacity: 1;
    left: 0;
  }
  100% {
    opacity: 0;
    left: -200%;
  }
}

.loader-ccc-sides {
  position: relative;
  width: 120px;
  height: 120px;
  animation: loader-ccc-sides 1.5s linear infinite;
  border-radius: 50%;
}

.loader-ccc-sides::after {
  position: absolute;
  width: 120px;
  height: 120px;
  content: '';
  top: 0;
  left: 0;
  box-sizing: border-box;
  border-top: 10px solid rgb(255, 187, 0);
  border-bottom: 10px solid rgb(255, 187, 0);
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-radius: 50%;
}

.loader-ccc-small {
  display: block;
  position: absolute;
  width: 60px;
  height: 60px;
  top: 50%;
  left: 50%;
  margin-left: -30px;
  margin-top: -30px;
}

.loader-ccc-logo-small {
  position: absolute;
  left: 20px;
  right: 20px;
  top: 20px;
  bottom: 20px;
  z-index: 5;
  background: url(data:image/png;base64,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)
    center no-repeat;
  background-size: cover;
  border-radius: 50%;
  border-width: 1px;
  border-style: solid;

  border-color: rgb(255, 187, 0);
  border-image: initial;
}

@keyframes loader-ccc-sides-small {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loader-ccc-sides-small {
  position: relative;
  width: 60px;
  height: 60px;
  animation: loader-ccc-sides 1.5s linear infinite;
  border-radius: 50%;
}

.loader-ccc-sides-small::after {
  position: absolute;
  width: 60px;
  height: 60px;
  content: '';
  top: 0px;
  left: 0px;
  box-sizing: border-box;
  border-top: 5px solid rgb(255, 187, 0);
  border-bottom: 5px solid rgb(255, 187, 0);
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-radius: 50%;
}

.amcharts-export-menu,
.amcharts-export-canvas {
  z-index: 0 !important;
}
</style>
