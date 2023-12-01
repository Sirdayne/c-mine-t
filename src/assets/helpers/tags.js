import getProperty from '~/assets/libs/getProperty';
import filterNoneObjects from '~/assets/libs/filterNoneObjects';
import { getMappedPostPreview } from '~/assets/helpers/posts';
import { getFormattedDateString } from '~/assets/helpers/dateTime';

export const getMappedTagData = (tag, options = {}) => {
  if (!tag || typeof tag !== 'object') {
    return {
      tag: null,
      posts: [],
      postsCount: 0,
      meta: null,
      alternates: [],
    };
  }
  const { languageDomain, languageCode, timeZone, pathname, languageShort } = options;
  const translation = getProperty(tag, 'tagTranslates[0]', {});
  const posts = getProperty(tag, 'posts.data', []);
  const postsCount = getProperty(tag, 'posts.postsCount', 0);
  const datePublished = getProperty(tag, 'createdAt', '');
  const dateModified = getProperty(tag, 'updatedAt', '');
  const alternates = getProperty(tag, 'alternates', []);
  const redirectRelativeUrl = getProperty(tag, 'redirectRelativeUrl', '');
  return {
    tag: {
      id: tag.id,
      title: translation.pageTitle,
      titleAlt: translation.title,
      about: translation.description,
      cover: tag.avatar,
      redirectRelativeUrl,
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
      image: tag.avatar,
      datePublished: getFormattedDateString(datePublished),
      dateModified: getFormattedDateString(dateModified),
    },
    alternates,
  };
};
