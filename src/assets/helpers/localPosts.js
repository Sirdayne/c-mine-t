import getProperty from '~/assets/libs/getProperty';
import filterNoneObjects from '~/assets/libs/filterNoneObjects';
import { getMappedPostPreview } from '~/assets/helpers/posts';

export const getMappedLocalPostsPageData = (localPage, options = {}) => {
  if (!localPage || typeof localPage !== 'object') {
    return {
      category: null,
      posts: [],
      postsCount: 0,
      meta: null,
      alternates: [],
    };
  }
  const { languageDomain, languageCode, timeZone, pathname, languageShort } = options;
  const seoTitle = getProperty(localPage, 'title', {});
  const seoDescription = getProperty(localPage, 'description', {});
  const keywords = getProperty(localPage, 'keywords', {});
  const posts = getProperty(localPage, 'posts.data', []);
  const postsCount = getProperty(localPage, 'posts.postsCount', 0);
  const alternates = getProperty(localPage, 'alternates', []);
  return {
    category: {
      title: seoTitle,
      description: seoDescription,
    },
    posts: filterNoneObjects(posts).map((item) =>
      getMappedPostPreview(item, {
        languageDomain,
        languageCode,
        timeZone,
        languageShort,
      })
    ),
    postsCount,
    meta: {
      url: pathname,
      title: seoTitle,
      description: seoDescription,
      keywords,
    },
    alternates,
  };
};
