import marketsPageQuery from '~/graphql/queries/marketsPage.graphql';
import getProperty from '~/assets/libs/getProperty';
import { fetchQuery } from '~/api/modules/shared';
import { getMappedI18n, marketsSlugMap } from '~/assets/helpers/i18n';
import { getMappedPostPreview } from '~/assets/helpers/posts';
import { POSTS_ORDER_TYPES } from '~/app.config';

export const fetchMarketsPageInitialState = async (options = {}) => {
  const { languageDomain, languageCode, timeZone, pathname, languageShort, apolloTransport } = options;
  const postsMapOptions = {
    languageDomain,
    languageCode,
    timeZone,
    languageShort,
  };
  const { data } = await fetchQuery({
    defaultData: {
      tag: null,
    },
    query: marketsPageQuery,
    variables: {
      pageUrl: pathname,
      slugsMap: marketsSlugMap,
    },
    languageShort,
    apolloTransport,
    sentryTag: 'fetch-markets-page',
  });
  const i18n = getMappedI18n({
    i18n: getProperty(data, 'i18n', []),
    map: marketsSlugMap,
  });
  const { data: rawTrading101Posts = [] } = getProperty(data, 'trading101.postsByTime', {});
  const { data: rawMarketsPostsByTime = [] } = getProperty(data, 'markets.postsByTime', {});
  const trading101Posts = rawTrading101Posts.map((item) => getMappedPostPreview(item, postsMapOptions));
  const marketsPostsByTime = rawMarketsPostsByTime.map((item) => getMappedPostPreview(item, postsMapOptions));

  return {
    localI18n: i18n,
    trading101Posts,
    lastPost: getProperty(marketsPostsByTime, 0, null),
    postData: {
      order: POSTS_ORDER_TYPES.BY_TIME,
      posts: marketsPostsByTime.slice(1, 6),
    },
  };
};
