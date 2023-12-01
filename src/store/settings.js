import parseJSON from '~/assets/libs/parseJSON';
import { getMappedSocials } from '~/assets/helpers/settings';
import { fetchSettings, fetchSocialLinks } from '~/api/modules/shared';
import { SETTINGS } from '~/store/types';
import { localStorageHelper } from '~/assets/libs/storage';
import { LOCAL_STORAGE_MAP } from '~/app.config';

const MINUTE = 60 * 1000; // in ms
const DAY = MINUTE * 60 * 24; // in ms
const YEAR = DAY * 365; // in ms

export const state = () => ({
  socials: {},
  socialLinks: {},
  selectedCurrency: '',
  isPrivacyPolicyHidden: true,
  isLanguageOfferHidden: false,
});

export const mutations = {
  [SETTINGS.MUTATE_SOCIALS](state, payload) {
    state.socials = payload;
  },
  [SETTINGS.MUTATE_SOCIAL_LINKS](state, payload) {
    state.socialLinks = payload;
  },
  [SETTINGS.MUTATE_CURRENCY_SELECTED](state, payload) {
    state.selectedCurrency = payload;
  },
  [SETTINGS.MUTATE_LANGUAGE_OFFER_HIDDEN](state, payload) {
    state.isLanguageOfferHidden = payload;
  },
  [SETTINGS.MUTATE_PRIVACY_POLICY_HIDDEN](state, payload) {
    state.isPrivacyPolicyHidden = payload;
  },
};

export const actions = {
  async [SETTINGS.FETCH_SETTINGS]({ commit, rootState }) {
    const { data } = await fetchSettings({
      slugsMap: {
        socials: 'social_settings',
      },
      languageShort: rootState.currentLanguage.short,
      apolloTransport: this.app.$apolloTransport,
    });
    commit(
      SETTINGS.MUTATE_SOCIALS,
      getMappedSocials(
        parseJSON({
          inputValue: data.socials,
          defaultValue: {},
        })
      )
    );
  },
  async [SETTINGS.FETCH_SOCIAL_LINKS]({ commit, rootState }) {
    const { data } = await fetchSocialLinks({
      languageShort: rootState.currentLanguage.short,
      apolloTransport: this.app.$apolloTransport,
    });
    commit(SETTINGS.MUTATE_SOCIAL_LINKS, data);
  },
  [SETTINGS.READ_LOCALSTORAGE_SETTINGS]({ dispatch }) {
    dispatch(SETTINGS.GET_PRIVACY_POLICY_HIDDEN);
    dispatch(SETTINGS.GET_LANGUAGE_OFFER_HIDDEN);
    dispatch(SETTINGS.GET_CURRENCY_SELECTED);
  },
  [SETTINGS.GET_CURRENCY_SELECTED]({ commit }) {
    const value = localStorageHelper.get(LOCAL_STORAGE_MAP.CURRENCY_SELECTED);
    if (!value) {
      return;
    }
    commit(SETTINGS.MUTATE_CURRENCY_SELECTED, value);
  },
  [SETTINGS.GET_LANGUAGE_OFFER_HIDDEN]({ commit }) {
    const MONTH_TIMESTAMP = 86400000 * 30;
    const storedValue = localStorageHelper.get(LOCAL_STORAGE_MAP.LANGUAGE_OFFER);
    let value = false;
    if (!storedValue) {
      localStorageHelper.remove(LOCAL_STORAGE_MAP.LANGUAGE_OFFER);
      localStorageHelper.set(LOCAL_STORAGE_MAP.LANGUAGE_OFFER, { closed: false });
    } else {
      value = storedValue.timestamp > Date.now() - MONTH_TIMESTAMP;
    }
    commit(SETTINGS.MUTATE_LANGUAGE_OFFER_HIDDEN, value);
  },
  [SETTINGS.GET_PRIVACY_POLICY_HIDDEN]({ commit }) {
    const hiddenUntil = localStorageHelper.get(LOCAL_STORAGE_MAP.PRIVACY_POLICY);
    const isHidden = hiddenUntil && hiddenUntil >= Date.now();
    commit(SETTINGS.MUTATE_PRIVACY_POLICY_HIDDEN, isHidden);
  },
  [SETTINGS.SET_CURRENCY_SELECTED]({ commit }, payload) {
    if (!payload) {
      return;
    }

    commit(SETTINGS.MUTATE_CURRENCY_SELECTED, payload);
  },
  [SETTINGS.SET_LANGUAGE_OFFER_HIDDEN]({ commit }) {
    localStorageHelper.set(LOCAL_STORAGE_MAP.LANGUAGE_OFFER, {
      closed: true,
      timestamp: Date.now(),
    });
    commit(SETTINGS.MUTATE_LANGUAGE_OFFER_HIDDEN, true);
  },
  [SETTINGS.SET_PRIVACY_POLICY_HIDDEN]({ commit }, payload) {
    const didUserClosed = payload === 'close';
    const time = Date.now();
    localStorageHelper.set(LOCAL_STORAGE_MAP.PRIVACY_POLICY, time + (didUserClosed ? MINUTE : YEAR));
    commit(SETTINGS.MUTATE_PRIVACY_POLICY_HIDDEN, true);
  },
};
