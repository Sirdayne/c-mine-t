import throttle from '~/assets/libs/throttle';
import { VIEWPORT } from '~/store/types';
import { getBreakpointName } from '~/assets/helpers/viewport';
import { BREAKPOINTS } from '~/app.config';

export const state = () => ({
  isWindowActive: true,
  viewportWidth: 0,
  viewportHeight: 0,
  scrollTop: 0,
  scrollIsLocked: false,
  breakpoint: BREAKPOINTS.XS,
  isOverlayVisible: false,
  userDeviceType: null,
  bottomZoneHeight: 0,
});

export const getters = {
  [VIEWPORT.IS_WINDOW_ACTIVE]: ({ isWindowActive }) => isWindowActive,
  [VIEWPORT.IS_DESKTOP_WIDTH]: ({ breakpoint }) =>
    [BREAKPOINTS.SM, BREAKPOINTS.MD, BREAKPOINTS.LG].includes(breakpoint),
  [VIEWPORT.IS_LARGE_WIDTH]: ({ breakpoint }) => [BREAKPOINTS.MD, BREAKPOINTS.LG].includes(breakpoint),
  [VIEWPORT.IS_MOBILE_WIDTH]: ({ breakpoint }) => [BREAKPOINTS.XXS, BREAKPOINTS.XS].includes(breakpoint),
  [VIEWPORT.IS_MOBILE_BREAKPOINT]: ({ breakpoint }) =>
    [BREAKPOINTS.XXS, BREAKPOINTS.XS, BREAKPOINTS.SM].includes(breakpoint),
  [VIEWPORT.VIEWPORT_WIDTH]: ({ viewportWidth }) => viewportWidth,
  [VIEWPORT.VIEWPORT_HEIGHT]: ({ viewportHeight }) => viewportHeight,
  [VIEWPORT.SCROLL_TOP]: ({ scrollTop }) => scrollTop,
  [VIEWPORT.BREAKPOINT]: ({ breakpoint }) => breakpoint,
  [VIEWPORT.IS_ONLY_MOBILE_BREAKPOINT]: ({ breakpoint }) => breakpoint === BREAKPOINTS.XXS,
};

export const mutations = {
  [VIEWPORT.MUTATE_IS_WINDOW_ACTIVE]: (state, value) => {
    state.isWindowActive = value;
  },
  [VIEWPORT.MUTATE_OVERLAY_VISIBILITY]: (state, value) => {
    state.isOverlayVisible = value;
  },
  [VIEWPORT.MUTATE_VIEWPORT_WIDTH]: (state, value) => {
    state.viewportWidth = value;
  },
  [VIEWPORT.MUTATE_VIEWPORT_HEIGHT]: (state, value) => {
    state.viewportHeight = value;
  },
  [VIEWPORT.MUTATE_SCROLL_TOP]: (state, value) => {
    state.scrollTop = value;
  },
  [VIEWPORT.MUTATE_BREAKPOINT]: (state, value) => {
    state.breakpoint = value;
  },
  [VIEWPORT.MUTATE_USER_DEVICE_TYPE]: (state, payload) => {
    state.userDeviceType = payload;
  },
  [VIEWPORT.MUTATE_BOTTOM_ZONE_HEIGHT](state, payload) {
    state.bottomZoneHeight = payload;
  },
  [VIEWPORT.MUTATE_LOCK_SCROLL](state, payload) {
    state.scrollIsLocked = payload;
  },
};

export const actions = {
  [VIEWPORT.LISTEN_TO_WINDOW_ACTIVE]: ({ dispatch }) => {
    if (process.server) {
      return;
    }
    let hidden;
    let visibilityChange;
    if (typeof window.document.hidden !== 'undefined') {
      hidden = 'hidden';
      visibilityChange = 'visibilitychange';
    } else if (typeof window.document.msHidden !== 'undefined') {
      hidden = 'msHidden';
      visibilityChange = 'msvisibilitychange';
    } else if (typeof window.document.webkitHidden !== 'undefined') {
      hidden = 'webkitHidden';
      visibilityChange = 'webkitvisibilitychange';
    }
    if (hidden === undefined) {
      return;
    }
    dispatch(VIEWPORT.ON_WINDOW_ACTIVE, !window.document[hidden]);
    window.document.addEventListener(
      visibilityChange,
      () => {
        dispatch(VIEWPORT.ON_WINDOW_ACTIVE, !window.document[hidden]);
      },
      false
    );
  },
  [VIEWPORT.LISTEN_TO_WINDOW_RESIZE]: ({ dispatch }) => {
    if (process.server) {
      return;
    }
    dispatch(VIEWPORT.ON_RESIZE_CALLBACK);
    window.addEventListener(
      'resize',
      throttle(() => {
        dispatch(VIEWPORT.ON_RESIZE_CALLBACK);
      }, 100),
      { passive: true }
    );
  },
  [VIEWPORT.LISTEN_TO_WINDOW_SCROLL]: ({ dispatch }) => {
    if (process.server) {
      return;
    }
    dispatch(VIEWPORT.ON_SCROLL_CALLBACK);
    window.addEventListener(
      'scroll',
      throttle(() => {
        dispatch(VIEWPORT.ON_SCROLL_CALLBACK);
      }, 100),
      { passive: true }
    );
  },
  [VIEWPORT.ON_WINDOW_ACTIVE]: ({ commit }, value) => {
    if (process.server) {
      return;
    }
    commit(VIEWPORT.MUTATE_IS_WINDOW_ACTIVE, value);
  },
  [VIEWPORT.ON_RESIZE_CALLBACK]: ({ commit }) => {
    if (process.server) {
      return;
    }
    const width = window.innerWidth;
    const height = window.innerHeight;
    commit(VIEWPORT.MUTATE_VIEWPORT_WIDTH, width);
    commit(VIEWPORT.MUTATE_VIEWPORT_HEIGHT, height);
    commit(VIEWPORT.MUTATE_BREAKPOINT, getBreakpointName(width));
  },
  [VIEWPORT.ON_SCROLL_CALLBACK]: ({ commit }) => {
    if (process.server) {
      return;
    }
    const scrollTop = window.document.documentElement.scrollTop || window.document.body.scrollTop;
    commit(VIEWPORT.MUTATE_SCROLL_TOP, scrollTop);
  },
  [VIEWPORT.SET_BOTTOM_ZONE_HEIGHT]({ commit }, payload) {
    commit(VIEWPORT.MUTATE_BOTTOM_ZONE_HEIGHT, payload);
  },
  [VIEWPORT.SET_LOCK_SCROLL]({ commit }, payload) {
    commit(VIEWPORT.MUTATE_LOCK_SCROLL, payload);
  },
  [VIEWPORT.SET_OVERLAY_VISIBILITY]({ commit }, payload) {
    commit(VIEWPORT.MUTATE_OVERLAY_VISIBILITY, payload);
  },
};
