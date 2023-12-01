import { SUBSCRIBE_STOP_PHRASES } from '~/app.config';

export const validateEmail = (value = '') => {
  const regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
  return regex.test(value);
};

export const isStringHasStopPhrases = (message, phrases = SUBSCRIBE_STOP_PHRASES) => {
  return phrases.reduce((acc, phrase) => message.indexOf(phrase) > -1 || acc, false);
};

const sendData = (email, url) => {
  return new Promise((resolve) => {
    const query = `${url}&EMAIL=${encodeURIComponent(email)}`;
    const response = {
      error: false,
      message: '',
      hasStopPhrases: false,
    };
    import('jsonp').then((module) => {
      const jsonp = module.default;
      jsonp(query, { param: 'c' }, (err, { msg, result } = {}) => {
        resolve({
          ...response,
          hasStopPhrases: isStringHasStopPhrases(msg),
          error: err || result === 'error',
          message: msg,
        });
      });
    });
  });
};

export const submitForm = async (email, url, ...rest) => {
  return rest.length ? (await submitForm(email, ...rest)) && sendData(email, url) : sendData(email, url);
};
