import { fetchQuery } from '~/api/modules/shared';
import innovationCirclePageQuery from '~/graphql/queries/innovationCirclePage.graphql';
import getProperty from '~/assets/libs/getProperty';
import { getMappedInnovationCircleData } from '~/assets/helpers/innovationCircle';
import { INNOVATION_CIRCLE_PAGE_POSTS_LENGTH, POSTS_ORDER_TYPES, RELATED_POSTS_LENGTH } from '~/app.config';

export const fetchInnovationCirclePage = async (options = {}) => {
  const {
    order,
    offset,
    length = INNOVATION_CIRCLE_PAGE_POSTS_LENGTH,
    languageDomain,
    languageCode,
    timeZone,
    pathname,
    languageShort,
    apolloTransport,
    sentryTag = 'fetch-innovation-circle-page',
  } = options;
  const { status, errors, data } = await fetchQuery({
    defaultData: {
      posts: [],
    },
    query: innovationCirclePageQuery,
    variables: {
      order,
      offset,
      length,
      relatedLength: RELATED_POSTS_LENGTH,
    },
    languageShort,
    apolloTransport,
    sentryTag,
  });
  // const posts = getProperty(data, 'posts', null);
  // console.log(status, errors, data);
  return {
    status,
    errors,
    data: getMappedInnovationCircleData(data, {
      languageDomain,
      languageCode,
      timeZone,
      pathname,
      languageShort,
    }),
  };
};

export const fetchInnovationCirclePageInitialState = async (options = {}) => {
  const { languageDomain, languageCode, timeZone, pathname, languageShort, apolloTransport } = options;
  const [{ data: byTimeData }] = await Promise.all([
    fetchInnovationCirclePage({
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
  const byTimePosts = getProperty(byTimeData, 'posts', []);
  const byTimePostsCount = getProperty(byTimeData, 'postsCount', 0);
  return {
    postData: {
      isPending: false,
      order: POSTS_ORDER_TYPES.BY_TIME,
      posts: byTimePosts,
      postsOffset: byTimePosts.length,
      postsAmount: byTimePostsCount,
    },
  };
};
