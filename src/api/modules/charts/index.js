import { getUnixTime, sub } from 'date-fns';
import { axiosTransport } from '~/api/transport/axiosTransport';
import { RATES_SERVICE_CLIENT_URL } from '~/app.config';
import { mapCharts } from '~/assets/helpers/charts';
import { captureError } from '~/lib/telemetry';

const DEFAULT_PERIOD_IN_HOURS = 24;

/**
 * @param options.variables {from: string, to: string, pairs: string}
 * @return {Promise<{errors: string, status: string}>}
 */
export const fetchCharts = async (options = {}) => {
  const date = new Date();
  const defaultFrom = getUnixTime(sub(date, { hours: DEFAULT_PERIOD_IN_HOURS }));
  const defaultTo = getUnixTime(date);

  const {
    from = defaultFrom,
    to = defaultTo,
    limit = DEFAULT_PERIOD_IN_HOURS,
    period = 'H1',
    pairs = ['BTC-USD'],
  } = options;

  try {
    const result = await axiosTransport.request({
      baseURL: RATES_SERVICE_CLIENT_URL,
      url: 'historical/',
      params: {
        pairs: pairs.join(','),
        time_from: from,
        time_till: to,
        period,
        limit,
      },
    });

    const data = mapCharts(result.data);

    return {
      status: 'success',
      data,
      errors: null,
    };
  } catch (error) {
    captureError(error);

    return {
      status: 'error',
      data: null,
      errors: 'error',
    };
  }
};
