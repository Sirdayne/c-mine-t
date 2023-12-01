import { AxiosInstance } from 'axios';
import { createInjection } from '~/lib/shared';
import { ConpletusApi } from './ConpletusApi';

const ij = createInjection<ConpletusApi>('conpletus-api');

// TODO: Sentry tracing headers
export const provideConpletusApi = (axiosInstance: AxiosInstance): void => {
  ij.provide(new ConpletusApi(axiosInstance));
};

export const useConpletusApi = ij.use;
