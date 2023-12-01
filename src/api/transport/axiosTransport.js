import axios from 'axios';
import { logApi } from '~/assets/helpers/log';
import { report } from '~/assets/helpers/sentry';
import { getTracingHeaders } from '~/lib/telemetry';

axios.interceptors.request.use(
  (config) => {
    config.headers = {
      ...config.headers,
      ...getTracingHeaders(),
    };

    return config;
  },
  (error) => Promise.reject(error)
);

const interceptorsWithSentryLogging = (axiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      const { sentryTag } = error.config || {};
      report({
        tag: sentryTag,
        error,
      });
      logApi.warn(error);
      return Promise.reject(error);
    }
  );
};

const axiosInstance = axios.create({
  timeout: 0,
});

interceptorsWithSentryLogging(axiosInstance);

/**
 * @type {import('axios').AxiosInstance}
 */
export const axiosTransport = axiosInstance;
