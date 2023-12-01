import searchPagePostsQuery from '~/graphql/queries/searchPagePosts.graphql';
import seoMetaQuery from '~/graphql/queries/seoMeta.graphql';
import getProperty from '~/assets/libs/getProperty';
import { fetchQuery } from '~/api/modules/shared';
import { getMappedPostPreview } from '~/assets/helpers/posts';
import { getMappedMeta } from '~/assets/helpers/seo';
import { getAlternateLinks } from '~/assets/helpers/meta';

export const fetchSearchPageInitialState = async (options = {}) => {
  const { pathName, languages, languageShort, apolloTransport, sentryTag = 'fetch-search-page-meta' } = options;

  const { data } = await fetchQuery({
    defaultData: {
      seoMeta: null,
    },
    query: seoMetaQuery,
    variables: {
      url: pathName,
    },
    languageShort,
    apolloTransport,
    sentryTag,
  });

  const rawSeoMeta = getProperty(data, 'seoMeta', null);
  const meta = getMappedMeta(rawSeoMeta);

  const alternates = getAlternateLinks({
    languages,
    meta,
  });

  return {
    meta,
    alternates,
  };
};

export const fetchSearchPagePosts = async (options = {}) => {
  const {
    query,
    offset,
    length,
    languageDomain,
    languageCode,
    timeZone,
    languageShort,
    apolloTransport,
    sentryTag = 'fetch-search-posts',
  } = options;
  const { status, errors, data } = await fetchQuery({
    defaultData: {
      postsSearch: {
        data: [],
        postsCount: 0,
        hasMorePosts: false,
      },
    },
    query: searchPagePostsQuery,
    variables: {
      query,
      offset,
      length,
    },
    languageShort,
    apolloTransport,
    sentryTag,
  });
  const posts = getProperty(data, 'postsSearch.data', []);
  const postsCount = getProperty(data, 'postsSearch.postsCount', 0);
  const hasMorePosts = getProperty(data, 'postsSearch.hasMorePosts', false);
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
      hasMorePosts,
    },
  };
};
