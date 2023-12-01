import basicDataQuery from '~/graphql/queries/basicData.graphql';
import getProperty from '~/assets/libs/getProperty';
import { getMappedI18n } from '~/assets/helpers/i18n';
import { fetchQuery } from '~/api/modules/shared';
import { MINUTE } from '~/assets/helpers/timeConstants';

export const fetchBasicData = async (options = {}) => {
  const { i18nMap = {}, languageShort, apolloTransport } = options;
  const { status, errors, data } = await fetchQuery({
    defaultData: {
      i18n: [],
    },
    query: basicDataQuery,
    variables: {
      slugs: Object.values(i18nMap),
      promo: false,
    },
    languageShort,
    apolloTransport,
    cacheTimeInMS: MINUTE,
    sentryTag: 'fetch-basic-data',
  });
  const i18n = getProperty(data, 'translates', []);

  return {
    status,
    errors,
    data: {
      i18n: getMappedI18n({
        i18n,
        map: i18nMap,
      }),
    },
  };
};
