import { FOOTER } from '~/store/types';
import { fetchFooterMenu } from '~/api/modules/menu';

export const state = () => ({
  isShown: true,
  menu: [],
});

export const mutations = {
  [FOOTER.MUTATE_MENU](state, payload) {
    state.menu = payload;
  },
  [FOOTER.MUTATE_IS_SHOWN](state, payload) {
    state.isShown = payload;
  },
};

export const actions = {
  async [FOOTER.FETCH_MENU]({ commit, rootState }) {
    const { data } = await fetchFooterMenu({
      languageShort: rootState.currentLanguage.short,
      apolloTransport: this.app.$apolloTransport,
    });
    commit(FOOTER.MUTATE_MENU, data);
  },
  [FOOTER.HIDE]({ commit }) {
    commit(FOOTER.MUTATE_IS_SHOWN, false);
  },
  [FOOTER.SHOW]({ commit }) {
    commit(FOOTER.MUTATE_IS_SHOWN, true);
  },
};
