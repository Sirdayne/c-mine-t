import { POST } from '~/store/types';

export const state = () => ({
  currentPlayerId: null,
});

export const mutations = {
  [POST.MUTATE_PLAYER_ID](state, payload) {
    state.currentPlayerId = payload;
  },
};

export const actions = {
  [POST.SET_PLAYER_ID]({ commit }, payload) {
    commit(POST.MUTATE_PLAYER_ID, payload);
  },
};
