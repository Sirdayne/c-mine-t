import { fetchQuery } from '~/api/modules/shared';
import tickersMetaQuery from '~/graphql/queries/tickersMeta.graphql';
import tickersGraphsQuery from '~/graphql/queries/tickersGraphs.graphql';
import getProperty from '~/assets/libs/getProperty';
import { getMappedTickersMeta, getMappedTickersGraphs } from '~/assets/helpers/tickers';
import { RATES_SERVICE_CLIENT_URL } from '~/app.config';
import { HOUR, MINUTE } from '~/assets/helpers/timeConstants';
import { axiosTransport } from '~/api/transport/axiosTransport';

export const fetchCoinRates = async (coinName) => {
  const url = `${RATES_SERVICE_CLIENT_URL}/rates/`;
  const { data: coin } = await axiosTransport.request({
    method: 'get',
    url,
    params: {
      coins: coinName,
      full: true,
    },
  });

  return coin;
};

export const fetchTickersMeta = async (options = {}) => {
  const { languageShort, apolloTransport } = options;
  const { status, errors, data } = await fetchQuery({
    defaultData: {
      tickerMeta: null,
    },
    query: tickersMetaQuery,
    languageShort,
    apolloTransport,
    sentryTag: 'fetch-tickers-meta',
    cacheTimeInMS: HOUR,
  });
  const tickerMeta = getProperty(data, 'tickerMeta', null);
  return {
    status,
    errors,
    data: getMappedTickersMeta(tickerMeta),
  };
};

export const fetchTickersGraphs = async (options = {}) => {
  const { graphType, currencies, languageShort, apolloTransport } = options;
  const { status, errors, data } = await fetchQuery({
    defaultData: {
      tickerMeta: null,
    },
    query: tickersGraphsQuery,
    variables: {
      widgetType: graphType,
      fiatCurrencies: currencies,
    },
    languageShort,
    apolloTransport,
    sentryTag: 'fetch-tickers-graphs',
    cacheTimeInMS: MINUTE,
  });
  const tickerMeta = getProperty(data, 'tickerMeta', null);
  return {
    status,
    errors,
    data: getMappedTickersGraphs(tickerMeta),
  };
};
