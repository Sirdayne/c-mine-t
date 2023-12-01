import { fetchQuery } from '~/api/modules/shared';
import localPostsQuery from '~/graphql/queries/localPosts.graphql';
import localPostsPageQuery from '~/graphql/queries/localPostsPage.graphql';
import getProperty from '~/assets/libs/getProperty';
import { LOCAL_POSTS_PAGE_POSTS_LENGTH } from '~/app.config';
import { getMappedLocalPostsPageData } from '~/assets/helpers/localPosts';
import { getMappedPostPreview } from '~/assets/helpers/posts';

export const fetchLocalPostsPage = async (options = {}) => {
  const { languageDomain, languageCode, timeZone, pathname, languageShort, apolloTransport } = options;
  const { status, errors, data } = await fetchQuery({
    defaultData: {
      category: null,
    },
    query: localPostsPageQuery,
    variables: {
      length: LOCAL_POSTS_PAGE_POSTS_LENGTH,
    },
    languageShort,
    apolloTransport,
    sentryTag: 'fetch-local-posts-page',
  });
  const category = getProperty(data, 'localPosts', null);
  return {
    status,
    errors,
    data: getMappedLocalPostsPageData(category, {
      languageDomain,
      languageCode,
      timeZone,
      pathname,
      languageShort,
    }),
  };
};

export const fetchLocalPagePosts = async (options = {}) => {
  const { slug, offset, languageDomain, languageCode, timeZone, languageShort, apolloTransport } = options;
  const { status, errors, data } = await fetchQuery({
    defaultData: {
      category: {
        posts: {
          data: [],
          postsCount: 0,
        },
      },
    },
    query: localPostsQuery,
    variables: {
      slug,
      offset,
      length: LOCAL_POSTS_PAGE_POSTS_LENGTH,
    },
    languageShort,
    apolloTransport,
    sentryTag: 'fetch-local-posts',
  });
  const posts = getProperty(data, 'localPosts.posts.data', []);
  const postsCount = getProperty(data, 'localPosts.posts.postsCount', 0);
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

export const fetchLocalPostsPageInitialState = async (options = {}) => {
  const { languageDomain, languageCode, timeZone, pathname, languageShort, apolloTransport } = options;
  const { data } = await fetchLocalPostsPage({
    languageDomain,
    languageCode,
    timeZone,
    pathname,
    languageShort,
    apolloTransport,
  });
  const category = getProperty(data, 'category', null);
  const posts = getProperty(data, 'posts', []);
  const postsOffset = posts.length;
  const postsAmount = getProperty(data, 'postsCount', 0);
  const meta = getProperty(data, 'meta', null);
  const alternates = getProperty(data, 'alternates', []);
  return {
    category,
    posts,
    postsOffset,
    postsAmount,
    meta,
    alternates,
  };
};
