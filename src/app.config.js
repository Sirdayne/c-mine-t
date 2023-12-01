export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const ADBUTLER_ID = 169476;

export const ERROR_MESSAGE = 'Unexpected error has occurred';

export const RATES_SERVICE_CLIENT_URL = process.env.TICKER_API_URL || process.env.RATES_CLIENT_URL;

export const ARTISAN_URL = process.env.ARTISAN_URL;

export const META_LOGO_URL = 'https://cointelegraph.com/assets/img/ct-meta-logo.png';

export const AUTHOR_FALLBACK_FEMALE_URL =
  'https://s3.cointelegraph.com/storage/uploads/view/45882b3b517958934ec343e657fa0069.png';

export const AUTHOR_FALLBACK_MALE_URL =
  'https://s3.cointelegraph.com/storage/uploads/view/422b8ae3bb89a5fca07ae7999226ef91.jpg';

export const POST_FALLBACK_COVER_URL =
  'https://s3.cointelegraph.com/storage/uploads/view/c6c580810575311bb52a64622466fff3.png';

export const ADBUTLER_URL = 'https://servedbyadbutler.com/adserve';

export const SUBSCRIBE_BASE_URL =
  'https://cointelegraph.us3.list-manage.com/subscribe/post-json?u=2c088712615955cd2f82aa968&id=';

export const RATES_URL = `${RATES_SERVICE_CLIENT_URL}/rates/?full=true`;

export const RATES_HISTORY_URL = `${RATES_SERVICE_CLIENT_URL}/historical/`;

export const RATES_HISTORICAL_URL = `${RATES_SERVICE_CLIENT_URL}/history/`;

export const MARKETS_URL = `${RATES_SERVICE_CLIENT_URL}/markets/`;

export const MAIN_PAGE_POSTS_LENGTH = 30;
export const MAIN_PAGE_POSTS_LENGTH_MOBILE = 23;

export const MAIN_PAGE_RELEASES_LENGTH = 21;

export const AUTHOR_PAGE_POSTS_LENGTH = 30;

export const CATEGORY_PAGE_POSTS_LENGTH = 15;

export const LOCAL_POSTS_PAGE_POSTS_LENGTH = 15;

export const TAG_PAGE_POSTS_LENGTH = 15;

export const INNOVATION_CIRCLE_PAGE_POSTS_LENGTH = 15;

export const PRICE_INDEX_PAGE_POSTS_LENGTH = 5;

export const ARTICLE_PAGE_INFINITE_ARTICLES_LENGTH = 1;

export const MAIN_PAGE_POSTS_POSITIONS_DESKTOP = [4, 10, 16, 22, 28];

export const MAIN_PAGE_POSTS_POSITIONS_MOBILE = [0, 6, 9, 15];

export const MAIN_PAGE_POSTS_POSITIONS_MOBILE_JP = [2, 8, 11, 14];

export const MAIN_PAGE_POSTS_STRETCH_POSITION = 6;
export const MAIN_PAGE_POSTS_STRETCH_POSITION_MOBILE = 7;

export const MAIN_PAGE_RECENTLY_COLLECTED_WIDGET_POSITION = 12;
export const MAIN_PAGE_RECENTLY_COLLECTED_WIDGET_POSITION_MOBILE = 10;

export const UNI_BLOCK_BETWEEN_POSTS_POSITION = 12;
export const UNI_BLOCK_BETWEEN_POSTS_POSITION_MOBILE = 13;

export const UNI_BLOCK_INNOVATION_CIRCLE_POSITION = 18;

export const RELATED_POSTS_LENGTH = 3;

export const ASIA_BIG_POST_INDEX = 5;

export const DEFAULT_LANGUAGE = {
  id: 1,
  url: 'https://cointelegraph.com',
  name: 'English',
  short: 'en',
  code: 'en',
  domain: 'cointelegraph.com',
  timezone: 'Europe/London',
  emailSubscribes: [],
  robotsTxt: '',
  isHidden: false,
};

export const DEFAULT_META = {
  url: '/',
  title: 'Cointelegraph Bitcoin & Ethereum Blockchain News',
  description:
    'The most recent news about crypto industry at Cointelegraph. Latest news about bitcoin, ethereum, blockchain, mining, cryptocurrency prices and more',
  keywords:
    'cryptocurrency, bitcoin, ethereum, finance, markets, ico, blockchain technology, bitcoin news, ethereum news, cryptocurrency market, cryptocurrency news today',
  image: 'https://s3.cointelegraph.com/storage/uploads/view/6259d082e83d20491f43075c38d970ea.png',
  openGraphType: 'website',
  twitterCard: 'summary_large_image',
};

export const INNOVATION_CIRCLE_META = {
  url: '/innovation-circle',
  title: 'Innovation Circle',
  description:
    'Cointelegraph Innovation Circle is a vetted professional organization of founders, partners, C-suite executives, principal decision makers (VP-level or higher), and experts in the fields of blockchain technology, cryptocurrency, Web3, NFTs, and decentralization in industries such as finance, insurance, gaming, healthcare, and more.',
  keywords:
    'cryptocurrency, bitcoin, ethereum, finance, markets, ico, blockchain technology, bitcoin news, ethereum news, cryptocurrency market, cryptocurrency news today',
  image: 'https://cointelegraph.com/assets/img/innovation-circle.jpg',
  openGraphType: 'website',
  twitterCard: 'summary_large_image',
};

export const NEWSLETTER_META = {
  url: '/',
  title: 'Newsletter Subscriptions - Cointelegraph',
  description: 'This will be the home of the Newsletter Landing Page',
  keywords:
    'cryptocurrency, bitcoin, ethereum, finance, markets, ico, blockchain technology, bitcoin news, ethereum news, cryptocurrency market, cryptocurrency news today',
  image: 'https://s3.cointelegraph.com/storage/uploads/view/6259d082e83d20491f43075c38d970ea.png',
  openGraphType: 'website',
  twitterCard: 'summary_large_image',
};

export const DEFAULT_CURRENCY = 'USD';

export const DEFAULT_DECIMALS = 2;

export const BANNER_PLACES = {
  LEADERBOARD_DESKTOP: 'leaderboard',
  LEADERBOARD_MOBILE: 'leaderboard_mobile',
  MAIN_POSTS_DESKTOP: 'index',
  MAIN_POSTS_MOBILE: 'index_mobile',
  MAIN_POSTS_NON_STRETCH_MOBILE: 'index_mobile_new',
  MAIN_STICKY: 'index_sticky',
  BILLBOARD_MOBILE: 'billboard_mobile',
  SIDEBAR: 'side',
  HEADER_DESKTOP: 'header_2',
  BETWEEN_POSTS_DESKTOP: 'article',
  BETWEEN_POSTS_MOBILE: 'article_mobile',
  BETWEEN_POSTS_YOUTUBE_MOBILE: 'article_mobile_youtube',
  PROMO_BUTTON_INDEX_MOBILE: 'promo_button_index_mobile',
  PROMO_BUTTON_ARTICLE_MOBILE: 'promo_button_article_mobile',
  PROMO_BUTTON_TAG_MOBILE: 'promo_button_tag_mobile',
  PROMO_BUTTON_TAG_DESKTOP: 'promo_button_tag_desktop',
  PROMO_BUTTON_PRICE_INDEX_DESKTOP: 'promo_button_price_index_desktop',
  PROMO_BUTTON_PRICE_INDEX_MOBILE: 'promo_button_price_index_mobile',
  PROMO_BUTTON_PRICE_INDEX_CALCULATOR: 'promo_button_price_index_calculator',
  PROMO_BUTTON_PRICE_INDEX_CALCULATOR_MOBILE: 'promo_button_price_index_calculator_mobile',
  PROMO_BUTTON_PRICE_INDEX_OVERVIEW_DESKTOP: 'promo_button_price_index_overview_desktop',
  PROMO_BUTTON_PRICE_INDEX_OVERVIEW_MOBILE: 'promo_button_price_index_overview_mobile',
  PROMO_BUTTON_PRICE_INDEX_HISTORY_DESKTOP: 'promo_button_price_index_history_desktop',
  PROMO_BUTTON_PRICE_INDEX_HISTORY_MOBILE: 'promo_button_price_index_history_mobile',
  PROMO_BUTTON_PRICE_INDEXES_MOBILE: 'promo_button_price_indexes_mobile',
  PROMO_BUTTON_PRICE_INDEXES_DESKTOP: 'promo_button_price_indexes_desktop',
  PROMO_BUTTON_101_INDEX_DESKTOP: 'promo_button_101_index_desktop',
  PROMO_BUTTON_101_INDEX_MOBILE: 'promo_button_101_index_mobile',
  PROMO_BUTTON_101_DESKTOP: 'promo_button_101_desktop',
  PROMO_BUTTON_101_MOBILE: 'promo_button_101_mobile',
  PROMO_BUTTON_CATEGORY_DESKTOP: 'promo_button_category_desktop',
  PROMO_BUTTON_CATEGORY_MOBILE: 'promo_button_category_mobile',
  PROMO_BUTTON_STACK_INDEX_MOBILE: 'promo_button_stack_index_mobile',
  PROMO_BUTTON_STACK_ARTICLE_MOBILE: 'promo_button_stack_article_mobile',
  PROMO_BUTTON_STACK_TAG_MOBILE: 'promo_button_stack_tag_mobile',
  RELATED_NEWS_SLOT_2: 'related_news_slot_2',
  IN_MOBILE_HEADER: 'in_mobile_header',
  IN_ARTICLE_AFTER_30_PERCENTS_MOBILE: 'in_article_after_30_percents_mobile',
  IN_ARTICLE_AFTER_30_PERCENTS_DESKTOP: 'in_article_after_30_percents_desktop',
  AFTER_ARTICLE_BODY_MOBILE: 'after_article_body_mobile',
  AFTER_ARTICLE_BODY_DESKTOP: 'after_article_body_desktop',
  PODCASTS_MOBILE_YOUTUBE: 'mobile_podcasts_youtube',
  PODCASTS_MOBILE_SQUARE_BANNER: 'mobile_podcasts_square_banner',
  PODCASTS_MOBILE_PROMO_BUTTON: 'mobile_podcasts_promo_button',
  PODCASTS_MOBILE_PROMO_BUTTONS_STACK: 'mobile_podcasts_promo_button_stack',
  LIVE_DATA_POPUP_PROMO_BUTTON: 'live_data_popup_promo_button',
  LEARN_SIDEBAR_DESKTOP: 'learn_sidebar_desktop',
  LEARN_SIDEBAR_DESKTOP_PROMO_BUTTON_STACK: 'learn_sidebar_desktop_stack',
};

export const BANNER_TYPES = {
  IMAGE: 'image',
  HTML5: 'html5',
  ADBUTLER: 'adbutler',
  ADBUTLER_YOUTUBE: 'adbutler_youtube',
  WIDGET: 'widget',
  QUIZ: 'quiz',
  POST: 'post',
  STRETCH: 'stretch',
  PROMO_BUTTON: 'promo_button',
  INDEX_STICKY: 'sticky',
  PROMO_BUTTON_STACK: 'promo_button_stack',
};

export const POST_BADGES = {
  1: {
    key: 'new',
    i18nKey: 'menuBadgeNew',
  },
  2: {
    key: 'soon',
    i18nKey: 'menuBadgeSoon',
  },
  3: {
    key: 'partner',
    i18nKey: 'menuBadgePartner',
  },
};

export const UNI_BLOCK_TYPES = {
  BETWEEN_POSTS: 'nrm_uni_block',
  INNOVATION_CIRCLE_POSTS: 'icp_uni_block',
  TOP: 'top_uni_block',
};

export const POSTS_ORDER_TYPES = {
  BY_VIEWS: 'postViews',
  BY_PRIORITY: 'postEditorsPriority',
  BY_TIME: 'postPublishedTime',
  BY_HOT: 'hotStories',
};

export const LOCAL_STORAGE_MAP = {
  CURRENCY_SELECTED: 'selected-currency',
  PRIVACY_POLICY: 'privacy-policy',
  LANGUAGE_OFFER: 'language-offer',
};

export const SUBSCRIBE_STOP_PHRASES = ['already subscribed', 'for this email', 'has too many recent'];
export const FOOTER_SUBSCRIBE_ACTIONS_BY_LANGUAGE = {
  fr: '64411716475159567',
  tr: '64411708903392544',
  br: '64411697250567223',
  jp: '64411679043093907',
  es: '64411660889097247',
  ar: '64411626602759420',
  de: '64411650431649306',
  it: '64411670411216869',
  cn: '64411637750171353',
  en: ['63518551307192135', '63518563605939751'],
};

export const SUBSCRIBE_ACTIONS_BY_LANGUAGE = {
  fr: [
    {
      slug: 'default',
      url: `${SUBSCRIBE_BASE_URL}dee544ff6b`,
    },
  ],
  br: [
    {
      slug: 'default',
      url: `${SUBSCRIBE_BASE_URL}2b7bbd12fe`,
    },
  ],
  tr: [
    {
      slug: 'default',
      url: `${SUBSCRIBE_BASE_URL}198f9eda4e`,
    },
  ],
  es: [
    {
      slug: 'default',
      url: `${SUBSCRIBE_BASE_URL}af24eff291`,
    },
  ],
  ru: [
    {
      slug: 'default',
      url: `${SUBSCRIBE_BASE_URL}0e3ce9e1aa`,
    },
  ],
  ar: [
    {
      slug: 'default',
      url: `${SUBSCRIBE_BASE_URL}3742c8945c`,
    },
  ],
  jp: [
    {
      slug: 'default',
      url: `${SUBSCRIBE_BASE_URL}7adb86f95a`,
    },
  ],
  de: [
    {
      slug: 'default',
      url: `${SUBSCRIBE_BASE_URL}d54e1ef71f`,
    },
  ],
  it: [
    {
      slug: 'default',
      url: `${SUBSCRIBE_BASE_URL}db5da21591`,
    },
  ],
  rs: [
    {
      slug: 'default',
      url: `${SUBSCRIBE_BASE_URL}9bbaa3e6dd`,
    },
  ],
  kr: [
    {
      slug: 'default',
      url: `${SUBSCRIBE_BASE_URL}9bb43852cb`,
    },
  ],
  en: [
    {
      slug: 'daily',
      url: `${SUBSCRIBE_BASE_URL}7376af3992`,
    },
    {
      slug: 'weekly',
      url: `${SUBSCRIBE_BASE_URL}aad9f6b505`,
    },
  ],
};

export const TICKERS_REPORT_MESSAGES = {
  COINS_MESSAGE: 'Coins are undefined',
  CURRENCIES_MESSAGE: 'Currencies are undefined',
  TICKERS_RAW_MESSAGE: 'TICKERS are undefined',
  PAIRS_MESSAGE: 'Pairs do not exist',
};

export const COINS_SIDEBAR = ['BTC', 'ETH', 'LTC', 'XRP', 'EOS'];

export const BREAKPOINTS = {
  XXS: 'XXS',
  XS: 'XS',
  SM: 'SM',
  MD: 'MD',
  LG: 'LG',
};

export const PRICE_INDEX_CHART_TYPES = ['LINE', 'CANDLE', 'OHLC'];

export const INTL_TAG_BY_LANGUAGE_SHORT = {
  ar: 'ar',
  de: 'de',
  es: 'es',
  it: 'it',
  jp: 'ja',
  rs: 'sr-Latn-RS',
  br: 'pt-BR',
  kr: 'ko',
  tr: 'tr',
  en: 'en',
  my: 'ms-MY',
};

export const INTL_TAG_BY_LANGUAGE_CODE = {
  en: 'en',
  es: 'es',
  de: 'de',
  it: 'it',
  ar: 'ar',
  sr: 'sr-Latn-RS',
  ja: 'ja',
  'pt-BR': 'pt-BR',
  ko: 'ko',
  zh: 'zh',
  tr: 'tr',
  my: 'ms-MY',
  'ms-MY': 'ms-MY',
};

export const NUMBER_FORMAT_LANGUAGE_CODES = {
  es: 'en',
};

export const KAKAO_API_KEY = 'c0c4b85be1406762eafa519b88b6cc78';

export const KAKAO_API_URL = 'https://developers.kakao.com/sdk/js/kakao.min.js';

export const BANNERS_SIZES = {
  index: 373,
  index_mobile: 373,
  side: 348,
  article: 717,
  article_mobile: 373,
  leaderboard: 1160,
  leaderboard_mobile: 373,
  index_sticky_footer_desktop: 952,
  index_sticky_footer_tablet: 800,
  index_sticky_footer_mobile: 300,
};

export const NAMED_VIEWS = {
  flashNews: 'flashNews',
  default: 'default',
};

export const ASIA_REGIONS_IDS = ['4', '22', '26'];

export const TWITTER_WIDGETS_JS = 'https://platform.twitter.com/widgets.js';

export const PATH_SLUGS_WITHOUT_LEADERBOARD = [
  'download',
  'advertise',
  'donate-with-crypto-ukraine-children-of-heroes',
  'explained-slug',
  'esports-evolution-is-on-the-way-with-moxy',
  'about',
  'slug',
  'sponsored-camino-network-hub',
];

export const LANGUAGES_ORDER = [17, 4, 5, 1, 2, 7, 22, 26, 23, 27, 28];
