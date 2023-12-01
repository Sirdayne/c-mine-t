import { IMAGE_MODAL } from '~/store/types';

export const state = () => ({
  isImageModalOpened: false,
  data: {},
});

export const mutations = {
  [IMAGE_MODAL.MUTATE_IS_SHOWN](state, value) {
    state.isImageModalOpened = value;
  },
  [IMAGE_MODAL.MUTATE_DATA](state, value) {
    state.data = value;
  },
};

export const actions = {
  [IMAGE_MODAL.SET_IS_SHOWN]({ commit }, payload) {
    const { isImageModalOpened } = payload;
    commit(IMAGE_MODAL.MUTATE_IS_SHOWN, isImageModalOpened);
  },
  [IMAGE_MODAL.SET_DATA]({ commit }, payload) {
    commit(IMAGE_MODAL.MUTATE_DATA, payload);
  },
};
