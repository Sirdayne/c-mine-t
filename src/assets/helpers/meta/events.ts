import getProperty from '~/assets/libs/getProperty';
import { DEFAULT_LANGUAGE, DEFAULT_META, IS_PRODUCTION, NEWSLETTER_META } from '~/app.config';
import { getBaiduScripts, getOpenGraphMeta, getTwitterMeta } from '~/assets/helpers/meta';
import { Event } from '~/graphql';

export const getEventsPageJSONSchema = (options: any) => {
  const headline = getProperty(options, 'meta.title', NEWSLETTER_META.title);
  const description = getProperty(options, 'meta.description', NEWSLETTER_META.description);
  const keywords = getProperty(options, 'meta.keywords', '');
  const events = getProperty(options, 'events', []);

  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'ItemList',
    headline,
    description,
    keywords,
    numberOfItems: events.length,
    itemListElement: events.map((item: Event, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: item.website,
      description: item.description,
      name: item.title,
      image: item.imageUrl,
      startDate: item.startDate,
      endDate: item.endDate,
    })),
  };

  return {
    hid: 'ldjson-schema',
    type: 'application/ld+json',
    innerHTML: JSON.stringify(schema),
  };
};
export const getEventsPageMeta = (options: any) => {
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

  return {
    htmlAttrs: {
      lang: code,
    },
    title: title,
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
      getEventsPageJSONSchema({
        currentLanguage,
        meta,
        events: options.events,
      }),
    ],
  };
};
