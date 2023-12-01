import { fetchQuery } from '~/api/modules/shared';
import authorPageQuery from '~/graphql/queries/authorPage.graphql';
import authorPagePostsQuery from '~/graphql/queries/authorPagePosts.graphql';
import getProperty from '~/assets/libs/getProperty';
import { getMappedAuthorData } from '~/assets/helpers/authors';
import { getMappedPostPreview } from '~/assets/helpers/posts';
import { AUTHOR_PAGE_POSTS_LENGTH } from '~/app.config';

export const fetchAuthorPage = async (options = {}) => {
  const { slug, length, languageDomain, languageCode, timeZone, pathname, languageShort, apolloTransport } = options;
  const { status, errors, data } = await fetchQuery({
    defaultData: {
      author: null,
    },
    query: authorPageQuery,
    variables: {
      slug,
      length,
    },
    languageShort,
    apolloTransport,
    sentryTag: 'fetch-author-page',
  });
  const author = getProperty(data, 'author', null);
  return {
    status,
    errors,
    data: getMappedAuthorData(author, {
      languageDomain,
      languageCode,
      timeZone,
      pathname,
      languageShort,
    }),
  };
};

export const fetchAuthorPagePosts = async (options = {}) => {
  const { slug, offset, languageCode, timeZone, languageShort, apolloTransport } = options;
  const { status, errors, data } = await fetchQuery({
    defaultData: {
      author: {
        posts: {
          data: [],
          postsCount: 0,
        },
      },
    },
    query: authorPagePostsQuery,
    variables: {
      slug,
      offset,
      length: AUTHOR_PAGE_POSTS_LENGTH,
    },
    languageShort,
    apolloTransport,
    sentryTag: 'fetch-author-posts',
  });
  const posts = getProperty(data, 'author.posts.data', []);
  const postsCount = getProperty(data, 'author.posts.postsCount', 0);
  return {
    status,
    errors,
    data: {
      posts: posts.map((item) =>
        getMappedPostPreview(item, {
          languageCode,
          timeZone,
          languageShort,
        })
      ),
      postsCount,
    },
  };
};

export const fetchAuthorPageInitialState = async (options = {}) => {
  const { slug, languageDomain, languageCode, timeZone, pathname, languageShort, apolloTransport } = options;
  const { data } = await fetchAuthorPage({
    slug,
    length: AUTHOR_PAGE_POSTS_LENGTH,
    languageDomain,
    languageCode,
    timeZone,
    pathname,
    languageShort,
    apolloTransport,
  });
  const posts = getProperty(data, 'posts', []);
  const postsCount = getProperty(data, 'postsCount', 0);
  const author = getProperty(data, 'author', null);
  const meta = getProperty(data, 'meta', null);
  const alternates = getProperty(data, 'alternates', []);
  return {
    author,
    posts,
    postsOffset: posts.length,
    postsAmount: postsCount,
    meta,
    alternates,
  };
};
