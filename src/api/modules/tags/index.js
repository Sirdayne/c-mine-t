import { fetchQuery } from '~/api/modules/shared';
import tagPageQuery from '~/graphql/queries/tagPage.graphql';
import getProperty from '~/assets/libs/getProperty';
import { getMappedTagData } from '~/assets/helpers/tags';
import { TAG_PAGE_POSTS_LENGTH, POSTS_ORDER_TYPES } from '~/app.config';

export const fetchTagPage = async (options = {}) => {
  const {
    slug,
    order,
    offset,
    length = TAG_PAGE_POSTS_LENGTH,
    languageDomain,
    languageCode,
    timeZone,
    pathname,
    languageShort,
    apolloTransport,
    sentryTag = 'fetch-tag-page',
  } = options;
  const { status, errors, data } = await fetchQuery({
    defaultData: {
      tag: null,
    },
    query: tagPageQuery,
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
  const tag = getProperty(data, 'tag', null);
  return {
    status,
    errors,
    data: getMappedTagData(tag, {
      languageDomain,
      languageCode,
      timeZone,
      pathname,
      languageShort,
    }),
  };
};

export const fetchTagPageInitialState = async (options = {}) => {
  const { slug, languageDomain, languageCode, timeZone, pathname, languageShort, apolloTransport } = options;
  const [{ data: byTimeData }] = await Promise.all([
    fetchTagPage({
      slug,
      order: POSTS_ORDER_TYPES.BY_TIME,
      offset: 0,
      languageDomain,
      languageCode,
      timeZone,
      pathname,
      languageShort,
      apolloTransport,
    }),
  ]);
  const tag = getProperty(byTimeData, 'tag', null);
  const byTimePosts = getProperty(byTimeData, 'posts', []);
  const byTimePostsCount = getProperty(byTimeData, 'postsCount', 0);
  const meta = getProperty(byTimeData, 'meta', null);
  const alternates = getProperty(byTimeData, 'alternates', []);
  return {
    tag,
    postData: {
      isPending: false,
      order: POSTS_ORDER_TYPES.BY_TIME,
      posts: byTimePosts,
      postsOffset: byTimePosts.length,
      postsAmount: byTimePostsCount,
    },
    meta,
    alternates,
  };
};
