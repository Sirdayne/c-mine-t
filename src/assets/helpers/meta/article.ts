import getProperty from '~/assets/libs/getProperty';
import { DEFAULT_LANGUAGE, DEFAULT_META, IS_PRODUCTION, META_LOGO_URL, POST_FALLBACK_COVER_URL } from '~/app.config';
import { getBaiduScripts, getOpenGraphMeta, getTwitterMeta } from '~/assets/helpers/meta';
import { getThumbnail } from '~/assets/libs/getThumbnail';

export const getArticlePageJSONSchema = (options) => {
  const articleTitle = getProperty(options, 'article.translate.seoTitle', '');
  const description = getProperty(options, 'article.translate.seoDescription', '');
  const keywords = getProperty(options, 'article.translate.seoKeywords', '');
  const articleTextLength = getProperty(options, 'article.translate.fullText.length', 0);
  const articleCover = getProperty(options, 'article.coverImg', '');

  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'ItemList',
    headline: articleTitle,
    description,
    keywords,
    wordCount: articleTextLength,
    image: {
      '@type': 'ImageObject',
      url: getThumbnail({
        imageUrl: articleCover,
        width: 1200,
        defaultImage: POST_FALLBACK_COVER_URL,
      }),
      width: 1200,
      height: 800,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cointelegraph',
      logo: {
        '@type': 'ImageObject',
        url: META_LOGO_URL,
        width: 360,
        height: 60,
      },
    },
  };

  return {
    hid: 'ldjson-schema',
    type: 'application/ld+json',
    innerHTML: JSON.stringify(schema),
  };
};
export const getArticlePageMeta = (options) => {
  const meta = getProperty(options, 'meta', DEFAULT_META);
  const url = getProperty(meta, 'url', DEFAULT_META.url);
  const title = getProperty(options, 'article.translate.title', '');
  const seoTitle = getProperty(meta, 'title', title);
  const description = getProperty(options, 'article.translate.seoDescription', '');
  const currentLanguage = getProperty(options, 'currentLanguage', DEFAULT_LANGUAGE);
  const code = getProperty(options, 'currentLanguage.code', DEFAULT_LANGUAGE.code);
  const hostname = getProperty(options, 'currentLanguage.url', DEFAULT_LANGUAGE.url);
  const article = getProperty(options, 'article', null);
  const routeName = getProperty(options, 'routeName', '');
  const isCn = getProperty(options, 'isCn', false);
  const baiduScripts = isCn && IS_PRODUCTION && process.client ? getBaiduScripts(routeName) : [];

  return {
    htmlAttrs: {
      lang: code,
    },
    title: seoTitle,
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: description,
        lang: code,
      },
      ...getOpenGraphMeta({
        currentLanguage,
        meta,
      }),
      ...getTwitterMeta({
        meta,
      }),
    ],
    link: [
      {
        rel: 'canonical',
        href: `${hostname}${url}`,
      },
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: 'Cointelegraph RSS Feed',
        href: `${hostname}/rss`,
      },
    ],
    script: [
      ...baiduScripts,
      getArticlePageJSONSchema({
        article,
        currentLanguage,
        meta,
      }),
    ],
  };
};
