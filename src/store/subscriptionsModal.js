import { SUBSCRIPTIONS_MODAL } from '~/store/types';
import { fetchTranslations } from '~/api/modules/shared';
import { subscriptionsModalSlugMap } from '~/assets/helpers/i18n';
import { mapDataFromI18n } from '~/assets/helpers/subscriptions';

export const state = () => ({
  i18n: null,
  isModalOpened: false,
  listItems: [],
});

export const mutations = {
  [SUBSCRIPTIONS_MODAL.MUTATE_IS_SHOWN](state, payload) {
    state.isModalOpened = payload;
  },
  [SUBSCRIPTIONS_MODAL.MUTATE_LIST_ITEMS](state, payload) {
    state.listItems = payload;
  },
  [SUBSCRIPTIONS_MODAL.MUTATE_I18N](state, payload) {
    state.i18n = payload;
  },
};

export const actions = {
  [SUBSCRIPTIONS_MODAL.SET_IS_SHOWN]({ commit }, payload) {
    commit(SUBSCRIPTIONS_MODAL.MUTATE_IS_SHOWN, payload);
  },
  async [SUBSCRIPTIONS_MODAL.FETCH_I18N]({ commit, rootState }) {
    const { data: allI18n } = await fetchTranslations({
      slugsMap: subscriptionsModalSlugMap,
      languageShort: rootState.currentLanguage.short,
      apolloTransport: this.app.$apolloTransport,
    });
    const { items = [], i18n = {} } = mapDataFromI18n(allI18n, (item, i) => ({
      ...item,
      id: i,
      selected: false,
    }));
    commit(SUBSCRIPTIONS_MODAL.MUTATE_LIST_ITEMS, items);
    commit(SUBSCRIPTIONS_MODAL.MUTATE_I18N, i18n);
  },
};
