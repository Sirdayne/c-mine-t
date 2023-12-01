import getProperty from '~/assets/libs/getProperty';
import filterNoneObjects from '~/assets/libs/filterNoneObjects';
import getYoutubeVideoId from '~/assets/libs/youtubeVideoIdParser';
import getFormattedDate from '~/assets/libs/getFormattedDate';
import {
  AUTHOR_FALLBACK_FEMALE_URL,
  AUTHOR_FALLBACK_MALE_URL,
  DEFAULT_LANGUAGE,
  POST_FALLBACK_COVER_URL,
} from '~/app.config';
import { pipeFunctions } from '~/assets/libs/functional';
import { rootUrlResolver } from '~/assets/helpers/utils';
import { restSlugMap } from '~/assets/helpers/i18n';

const getSeoTitleTail = (i18n = {}) => {
  const postTitleSeoTail = getProperty(i18n, 'postTitleSeoTail', '');
  const isSeoTailFilled = postTitleSeoTail && postTitleSeoTail !== restSlugMap.postTitleSeoTail;
  return isSeoTailFilled ? postTitleSeoTail : '';
};

const getSeoTitle = (title = '', i18n = {}) => {
  return title.length > 54 ? title : title + getSeoTitleTail(i18n);
};

export const reduceRelatedPosts = (posts = []) => {
  const postsNumber = posts.length;
  switch (true) {
    case postsNumber >= 3 && postsNumber < 6:
      return posts.slice(0, 3);
    case postsNumber >= 6:
      return posts.slice(0, 6);
    default:
      return [];
  }
};

export const addPostIdToAlternateObject =
  (articleId) =>
  (item = {}) => ({
    ...item,
    articleId,
  });

export const reduceArticlesToAlternates = (acc, { id, alternates = [] } = {}) => {
  return Array.isArray(alternates) && alternates.length
    ? [...acc, ...alternates.map(addPostIdToAlternateObject(id))]
    : acc;
};

export const getMappedPostTags = (tags = []) => {
  if (!tags || !tags.length) {
    return [];
  }
  return filterNoneObjects(tags).map((tag) => {
    const id = getProperty(tag, 'id', '');
    const slug = getProperty(tag, 'slug', '');
    const tagTranslates = getProperty(tag, 'tagTranslates[0]', '');
    const title = getProperty(tagTranslates, 'title', '');
    const url = `/tags/${slug}`;
    return {
      id,
      slug,
      title,
      url,
    };
  });
};

export const getPostPreSlug = (categoryId) => {
  let preSlug;
  switch (+categoryId) {
    case 58:
      preSlug = 'press-releases';
      break;
    case 107:
      preSlug = 'market-releases';
      break;
    case 65:
      preSlug = 'explained';
      break;
    case 82:
      preSlug = 'quiz';
      break;
    case 106:
      preSlug = 'innovation-circle';
      break;
    default:
      preSlug = 'news';
  }
  return preSlug;
};

export const getPostUrl = (options) => {
  const slug = getProperty(options, 'slug', '');
  const categoryId = getProperty(options, 'categoryId', '');
  if (!slug) {
    return '/';
  }
  const postPreSlug = getPostPreSlug(categoryId);
  return `/${postPreSlug}/${slug}`;
};

export const getAbsoluteUrl = (options) => {
  const domain = getProperty(options, 'domain', DEFAULT_LANGUAGE.domain);
  const url = getProperty(options, 'url', '');
  const rootUrl = rootUrlResolver({
    domain,
    isDuke: false,
  });
  return `${rootUrl}${url}`;
};

// just extracted legacy shit
const getMappedPostAuthor = (postData) => {
  const postAuthor = postData?.author;
  const postTranslateAuthor = postData?.postTranslate?.author;
  const author = postTranslateAuthor ?? postAuthor;
  const innovationCircleUrl = postTranslateAuthor?.innovationCircleUrl ?? postAuthor?.innovationCircleUrl;

  const name = author?.authorTranslates?.[0]?.name ?? author?.name ?? '';
  let avatar = '';
  if (!author?.avatar) {
    if (author?.gender) {
      avatar = author?.gender === 'female' ? AUTHOR_FALLBACK_FEMALE_URL : AUTHOR_FALLBACK_MALE_URL;
    } else {
      avatar = postAuthor?.gender === 'female' ? AUTHOR_FALLBACK_FEMALE_URL : AUTHOR_FALLBACK_MALE_URL;
    }
  } else {
    avatar = author?.avatar;
  }

  const url = innovationCircleUrl ?? `/authors/${author?.slug}`;
  return { name, avatar, url };
};

export const getMappedPostPreview = (postData, options) => {
  const languageDomain = getProperty(options, 'languageDomain', DEFAULT_LANGUAGE.domain);
  const languageCode = getProperty(options, 'languageCode', DEFAULT_LANGUAGE.code);
  const timeZone = getProperty(options, 'timeZone', DEFAULT_LANGUAGE.timezone);
  const translation = getProperty(postData, 'postTranslate', {});
  const category = getProperty(postData, 'category', {});
  const views = getProperty(postData, 'views', 0);
  const showShares = getProperty(postData, 'showShares', true);
  const showStats = getProperty(postData, 'showStats', true);
  const categoryTranslation = getProperty(category, 'categoryTranslates[0]', {});

  const { name: authorName, url: authorUrl } = getMappedPostAuthor(postData);

  const badge = getProperty(postData, 'postBadge', {});
  const badgeTranslation = getProperty(badge, 'postBadgeTranslates[0]', {});
  const dateHuman = getProperty(translation, 'publishedHumanFormat', '');
  const isMagazinePost = category.slug === 'magazine';
  const url = isMagazinePost
    ? postData.slug
    : getPostUrl({
        slug: postData.slug,
        categoryId: category.id,
      });
  const absoluteUrl = isMagazinePost
    ? postData.slug
    : getAbsoluteUrl({
        domain: languageDomain,
        url,
      });
  const { dateISOShort: datePublished, dateTimeObject: publishedDateTimeObject } = getFormattedDate({
    date: translation.published,
    languageCode,
    timeZone,
  });
  return {
    id: postData.id,
    isSponsored: category.slug === 'sponsored',
    isPressRelease: category.slug === 'press-releases',
    isMarketRelease: category.slug === 'market-releases',
    isExplained: category.slug === 'explained',
    isMagazinePost,
    url,
    absoluteUrl,
    title: translation.title,
    cover: translation.avatar,
    datePublished,
    dateHuman,
    publishedDateTimeObject,
    categorySlug: category.slug,
    categoryUrl: `/category/${category.slug}`,
    categoryName: categoryTranslation.title,
    authorUrl,
    authorName,
    previewText: translation.leadText,
    badgeSlug: badge.label,
    badgeName: badgeTranslation.title,
    views,
    showShares,
    showStats,
  };
};

export const getMappedPost = (postData, options) => {
  if (!postData) {
    return {
      meta: null,
      article: null,
      alternates: [],
    };
  }
  const languageShort = getProperty(options, 'languageShort', DEFAULT_LANGUAGE.short);
  const languageDomain = getProperty(options, 'languageDomain', DEFAULT_LANGUAGE.domain);
  const languageCode = getProperty(options, 'languageCode', DEFAULT_LANGUAGE.code);
  const timeZone = getProperty(options, 'timeZone', DEFAULT_LANGUAGE.timezone);
  const i18n = getProperty(options, 'i18n', {});
  const translation = getProperty(postData, 'postTranslate', {});
  const category = getProperty(postData, 'category', {});
  const views = getProperty(postData, 'views', 0);
  const categoryTranslation = getProperty(category, 'categoryTranslates[0]', {});

  const { name: authorName, avatar: authorAvatar, url: authorUrl } = getMappedPostAuthor(postData);
  const badge = getProperty(postData, 'postBadge', {});
  const showShares = getProperty(postData, 'showShares', true);
  const showStats = getProperty(postData, 'showStats', true);
  const isNoIndex = getProperty(translation, 'noIndex', false);
  const tags = getMappedPostTags(postData.tags);
  const badgeTranslation = getProperty(badge, 'postBadgeTranslates[0]', {});
  const topics = getProperty(postData, 'topics', []);
  const relatedPosts = getProperty(postData, 'relatedPosts', []);
  const alternates = getProperty(postData, 'alternates', []);
  const postOptions = getProperty(postData, 'postOptions', {});
  const dateHuman = getProperty(translation, 'publishedHumanFormat', '');
  const mappedTopics = filterNoneObjects(topics).map((item) => {
    const post = getProperty(item, 'post', {});
    const mappedPost = getMappedPostPreview(post, {
      languageShort,
      languageDomain,
    });
    delete item.post;
    return {
      ...item,
      ...mappedPost,
    };
  });
  const relatedPostsComposition = pipeFunctions(
    filterNoneObjects,
    (posts) =>
      posts.map((item) =>
        getMappedPostPreview(item, {
          languageShort,
          languageDomain,
        })
      ),
    reduceRelatedPosts
  );
  const url = getPostUrl({
    slug: postData.slug,
    categoryId: category.id,
  });
  const absoluteUrl = getAbsoluteUrl({
    domain: languageDomain,
    url,
  });
  const {
    dateISOShort: datePublished,
    dateISOFull,
    dateTimeObject: publishedDateTimeObject,
    humanDateTime,
  } = getFormattedDate({
    date: translation.published,
    languageCode,
    timeZone,
  });
  return {
    article: {
      id: postData.id,
      isDeleted: !!postData.deletedAt,
      isDisclaimerHidden: postOptions.hideDisclaimer,
      isPromo: postOptions.isPromo,
      isSponsored: category.slug === 'sponsored',
      isPressRelease: category.slug === 'press-releases',
      isMarketRelease: category.slug === 'market-releases',
      isExplained: category.slug === 'explained',
      isInnovationCircle: category.slug === 'innovation-circle',
      isDefined: badgeTranslation.id === '2027',
      slug: postData.slug,
      url,
      absoluteUrl,
      title: translation.title,
      youtubeVideoIdCover: getYoutubeVideoId(translation.youtube),
      cover: translation.avatar,
      datePublished,
      dateHuman,
      humanDateTime,
      dateISOFull,
      publishedDateTimeObject,
      categorySlug: category.slug,
      categoryUrl: `/category/${category.slug}`,
      categoryName: categoryTranslation.title,
      authorUrl,
      authorName,
      authorAvatar,
      previewText: translation.leadText,
      twitterLeadText: translation.twitterLeadText,
      badgeSlug: badge.label,
      badgeName: badgeTranslation.title,
      fullText: translation.bodyText,
      audio: translation.audio,
      facebookShares: translation.facebookShares,
      twitterShares: translation.twitterShares,
      redditShares: translation.redditShares,
      views,
      shares: translation.totalShares,
      tags,
      topics: mappedTopics,
      relatedPosts: relatedPostsComposition(relatedPosts),
      trackingPixelUrl: postData.pixelUrl,
      showShares,
      showStats,
      isNoIndex,
      translationId: translation.id,
    },
    meta: {
      articleId: postData.id,
      url,
      title: translation.title,
      seoTitle: getSeoTitle(translation.title, i18n),
      description: translation.description,
      image: translation.avatar || POST_FALLBACK_COVER_URL,
      openGraphType: 'article',
    },
    alternates: alternates.map(addPostIdToAlternateObject(postData.id)),
  };
};

export const getMappedCategory = (category, options) => {
  if (!category || typeof category !== 'object') {
    return {
      category: {
        slug: '',
        title: '',
      },
      posts: [],
      postsCount: 0,
    };
  }
  const languageDomain = getProperty(options, 'languageDomain', DEFAULT_LANGUAGE.domain);
  const languageShort = getProperty(options, 'languageShort', DEFAULT_LANGUAGE.short);
  const languageCode = getProperty(options, 'languageCode', DEFAULT_LANGUAGE.code);
  const timeZone = getProperty(options, 'timeZone', DEFAULT_LANGUAGE.timezone);
  const translation = getProperty(category, 'categoryTranslates[0]', {});
  const posts = getProperty(category, 'posts.data', []);
  const postsCount = getProperty(category, 'posts.postsCount', 0);
  return {
    category: {
      id: category.id,
      slug: category.slug,
      title: translation.title,
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
  };
};

export const getMappedUniBlock = (uniBlock, options) => {
  if (!uniBlock || typeof uniBlock !== 'object') {
    return null;
  }
  const languageDomain = getProperty(options, 'languageDomain', DEFAULT_LANGUAGE.domain);
  const languageCode = getProperty(options, 'languageCode', DEFAULT_LANGUAGE.code);
  const timeZone = getProperty(options, 'timeZone', DEFAULT_LANGUAGE.timezone);
  const translation = getProperty(uniBlock, 'universalBlockTranslates[0]', {});
  const posts = getProperty(uniBlock, 'posts.data', []);
  return {
    id: uniBlock.id,
    type: uniBlock.type,
    title: translation.title,
    posts: filterNoneObjects(posts).map((item) =>
      getMappedPostPreview(item, {
        languageDomain,
        languageCode,
        timeZone,
      })
    ),
  };
};
