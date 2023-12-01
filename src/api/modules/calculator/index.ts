import { fetchMainPosts } from '~/api/modules/main';
import { getAlternateLinks } from '~/assets/helpers/meta';
import seoMetaQuery from '~/graphql/queries/seoMeta.graphql';
import { fetchQuery } from '~/api/modules/shared';
import getProperty from '~/assets/libs/getProperty';
import { getMappedMeta } from '~/assets/helpers/seo';

interface OptionsInterface {
  languages: Array<object>;
  languageDomain: string;
  languageCode: string;
  timeZone: string;
  languageShort: string;
  apolloTransport: object;
}
const CALCULATOR_PAGE_TRENDING_NEWS_LENGTH = 4;
export async function fetchTrendingNews(options: OptionsInterface): Promise<object> {
  const { languages, languageDomain, languageCode, timeZone, languageShort, apolloTransport } = options;

  const postsOptions = {
    offset: 0,
    length: CALCULATOR_PAGE_TRENDING_NEWS_LENGTH,
    languageDomain,
    languageCode,
    timeZone,
    languageShort,
    apolloTransport,
  };

  const {
    data: { posts, postsCount },
  } = await fetchMainPosts(postsOptions);
  const alternates = getAlternateLinks({ languages });

  return { posts, postsCount, alternates };
}

interface MetaOptions {
  pathname: string;
  languageShort: string;
  apolloTransport: object;
}
export async function fetchCalculatorPageMeta(options: MetaOptions): Promise<object> {
  const { pathname, languageShort, apolloTransport } = options;
  const seoMetaOptions = {
    query: seoMetaQuery,
    variables: {
      short: languageShort,
      url: pathname,
    },
    languageShort,
    apolloTransport,
  };
  const { data } = await fetchQuery(seoMetaOptions);
  const rawSeoMeta = getProperty(data, 'seoMeta', null);
  const meta = getMappedMeta(rawSeoMeta);
  return { meta };
}
