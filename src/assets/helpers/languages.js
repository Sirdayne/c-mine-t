import acceptLanguageParser from 'accept-language-parser';
import { DEFAULT_LANGUAGE, LANGUAGES_ORDER } from '~/app.config';
import getProperty from '~/assets/libs/getProperty';
import { rootUrlResolver } from '~/assets/helpers/utils';

const getLanguagePositionById = (languageId = DEFAULT_LANGUAGE.id) => {
  return LANGUAGES_ORDER.findIndex((id) => id === languageId);
};

/**
 * @return {{ code: string }[]}
 */
export const detectPreferredLanguages = () => {
  let result = [];

  if (process.client) {
    for (const language of navigator.languages) {
      const parsed = acceptLanguageParser.parse(language);
      result = result.concat(parsed);
    }
  }

  return result.sort((a, b) => b.quality - a.quality);
};

/**
 * Determine language offer
 * @param {string} currentLanguageCode
 * @param {import('~/graphql').Language[]} allLanguages All languages
 * @returns {null | import('~/graphql').Language} Offered language
 */
export const resolveLanguageOffer = (currentLanguageCode, allLanguages) => {
  /** @type {null | import('~/graphql').Language} */
  let preferredLanguage = null;

  for (const { code } of detectPreferredLanguages()) {
    if (preferredLanguage !== null) break;

    if (code === currentLanguageCode) {
      preferredLanguage = null;
      continue;
    }

    for (const language of allLanguages) {
      if (code === language.code) {
        preferredLanguage = language;
        break;
      }
    }
  }

  if (preferredLanguage?.code === currentLanguageCode) return null;

  return preferredLanguage;
};

export const sortMappedLanguagesByPosition = (a, b) => a.position - b.position;

export const getMappedLanguages = (language) => {
  if (!language || typeof language !== 'object') {
    return null;
  }
  const rootUrl = rootUrlResolver({
    domain: language.domain,
    isDuke: false,
  });
  return {
    id: language.id,
    url: rootUrl,
    name: language.title,
    domain: language.domain,
    timezone: language.timezone,
    short: language.short,
    code: language.code,
    emailSubscribes: language.subscribes,
    robotsTxt: language.robots,
    isHidden: Boolean(language.hidden),
    position: getLanguagePositionById(Number.parseInt(language.id)),
  };
};

export const mapForLanguageSelector = (item) => {
  const domain = item.domain;
  const alternateUrl = getProperty(item, 'alternateUrl.url', '');
  const rootUrl = rootUrlResolver({ domain });
  const url = alternateUrl ? rootUrl + alternateUrl : rootUrl;
  return {
    ...item,
    url,
  };
};
