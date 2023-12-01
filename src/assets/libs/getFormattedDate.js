import getProperty from '~/assets/libs/getProperty';
import { DEFAULT_LANGUAGE } from '~/app.config';
import { getDateTime } from '~/assets/helpers/dateTime';

export default (options = {}) => {
  const date = getProperty(options, 'date', '');
  const timeZone = getProperty(options, 'timeZone', DEFAULT_LANGUAGE.timezone);
  const languageCode = getProperty(options, 'languageCode', DEFAULT_LANGUAGE.code);
  return getDateTime(date, timeZone, languageCode);
};
