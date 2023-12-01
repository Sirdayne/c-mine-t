import { formatInTimeZone } from 'date-fns-tz';
import { isValid, formatISO } from 'date-fns';
import { unsafeParseDate } from '~/assets/libs/dateTimeUtils';
import { DEFAULT_LANGUAGE, INTL_TAG_BY_LANGUAGE_CODE } from '~/app.config';

const getFormatDateTimePattern = (languageCode = DEFAULT_LANGUAGE.code) => {
  return languageCode === INTL_TAG_BY_LANGUAGE_CODE.ja ? "yyyy'年'MM'月'dd'日' / HH:mm" : 'yyyy-MM-dd HH:mm';
};

export const getDateTime = (
  dateString = '',
  timeZone = DEFAULT_LANGUAGE.timezone,
  languageCode = DEFAULT_LANGUAGE.code
) => {
  const date = unsafeParseDate(dateString);

  if (!isValid(date)) {
    return {
      dateTimeObject: null,
      dateISOShort: '',
      dateISOFull: '',
    };
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateISOShort = formatISO(date, { format: 'extended', representation: 'date' });
  const dateISOFull = date.toISOString();
  const pattern = getFormatDateTimePattern(languageCode);
  const humanDateTime = formatInTimeZone(date, timeZone, pattern);
  return {
    dateTimeObject: {
      year,
      month,
      day,
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
      millisecond: date.getMilliseconds(),
    },
    dateISOShort,
    dateISOFull,
    humanDateTime,
  };
};

export const getFormattedDateString = (date = '') => {
  if (typeof date !== 'string' || !date) {
    return '';
  }
  const pad = (s) => `0${s}`.slice(-2);
  const isValidDate = (d) => d instanceof Date && !Number.isNaN(d);
  const getFormattedString = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const d = new Date(date);
  return isValidDate(d) ? getFormattedString(d) : '';
};
