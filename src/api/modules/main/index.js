import mainPagePostsQuery from '~/graphql/queries/mainPagePosts.graphql';
import { fetchQuery } from '~/api/modules/shared';
import getProperty from '~/assets/libs/getProperty';
import filterNoneObjects from '~/assets/libs/filterNoneObjects';
import { getMappedPostPreview } from '~/assets/helpers/posts';
import { MAIN_PAGE_POSTS_LENGTH } from '~/app.config';
import { MILLISECONDS_PER_SECOND } from '~/assets/helpers/timeConstants';

export const fetchMainPosts = async (options = {}) => {
  const {
    offset,
    length = MAIN_PAGE_POSTS_LENGTH,
    languageDomain,
    languageCode,
    timeZone,
    languageShort,
    apolloTransport,
  } = options;
  const { status, errors, data } = await fetchQuery({
    defaultData: {
      posts: {
        data: [],
        postsCount: 0,
      },
    },
    query: mainPagePostsQuery,
    variables: {
      offset,
      length,
    },
    languageShort,
    apolloTransport,
    sentryTag: 'fetch-main-posts',
    cacheTimeInMS: MILLISECONDS_PER_SECOND,
  });
  const posts = getProperty(data, 'posts.data', []);
  const postsCount = getProperty(data, 'posts.postsCount', 0);
  const hasMorePosts = getProperty(data, 'posts.hasMorePosts', false);
  return {
    status,
    errors,
    data: {
      posts: filterNoneObjects(posts).map((item) =>
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
