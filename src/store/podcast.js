import { PODCAST } from '~/store/types';

export const state = () => ({
  podcastImageUrl: '',
});

export const mutations = {
  [PODCAST.MUTATE_IMAGE_URL](state, payload) {
    state.podcastImageUrl = payload;
  },
};

export const actions = {
  [PODCAST.SET_IMAGE_URL]({ commit }, payload) {
    commit(PODCAST.MUTATE_IMAGE_URL, payload);
  },
};
