import getProperty from '~/assets/libs/getProperty';
import filterNoneObjects from '~/assets/libs/filterNoneObjects';
import { getMappedPostPreview } from '~/assets/helpers/posts';

export const getMappedCategoryData = (category, options = {}) => {
  if (!category || typeof category !== 'object') {
    return {
      category: null,
      posts: [],
      postsCount: 0,
      meta: null,
      alternates: [],
    };
  }
  const { languageDomain, languageCode, timeZone, pathname, languageShort } = options;
  const translation = getProperty(category, 'categoryTranslates[0]', {});
  const posts = getProperty(category, 'posts.data', []);
  const postsCount = getProperty(category, 'posts.postsCount', 0);
  const alternates = getProperty(category, 'alternates', []);
  return {
    category: {
      title: translation.title,
      description: translation.description,
      alt: translation.alt,
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
      title: translation.metaTitle,
      description: translation.metaDescription,
      keywords: translation.keywords,
      createdAt: category.createdAt,
    },
    alternates,
  };
};

export const isValidCategory = (data = {}) => {
  return data && data.category && Array.isArray(data.posts) && data.posts.length;
};
