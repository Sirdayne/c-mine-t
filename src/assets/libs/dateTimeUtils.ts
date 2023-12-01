import { intlFormat, intlFormatDistance, parseISO, differenceInSeconds, isValid, isDate } from 'date-fns';

export const isDateTimeRecent = (source: Date, now: Date, thresholdInSeconds: number): boolean =>
  thresholdInSeconds > 0 && differenceInSeconds(now, source) < thresholdInSeconds;

export const unsafeParseDate = (source: unknown): Date => {
  if (isDate(source)) return source as Date;

  try {
    return parseISO(source as string);
  } catch (error) {
    return new Date(NaN);
  }
};

export interface PrettyPrintDateTimeOptions {
  // input date to pretty-print in ISO-8601 / RFC-3339 format
  // TODO when parse fails pretty print returns empty string; errors should be captured
  source: unknown;

  now: Date;

  // language code in BCP-47 format (example: de, fr, en-US)
  locale?: string;

  // until which time should be printed in relative format like "1 hour ago"
  recentThresholdInSeconds?: number;
}

export const localeFormatter = (languageShort: string | undefined) => {
  // map our language.short to BCP-47 locale code
  if (languageShort === 'jp') return 'ja';
  if (languageShort === 'cn') return 'zh-CN';
  if (languageShort === 'kr') return 'ko';
  if (languageShort === 'br') return 'pt-BR';
  if (languageShort === 'ar') return 'ar-AE';
  if (languageShort === 'my') return 'ms-MY';

  return languageShort;
};
export const prettyPrintDateTime = ({
  now,
  source: sourceRaw,
  recentThresholdInSeconds,
  locale,
}: PrettyPrintDateTimeOptions): string => {
  const source = unsafeParseDate(sourceRaw);
  const dateIsRecent = Boolean(recentThresholdInSeconds) && isDateTimeRecent(source, now, recentThresholdInSeconds);

  if (!isValid(source)) return '';
  const formattedLocale = localeFormatter(locale);
  if (dateIsRecent) return intlFormatDistance(source, now, { locale: formattedLocale });

  return intlFormat(
    source,
    {
      hour: 'numeric',
      minute: 'numeric',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    },
    { locale: formattedLocale }
  );
};
