import { readonly } from 'vue';
import { TICKERS } from '~/store/types';
import { fetchTickersMeta, fetchTickersGraphs } from '~/api/modules/tickers';
import { getMappedCoins, getCurrenciesByCoin, validatePairs } from '~/assets/helpers/tickers';
import { DEFAULT_CURRENCY, RATES_URL } from '~/app.config';
import getProperty from '~/assets/libs/getProperty';
import { axiosTransport } from '~/api/transport/axiosTransport';
import { ShortPolling } from '~/assets/libs/ShortPolling';

const TICKERS_DATA_SHORT_POLLING_DELAY_MS = 60000;
const TICKERS_DATA_SHORT_POLLING_RECOVERY_DELAY_MS = 1000;

export const state = () => ({
  currency: null,
  meta: {},
  coins: {},
  currencies: [],
  graphs: {},
  showPostLiveTickerData: false,
  selectedTickerFromPost: {},
  rawRates: null,
});

export const getters = {
  [TICKERS.SIGN]({ currency, meta: { currencies = [] } }) {
    const { sign = '' } = currencies.find((item) => item.name === currency) || {};
    return sign;
  },
  [TICKERS.DESKTOP_COINS_BY_CURRENCY]({ coins, currency }) {
    const coinsByCurrency = coins[currency] || [];
    return coinsByCurrency.filter(({ isVisibleOnDesktop }) => isVisibleOnDesktop);
  },
  [TICKERS.MOBILE_COINS_BY_CURRENCY]({ coins, currency }) {
    const coinsByCurrency = coins[currency] || [];
    return coinsByCurrency.filter(({ isVisibleOnMobile }) => isVisibleOnMobile);
  },
  [TICKERS.META_COINS]({ meta }) {
    return getProperty(meta, 'coins', null);
  },
  [TICKERS.GET_CURRENCY_SELECTED]({ currency }) {
    return currency;
  },
  [TICKERS.POST_COINS]({ coins, currency }) {
    return coins[currency];
  },
  [TICKERS.POPULAR_CRYPTO_TO_FIAT]({ coins }) {
    // List of popular crypto coins
    const popularCoins = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'DOGE'];
    let filteredCoins = [];
    for (const [key, value] of Object.entries(coins)) {
      for (const val of value) {
        if (popularCoins.includes(val.name)) {
          filteredCoins.push({
            ...val,
            fiat: key,
          });
        }
      }
    }
    return filteredCoins;
  },
};

export const mutations = {
  [TICKERS.MUTATE_CURRENCY](state, payload) {
    state.currency = payload;
  },
  [TICKERS.MUTATE_META](state, payload) {
    state.meta = payload;
  },
  [TICKERS.MUTATE_COINS](state, payload) {
    state.coins = payload;
  },
  [TICKERS.MUTATE_CURRENCIES](state, payload) {
    state.currencies = payload;
  },
  [TICKERS.MUTATE_GRAPHS](state, payload) {
    state.graphs = payload;
  },
  [TICKERS.MUTATE_LIVE_DATA_MOBILE_POPUP_VISIBILITY](state, payload) {
    state.showPostLiveTickerData = payload;
  },
  [TICKERS.MUTATE_TICKER_DATA_FROM_POST](state, payload) {
    state.selectedTickerFromPost = payload;
  },
  [TICKERS.MUTATE_RAW_RATES](state, payload) {
    state.rawRates = payload;
  },
};

export const actions = {
  [TICKERS.SET_CURRENCY]({ commit }, payload) {
    commit(TICKERS.MUTATE_CURRENCY, payload);
  },
  async [TICKERS.FETCH_TICKERS_DATA]({ commit, rootState }) {
    const {
      currentLanguage: { short, code },
    } = rootState;

    const [{ data }, { data: meta }] = await Promise.all([
      axiosTransport.request({
        method: 'get',
        url: RATES_URL,
      }),
      fetchTickersMeta({
        languageShort: short,
        apolloTransport: this.app.$apolloTransport,
      }),
    ]);

    if (!data || !data.data || !Object.keys(meta).length) {
      throw new Error(`${data.status}: ${data.statusText}`);
    }

    // using readonly for better performance
    commit(TICKERS.MUTATE_RAW_RATES, readonly(data.data));

    const rawCoins = data.data;
    commit(TICKERS.MUTATE_META, meta);
    const currency = rootState.settings.selectedCurrency || meta.defaultCurrency || DEFAULT_CURRENCY;
    commit(TICKERS.MUTATE_CURRENCY, currency);
    const coins = getMappedCoins(rawCoins, {
      meta,
      languageCode: code,
    });
    const currencies = getCurrenciesByCoin(coins, {
      coin: 'BTC',
      meta,
    });
    commit(TICKERS.MUTATE_COINS, coins);
    commit(TICKERS.MUTATE_CURRENCIES, currencies);
    validatePairs({
      tickers: rawCoins,
      coins: meta.coins.map((item) => item.name),
      currencies: meta.currencies.map((item) => item.name),
    });
  },
  async [TICKERS.FETCH_TICKERS_GRAPHS]({ commit, rootState }) {
    const { data } = await fetchTickersGraphs({
      graphType: 'widget',
      languageShort: rootState.currentLanguage.short,
      apolloTransport: this.app.$apolloTransport,
    });

    commit(TICKERS.MUTATE_GRAPHS, data);
  },

  async [TICKERS.START_TICKERS_DATA_SHORT_POLLING]({ dispatch }) {
    const tickersShortPolling = new ShortPolling(
      TICKERS_DATA_SHORT_POLLING_DELAY_MS,
      TICKERS_DATA_SHORT_POLLING_RECOVERY_DELAY_MS,
      () => dispatch(TICKERS.FETCH_TICKERS_DATA)
    );
    tickersShortPolling.init();
  },
  [TICKERS.CHANGE_LIVE_DATA_MOBILE_POPUP_VISIBILITY]({ commit }, payload) {
    commit(TICKERS.MUTATE_LIVE_DATA_MOBILE_POPUP_VISIBILITY, payload);
  },
  [TICKERS.SET_TICKER_DATA_FROM_POST]({ commit }, payload) {
    commit(TICKERS.MUTATE_TICKER_DATA_FROM_POST, payload);
  },
};
