import getProperty from '~/assets/libs/getProperty';
import filterNoneObjects from '~/assets/libs/filterNoneObjects';
import { getMappedPostPreview } from '~/assets/helpers/posts';
import { AUTHOR_FALLBACK_FEMALE_URL, AUTHOR_FALLBACK_MALE_URL } from '~/app.config';

export const getMappedAuthorData = (author, options = {}) => {
  if (!author || typeof author !== 'object') {
    return {
      author: null,
      posts: [],
      postsCount: 0,
      meta: null,
      alternates: [],
    };
  }
  const { languageDomain, languageCode, timeZone, pathname, languageShort } = options;
  const translation = getProperty(author, 'authorTranslates.0', {});
  const alternates = getProperty(author, 'alternates', []);
  const socialLinks = [];
  if (author.twitter) {
    socialLinks.push({
      id: 'twitter',
      url: author.twitter,
      iconName: 'twitter',
    });
  }
  if (author.facebook) {
    socialLinks.push({
      id: 'facebook',
      url: author.facebook,
      iconName: 'facebook',
    });
  }
  if (author.googlePlus) {
    socialLinks.push({
      id: 'googlePlus',
      url: author.googlePlus,
      iconName: 'googleplus',
    });
  }
  if (author.linkedin) {
    socialLinks.push({
      id: 'linkedin',
      url: author.linkedin,
      iconName: 'linkedin',
    });
  }
  if (author.email) {
    socialLinks.push({
      id: 'email',
      url: `mailto:${author.email}`,
      iconName: 'email',
    });
  }
  const fallbackAvatar = author.gender === 'female' ? AUTHOR_FALLBACK_FEMALE_URL : AUTHOR_FALLBACK_MALE_URL;
  const posts = getProperty(author, 'posts.data', []);
  const postsCount = getProperty(author, 'posts.postsCount', 0);
  const fallbackTitle = `${translation.name} articles on Cointelegraph`;
  const fallbackDescription = `${translation.name} archive page on Cointelegraph. Articles, opinions and reviews by ${translation.name}`;
  return {
    author: {
      name: translation.name,
      about: translation.description,
      avatar: author.avatar || fallbackAvatar,
      socialLinks,
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
      title: translation.seoTitle || fallbackTitle,
      description: translation.seoDescription || fallbackDescription,
      image: author.avatar || fallbackAvatar,
      openGraphType: 'profile',
      twitterCard: 'summary',
      createdAt: author.createdAt,
    },
    alternates,
  };
};
