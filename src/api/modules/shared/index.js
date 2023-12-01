import translateQuery from '~/graphql/queries/translate.graphql';
import languagesQuery from '~/graphql/queries/languages.graphql';
import settingsQuery from '~/graphql/queries/settings.graphql';
import seoMetaQuery from '~/graphql/queries/seoMeta.graphql';
import socialLinksQuery from '~/graphql/queries/socialLinks.graphql';
import getProperty from '~/assets/libs/getProperty';
import filterNoneObjects from '~/assets/libs/filterNoneObjects';
import { getMappedI18n } from '~/assets/helpers/i18n';
import { getMappedLanguages, sortMappedLanguagesByPosition } from '~/assets/helpers/languages';
import { getMappedSettings, getMappedSocialsLinks } from '~/assets/helpers/settings';
import { getMappedMeta } from '~/assets/helpers/seo';
import { logApi } from '~/assets/helpers/log';
import { MINUTE } from '~/assets/helpers/timeConstants';
import { ERROR_MESSAGE, DEFAULT_LANGUAGE } from '~/app.config';

export const fetchQuery = async (options = {}) => {
  const {
    defaultData = null,
    query,
    variables = {},
    sentryTag,
    languageShort = DEFAULT_LANGUAGE.short,
    apolloTransport,
    cacheTimeInMS = MINUTE * 5,
  } = options;
  const response = {
    status: 'error',
    errors: ERROR_MESSAGE,
    data: defaultData,
  };
  try {
    if (!apolloTransport || typeof apolloTransport.query !== 'function') {
      throw new Error('`apolloTransport` is not defined');
    }
    const { errors, data } = await apolloTransport.query({
      query,
      variables: {
        ...variables,
        short: languageShort,
        cacheTimeInMS,
      },
      context: {
        sentryTag,
      },
    });
    if (errors) {
      if (Array.isArray(errors)) {
        response.errors = errors.reduce((acc, value) => `${acc}, ${value}`);
      }
      return response;
    }
    response.status = 'success';
    response.errors = null;
    response.data = getProperty(data, 'locale', defaultData);
    return response;
  } catch (e) {
    response.errors = e.message;
    logApi.warn('[ApolloQuery Error]:', e.message);
    return response;
  }
};

export const fetchTranslations = async (options = {}) => {
  const { slugsMap = {}, languageShort, apolloTransport, sentryTag = 'fetch-translations' } = options;
  const { status, errors, data } = await fetchQuery({
    defaultData: {
      translates: [],
    },
    query: translateQuery,
    variables: {
      slugs: Object.values(slugsMap),
    },
    languageShort,
    apolloTransport,
    sentryTag,
  });
  const translates = getProperty(data, 'translates', []);
  return {
    status,
    errors,
    data: getMappedI18n({
      i18n: translates,
      map: slugsMap,
    }),
  };
};

export const fetchLanguages = async (options = {}) => {
  const { languageShort, apolloTransport } = options;
  const { status, errors, data } = await fetchQuery({
    defaultData: {
      languages: [],
    },
    query: languagesQuery,
    variables: {
      key: 'languages',
    },
    languageShort,
    apolloTransport,
    sentryTag: 'fetch-languages',
  });
  const languages = getProperty(data, 'languages', []);
  return {
    status,
    errors,
    data: filterNoneObjects(languages)
      .map((item) => getMappedLanguages(item))
      .sort(sortMappedLanguagesByPosition),
  };
};

export const fetchSettings = async (options = {}) => {
  const { slugsMap = {}, languageShort, apolloTransport } = options;
  const { status, errors, data } = await fetchQuery({
    defaultData: {
      settings: [],
    },
    query: settingsQuery,
    variables: {
      slugs: Object.values(slugsMap),
    },
    languageShort,
    apolloTransport,
    sentryTag: 'fetch-settings',
  });
  const settings = getProperty(data, 'settings', []);
  return {
    status,
    errors,
    data: getMappedSettings({
      settings,
      map: slugsMap,
    }),
  };
};

export const fetchSocialLinks = async (options = {}) => {
  const { languageShort, apolloTransport } = options;
  const { status, errors, data } = await fetchQuery({
    defaultData: {
      socialLinks: {},
    },
    query: socialLinksQuery,
    languageShort,
    apolloTransport,
    sentryTag: 'fetch-social-links',
  });
  const socialLinks = getProperty(data, 'socialLinks', {});
  return {
    status,
    errors,
    data: getMappedSocialsLinks(socialLinks),
  };
};

export const fetchSeoMeta = async (options = {}) => {
  const { url, languageShort, apolloTransport } = options;
  const { status, errors, data } = await fetchQuery({
    defaultData: {
      seoMeta: null,
    },
    query: seoMetaQuery,
    variables: {
      url,
    },
    languageShort,
    apolloTransport,
    sentryTag: 'fetch-seo-meta',
  });
  const seoMeta = getProperty(data, 'seoMeta', null);
  return {
    status,
    errors,
    data: getMappedMeta(seoMeta),
  };
};
