import { fetchQuery } from '~/api/modules/shared';
import relatedPostsQuery from '~/graphql/queries/relatedPosts.graphql';
import getProperty from '~/assets/libs/getProperty';
import { getMappedPostPreview, reduceRelatedPosts } from '~/assets/helpers/posts';
import { pipeFunctions } from '~/assets/libs/functional';
import filterNoneObjects from '~/assets/libs/filterNoneObjects';
import { RELATED_POSTS_LENGTH } from '~/app.config';

export const fetchRelatedPosts = async (options = {}) => {
  const { postId, excludeIds = [], languageShort, languageCode, timeZone, apolloTransport } = options;
  const { status, errors, data } = await fetchQuery({
    defaultData: {
      relatedPosts: [],
    },
    query: relatedPostsQuery,
    variables: {
      postId,
      excludeIds,
      relatedLength: RELATED_POSTS_LENGTH,
    },
    languageShort,
    apolloTransport,
    sentryTag: 'fetch-related-posts',
  });
  const relatedPosts = getProperty(data, 'relatedPosts', []);
  const postPreviewMapperOptions = {
    languageCode,
    timeZone,
    languageShort,
  };
  const relatedPostsComposition = pipeFunctions(
    filterNoneObjects,
    (posts) => posts.map((item) => getMappedPostPreview(item, postPreviewMapperOptions)),
    reduceRelatedPosts
  );
  return {
    status,
    errors,
    data: relatedPostsComposition(relatedPosts),
  };
};
