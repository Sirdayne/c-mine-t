import { logLibs } from '~/assets/helpers/log';

export const localStorageHelper = {
  get(key) {
    try {
      return JSON.parse(window.localStorage.getItem(key));
    } catch (e) {
      logLibs.warn(e);
      return null;
    }
  },
  set(key, val) {
    try {
      window.localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      logLibs.warn(e);
    }
  },
  remove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      logLibs.warn(e);
    }
  },
  clear() {
    try {
      window.localStorage.clear();
    } catch (e) {
      logLibs.warn(e);
    }
  },
};
