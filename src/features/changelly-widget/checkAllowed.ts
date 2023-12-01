export interface IsChangellyWidgetVisibleArgs {
  userCountry: string | null;
  postPreviewText: string;
  postFullText: string;
  postTags: { title: string; slug: string }[];
}

const RESTRICTED_WORDS = ['scam', 'fraud', 'hack', 'hacker', 'vulnerability'];

/**
 * ISO-3166-2 country codes
 * where widget allowed
 * @see https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes
 */
const ALLOWED_COUNTRIES = [
  'DZ',
  'AO',
  'BJ',
  'BW',
  'BF',
  'BI',
  'CV',
  'CM',
  'CF',
  'TD',
  'KM',
  'CG',
  'CD',
  'DJ',
  'EG',
  'GQ',
  'ER',
  'SZ',
  'ET',
  'GA',
  'GM',
  'GH',
  'GN',
  'GW',
  'CI',
  'KE',
  'LS',
  'LR',
  'LY',
  'MG',
  'MW',
  'ML',
  'MR',
  'MU',
  'MA',
  'MZ',
  'NA',
  'NE',
  'NG',
  'RW',
  'ST',
  'SN',
  'SC',
  'SL',
  'SO',
  'ZA',
  'SS',
  'SD',
  'TZ',
  'TG',
  'TN',
  'UG',
  'ZM',
  'ZW',
  'AF',
  'AM',
  'AZ',
  'BH',
  'BD',
  'BT',
  'BN',
  'KH',
  'CN',
  'TL',
  'GE',
  'IN',
  'ID',
  'IR',
  'IQ',
  'IL',
  'JP',
  'JO',
  'KZ',
  'KW',
  'KG',
  'LA',
  'LB',
  'MY',
  'MV',
  'MN',
  'MM',
  'NP',
  'KP',
  'OM',
  'PK',
  'PS',
  'PH',
  'QA',
  'SA',
  'SG',
  'KR',
  'LK',
  'SY',
  'TW',
  'TJ',
  'TH',
  'TR',
  'TM',
  'AE',
  'VN',
  'YE',
];

const isContainBadWords = (source: string): boolean => {
  const lowerCasedSource = source.toLowerCase();

  for (const restrictedWord of RESTRICTED_WORDS) {
    if (lowerCasedSource.includes(restrictedWord)) return true;
  }

  return false;
};

export const checkAllowed = ({
  userCountry,
  postFullText,
  postPreviewText,
  postTags,
}: IsChangellyWidgetVisibleArgs): boolean => {
  const contentContainsBadWords = [...postTags.map((t) => t.title), postFullText, postPreviewText].some(
    isContainBadWords
  );

  const userCountryAllowed = !userCountry || ALLOWED_COUNTRIES.includes(userCountry.toUpperCase());

  return userCountryAllowed && !contentContainsBadWords;
};
