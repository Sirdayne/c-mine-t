import { DEFAULT_LANGUAGE } from '~/app.config';

const isStringInLowerCase = (string = '') => string === string.toLowerCase();

export const pathValidator = ({ route: { path }, redirect }) => {
  return isStringInLowerCase(path) || redirect(301, path.toLowerCase());
};

export const rootUrlResolver = ({ domain = DEFAULT_LANGUAGE.domain }) => `https://${domain}`;

export const appendScript = ({ src = '', async = false, defer = false }) =>
  new Promise((resolve, reject) => {
    if (typeof document !== 'object' || typeof document.createElement !== 'function') {
      return;
    }
    const script = document.createElement('script');
    script.onload = () => resolve(true);
    script.onerror = (e) => reject(e);
    if (async) {
      script.async = true;
    }
    if (defer) {
      script.defer = true;
    }
    script.src = src;
    document.head.appendChild(script);
  });

export const attempt = async (fn, ...args) => {
  try {
    return await fn(...args);
  } catch (e) {
    return e instanceof Error ? e : new Error(e);
  }
};
