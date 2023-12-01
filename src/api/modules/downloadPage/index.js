import { fetchSeoMeta, fetchTranslations } from '~/api/modules/shared';
import getProperty from '~/assets/libs/getProperty';
import { downloadPageSlugMap } from '~/assets/helpers/i18n';

export const fetchDownloadPageInitialState = async (options = {}) => {
  const { pathname, languageShort, apolloTransport } = options;
  const [i18n, meta] = await Promise.all([
    fetchTranslations({
      slugsMap: downloadPageSlugMap,
      languageShort,
      apolloTransport,
    }),
    fetchSeoMeta({
      url: pathname,
      languageShort,
      apolloTransport,
    }),
  ]);
  return {
    i18n: getProperty(i18n, 'data', null),
    meta: getProperty(meta, 'data', null),
  };
};
