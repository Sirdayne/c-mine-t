import { fetchQuery } from '~/api/modules/shared';
import categoryPageQuery from '~/graphql/queries/categoryPage.graphql';
import categoryPagePostsQuery from '~/graphql/queries/categoryPagePosts.graphql';
import getProperty from '~/assets/libs/getProperty';
import { getMappedCategoryData } from '~/assets/helpers/categories';
import { getMappedPostPreview } from '~/assets/helpers/posts';
import { CATEGORY_PAGE_POSTS_LENGTH } from '~/app.config';

export const fetchCategoryPage = async (options = {}) => {
  const {
    slug,
    languageDomain,
    languageCode,
    timeZone,
    pathname,
    languageShort,
    apolloTransport,
    hideFromMainPage = null,
  } = options;
  const { status, errors, data } = await fetchQuery({
    defaultData: {
      category: null,
    },
    query: categoryPageQuery,
    variables: {
      slug,
      length: CATEGORY_PAGE_POSTS_LENGTH,
      hideFromMainPage,
    },
    languageShort,
    apolloTransport,
    sentryTag: 'fetch-category-page',
  });
  const category = getProperty(data, 'category', null);
  return {
    status,
    errors,
    data: getMappedCategoryData(category, {
      languageDomain,
      languageCode,
      timeZone,
      pathname,
      languageShort,
    }),
  };
};

export const fetchCategoryPagePosts = async (options = {}) => {
  const {
    slug,
    offset,
    languageDomain,
    languageCode,
    timeZone,
    languageShort,
    apolloTransport,
    hideFromMainPage = null,
  } = options;
  const { status, errors, data } = await fetchQuery({
    defaultData: {
      category: {
        posts: {
          data: [],
          postsCount: 0,
        },
      },
    },
    query: categoryPagePostsQuery,
    variables: {
      slug,
      offset,
      length: CATEGORY_PAGE_POSTS_LENGTH,
      hideFromMainPage,
    },
    languageShort,
    apolloTransport,
    sentryTag: 'fetch-category-posts',
  });
  const posts = getProperty(data, 'category.posts.data', []);
  const postsCount = getProperty(data, 'category.posts.postsCount', 0);
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

export const fetchCategoryPageInitialState = async (options = {}) => {
  const {
    slug,
    languageDomain,
    languageCode,
    timeZone,
    pathname,
    languageShort,
    apolloTransport,
    hideFromMainPage = null,
  } = options;
  const { data } = await fetchCategoryPage({
    slug,
    languageDomain,
    languageCode,
    timeZone,
    pathname,
    languageShort,
    apolloTransport,
    hideFromMainPage,
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
