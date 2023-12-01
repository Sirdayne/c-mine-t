import { fetchMainPosts } from '~/api/modules/main';
import { fetchQuery } from '~/api/modules/shared';
import getProperty from '~/assets/libs/getProperty';
import seoMetaQuery from '~/graphql/queries/seoMeta.graphql';
import coinMetaQuery from '~/graphql/queries/coinMeta.graphql';
import { getMappedMeta } from '~/assets/helpers/seo';
import { getAlternateLinks } from '~/assets/helpers/meta';
import { formatCoinPriceIndexMetaDescriptionString } from '~/assets/helpers/tickers';
import { fetchCoinRates } from '~/api/modules/tickers';

export const fetchPriceIndexesPageData = async (options = {}) => {
  const { languages, languageDomain, languageCode, timeZone, languageShort, apolloTransport } = options;

  const postsOptions = {
    offset: 0,
    length: 10,
    languageDomain,
    languageCode,
    timeZone,
    languageShort,
    apolloTransport,
  };

  const {
    data: { posts, postsCount },
  } = await fetchMainPosts(postsOptions);
  const alternates = getAlternateLinks({ languages });

  return { posts, postsCount, alternates };
};

export const getCoinPriceIndexMetaDescription = async ({ languageShort, apolloTransport }, slug, errorFn) => {
  //Due to CDT-2013 updates seo meta description for en only
  const coinMetaOptions = {
    query: coinMetaQuery,
    variables: {
      short: languageShort,
      slug,
    },
    languageShort,
    apolloTransport,
  };

  const {
    data: { coin: currCoinMeta },
  } = await fetchQuery(coinMetaOptions);

  if (!currCoinMeta) {
    errorFn({
      statusCode: 404,
    });
    return null;
  }

  const coin = await fetchCoinRates(currCoinMeta.name);
  return formatCoinPriceIndexMetaDescriptionString(coin, currCoinMeta, languageShort);
};

export const fetchPriceIndexPageMeta = async (options = {}) => {
  const { pathname, languageShort, apolloTransport } = options;
  const seoMetaOptions = {
    query: seoMetaQuery,
    variables: {
      short: languageShort,
      url: pathname,
    },
    languageShort,
    apolloTransport,
  };
  const { data } = await fetchQuery(seoMetaOptions);
  const rawSeoMeta = getProperty(data, 'seoMeta', null);
  const meta = getMappedMeta(rawSeoMeta);
  return { meta };
};
