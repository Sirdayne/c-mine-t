import { fetchQuery } from '~/api/modules/shared';
import articleQuery from '~/graphql/queries/article.graphql';
import infiniteScrollArticleQuery from '~/graphql/queries/infiniteScrollArticle.graphql';
import getProperty from '~/assets/libs/getProperty';
import { getMappedPost } from '~/assets/helpers/posts';
import { RELATED_POSTS_LENGTH } from '~/app.config';
import { SECOND } from '~/assets/helpers/timeConstants';

export const fetchArticlePage = async (options = {}) => {
  const { slug, languageDomain, languageCode, i18n, timeZone, pathname, languageShort, apolloTransport } = options;
  const { status, errors, data } = await fetchQuery({
    defaultData: {
      post: null,
    },
    query: articleQuery,
    variables: {
      slug,
      relatedLength: RELATED_POSTS_LENGTH,
    },
    languageShort,
    apolloTransport,
    sentryTag: 'fetch-news-page',
    cacheTimeInMS: SECOND,
  });
  const post = getProperty(data, 'post', null);
  return {
    status,
    errors,
    data: getMappedPost(post, {
      languageDomain,
      languageCode,
      timeZone,
      i18n,
      pathname,
      languageShort,
    }),
  };
};

export const fetchInfiniteScrollArticle = async (options = {}) => {
  const {
    languageDomain,
    languageCode,
    timeZone,
    i18n,
    pathname,
    languageShort,
    apolloTransport,
    promo,
    beforePostId,
    categorySlug,
  } = options;
  const { status, errors, data } = await fetchQuery({
    defaultData: {
      posts: {
        data: [],
        hasMore: false,
      },
    },
    query: infiniteScrollArticleQuery,
    variables: {
      promo,
      beforePostId,
      categorySlug,
      relatedLength: RELATED_POSTS_LENGTH,
    },
    languageShort,
    apolloTransport,
    sentryTag: 'fetch-infinite-scroll',
    cacheTimeInMS: SECOND,
  });

  const hasMore = data?.posts?.hasMore ?? false;
  const post = getMappedPost(data?.posts?.data?.[0], {
    languageDomain,
    languageCode,
    timeZone,
    i18n,
    pathname,
    languageShort,
  });

  return {
    ...post,
    hasMore,
    status,
    errors,
  };
};

export const fetchArticlePageInitialState = async (options = {}) => {
  const { slug, languageDomain, languageCode, timeZone, i18n, pathname, languageShort, apolloTransport } = options;

  const { data: pageData } = await fetchArticlePage({
    slug,
    languageDomain,
    languageCode,
    timeZone,
    i18n,
    pathname,
    languageShort,
    apolloTransport,
  });
  const { article, meta, alternates } = pageData;
  return {
    currentMeta: meta,
    currentArticle: article,
    currentAlternates: alternates,
    metas: [meta],
    articles: article ? [article] : [],
  };
};
