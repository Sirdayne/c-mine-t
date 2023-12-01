import getProperty from '~/assets/libs/getProperty';
import { DEFAULT_LANGUAGE, DEFAULT_META, IS_PRODUCTION, META_LOGO_URL, POST_FALLBACK_COVER_URL } from '~/app.config';
import { getBaiduScripts, getOpenGraphMeta, getTwitterMeta } from '~/assets/helpers/meta';
import { getThumbnail } from '~/assets/libs/getThumbnail';

export const getSpecialProjectPageJSONSchema = (options: any) => {
  const headline = getProperty(options, 'meta.title', DEFAULT_META.title);
  const description = getProperty(options, 'meta.description', DEFAULT_META.description);
  const keywords = getProperty(options, 'meta.keywords', '');
  const coverImage = getProperty(options, 'coverImage', '');

  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Article',
    headline,
    description,
    keywords,
    image: {
      '@type': 'ImageObject',
      url: getThumbnail({
        imageUrl: coverImage,
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

export const getSpecialProjectPageMeta = (options: any) => {
  const meta = getProperty(options, 'meta', DEFAULT_META);
  const url = getProperty(meta, 'url', DEFAULT_META.url);
  const title = getProperty(meta, 'title', DEFAULT_META.title);
  const description = getProperty(meta, 'description', DEFAULT_META.description);
  const currentLanguage = getProperty(options, 'currentLanguage', DEFAULT_LANGUAGE);
  const currentLanguageId = getProperty(options, 'currentLanguage.id', DEFAULT_LANGUAGE.id);
  const code = getProperty(options, 'currentLanguage.code', DEFAULT_LANGUAGE.code);
  const hostname = getProperty(options, 'currentLanguage.url', DEFAULT_LANGUAGE.url);
  const routeName = getProperty(options, 'routeName', '');
  const isCn = currentLanguageId.toString() === '4';
  const baiduScripts = isCn && IS_PRODUCTION && process.client ? getBaiduScripts(routeName) : [];
  const coverImage = getProperty(options, 'meta.image', '');

  return {
    htmlAttrs: {
      lang: code,
    },
    title,
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
      getSpecialProjectPageJSONSchema({
        currentLanguage,
        meta,
        coverImage,
      }),
      ...baiduScripts,
    ],
  };
};
