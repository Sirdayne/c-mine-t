import numeral from 'numeral';
import hasIn from 'lodash/hasIn';
import find from 'lodash/find';
import get from 'lodash/get';
import getProperty from '~/assets/libs/getProperty';
import filterNoneObjects from '~/assets/libs/filterNoneObjects';
import { report } from '~/assets/helpers/sentry';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_DECIMALS,
  NUMBER_FORMAT_LANGUAGE_CODES,
  TICKERS_REPORT_MESSAGES,
} from '~/app.config';
import { REDIRECT_MAP } from '~/middleware/redirect';

const getHardcodedLanguageCode = (languageCode = '') => {
  return getProperty(NUMBER_FORMAT_LANGUAGE_CODES, languageCode, languageCode);
};

export const getNumberFormatter = (options = {}) => {
  const { defaultValue = 0.0, languageCode = DEFAULT_LANGUAGE.code, intlOptions = null } = options;
  try {
    let numberFormatter;
    // TODO: Make it better
    const langCode = getHardcodedLanguageCode(languageCode);
    const locale = `${langCode}-u-nu-latn`;
    if (process.server) {
      numberFormatter = new Intl.NumberFormat(locale, intlOptions).format;
    } else {
      numberFormatter = new window.Intl.NumberFormat(locale, intlOptions).format;
    }
    return numberFormatter;
  } catch (e) {
    return () => defaultValue;
  }
};

export const formatPrice = (inputValue, options = {}) => {
  const {
    defaultValue = 0.0,
    defaultDecimals = 2,
    forceDecimals,
    languageCode = DEFAULT_LANGUAGE.code,
    currency = 'USD',
    coin = 'BTC',
  } = options;
  let value = parseFloat(inputValue);
  if (Number.isNaN(value)) {
    value = defaultValue;
  }
  let decimals = defaultDecimals;
  if (coin === 'USDT' && ['USD', 'EUR', 'GBP'].includes(currency)) {
    decimals = 4;
  } else if (['TRX', 'ADA', 'XLM'].includes(coin)) {
    decimals = 3;
  } else if (value < 10) {
    decimals = 2;
  }
  decimals = forceDecimals ?? decimals;
  const intlOptions = {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  };
  const numberFormatter = getNumberFormatter({
    defaultValue,
    languageCode,
    intlOptions,
  });
  value = numberFormatter(value);
  return value;
};

export const formatPercentage = (inputValue, options = {}) => {
  const { defaultValue, languageCode = DEFAULT_LANGUAGE.code } = options;
  let value = parseFloat(inputValue);
  if (Number.isNaN(value)) {
    value = defaultValue;
  }
  let sign = '';
  if (value > 0) {
    sign = '+';
  }
  if (value < 0) {
    sign = '-';
  }
  const intlOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  const numberFormatter = getNumberFormatter({
    defaultValue,
    languageCode,
    intlOptions,
  });
  value = numberFormatter(Math.abs(value));
  return `${sign}${value}%`;
};

export const getMappedCoinDecimals = (decimals) => {
  return Array.isArray(decimals)
    ? decimals.map((item) => ({
        currency: item.currency,
        value: item.value,
      }))
    : [];
};

export const getMappedTickersMeta = (tickersMeta) => {
  const defaultCurrency = getProperty(tickersMeta, 'defaultCurrency', 'USD');
  const currencies = filterNoneObjects(getProperty(tickersMeta, 'currencySymbols', [])).map((item, i) => ({
    id: `${item.name}-${i}`,
    name: item.name,
    sign: item.sign,
  }));
  const coins = filterNoneObjects(getProperty(tickersMeta, 'coinSymbols', [])).map((item) => {
    const tagSlug = item.tag ? item.tag.slug : '';

    let url = `/${item.slug}-price-index`;
    if (REDIRECT_MAP[url]) {
      url = REDIRECT_MAP[url];
    }

    return {
      id: item.id,
      decimals: {
        global: getMappedCoinDecimals(item.decimals),
        mobile: getMappedCoinDecimals(item.decimalsHeaderMobile),
        desktop: getMappedCoinDecimals(item.decimalsHeaderDesktop),
      },
      name: item.name,
      label: item.label,
      priority: item.priority,
      logo: item.logo,
      url,
      tagSlug,
      guideSlug: item.guideSlug,
      isVisibleOnDesktop: item.tickersDesktop,
      isVisibleOnMobile: item.tickersMobile,
    };
  });
  const allowedMarkets = getProperty(tickersMeta, 'allowedMarkets', []);
  return {
    defaultCurrency,
    currencies,
    coins,
    allowedMarkets,
  };
};

export const getMappedTickersGraphs = (tickersMeta) => {
  return filterNoneObjects(getProperty(tickersMeta, 'coinSymbols', [])).reduce((result, coinData) => {
    const { name: coin, graphs = [] } = coinData;
    graphs
      .filter((graph) => graph && typeof graph === 'object')
      .forEach((graph) => {
        result[`${coin}-${graph.fiatCurrencyCode}`] = graph.graph;
      });
    return result;
  }, []);
};

export const getMappedCoins = (tickers, options) => {
  if (!tickers || typeof tickers !== 'object') {
    return {};
  }
  const { languageCode } = options || {};
  const coins = filterNoneObjects(getProperty(options, 'meta.coins', []));
  return coins.reduce((result, coinData) => {
    const { id, name: coin, label, url, logo, decimals, isVisibleOnDesktop, isVisibleOnMobile } = coinData;
    Object.entries(getProperty(tickers, coin, {}))
      .filter(([, value]) => getProperty(value, 'price', false))
      .map(([key, value]) => {
        const {
          price = '0.00',
          change24h = '0.00',
          cap = '0.00',
          volumeCurrency = '0.00',
          volume = '0.00',
          open = '0.00',
          high = '0.00',
          low = '0.00',
          week = '0.00',
          month = '0.00',
          emitted = '0.00',
        } = value;
        return [
          key,
          {
            priceRaw: price,
            priceRounded: parseFloat(price).toFixed(2),
            changeFor24Hours: change24h,
            mktcap: cap,
            open,
            high,
            low,
            supply: emitted,
            changeForWeek: week,
            changeForMonth: month,
            coinTradeVol: volume,
            volume24hour: volumeCurrency,
          },
        ];
      })
      .forEach(([currency, byCurrencyData]) => {
        const {
          priceRaw,
          priceRounded,
          changeFor24Hours,
          mktcap,
          volume24hour,
          coinTradeVol,
          open,
          high,
          low,
          supply,
          changeForWeek,
          changeForMonth,
        } = byCurrencyData;

        const globalDecimals = find(decimals.global, { currency });
        const defaultMobileDecimals = find(decimals.mobile, { currency: 'default' });
        const defaultDesktopDecimals = find(decimals.desktop, { currency: 'default' });
        const currencyMobileDecimals = find(decimals.mobile, { currency });
        const currencyDesktopDecimals = find(decimals.desktop, { currency });

        const mobileDecimals = currencyMobileDecimals || defaultMobileDecimals;
        const desktopDecimals = currencyDesktopDecimals || defaultDesktopDecimals;
        const percentage = parseFloat(changeFor24Hours);
        const isUp = percentage > 0;
        const isDown = percentage < 0;

        const value = formatPrice(priceRaw, {
          defaultValue: priceRaw,
          forceDecimals: desktopDecimals ? desktopDecimals.value : 0,
          languageCode,
          currency,
          coin,
        });
        const openFormatted = formatPrice(open, {
          defaultValue: open,
          forceDecimals: desktopDecimals ? desktopDecimals.value : 0,
          languageCode,
          currency,
          coin,
        });
        const highFormatted = formatPrice(high, {
          defaultValue: high,
          forceDecimals: desktopDecimals ? desktopDecimals.value : 0,
          languageCode,
          currency,
          coin,
        });
        const lowFormatted = formatPrice(low, {
          defaultValue: low,
          forceDecimals: desktopDecimals ? desktopDecimals.value : 0,
          languageCode,
          currency,
          coin,
        });
        const changePercentage = formatPercentage(changeFor24Hours, {
          defaultValue: changeFor24Hours,
          languageCode,
        });
        const changeForWeekFormatted = formatPercentage(changeForWeek, {
          defaultValue: changeForWeek,
          languageCode,
        });
        const changeForMonthFormatted = formatPercentage(changeForMonth, {
          defaultValue: changeForMonth,
          languageCode,
        });
        const valueAltDesktop = formatPrice(priceRaw, {
          defaultValue: priceRounded,
          defaultDecimals: desktopDecimals ? desktopDecimals.value : 0,
          languageCode,
          currency,
          coin,
        });
        const valueAltMobile = formatPrice(priceRaw, {
          defaultValue: priceRounded,
          defaultDecimals: mobileDecimals ? mobileDecimals.value : 2,
          languageCode,
          currency,
          coin,
        });
        const valueAltGlobal = formatPrice(priceRaw, {
          defaultValue: priceRaw,
          forceDecimals: globalDecimals ? globalDecimals.value : 0,
          languageCode,
          currency,
          coin,
        });
        if (result[currency] === undefined) {
          result[currency] = [];
        }
        const supplyFormatted = numeral(supply).format('0.00 a');
        const coinTradeVolFormatted = numeral(coinTradeVol).format('0.00 a');
        const mktcapFormatted = numeral(mktcap).format('0.00 a');
        const volume24hourFormatted = numeral(volume24hour).format('0.00 a');
        result[currency].push({
          id,
          name: coin,
          label,
          url,
          logo,
          value,
          valueAltGlobal,
          valueAltDesktop,
          valueAltMobile,
          changePercentage,
          changeForWeek,
          changeForWeekFormatted,
          changeForMonth,
          changeForMonthFormatted,
          isUp,
          isDown,
          isVisibleOnDesktop,
          isVisibleOnMobile,
          mktcap,
          mktcapFormatted,
          open,
          openFormatted,
          high,
          highFormatted,
          low,
          lowFormatted,
          volume24hour,
          volume24hourFormatted,
          coinTradeVol,
          coinTradeVolFormatted,
          supply,
          supplyFormatted,
        });
      });
    return result;
  }, {});
};

export const getCurrenciesByCoin = (coins, options) => {
  const { coin } = options || {};
  if (!coin || !coins) {
    return [];
  }
  const currencies = filterNoneObjects(getProperty(options, 'meta.currencies', []));
  return currencies.reduce((result, currencyData) => {
    const { id, sign, name: currency } = currencyData;
    const byCurrency = getProperty(coins, currency, []);
    const coinData = byCurrency.find((item) => item.name === coin);
    if (coinData && coinData.valueAltDesktop) {
      result.push({
        id,
        name: currency,
        sign,
        value: coinData.valueAltDesktop,
      });
    }
    return result;
  }, []);
};

export const validatePairs = (options) => {
  const coins = getProperty(options, 'coins', []);
  const currencies = getProperty(options, 'currencies', []);
  const tickersRaw = getProperty(options, 'tickers', null);
  const pairs = [];
  const errors = [];
  if (!coins.length) {
    report({
      tag: 'tickers',
      error: {
        message: TICKERS_REPORT_MESSAGES.COINS_MESSAGE,
      },
    });
    return;
  }
  if (!currencies.length) {
    report({
      tag: 'tickers',
      error: {
        message: TICKERS_REPORT_MESSAGES.CURRENCIES_MESSAGE,
      },
    });
    return;
  }
  if (!tickersRaw) {
    report({
      tag: 'tickers',
      error: {
        message: TICKERS_REPORT_MESSAGES.TICKERS_RAW_MESSAGE,
      },
    });
    return;
  }
  coins.forEach((coin) => pairs.push(...currencies.map((currency) => [coin, currency])));
  pairs.forEach((pair) => {
    if (!hasIn(tickersRaw, pair)) {
      errors.push(pair.splice(1).join('.'));
    }
  });
  if (errors.length) {
    report({
      tag: 'tickers',
      error: {
        message: TICKERS_REPORT_MESSAGES.PAIRS_MESSAGE,
      },
      withScope(scope) {
        scope.setExtra('failedPairs', errors);
      },
    });
  }
};

const getDecimalsTypeKey = (type = 'default') => {
  switch (true) {
    case type === 'mobile':
      return 'decimals.mobile';
    case type === 'desktop':
      return 'decimals.desktop';
    default:
      return 'decimals.desktop';
  }
};

export const getCoinDecimalsByCurrency = ({ coin = {}, currency = 'USD', type = 'default' }) => {
  const decimalsTypeKey = getDecimalsTypeKey(type);
  const decimalsOptions = get(coin, decimalsTypeKey, []) || [];
  const decimals = decimalsOptions.find((o) => o.currency === currency)?.value;
  return decimals ?? DEFAULT_DECIMALS;
};

export const formatCoinPriceIndexMetaDescriptionString = (coin, currCoinMeta, languageShort) => {
  const currency = 'USD';
  const rawCoinData = coin.data[currCoinMeta.name][currency];

  try {
    const digitsAfterDotSetting = currCoinMeta.decimals.find((el) => el.currency === currency);
    const valueAltGlobal = formatPrice(rawCoinData.price, {
      defaultValue: rawCoinData.price,
      forceDecimals: digitsAfterDotSetting ? digitsAfterDotSetting.value : 0,
      languageCode: languageShort,
      currency,
      coin,
    });
    const changePercentage = formatPercentage(rawCoinData.change24h, {
      defaultValue: rawCoinData.change24h,
      languageCode: languageShort,
    });
    const mktcapFormatted = numeral(rawCoinData.cap).format('0.00 a');

    return `The ${currCoinMeta.label} (${
      currCoinMeta.name
    }) live price today is $${valueAltGlobal}, changes over 24H (${changePercentage}). Current market cap is $${mktcapFormatted.toUpperCase()}. All given information about ${
      currCoinMeta.label
    } (${currCoinMeta.name}) updated in real-time.`;
  } catch {
    return null;
  }
};
