import groupBy from 'lodash/groupBy';
import { fetchLanguages, fetchTranslations } from '~/api/modules/shared';
import { ROOT, SETTINGS, MENU, FOOTER, VIEWPORT, SUBSCRIPTIONS_MODAL, TICKERS } from '~/store/types';
import { resolveLanguageOffer, mapForLanguageSelector } from '~/assets/helpers/languages';
import { report } from '~/assets/helpers/sentry';
import { DEFAULT_LANGUAGE, BANNER_PLACES, ASIA_REGIONS_IDS } from '~/app.config';
import {
  getBannersPlaces,
  getMappedBannerOptions,
  reduceBannersByPriorityAndWeight,
  sortBannersByPriority,
} from '~/assets/helpers/banners';
import { restSlugMap } from '~/assets/helpers/i18n';
import { fetchBasicData } from '~/api/modules/basic';
import { pipeFunctions } from '~/assets/libs/functional';
import { withSpan } from '~/lib/telemetry';
import { BannersDocument } from '~/graphql';
import isMobile from '~/assets/libs/isMobile';

const BANNER_PLACES_EXCLUDED_FROM_SHUFFLE = [
  BANNER_PLACES.BETWEEN_POSTS_MOBILE,
  BANNER_PLACES.BETWEEN_POSTS_YOUTUBE_MOBILE,
  BANNER_PLACES.BETWEEN_POSTS_DESKTOP,
  BANNER_PLACES.MAIN_STICKY,
  BANNER_PLACES.PROMO_BUTTON_CATEGORY_DESKTOP,
  BANNER_PLACES.PROMO_BUTTON_CATEGORY_MOBILE,
];

export const state = () => ({
  currentLanguage: DEFAULT_LANGUAGE,
  languages: [],
  isYoutubeApiReady: false,
  i18n: {},
  banners: {},
  hostname: '',
  bannersLoaded: false,
});

export const getters = {
  [ROOT.IS_ASIA]({ currentLanguage: { id } }) {
    return ASIA_REGIONS_IDS.includes(`${id}`);
  },

  [ROOT.IS_RTL]({ currentLanguage: { id } }) {
    return id.toString() === '17';
  },

  [ROOT.IS_EN]({ currentLanguage: { id } }) {
    return id.toString() === '1';
  },

  [ROOT.IS_JP]({ currentLanguage: { id } }) {
    return id.toString() === '22';
  },

  [ROOT.IS_CN]({ currentLanguage: { id } }) {
    return id.toString() === '4';
  },

  [ROOT.PREFERRED_LANGUAGE](state) {
    const { currentLanguage, languages } = state;
    const currentLanguageCode = (currentLanguage || DEFAULT_LANGUAGE).code || '';
    const preferredLanguage = resolveLanguageOffer(currentLanguageCode, languages);

    if (!preferredLanguage) return null;

    return {
      ...preferredLanguage,
      isRTL: `${preferredLanguage.id}` === '17',
      url: `https://${preferredLanguage.domain}`,
    };
  },

  [ROOT.LANGUAGES_FOR_LANG_SELECTOR]({ currentLanguage = {}, languages = [] }) {
    const filterLanguages = (item) => item.id !== currentLanguage.id && !item.isHidden;
    return languages.filter(filterLanguages).map(mapForLanguageSelector);
  },
};

export const mutations = {
  [ROOT.MUTATE_LANGUAGES](state, payload) {
    state.languages = payload;
  },
  [ROOT.MUTATE_CURRENT_LANGUAGE](state, payload) {
    state.currentLanguage = payload;
  },
  [ROOT.MUTATE_YOUTUBE_API_READY](state, payload) {
    state.isYoutubeApiReady = payload;
  },
  [ROOT.MUTATE_I18N](state, payload) {
    state.i18n = payload;
  },

  /**
   * payload banners is array of graphql banners
   */
  [ROOT.MUTATE_SHUFFLE_AND_APPEND_BANNERS](state, { banners }) {
    // place => group of bannerOptions
    const bannerOptionsGroupedByPlace = groupBy(banners, 'place');
    const shuffle = pipeFunctions(reduceBannersByPriorityAndWeight, sortBannersByPriority);

    for (const place in bannerOptionsGroupedByPlace) {
      let group = bannerOptionsGroupedByPlace[place];

      if (!BANNER_PLACES_EXCLUDED_FROM_SHUFFLE.includes(place)) group = shuffle(group);

      bannerOptionsGroupedByPlace[place] = group;
    }

    state.banners = {
      ...state.banners,
      ...bannerOptionsGroupedByPlace,
    };
  },

  [ROOT.MUTATE_CLIENT_BANNERS_LOADED](state) {
    state.bannersLoaded = true;
  },
};

export const actions = {
  async nuxtServerInit({ commit, dispatch }, { req }) {
    await withSpan(
      {
        op: 'nuxt.ssr-store-server-init',
        description: 'Nuxt Vuex nuxtServerInit',
      },
      async () => {
        // be advised: order down below - matters
        await dispatch(ROOT.FETCH_LANGUAGES);

        commit(`viewport/${VIEWPORT.MUTATE_USER_DEVICE_TYPE}`, req.isMobile);
        dispatch(ROOT.SET_CURRENT_LANGUAGE, req.languageShort);

        await Promise.all([
          dispatch(ROOT.FETCH_BASIC_DATA),
          dispatch(`menu/${MENU.FETCH_DESKTOP_MENU}`),
          dispatch(`settings/${SETTINGS.FETCH_SETTINGS}`),
          dispatch(`settings/${SETTINGS.FETCH_SOCIAL_LINKS}`),
          dispatch(`footer/${FOOTER.FETCH_MENU}`),
        ]);
      }
    );
  },

  async [ROOT.INIT_CLIENT]({ dispatch, commit }) {
    if (process.server) return;

    commit(`viewport/${VIEWPORT.MUTATE_USER_DEVICE_TYPE}`, isMobile(navigator.userAgent));
    dispatch(`settings/${SETTINGS.READ_LOCALSTORAGE_SETTINGS}`);
    dispatch(ROOT.FETCH_BANNERS);
    dispatch(ROOT.FETCH_LANGUAGE_OFFER_I18N);
    dispatch(`subscriptionsModal/${SUBSCRIPTIONS_MODAL.FETCH_I18N}`);
    dispatch(`tickers/${TICKERS.START_TICKERS_DATA_SHORT_POLLING}`);
    dispatch(`menu/${MENU.FETCH_MOBILE_MENU}`);
  },

  async [ROOT.FETCH_BASIC_DATA]({ state, commit }) {
    const {
      currentLanguage: { short: languageShort, timezone: timeZone, code: languageCode, domain: languageDomain },
    } = state;
    const {
      data: { i18n },
    } = await fetchBasicData({
      i18nMap: restSlugMap,
      languageDomain,
      languageShort,
      languageCode,
      timeZone,
      apolloTransport: this.app.$apolloTransport,
    });

    commit(ROOT.MUTATE_I18N, i18n);
  },

  /**
   *
   * @param state
   * @param commit
   * @param {{ ssr: boolean }} payload Load ssr or csr set of banners
   * @returns {Promise<void>}
   */
  async [ROOT.FETCH_BANNERS]({ state, commit }) {
    /** @type {import('@urql/core').Client} */
    const urql = this.app.$urql;

    const result = await urql
      .query(
        BannersDocument,
        {
          short: state.currentLanguage.short,
          places: getBannersPlaces(),
        },
        {
          fetchOptions: {
            headers: {
              /**
               * WARN: because of Conpletus shitty caching this header required
               * by CDT-2387
               */
              'Cache-Control': 'no-store',
            },
          },
        }
      )
      .toPromise();

    const banners = result.data?.locale?.banners ?? [];
    const bannerOptionsList = banners.map(getMappedBannerOptions).filter(Boolean);

    commit(ROOT.MUTATE_SHUFFLE_AND_APPEND_BANNERS, { banners: bannerOptionsList });
    commit(ROOT.MUTATE_CLIENT_BANNERS_LOADED);
  },

  async [ROOT.FETCH_LANGUAGE_OFFER_I18N]({ state, getters, commit }) {
    const { i18n: stateI18n } = state;
    const preferredLanguage = getters[ROOT.PREFERRED_LANGUAGE];

    if (!preferredLanguage) return;

    const { data: languageOfferTranslations } = await fetchTranslations({
      slugsMap: {
        languageOfferTitle: 'lang.offer.title',
        languageOfferDescription: 'lang.offer.description',
        languageOfferYes: 'lang.offer.yes',
        languageOfferNo: 'lang.offer.no',
      },
      languageShort: preferredLanguage.short,
      apolloTransport: this.app.$apolloTransport,
    });
    commit(ROOT.MUTATE_I18N, {
      ...stateI18n,
      ...languageOfferTranslations,
    });
  },
  async [ROOT.FETCH_LANGUAGES]({ state, commit }) {
    const {
      currentLanguage: { short: languageShort },
    } = state;
    const { data: languages } = await fetchLanguages({
      languageShort,
      apolloTransport: this.app.$apolloTransport,
    });
    commit(ROOT.MUTATE_LANGUAGES, languages);
  },
  [ROOT.SET_CURRENT_LANGUAGE]({ state, commit }, payload) {
    const languageShort = payload;
    const { languages } = state;
    const found = languages.find((item) => item.short === languageShort);
    if (found) {
      commit(ROOT.MUTATE_CURRENT_LANGUAGE, found);
    } else {
      report({
        tag: 'store-set-current-language',
        error: {
          message: `Proper language was not found; \`languageShort\`: "${languageShort}"; languages: [${languages
            .map((item) => item.short)
            .join(', ')}]`,
        },
      });
    }
  },
  [ROOT.SET_YOUTUBE_API_READY]({ commit }) {
    commit(ROOT.MUTATE_YOUTUBE_API_READY, true);
  },
  [ROOT.SET_ALTERNATES]({ state, commit }, payload = {}) {
    const { languages, currentLanguage } = state;
    const { alternates, url } = payload;
    const existedAlternates = alternates
      .filter(({ id }) => id !== currentLanguage.id)
      .map(({ id }) => ({
        id,
        url,
      }));
    const extendedLanguages = languages.map((language) => ({
      ...language,
      alternateUrl: existedAlternates.find((alternate) => alternate.id === language.id) || {},
    }));
    commit(ROOT.MUTATE_LANGUAGES, extendedLanguages);
  },
};
