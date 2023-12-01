import { MENU } from '~/store/types';
import { fetchMobileMenu, fetchDesktopMenu } from '~/api/modules/menu';

export const state = () => ({
  isMobileMenuOpened: false,
  isSearchOpened: false,
  scrollBeforeOpened: 0,
  mobileMenu: [],
  desktopMenu: [],
});

export const mutations = {
  [MENU.MUTATE_MOBILE_MENU_OPENED](state, payload) {
    state.isMobileMenuOpened = payload;
  },
  [MENU.MUTATE_SEARCH_OPENED](state, payload) {
    state.isSearchOpened = payload;
  },
  [MENU.MUTATE_SCROLL_BEFORE_OPENED](state, payload) {
    state.scrollBeforeOpened = payload;
  },
  [MENU.MUTATE_MOBILE_MENU](state, payload) {
    state.mobileMenu = payload;
  },
  [MENU.MUTATE_DESKTOP_MENU](state, payload) {
    state.desktopMenu = payload;
  },
};

export const actions = {
  async [MENU.FETCH_MOBILE_MENU]({ commit, rootState }) {
    const { data } = await fetchMobileMenu({
      languageShort: rootState.currentLanguage.short,
      apolloTransport: this.app.$apolloTransport,
    });
    commit(MENU.MUTATE_MOBILE_MENU, data);
  },
  async [MENU.FETCH_DESKTOP_MENU]({ commit, rootState }) {
    const { data } = await fetchDesktopMenu({
      languageShort: rootState.currentLanguage.short,
      apolloTransport: this.app.$apolloTransport,
    });
    commit(MENU.MUTATE_DESKTOP_MENU, data);
  },
  [MENU.OPEN_MOBILE_MENU]({ commit }) {
    commit(MENU.MUTATE_MOBILE_MENU_OPENED, true);
  },
  [MENU.CLOSE_MOBILE_MENU]({ commit }) {
    commit(MENU.MUTATE_MOBILE_MENU_OPENED, false);
  },
  [MENU.OPEN_SEARCH]({ commit }) {
    commit(MENU.MUTATE_SEARCH_OPENED, true);
  },
  [MENU.CLOSE_SEARCH]({ commit }) {
    commit(MENU.MUTATE_SEARCH_OPENED, false);
  },
  [MENU.SET_SCROLL_BEFORE_OPENED]({ commit }, payload) {
    commit(MENU.MUTATE_SCROLL_BEFORE_OPENED, payload);
  },
};
