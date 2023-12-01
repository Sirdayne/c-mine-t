import { format } from 'date-fns';
import getProperty from '~/assets/libs/getProperty';
import { getThumbnail } from '~/assets/libs/getThumbnail';
import {
  META_LOGO_URL,
  DEFAULT_LANGUAGE,
  DEFAULT_META,
  POST_FALLBACK_COVER_URL,
  IS_PRODUCTION,
  INNOVATION_CIRCLE_META,
  NEWSLETTER_META,
} from '~/app.config';
import { rootUrlResolver } from '~/assets/helpers/utils';

const SPECIAL_CATEGORIES = ['explained', 'press-releases', 'market-releases', 'innovation-circle'];

/**
 * We stop supporting AMP pages generation after 9 of May 2023
 * https://jira.cointelegraph.com/browse/CDT-3246
 * Slack thread https://ctmain.slack.com/archives/C03TZ8HGC1E/p1683208807846579
 * */
const isAmpPagesGenerationAllowed = (publishDate) => {
  // Fix date after test
  const ampPublishDateDeadline = new Date(2023, 7, 18, 12, 0, 0, 0);
  const currentDate =
    typeof publishDate === 'object'
      ? new Date(
          publishDate.year,
          publishDate.month,
          publishDate.day,
          publishDate.hour,
          publishDate.minute,
          publishDate.millisecond
        )
      : new Date(publishDate);
  return currentDate.getTime() < ampPublishDateDeadline.getTime();
};

const getIosAppJsonSchema = (options = {}) => {
  const name = getProperty(options, 'i18n.softwareApplicationName', '');
  const downloadUrl = getProperty(options, 'i18n.softwareApplicationIosUrl', '');
  const description = getProperty(options, 'description', DEFAULT_META.description);
  const inLanguage = getProperty(options, 'currentLanguage.name', DEFAULT_LANGUAGE.name);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    image: 'https://s3.cointelegraph.com/storage/uploads/view/b047f51d2b432d557098db927fc5dc48.png',
    inLanguage,
    operatingSystem: 'iOS',
    downloadUrl,
    applicationCategory: 'News',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.7',
      ratingCount: '70',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      category: 'free',
    },
  };
  return {
    hid: 'ios-app-ldjson-schema',
    type: 'application/ld+json',
    innerHTML: JSON.stringify(schema),
  };
};

const getAndroidAppJsonSchema = (options = {}) => {
  const name = getProperty(options, 'i18n.softwareApplicationName', '');
  const downloadUrl = getProperty(options, 'i18n.softwareApplicationAndroidUrl', '');
  const description = getProperty(options, 'description', DEFAULT_META.description);
  const inLanguage = getProperty(options, 'currentLanguage.name', DEFAULT_LANGUAGE.name);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    image: 'https://s3.cointelegraph.com/storage/uploads/view/b047f51d2b432d557098db927fc5dc48.png',
    inLanguage,
    operatingSystem: 'Android',
    downloadUrl,
    applicationCategory: 'News',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.6',
      ratingCount: '339',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      category: 'free',
    },
  };
  return {
    hid: 'android-app-ldjson-schema',
    type: 'application/ld+json',
    innerHTML: JSON.stringify(schema),
  };
};

const getNoIndexMeta = (isNoIndex = false) => {
  const noIndexMeta = [
    {
      hid: 'robots-noindex',
      name: 'robots',
      content: 'noindex',
    },
  ];
  return isNoIndex ? noIndexMeta : [];
};

const getBaiduReferrerScript = (routeName = 'index') => ({
  hid: `baidu-index-${routeName}-${Date.now()}`,
  defer: true,
  src: 'https://zz.bdstatic.com/linksubmit/push.js',
  pbody: true,
  once: true,
});

const getBaiduAnalyticsScript = (routeName = 'index') => ({
  hid: `baidu-analytics-${routeName}-${Date.now()}`,
  defer: true,
  src: 'https://hm.baidu.com/hm.js?fe7fe1c71b0a1c3991246d0d454740f8',
  once: true,
});

export const getBaiduScripts = (routeName = 'index') => [
  getBaiduReferrerScript(routeName),
  getBaiduAnalyticsScript(routeName),
];

export const getOpenGraphMeta = (options) => {
  const hostname = getProperty(options, 'currentLanguage.url', DEFAULT_LANGUAGE.url);
  const url = getProperty(options, 'meta.url', DEFAULT_META.url);
  const title = getProperty(options, 'meta.title', DEFAULT_META.title);
  const description = getProperty(options, 'meta.description', DEFAULT_META.description);
  const image = getProperty(options, 'meta.image', DEFAULT_META.image);
  const openGraphType = getProperty(options, 'meta.openGraphType', DEFAULT_META.openGraphType);
  return [
    {
      property: 'og:url',
      content: `${hostname}${url}`,
    },
    {
      property: 'og:image',
      content: getThumbnail({
        imageUrl: image,
        width: 1200,
        defaultImage: POST_FALLBACK_COVER_URL,
      }),
    },
    {
      property: 'og:title',
      content: title,
    },
    {
      property: 'og:description',
      content: description,
    },
    {
      property: 'og:type',
      content: openGraphType,
    },
    {
      property: 'og:site_name',
      content: 'Cointelegraph',
    },
  ];
};

export const getTwitterMeta = (options) => {
  const title = getProperty(options, 'meta.title', DEFAULT_META.title);
  const description = getProperty(options, 'meta.description', DEFAULT_META.description);
  const image = getProperty(options, 'meta.image', DEFAULT_META.image);
  const twitterCard = getProperty(options, 'meta.twitterCard', DEFAULT_META.twitterCard);
  return [
    {
      property: 'twitter:card',
      content: twitterCard,
    },
    {
      property: 'twitter:site',
      content: '@cointelegraph',
    },
    {
      property: 'twitter:creator',
      content: '@cointelegraph',
    },
    {
      property: 'twitter:title',
      content: title,
    },
    {
      property: 'twitter:description',
      content: description,
    },
    {
      property: 'twitter:image',
      content: getThumbnail({
        imageUrl: image,
        width: 1200,
        defaultImage: POST_FALLBACK_COVER_URL,
      }),
    },
  ];
};

export const getMobileAppsJsonSchema = (options = {}) => {
  const currentLanguage = getProperty(options, 'currentLanguage', DEFAULT_LANGUAGE);
  const isNotUniversal = currentLanguage.id.toString() !== '1';
  return isNotUniversal ? [getIosAppJsonSchema(options), getAndroidAppJsonSchema(options)] : [];
};

export const getOrganizationJSONSchema = (options) => {
  const hostname = getProperty(options, 'hostname', DEFAULT_LANGUAGE.url);
  const url = getProperty(options, 'meta.url', DEFAULT_META.url);
  return {
    author: {
      '@type': 'Organization',
      name: 'Cointelegraph',
      legalName: 'Cointelegraph Media USA',
      url: `${hostname}${url}`,
      logo: META_LOGO_URL,
      foundingDate: '2013',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '589 8th Ave 23 fl',
        addressLocality: 'New York',
        addressRegion: 'NY',
        postalCode: '10018',
        addressCountry: 'USA',
      },
      sameAs: [
        'https://www.facebook.com/cointelegraph',
        'https://twitter.com/cointelegraph',
        'https://telegram.me/cointelegraph',
        'https://t.me/oneminuteletter',
        'https://www.instagram.com/cointelegraph',
        'https://www.instagram.com/cointelegraphdaily',
        'https://www.youtube.com/channel/UCRqBu-grVX1p97WaX4d-OuQ',
      ],
    },
    publisher: 'Cointelegraph',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${hostname}/search?query={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
};

export const getPageJSONSchema = (options) => {
  const hostname = getProperty(options, 'currentLanguage.url', DEFAULT_LANGUAGE.url);
  const url = getProperty(options, 'meta.url', DEFAULT_META.url);
  const image = getProperty(options, 'meta.image', DEFAULT_META.image);
  const title = getProperty(options, 'meta.title', DEFAULT_META.title);
  const description = getProperty(options, 'meta.description', DEFAULT_META.description);
  const schema = {
    '@context': 'http://schema.org',
    '@type': 'WebSite',
    url: `${hostname}${url}`,
    name: title,
    description,
    image,
    ...getOrganizationJSONSchema({
      hostname,
      url,
    }),
  };
  return {
    hid: 'ldjson-schema',
    type: 'application/ld+json',
    innerHTML: JSON.stringify(schema),
  };
};

export const getArticlesJSONSchema = (options) => {
  const hostname = getProperty(options, 'currentLanguage.url', DEFAULT_LANGUAGE.url);
  const posts = getProperty(options, 'posts', []);
  const schema = {
    '@context': 'http://schema.org',
    '@type': 'ItemList',
    numberOfItems: posts.length,
    itemListElement: posts.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${hostname}${item.url}`,
      name: item.title,
      image: getThumbnail({
        imageUrl: item.cover,
        width: 740,
        defaultImage: POST_FALLBACK_COVER_URL,
      }),
    })),
  };
  return {
    hid: 'ldjson-schema',
    type: 'application/ld+json',
    innerHTML: JSON.stringify(schema),
  };
};

export const getNewsletterPageJSONSchema = (options) => {
  const hostname = getProperty(options, 'currentLanguage.url', DEFAULT_LANGUAGE.url);
  const url = getProperty(options, 'meta.url', NEWSLETTER_META.url);
  const headline = getProperty(options, 'meta.title', NEWSLETTER_META.title);
  const description = getProperty(options, 'meta.description', NEWSLETTER_META.description);
  const keywords = getProperty(options, 'meta.keywords', '');
  const datePublished = getProperty(options, 'meta.datePublished', '');
  const dateModified = getProperty(options, 'meta.dateModified', '');
  const image = getProperty(options, 'meta.image', NEWSLETTER_META.image);
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Article',
    headline,
    description,
    keywords,
    datePublished,
    dateModified,
    about: description,
    wordCount: '',
    mainEntity: `${hostname}${url}`,
    mainEntityOfPage: `${hostname}${url}`,
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
    author: {
      '@type': 'Organization',
      name: 'Cointelegraph',
      logo: {
        '@type': 'ImageObject',
        url: META_LOGO_URL,
        width: 40,
        height: 40,
      },
    },
    image,
  };
  return {
    hid: 'ldjson-schema',
    type: 'application/ld+json',
    innerHTML: JSON.stringify(schema),
  };
};

export const getInnovationCirclePageJSONSchema = (options) => {
  const hostname = getProperty(options, 'currentLanguage.url', DEFAULT_LANGUAGE.url);
  const url = getProperty(options, 'meta.url', INNOVATION_CIRCLE_META.url);
  const headline = getProperty(options, 'meta.title', INNOVATION_CIRCLE_META.title);
  const description = getProperty(options, 'meta.description', INNOVATION_CIRCLE_META.description);
  const keywords = getProperty(options, 'meta.keywords', '');
  const datePublished = getProperty(options, 'meta.datePublished', '');
  const dateModified = getProperty(options, 'meta.dateModified', '');
  const image = getProperty(options, 'meta.image', INNOVATION_CIRCLE_META.image);
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Article',
    headline,
    description,
    keywords,
    datePublished,
    dateModified,
    about: description,
    wordCount: '',
    mainEntity: `${hostname}${url}`,
    mainEntityOfPage: `${hostname}${url}`,
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
    author: {
      '@type': 'Organization',
      name: 'Cointelegraph',
      logo: {
        '@type': 'ImageObject',
        url: META_LOGO_URL,
        width: 40,
        height: 40,
      },
    },
    image,
  };
  return {
    hid: 'ldjson-schema',
    type: 'application/ld+json',
    innerHTML: JSON.stringify(schema),
  };
};

export const getTagPageJSONSchema = (options) => {
  const hostname = getProperty(options, 'currentLanguage.url', DEFAULT_LANGUAGE.url);
  const url = getProperty(options, 'meta.url', DEFAULT_META.url);
  const headline = getProperty(options, 'meta.title', DEFAULT_META.title);
  const description = getProperty(options, 'meta.description', DEFAULT_META.description);
  const keywords = getProperty(options, 'meta.keywords', '');
  const datePublished = getProperty(options, 'meta.datePublished', '');
  const dateModified = getProperty(options, 'meta.dateModified', '');
  const image = getProperty(options, 'meta.image', DEFAULT_META.image);
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Article',
    headline,
    description,
    keywords,
    datePublished,
    dateModified,
    about: description,
    wordCount: '',
    mainEntity: `${hostname}${url}`,
    mainEntityOfPage: `${hostname}${url}`,
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
    author: {
      '@type': 'Organization',
      name: 'Cointelegraph',
      logo: {
        '@type': 'ImageObject',
        url: META_LOGO_URL,
        width: 40,
        height: 40,
      },
    },
    image,
  };
  return {
    hid: 'ldjson-schema',
    type: 'application/ld+json',
    innerHTML: JSON.stringify(schema),
  };
};

export const getAuthorPageJSONSchema = (options) => {
  const hostname = getProperty(options, 'currentLanguage.url', DEFAULT_LANGUAGE.url);
  const url = getProperty(options, 'meta.url', DEFAULT_META.url);
  const authorName = getProperty(options, 'author.name', '');
  const authorAbout = getProperty(options, 'author.about', '');
  const authorAvatar = getProperty(options, 'author.avatar', '');
  const authorFallbackAvatar = getProperty(options, 'author.fallbackAvatar', '');
  const authorSocialLinks = getProperty(options, 'author.socialLinks', []);
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    name: authorName,
    description: authorAbout,
    url: `${hostname}${url}`,
    image: authorAvatar || authorFallbackAvatar,
    sameAs: authorSocialLinks.map((item) => item.url),
    jobTitle: 'Author',
    worksFor: {
      '@type': 'Organization',
      name: 'Cointelegraph',
    },
  };
  return {
    hid: 'ldjson-schema',
    type: 'application/ld+json',
    innerHTML: JSON.stringify(schema),
  };
};

export const getArticlePageJSONSchema = (options) => {
  const hostname = getProperty(options, 'currentLanguage.url', DEFAULT_LANGUAGE.url);
  const url = getProperty(options, 'meta.url', DEFAULT_META.url);
  const description = getProperty(options, 'meta.description', '');
  const articleTitle = getProperty(options, 'article.title', '');
  const articleCategoryName = getProperty(options, 'article.categoryName', '');
  const articleTextLength = getProperty(options, 'article.fullText.length', 0);
  const articleCover = getProperty(options, 'article.cover', '');
  const articleAuthorName = getProperty(options, 'article.authorName', '');
  const articleDateISOFull = getProperty(options, 'article.dateISOFull', '');
  const articleCategorySlug = getProperty(options, 'article.categorySlug', '');
  const docType = SPECIAL_CATEGORIES.includes(articleCategorySlug) ? 'Article' : 'NewsArticle';

  const articleAuthorUrl = getProperty(options, 'article.authorUrl', '');
  const articleAuthorUrlWithHostname = articleAuthorUrl.startsWith('http')
    ? articleAuthorUrl
    : `${hostname}${articleAuthorUrl}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': docType,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${hostname}${url}`,
    },
    headline: articleTitle,
    description,
    articleSection: articleCategoryName,
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
    author: {
      '@type': 'Person',
      name: articleAuthorName,
      url: `${articleAuthorUrlWithHostname}`,
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
    datePublished: articleDateISOFull,
    dateModified: articleDateISOFull,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.post .post__title', '.post .post__lead'],
    },
  };
  return {
    hid: 'ldjson-schema',
    type: 'application/ld+json',
    innerHTML: JSON.stringify(schema),
  };
};

export const getPriceIndexPageJSONSchema = (options) => {
  const hostname = getProperty(options, 'currentLanguage.url', DEFAULT_LANGUAGE.url);
  const url = getProperty(options, 'meta.url', DEFAULT_META.url);
  const name = getProperty(options, 'meta.title', DEFAULT_META.title);
  const description = getProperty(options, 'meta.description', DEFAULT_META.description);
  const keywords = getProperty(options, 'meta.keywords', '');
  const inLanguage = getProperty(options, 'currentLanguage.name', DEFAULT_LANGUAGE.name);
  const datePublished = getProperty(options, 'meta.datePublished', '2018-01-01 00:00:00');
  const dateModified = getProperty(options, 'meta.dateModified', format(new Date(), 'yyyy-LL-dd HH:mm:ss'));
  const canonical = getProperty(options, 'canonical', hostname + url);
  const homePage = getProperty(options, 'i18n.homePage', 'Home');
  const priceIndexesPage = getProperty(options, 'i18n.priceIndexesPage', 'Price Indexes');
  const currencies = getProperty(options, 'currencies', []);
  const coinLabel = getProperty(options, 'coinLabel', '');
  const headline =
    getProperty(options, 'i18n.title', '') ||
    getProperty(options, 'i18n.priceIndexesPageTitle', '') ||
    priceIndexesPage;

  const exchangeRatesList = currencies.map((currency, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'ExchangeRateSpecification',
      currency: coinLabel,
      url: `${canonical}#${currency.name?.toLowerCase()}`,
      currentExchangeRate: {
        '@type': 'UnitPriceSpecification',
        price: currency.value,
        priceCurrency: currency.name,
      },
    },
  }));

  const schema = {
    '@context': 'http://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name,
        description,
        headline,
        author: 'Cointelegraph',
        inLanguage,
        mainEntityOfPage: canonical,
        accessMode: 'textual, chartOnVisual',
        mainEntity: canonical,
        datePublished,
        dateModified,
        license: 'http://creativecommons.org/licenses/by-nc-sa/3.0/us/deed.en_US',
        publisher: {
          '@type': 'Organization',
          name: 'Cointelegraph',
          logo: {
            type: 'ImageObject',
            url: `${hostname}/assets/img/logo.png`,
            width: '40',
            height: '40',
          },
        },
      },
      {
        '@type': 'Dataset',
        name,
        description,
        license: 'http://creativecommons.org/licenses/by-nc-sa/3.0/us/deed.en_US',
        keywords,
        creator: {
          '@type': 'Organization',
          url: hostname,
          name: 'Cointelegraph',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: homePage,
            item: hostname,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: priceIndexesPage,
            item: `${hostname}/price-indexes`,
          },
          coinLabel && {
            '@type': 'ListItem',
            position: 3,
            name: headline,
            item: hostname + url,
          },
        ].filter(Boolean),
      },
      {
        '@type': 'ItemList',
        name: headline,
        itemListElement: exchangeRatesList,
      },
    ],
  };

  return {
    hid: 'ldjson-schema',
    type: 'application/ld+json',
    innerHTML: JSON.stringify(schema),
  };
};

export const getAlternateLinks = (options) => {
  const url = getProperty(options, 'meta.url', DEFAULT_META.url);
  const languages = getProperty(options, 'languages', [DEFAULT_LANGUAGE]);
  return languages.map((item) => ({
    id: item.id,
    rel: 'alternate',
    hreflang: item.code,
    code: item.code,
    domain: item.domain,
    href: rootUrlResolver({ domain: item.domain, isDuke: false }) + url,
  }));
};

export const getDynamicAlternateLinks = ({ alternates = [], url = DEFAULT_META.url }) => {
  if (!Array.isArray(alternates) || typeof url !== 'string' || !url) {
    return [];
  }
  return alternates.map((item) => {
    const domain = getProperty(item, 'domain', DEFAULT_LANGUAGE.domain);
    const hreflang = getProperty(item, 'code', DEFAULT_LANGUAGE.code);
    const rootUrl = rootUrlResolver({ domain, isDuke: false });
    const href = `${rootUrl}${url}`;
    return {
      rel: 'alternate',
      hreflang,
      href,
    };
  });
};

export const getMainPageMeta = (options) => {
  const meta = getProperty(options, 'meta', DEFAULT_META);
  const title = getProperty(meta, 'title', DEFAULT_META.title);
  const description = getProperty(meta, 'description', DEFAULT_META.description);
  const i18n = getProperty(options, 'i18n', {});
  const currentLanguage = getProperty(options, 'currentLanguage', DEFAULT_LANGUAGE);
  const currentLanguageId = getProperty(options, 'currentLanguage.id', DEFAULT_LANGUAGE.id);
  const code = getProperty(options, 'currentLanguage.code', DEFAULT_LANGUAGE.code);
  const hostname = getProperty(options, 'currentLanguage.url', DEFAULT_LANGUAGE.url);
  const languages = getProperty(options, 'languages', [DEFAULT_LANGUAGE]);
  const isError = getProperty(options, 'isError', false);
  const errorPageUrl = isError && getProperty(meta, 'url', '');
  const routeName = getProperty(options, 'routeName', '');
  const canonicalHref = errorPageUrl ? `${hostname}${errorPageUrl}` : hostname;
  const isCn = currentLanguageId.toString() === '4';
  const baiduScripts = isCn && IS_PRODUCTION && process.client ? getBaiduScripts(routeName) : [];
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
      ...(!isError
        ? getAlternateLinks({
            languages,
            meta,
          })
        : []),
      {
        rel: 'canonical',
        href: canonicalHref,
      },
      ...(!isError
        ? [
            {
              rel: 'amphtml',
              href: `${hostname}/amp`,
            },
          ]
        : []),
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: 'Cointelegraph RSS Feed',
        href: `${hostname}/rss`,
      },
    ],
    script: [
      getPageJSONSchema({
        currentLanguage,
        meta,
      }),
      ...getMobileAppsJsonSchema({
        currentLanguage,
        description,
        i18n,
      }),
      ...baiduScripts,
    ],
  };
};

export const getNewsletterPageMeta = (options) => {
  const meta = getProperty(options, 'meta', NEWSLETTER_META);
  const alternates = getProperty(options, 'alternates', []);
  const url = getProperty(meta, 'url', NEWSLETTER_META.url);
  const title = getProperty(meta, 'title', NEWSLETTER_META.title);
  const description = getProperty(meta, 'description', NEWSLETTER_META.description);
  const currentLanguage = getProperty(options, 'currentLanguage', DEFAULT_LANGUAGE);
  const currentLanguageId = getProperty(options, 'currentLanguage.id', DEFAULT_LANGUAGE.id);
  const code = getProperty(options, 'currentLanguage.code', DEFAULT_LANGUAGE.code);
  const hostname = getProperty(options, 'currentLanguage.url', DEFAULT_LANGUAGE.url);
  const routeName = getProperty(options, 'routeName', '');
  const isCn = currentLanguageId.toString() === '4';
  const canonical = url;
  const baiduScripts = isCn && IS_PRODUCTION && process.client ? getBaiduScripts(routeName) : [];
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
      ...getDynamicAlternateLinks({
        alternates,
        url,
      }),
      {
        rel: 'canonical',
        href: hostname + canonical,
      },
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: 'Cointelegraph RSS Feed',
        href: `${hostname}/rss`,
      },
    ],
    script: [
      getNewsletterPageJSONSchema({
        currentLanguage,
        meta,
      }),
      ...baiduScripts,
    ],
  };
};

export const getInnovationCirclePageMeta = (options) => {
  const meta = getProperty(options, 'meta', INNOVATION_CIRCLE_META);
  const alternates = getProperty(options, 'alternates', []);
  const url = getProperty(meta, 'url', INNOVATION_CIRCLE_META.url);
  const title = getProperty(meta, 'title', INNOVATION_CIRCLE_META.title);
  const description = getProperty(meta, 'description', INNOVATION_CIRCLE_META.description);
  const currentLanguage = getProperty(options, 'currentLanguage', DEFAULT_LANGUAGE);
  const currentLanguageId = getProperty(options, 'currentLanguage.id', DEFAULT_LANGUAGE.id);
  const code = getProperty(options, 'currentLanguage.code', DEFAULT_LANGUAGE.code);
  const hostname = getProperty(options, 'currentLanguage.url', DEFAULT_LANGUAGE.url);
  const routeName = getProperty(options, 'routeName', '');
  const isCn = currentLanguageId.toString() === '4';
  const canonical = url;
  const baiduScripts = isCn && IS_PRODUCTION && process.client ? getBaiduScripts(routeName) : [];
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
      ...getDynamicAlternateLinks({
        alternates,
        url,
      }),
      {
        rel: 'canonical',
        href: hostname + canonical,
      },
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: 'Cointelegraph RSS Feed',
        href: `${hostname}/rss`,
      },
    ],
    script: [
      getInnovationCirclePageJSONSchema({
        currentLanguage,
        meta,
      }),
      ...baiduScripts,
    ],
  };
};

export const getTagsPageMeta = (options) => {
  const meta = getProperty(options, 'meta', DEFAULT_META);
  const alternates = getProperty(options, 'alternates', []);
  const url = getProperty(meta, 'url', DEFAULT_META.url);
  const title = getProperty(meta, 'title', DEFAULT_META.title);
  const description = getProperty(meta, 'description', DEFAULT_META.description);
  const currentLanguage = getProperty(options, 'currentLanguage', DEFAULT_LANGUAGE);
  const currentLanguageId = getProperty(options, 'currentLanguage.id', DEFAULT_LANGUAGE.id);
  const code = getProperty(options, 'currentLanguage.code', DEFAULT_LANGUAGE.code);
  const hostname = getProperty(options, 'currentLanguage.url', DEFAULT_LANGUAGE.url);
  const routeName = getProperty(options, 'routeName', '');
  const isCn = currentLanguageId.toString() === '4';
  const canonical = url;
  const baiduScripts = isCn && IS_PRODUCTION && process.client ? getBaiduScripts(routeName) : [];
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
      ...getDynamicAlternateLinks({
        alternates,
        url,
      }),
      {
        rel: 'canonical',
        href: hostname + canonical,
      },
      ...(isAmpPagesGenerationAllowed(meta.datePublished)
        ? [
            {
              rel: 'amphtml',
              href: `${hostname}/amp`,
            },
          ]
        : []),
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: 'Cointelegraph RSS Feed',
        href: `${hostname}/rss`,
      },
    ],
    script: [
      getTagPageJSONSchema({
        currentLanguage,
        meta,
      }),
      ...baiduScripts,
    ],
  };
};

export const getMarketsPageMeta = (options) => {
  const meta = getProperty(options, 'meta', DEFAULT_META);
  const alternates = getProperty(options, 'alternates', []);
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
      ...getDynamicAlternateLinks({
        alternates,
        url,
      }),
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
      getTagPageJSONSchema({
        currentLanguage,
        meta,
      }),
      ...baiduScripts,
    ],
  };
};

export const getCategoryPageMeta = (options) => {
  const meta = getProperty(options, 'meta', DEFAULT_META);
  const url = getProperty(meta, 'url', DEFAULT_META.url);
  const title = getProperty(meta, 'title', DEFAULT_META.title);
  const description = getProperty(meta, 'description', DEFAULT_META.description);
  const currentLanguage = getProperty(options, 'currentLanguage', DEFAULT_LANGUAGE);
  const currentLanguageId = getProperty(options, 'currentLanguage.id', DEFAULT_LANGUAGE.id);
  const code = getProperty(options, 'currentLanguage.code', DEFAULT_LANGUAGE.code);
  const hostname = getProperty(options, 'currentLanguage.url', DEFAULT_LANGUAGE.url);
  const posts = getProperty(options, 'posts', []);
  const alternates = getProperty(options, 'alternates', []);
  const routeName = getProperty(options, 'routeName', '');
  const isCn = currentLanguageId.toString() === '4';
  const baiduScripts = isCn && IS_PRODUCTION && process.client ? getBaiduScripts(routeName) : [];
  const amphtmlDisabled = getProperty(options, 'amphtmlDisabled', false);
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
      ...getDynamicAlternateLinks({
        alternates,
        url,
      }),
      {
        rel: 'canonical',
        href: `${hostname}${url}`,
      },
      ...(!amphtmlDisabled && isAmpPagesGenerationAllowed(meta.createdAt)
        ? [
            {
              rel: 'amphtml',
              href: `${hostname}${url}/amp`,
            },
          ]
        : []),
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: 'Cointelegraph RSS Feed',
        href: `${hostname}/rss`,
      },
    ],
    script: [
      getArticlesJSONSchema({
        currentLanguage,
        meta,
        posts,
      }),
      ...baiduScripts,
    ],
  };
};

export const getAuthorPageMeta = (options) => {
  const meta = getProperty(options, 'meta', DEFAULT_META);
  const url = getProperty(meta, 'url', DEFAULT_META.url);
  const title = getProperty(meta, 'title', DEFAULT_META.title);
  const description = getProperty(meta, 'description', DEFAULT_META.description);
  const currentLanguage = getProperty(options, 'currentLanguage', DEFAULT_LANGUAGE);
  const currentLanguageId = getProperty(options, 'currentLanguage.id', DEFAULT_LANGUAGE.id);
  const code = getProperty(options, 'currentLanguage.code', DEFAULT_LANGUAGE.code);
  const hostname = getProperty(options, 'currentLanguage.url', DEFAULT_LANGUAGE.url);
  const alternates = getProperty(options, 'alternates', []);
  const author = getProperty(options, 'author', null);
  const routeName = getProperty(options, 'routeName', '');
  const isCn = currentLanguageId.toString() === '4';
  const baiduScripts = isCn && IS_PRODUCTION && process.client ? getBaiduScripts(routeName) : [];
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
      ...getDynamicAlternateLinks({
        alternates,
        url,
      }),
      {
        rel: 'canonical',
        href: `${hostname}${url}`,
      },
      ...(isAmpPagesGenerationAllowed(meta.createdAt)
        ? [
            {
              rel: 'amphtml',
              href: `${hostname}${url}/amp`,
            },
          ]
        : []),
    ],
    script: [
      getAuthorPageJSONSchema({
        author,
        currentLanguage,
        meta,
      }),
      ...baiduScripts,
    ],
  };
};

export const getArticlePageMeta = (options) => {
  const meta = getProperty(options, 'meta', DEFAULT_META);
  const url = getProperty(meta, 'url', DEFAULT_META.url);
  const title = getProperty(meta, 'title', DEFAULT_META.title);
  const seoTitle = getProperty(meta, 'seoTitle', title);
  const description = getProperty(meta, 'description', DEFAULT_META.description);
  const currentLanguage = getProperty(options, 'currentLanguage', DEFAULT_LANGUAGE);
  const currentLanguageId = getProperty(options, 'currentLanguage.id', DEFAULT_LANGUAGE.id);
  const code = getProperty(options, 'currentLanguage.code', DEFAULT_LANGUAGE.code);
  const hostname = getProperty(options, 'currentLanguage.url', DEFAULT_LANGUAGE.url);
  const article = getProperty(options, 'article', null);
  const isNoIndex = getProperty(article, 'isNoIndex', false);
  const alternates = getProperty(options, 'alternates', []);
  const routeName = getProperty(options, 'routeName', '');
  const isCn = currentLanguageId.toString() === '4';
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
      ...getNoIndexMeta(isNoIndex),
    ],
    link: [
      ...getDynamicAlternateLinks({
        alternates,
        url,
      }),
      {
        rel: 'canonical',
        href: `${hostname}${url}`,
      },
      ...(isAmpPagesGenerationAllowed(options.article.publishedDateTimeObject)
        ? [
            {
              rel: 'amphtml',
              href: `${hostname}${url}/amp`,
            },
          ]
        : []),
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

export const getGlossaryPageJSONSchema = (options) => {
  const hostname = getProperty(options, 'currentLanguage.url', DEFAULT_LANGUAGE.url);
  const headline = getProperty(options, 'meta.title', NEWSLETTER_META.title);
  const description = getProperty(options, 'meta.description', NEWSLETTER_META.description);
  const keywords = getProperty(options, 'meta.keywords', '');
  const glossary = getProperty(options, 'glossary', []);

  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'ItemList',
    headline,
    description,
    keywords,
    numberOfItems: glossary.length,
    itemListElement: glossary.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${hostname}${item.link}`,
      name: item.title,
    })),
  };
  return {
    hid: 'ldjson-schema',
    type: 'application/ld+json',
    innerHTML: JSON.stringify(schema),
  };
};

export const getDownloadPageMeta = (options = {}) => {
  const currentLanguage = getProperty(options, 'currentLanguage', DEFAULT_LANGUAGE);
  const currentLanguageId = getProperty(options, 'currentLanguage.id', DEFAULT_LANGUAGE.id);
  const domain = getProperty(currentLanguage, 'domain', DEFAULT_LANGUAGE.domain);
  const code = getProperty(currentLanguage, 'code', DEFAULT_LANGUAGE.code);
  const meta = getProperty(options, 'meta', DEFAULT_META);
  const title = getProperty(meta, 'title', DEFAULT_META.title);
  const description = getProperty(meta, 'description', DEFAULT_META.description);
  const url = getProperty(meta, 'url', DEFAULT_META.url);
  const hostname = rootUrlResolver({ domain, isDuke: true });
  const routeName = getProperty(options, 'routeName', '');
  const isCn = currentLanguageId.toString() === '4';
  const baiduScripts = isCn && IS_PRODUCTION && process.client ? getBaiduScripts(routeName) : [];
  return {
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
        href: hostname + url,
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Playfair+Display:400,500,600,700&display=swap',
        media: 'print',
        onload: "this.media='all'",
        once: true,
      },
      {
        rel: 'alternate',
        hreflang: code,
        href: hostname + url,
      },
    ],
    script: [...baiduScripts],
  };
};

export const getSearchPageMeta = (options) => {
  const meta = getProperty(options, 'meta', DEFAULT_META);
  const query = getProperty(options, 'query', '');
  const i18n = getProperty(options, 'i18n', {});
  const url = getProperty(meta, 'url', DEFAULT_META.url);
  const title = query
    ? `${i18n.youSearchedFor} ${query} | Cointelegraph`
    : getProperty(meta, 'title', DEFAULT_META.title);
  const description = getProperty(meta, 'description', DEFAULT_META.description);
  const currentLanguage = getProperty(options, 'currentLanguage', DEFAULT_LANGUAGE);
  const currentLanguageId = getProperty(options, 'currentLanguage.id', DEFAULT_LANGUAGE.id);
  const code = getProperty(options, 'currentLanguage.code', DEFAULT_LANGUAGE.code);
  const hostname = getProperty(options, 'currentLanguage.url', DEFAULT_LANGUAGE.url);
  const alternates = getProperty(options, 'alternates', []);
  const routeName = getProperty(options, 'routeName', '');
  const isCn = currentLanguageId.toString() === '4';
  const baiduScripts = isCn && IS_PRODUCTION && process.client ? getBaiduScripts(routeName) : [];
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
      ...getNoIndexMeta(true),
    ],
    link: [
      ...getDynamicAlternateLinks({
        alternates,
        url,
      }),
      {
        rel: 'canonical',
        href: `${hostname}${url}`,
      },
      {
        rel: 'amphtml',
        href: `${hostname}${url}/amp`,
      },
    ],
    script: [...baiduScripts],
  };
};

export const getPriceIndexPageMeta = (options) => {
  const meta = getProperty(options, 'meta', DEFAULT_META);
  const url = getProperty(meta, 'url', DEFAULT_META.url);
  const title = getProperty(meta, 'title', DEFAULT_META.title);
  const description = getProperty(meta, 'description', DEFAULT_META.description);
  const currentLanguage = getProperty(options, 'currentLanguage', DEFAULT_LANGUAGE);
  const currentLanguageId = getProperty(options, 'currentLanguage.id', DEFAULT_LANGUAGE.id);
  const code = getProperty(options, 'currentLanguage.code', DEFAULT_LANGUAGE.code);
  const hostname = getProperty(options, 'currentLanguage.url', DEFAULT_LANGUAGE.url);
  const alternates = getProperty(options, 'alternates', []);
  const routeName = getProperty(options, 'routeName', '');
  const currencies = getProperty(options, 'currencies', []);
  const coinLabel = getProperty(options, 'coinLabel', '');
  const i18n = getProperty(options, 'localI18n', {});
  const isCn = currentLanguageId.toString() === '4';
  const baiduScripts = isCn && IS_PRODUCTION && process.client ? getBaiduScripts(routeName) : [];
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
      ...getDynamicAlternateLinks({
        alternates,
        url,
      }),
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
      getPriceIndexPageJSONSchema({
        currentLanguage,
        meta,
        canonical: hostname + url,
        currencies,
        i18n,
        coinLabel,
      }),
      ...baiduScripts,
    ],
  };
};

export const getGlossaryPageMeta = (options) => {
  const meta = getProperty(options, 'meta', DEFAULT_META);
  const url = getProperty(meta, 'url', DEFAULT_META.url);
  const title = getProperty(meta, 'title', DEFAULT_META.title);
  const description = getProperty(meta, 'description', DEFAULT_META.description);
  const currentLanguage = getProperty(options, 'currentLanguage', DEFAULT_LANGUAGE);
  const currentLanguageId = getProperty(options, 'currentLanguage.id', DEFAULT_LANGUAGE.id);
  const code = getProperty(options, 'currentLanguage.code', DEFAULT_LANGUAGE.code);
  const hostname = getProperty(options, 'currentLanguage.url', DEFAULT_LANGUAGE.url);
  const alternates = getProperty(options, 'alternates', []);
  const glossary = getProperty(options, 'glossary', []);
  const routeName = getProperty(options, 'routeName', '');
  const isCn = currentLanguageId.toString() === '4';
  const baiduScripts = isCn && IS_PRODUCTION && process.client ? getBaiduScripts(routeName) : [];

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
      ...getDynamicAlternateLinks({
        alternates,
        url,
      }),
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
      getGlossaryPageJSONSchema({
        currentLanguage,
        meta,
        canonical: hostname + url,
        glossary,
      }),
      ...baiduScripts,
    ],
  };
};
