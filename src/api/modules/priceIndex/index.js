import axios from 'axios';
import getProperty from '~/assets/libs/getProperty';
import { fetchQuery } from '~/api/modules/shared';
import { getMappedI18n, priceIndexSlugMap } from '~/assets/helpers/i18n';
import { getMappedPostPreview } from '~/assets/helpers/posts';
import { getMappedMeta } from '~/assets/helpers/seo';
import { getAlternateLinks } from '~/assets/helpers/meta';
import coinPriceIndexPageQuery from '~/graphql/queries/coinPriceIndexPage.graphql';
import tagPagePostsQuery from '~/graphql/queries/tagPagePosts.graphql';
import {
  POSTS_ORDER_TYPES,
  RATES_HISTORY_URL,
  RATES_HISTORICAL_URL,
  MARKETS_URL,
  TAG_PAGE_POSTS_LENGTH,
} from '~/app.config';

const CancelToken = axios.CancelToken;

export const fetchPriceIndexPageInitialState = async (options = {}) => {
  const {
    languages,
    languageDomain,
    languageCode,
    timeZone,
    pathname,
    coinSlug,
    guideSlug,
    cryptoSymbol,
    languageShort,
    apolloTransport,
  } = options;

  const postsMapOptions = {
    languageDomain,
    languageCode,
    timeZone,
    languageShort,
  };

  const slugsMap = priceIndexSlugMap(cryptoSymbol);

  const { data } = await fetchQuery({
    defaultData: {
      tag: null,
    },
    query: coinPriceIndexPageQuery,
    variables: {
      coinSlug,
      guideSlug,
      slugsMap,
      pageUrl: pathname,
    },
    languageShort,
    apolloTransport,
    sentryTag: 'fetch-price-index-page',
  });

  const i18n = getMappedI18n({
    i18n: getProperty(data, 'i18n', []),
    map: slugsMap,
  });
  const rawSeoMeta = getProperty(data, 'seoMeta', null);
  const meta = getMappedMeta(rawSeoMeta);
  const { data: rawPostsByTime = [], postsCount: postsByTimeCount } = getProperty(data, 'posts.postsByTime', {});
  const guides = getProperty(data, 'guideCategory.guides', []);
  const postsByTime = rawPostsByTime.map((item) => getMappedPostPreview(item, postsMapOptions));

  const alternates = getAlternateLinks({
    languages,
    meta,
  });
  return {
    localI18n: i18n,
    meta,
    guides,
    lastPost: getProperty(postsByTime, 0, null),
    postData: {
      key: 'tagRecent',
      isPending: false,
      order: POSTS_ORDER_TYPES.BY_TIME,
      posts: postsByTime,
      postsOffset: postsByTime.length,
      postsAmount: postsByTimeCount,
    },
    alternates,
  };
};

export const fetchNewHistoryBulkedWithCancelation = (options) => {
  let cancel;
  const defaultRequestData = {
    pairs: 'BTC-USD',
    markets: 'Index',
    period: 'H1',
    limit: 24,
    time_from: Math.floor(new Date().setDate(new Date().getDate() - 1) / 1000),
    time_till: Math.floor(Date.now() / 1000),
    data_type: 'candle',
  };
  const response = {
    status: 'success',
    error: '',
  };
  const historicalAxios = axios.create({
    cancelToken: new CancelToken((c) => {
      cancel = c;
    }),
  });
  return {
    cancel,
    fetch: async () => {
      try {
        const requestData = {
          ...defaultRequestData,
          ...options,
          sentryTag: 'charts',
        };
        const requestUrl = `${RATES_HISTORY_URL}`;
        const {
          data: { data },
        } = await historicalAxios.request({
          method: 'get',
          baseURL: requestUrl,
          params: requestData,
        });
        response.data = data;
        response.status = 'success';
        return response;
      } catch (e) {
        response.status = 'error';
        response.error = e.message;
        response.thrown = e;
        return response;
      }
    },
  };
};

export const fetchNewHistoryWithCancelation = (options) => {
  let cancel;
  const defaultRequestData = {
    coin: 'BTC',
    currency: 'USD',
    market: 'Index',
    period: 'H1',
    limit: 24,
    time_from: Math.floor(new Date().setDate(new Date().getDate() - 1) / 1000),
    time_till: Math.floor(Date.now() / 1000),
  };
  const response = {
    status: 'success',
    error: '',
  };
  const historyAxios = axios.create({
    cancelToken: new CancelToken((c) => {
      cancel = c;
    }),
  });
  return {
    cancel,
    fetch: async () => {
      try {
        const requestData = {
          ...defaultRequestData,
          ...options,
          sentryTag: 'charts',
        };
        const requestUrl = `${RATES_HISTORICAL_URL}${requestData.coin}/${requestData.currency}/`;
        const {
          data: { data },
        } = await historyAxios.request({
          method: 'get',
          baseURL: requestUrl,
          params: requestData,
        });
        response.data = data;
        response.status = 'success';
        return response;
      } catch (e) {
        response.status = 'error';
        response.error = e.message;
        response.thrown = e;
        return response;
      }
    },
  };
};

export const fetchCoinExchanges = async (coin = 'BTC') => {
  try {
    const res = await axios(`${MARKETS_URL + coin}/`);
    return res.data.data;
  } catch (e) {
    console.error(e);
    return {};
  }
};

export const fetchPriceIndexPosts = async (options = {}) => {
  const {
    slug,
    order,
    offset,
    languageDomain,
    languageCode,
    timeZone,
    languageShort,
    apolloTransport,
    length = TAG_PAGE_POSTS_LENGTH,
    sentryTag = 'fetch-tag-posts',
  } = options;
  const { status, errors, data } = await fetchQuery({
    defaultData: {
      tag: {
        posts: {
          data: [],
          postsCount: 0,
        },
      },
    },
    query: tagPagePostsQuery,
    variables: {
      slug,
      order,
      offset,
      length,
    },
    languageShort,
    apolloTransport,
    sentryTag,
  });
  const posts = getProperty(data, 'tag.posts.data', []);
  const postsCount = getProperty(data, 'tag.posts.postsCount', 0);
  return {
    status,
    errors,
    data: {
      posts: posts.map((item) =>
        getMappedPostPreview(item, {
          languageDomain,
          languageCode,
          timeZone,
          languageShort,
        })
      ),
      postsCount,
    },
  };
};
