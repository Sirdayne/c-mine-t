import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

/** Base author */
export type Author = {
  __typename?: 'Author';
  /** Alternates */
  alternates?: Maybe<Array<Maybe<Language>>>;
  /** Author translates array. */
  authorTranslates?: Maybe<Array<Maybe<AuthorTranslate>>>;
  /** Author avatar. */
  avatar?: Maybe<Scalars['String']>;
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** Created at. */
  createdAt: Scalars['DateTime'];
  /** Author email. */
  email?: Maybe<Scalars['String']>;
  /** Author Social. */
  facebook?: Maybe<Scalars['String']>;
  /** Author gender */
  gender?: Maybe<Scalars['String']>;
  /** Author Social. */
  googlePlus?: Maybe<Scalars['String']>;
  /** Author id. */
  id: Scalars['ID'];
  /** Innovation Circle URL. */
  innovationCircleUrl?: Maybe<Scalars['String']>;
  /** Author Social. */
  linkedin?: Maybe<Scalars['String']>;
  posts?: Maybe<PaginatedPosts>;
  /** Author slug. */
  slug: Scalars['String'];
  /** Author Social. */
  twitter?: Maybe<Scalars['String']>;
  /** Updated at. */
  updatedAt: Scalars['DateTime'];
};


/** Base author */
export type AuthorPostsArgs = {
  length?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Scalars['String']>;
};

/** Base author translate */
export type AuthorTranslate = {
  __typename?: 'AuthorTranslate';
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** Author description. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Author name. */
  name: Scalars['String'];
  /** Author seo description. */
  seoDescription?: Maybe<Scalars['String']>;
  /** Author seo title. */
  seoTitle?: Maybe<Scalars['String']>;
  /** Author show in authors */
  showInAuthors?: Maybe<Scalars['Boolean']>;
};

/** Base banner */
export type Banner = {
  __typename?: 'Banner';
  /** Banner code */
  bannerCode?: Maybe<Scalars['String']>;
  /** Banner comment */
  bannerComment?: Maybe<Scalars['String']>;
  /** Banner image */
  bannerImage?: Maybe<Scalars['String']>;
  /** Banner options */
  bannerOptions?: Maybe<Scalars['String']>;
  /** Banner place */
  bannerPlace: Scalars['String'];
  /** Banner priority */
  bannerPriority?: Maybe<Scalars['Int']>;
  /** Banner title */
  bannerTitle?: Maybe<Scalars['String']>;
  /** Banner type */
  bannerType: Scalars['String'];
  /** Banner url */
  bannerUrl?: Maybe<Scalars['String']>;
  /** Banner weight */
  bannerWeight?: Maybe<Scalars['Int']>;
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** The unique ID of the banner. */
  id: Scalars['ID'];
  /** Banner post */
  post?: Maybe<Post>;
};

/** Buzzsprout platform podcast */
export type BuzzsproutPodcast = {
  __typename?: 'BuzzsproutPodcast';
  artworkUrl?: Maybe<Scalars['String']>;
  /** Author of podcast */
  author?: Maybe<Scalars['String']>;
  backgroundUrl?: Maybe<Scalars['String']>;
  contactEmail?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  explicit?: Maybe<Scalars['String']>;
  /** buzzsprout id */
  id?: Maybe<Scalars['ID']>;
  keywords?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  lastUpdate?: Maybe<Scalars['DateTime']>;
  mainCategory?: Maybe<Scalars['String']>;
  mainCategory2?: Maybe<Scalars['String']>;
  mainCategory3?: Maybe<Scalars['String']>;
  subCategory?: Maybe<Scalars['String']>;
  subCategory2?: Maybe<Scalars['String']>;
  subCategory3?: Maybe<Scalars['String']>;
  timezone?: Maybe<Scalars['String']>;
  /** Name of podcast */
  title?: Maybe<Scalars['String']>;
  websiteAddress?: Maybe<Scalars['String']>;
};

/** Base category */
export type Category = {
  __typename?: 'Category';
  /** Alternates */
  alternates?: Maybe<Array<Maybe<Language>>>;
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** Category translates. */
  categoryTranslates?: Maybe<Array<Maybe<CategoryTranslate>>>;
  /** Created at. */
  createdAt: Scalars['DateTime'];
  /** Category has short URL (without /category prefix) */
  hasShortUrl: Scalars['Boolean'];
  /** Category id. */
  id: Scalars['ID'];
  posts?: Maybe<PaginatedPosts>;
  /** Category slug. */
  slug: Scalars['String'];
  /** Updated at. */
  updatedAt: Scalars['DateTime'];
};


/** Base category */
export type CategoryPostsArgs = {
  hideFromMainPage?: InputMaybe<Scalars['Boolean']>;
  length?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Scalars['String']>;
};

/** Base category translate */
export type CategoryTranslate = {
  __typename?: 'CategoryTranslate';
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** Created at. */
  createdAt: Scalars['DateTime'];
  /** Category description. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Category keywords. */
  keywords?: Maybe<Scalars['String']>;
  /** Category description. */
  metaDescription?: Maybe<Scalars['String']>;
  /** Category title. */
  metaTitle?: Maybe<Scalars['String']>;
  /** Category title. */
  title: Scalars['String'];
  /** Updated at. */
  updatedAt: Scalars['DateTime'];
};

export type City = {
  __typename?: 'City';
  /** The unique identifier for the city. */
  id: Scalars['ID'];
  /** The title of the city. */
  title: Scalars['String'];
};

/** Base coin */
export type Coin = {
  __typename?: 'Coin';
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** Global decimals */
  decimals?: Maybe<Array<Maybe<Decimals>>>;
  /** Decimals for desktop version */
  decimalsHeaderDesktop?: Maybe<Array<Maybe<Decimals>>>;
  /** Decimals for mobile version */
  decimalsHeaderMobile?: Maybe<Array<Maybe<Decimals>>>;
  /** Get Graphs for coin */
  graphs?: Maybe<Array<Maybe<Graph>>>;
  /** Coin guide */
  guideSlug: Scalars['String'];
  /** Coin id. */
  id: Scalars['ID'];
  /** Coin label */
  label?: Maybe<Scalars['String']>;
  /** Coin logo */
  logo?: Maybe<Scalars['String']>;
  /** Coin logo in PNG format */
  logoPng?: Maybe<Scalars['String']>;
  /** Coin logo in PNG format for dark mode */
  logoPngDark?: Maybe<Scalars['String']>;
  /** Coin name. */
  name: Scalars['String'];
  /** Coin priority */
  priority: Scalars['Int'];
  /** Get rates for coin */
  rates?: Maybe<Array<Maybe<CoinRate>>>;
  /** Coin slug. */
  slug: Scalars['String'];
  tag?: Maybe<Tag>;
  /** Show coin in desktop header */
  tickersDesktop: Scalars['Boolean'];
  /** Show coin in desktop header */
  tickersMobile: Scalars['Boolean'];
};


/** Base coin */
export type CoinGraphsArgs = {
  fiatCurrencies?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  widgetType?: InputMaybe<Scalars['String']>;
};


/** Base coin */
export type CoinRatesArgs = {
  fiatCurrencies?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** Coin rate */
export type CoinRate = {
  __typename?: 'CoinRate';
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** Market cap */
  cap: Scalars['Float'];
  /** 24h change */
  change24h: Scalars['Float'];
  /** Day change */
  day: Scalars['Float'];
  /** Emitted value */
  emitted: Scalars['Float'];
  /** Rate fiat currency code. */
  fiatCurrencyCode: Scalars['String'];
  /** High price */
  high: Scalars['Float'];
  /** Low price */
  low: Scalars['Float'];
  /** Monthly change */
  month: Scalars['Float'];
  /** Open price */
  open: Scalars['Float'];
  /** Current rate price */
  price: Scalars['Float'];
  /** Trading volume */
  volume: Scalars['Float'];
  /** Trading volume in fiat currency */
  volumeCurrency: Scalars['Float'];
  /** Weekly change */
  week?: Maybe<Scalars['Float']>;
};

export type Country = {
  __typename?: 'Country';
  /** The third-letter country code (e.g. CAN). */
  code: Scalars['String'];
  /** The two-letter country code (e.g., PT, BR, US). */
  code2: Scalars['String'];
  /** The title of the country. */
  title: Scalars['String'];
};

/** Base coin */
export type Currency = {
  __typename?: 'Currency';
  /** Currency slug. */
  name: Scalars['String'];
  /** Currency sign. */
  sign: Scalars['String'];
};

export type Decimals = {
  __typename?: 'Decimals';
  currency: Scalars['String'];
  value: Scalars['Int'];
};

export type Event = {
  __typename?: 'Event';
  /** The list of categories associated with the event. */
  categories: Array<EventCategory>;
  /** The City object representing the city where the event takes place. */
  city?: Maybe<City>;
  /** The Country object representing the country where the event takes place. */
  country?: Maybe<Country>;
  /** The description of the event. */
  description?: Maybe<Scalars['String']>;
  /** The end date of the event. */
  endDate: Scalars['DateTime'];
  /** The unique identifier for the event. */
  id: Scalars['ID'];
  /** The URL of the event image. */
  imageUrl: Scalars['String'];
  /** Optional promotional code for the event. */
  promocode?: Maybe<Scalars['String']>;
  /** The start date of the event. */
  startDate: Scalars['DateTime'];
  /** The title of the event. */
  title: Scalars['String'];
  /** The URL of the event. */
  website?: Maybe<Scalars['String']>;
};

export type EventCategory = {
  __typename?: 'EventCategory';
  /** The description of the event category. */
  description?: Maybe<Scalars['String']>;
  /** The unique identifier for the event category. */
  id: Scalars['ID'];
  /** The slug of category */
  slug: Scalars['String'];
  /** The title of the event category. */
  title: Scalars['String'];
};

/** Glossary entity */
export type GlossaryItem = {
  __typename?: 'GlossaryItem';
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** The unique ID of the guide. */
  id: Scalars['ID'];
  link: Scalars['String'];
  title: Scalars['String'];
};

/** Base Coin Graph */
export type Graph = {
  __typename?: 'Graph';
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** Graph fiat currency code. */
  fiatCurrencyCode: Scalars['String'];
  /** Graph svg image */
  graph: Scalars['String'];
  /** Graph type, must be: `main` or `widget` */
  graphType: Scalars['String'];
  /** Graph id. */
  id: Scalars['ID'];
};

/** Guide entity */
export type Guide = {
  __typename?: 'Guide';
  alternates?: Maybe<Array<Maybe<Language>>>;
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  coverImg: Scalars['String'];
  coverImgCaption: Scalars['String'];
  createdAt?: Maybe<Scalars['DateTime']>;
  /** The unique ID of the guide. */
  id: Scalars['ID'];
  slug: Scalars['String'];
  socialImg: Scalars['String'];
  socialImgCaption: Scalars['String'];
  translate?: Maybe<GuideTranslate>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

/** Guide category entity */
export type GuideCategory = {
  __typename?: 'GuideCategory';
  alternates?: Maybe<Array<Maybe<Language>>>;
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description: Scalars['String'];
  /** Guides loader */
  guides?: Maybe<Array<Maybe<Guide>>>;
  /** Guides count on GuideCategory */
  guidesCount: Scalars['Int'];
  /** The unique ID of the guide category. */
  id: Scalars['ID'];
  slug: Scalars['String'];
  translate?: Maybe<GuideCategoryTranslate>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type GuideCategoryOrGuide = Guide | GuideCategory;

/** Guide category translate entity */
export type GuideCategoryTranslate = {
  __typename?: 'GuideCategoryTranslate';
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  description: Scalars['String'];
  /** The unique ID of the guide category translate. */
  id: Scalars['ID'];
  title: Scalars['String'];
  updatedAt?: Maybe<Scalars['DateTime']>;
};

/** Guide translate entity */
export type GuideTranslate = {
  __typename?: 'GuideTranslate';
  about: Scalars['String'];
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  fullText: Scalars['String'];
  /** The unique ID of the guide translate. */
  id: Scalars['ID'];
  published: Scalars['Boolean'];
  /** Published time */
  publishedAt?: Maybe<Scalars['DateTime']>;
  seoDescription: Scalars['String'];
  seoKeywords: Scalars['String'];
  seoTitle: Scalars['String'];
  title: Scalars['String'];
};

/** Base author */
export type IcoEvent = {
  __typename?: 'IcoEvent';
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** End time. */
  endDate?: Maybe<Scalars['DateTime']>;
  /** IcoEvent details. */
  icoEventDetails?: Maybe<Array<Maybe<IcoEventDetail>>>;
  /** IcoEvent socials. */
  icoEventSocials?: Maybe<IcoEventSocial>;
  /** IcoEvent teams. */
  icoEventTeams?: Maybe<Array<Maybe<IcoEventTeam>>>;
  /** IcoEvent translates. */
  icoEventTranslates?: Maybe<Array<Maybe<IcoEventTranslate>>>;
  /** Ico id. */
  id: Scalars['ID'];
  /** Ico img. */
  img: Scalars['String'];
  /** Slug. */
  slug: Scalars['String'];
  /** Start date. */
  startDate?: Maybe<Scalars['DateTime']>;
  /** Video url. */
  video: Scalars['String'];
};

/** Base detail */
export type IcoEventDetail = {
  __typename?: 'IcoEventDetail';
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** IcoEvent translates. */
  icoEventDetailTranslates?: Maybe<Array<Maybe<IcoEventDetailTranslate>>>;
  id: Scalars['ID'];
};

export type IcoEventDetailTranslate = {
  __typename?: 'IcoEventDetailTranslate';
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** Detail description. */
  description: Scalars['String'];
  id: Scalars['ID'];
  /** Detail title. */
  title: Scalars['String'];
};

/** Base social */
export type IcoEventSocial = {
  __typename?: 'IcoEventSocial';
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** IcoEvent translates. */
  icoEventSocialTranslates?: Maybe<Array<Maybe<IcoEventSocialTranslate>>>;
  id: Scalars['ID'];
};

export type IcoEventSocialTranslate = {
  __typename?: 'IcoEventSocialTranslate';
  /** Social link */
  bitcointalk: Scalars['String'];
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** Social link */
  facebook: Scalars['String'];
  /** Social link */
  flickr: Scalars['String'];
  /** Social link */
  github: Scalars['String'];
  /** Social link */
  google: Scalars['String'];
  id: Scalars['ID'];
  /** Social link */
  instagram: Scalars['String'];
  /** Social link */
  linkedin: Scalars['String'];
  /** Social link */
  livejournal: Scalars['String'];
  /** Social link */
  medium: Scalars['String'];
  /** Social link */
  reddit: Scalars['String'];
  /** Social link */
  slackin: Scalars['String'];
  /** Social link */
  soundcloud: Scalars['String'];
  /** Social link */
  telegram: Scalars['String'];
  /** Social link */
  twitter: Scalars['String'];
  /** Social link */
  vkontakte: Scalars['String'];
  /** Social link */
  whatsapp: Scalars['String'];
};

/** Base detail */
export type IcoEventTeam = {
  __typename?: 'IcoEventTeam';
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** IcoEvent socials. */
  icoEventSocialTranslates?: Maybe<IcoEventSocial>;
  /** IcoEvent translates. */
  icoEventTeamTranslates?: Maybe<Array<Maybe<IcoEventTeamTranslate>>>;
  id: Scalars['ID'];
  /** Team image. */
  img: Scalars['String'];
};

export type IcoEventTeamTranslate = {
  __typename?: 'IcoEventTeamTranslate';
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** Team description. */
  description: Scalars['String'];
  id: Scalars['ID'];
  /** Team link. */
  link: Scalars['String'];
  /** Team profession. */
  profession: Scalars['String'];
  /** Team title. */
  title: Scalars['String'];
};

export type IcoEventTranslate = {
  __typename?: 'IcoEventTranslate';
  /** Anounce. */
  anounce: Scalars['String'];
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** Description. */
  description: Scalars['String'];
  id: Scalars['ID'];
  /** Event title. */
  title: Scalars['String'];
  /** Website. */
  website: Scalars['String'];
  /** Whitepaper. */
  whitepaper: Scalars['String'];
};

/** Base language */
export type Language = {
  __typename?: 'Language';
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** Language code */
  code: Scalars['String'];
  /** Date format */
  dateFormat: Scalars['String'];
  /** Language domain */
  domain?: Maybe<Scalars['String']>;
  /** Ga code */
  gaCode: Scalars['String'];
  /** Hide language from menu */
  hidden: Scalars['Boolean'];
  /** The unique ID of the language. */
  id: Scalars['ID'];
  /** Locale of language */
  locale?: Maybe<Scalars['String']>;
  /** Robots.txt file */
  robots: Scalars['String'];
  /** Short name of language */
  short: Scalars['String'];
  /** Date format */
  subscribes?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Region timezone */
  timezone: Scalars['String'];
  /** Language title */
  title: Scalars['String'];
};

export type LocalPosts = {
  __typename?: 'LocalPosts';
  alternates?: Maybe<Array<Maybe<Language>>>;
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** Meta Description */
  description?: Maybe<Scalars['String']>;
  /** Meta Keywords */
  keywords?: Maybe<Scalars['String']>;
  posts?: Maybe<PaginatedPosts>;
  /** The unique SHORT of the language. */
  short: Scalars['String'];
  /** Meta Title */
  title?: Maybe<Scalars['String']>;
};


export type LocalPostsPostsArgs = {
  length?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Scalars['String']>;
};

/** Base placement */
export type Locale = {
  __typename?: 'Locale';
  /** All guide categories */
  allGuideCategories: Array<GuideCategory>;
  author?: Maybe<Author>;
  /** Authors */
  authors?: Maybe<Array<Maybe<Author>>>;
  banners?: Maybe<Array<Maybe<Banner>>>;
  /** Filters events by cityId, countryId, pick events afterDate, or having a non-empty promocode. */
  calendarEvents: PaginatedEvents;
  /** Events with toggled flag Featured or Pinned. */
  carouselEvents: Array<Event>;
  /** Get carousel posts list */
  carouselPosts?: Maybe<Array<Maybe<Post>>>;
  category?: Maybe<Category>;
  coin?: Maybe<Coin>;
  coins?: Maybe<Array<Maybe<Coin>>>;
  currency?: Maybe<Currency>;
  /** Get editors choice posts list */
  editorsPosts?: Maybe<Array<Maybe<Post>>>;
  /** List of categories where future events are available */
  eventCategories: Array<EventCategory>;
  /** List of cities where future events are available. */
  eventCities: Array<City>;
  /** List of countries where future events are available. */
  eventCountries: Array<Country>;
  /** List of months as DateTimes when future events are available. */
  eventMonths: Array<Scalars['DateTime']>;
  glossary?: Maybe<Array<Maybe<GlossaryItem>>>;
  guide?: Maybe<Guide>;
  guideCategory?: Maybe<GuideCategory>;
  guideCategoryOrGuide?: Maybe<GuideCategoryOrGuide>;
  /** All guides with offset */
  guides: PaginatedGuides;
  /** Get hot posts list */
  hotPosts?: Maybe<Array<Maybe<Post>>>;
  icoEvent?: Maybe<IcoEvent>;
  icoEventsOngoing?: Maybe<PaginatedIcoEvents>;
  icoEventsPast?: Maybe<PaginatedIcoEvents>;
  icoEventsUpcoming?: Maybe<PaginatedIcoEvents>;
  language?: Maybe<Language>;
  languages?: Maybe<Array<Maybe<Language>>>;
  latestAuthors?: Maybe<PaginatedAuthors>;
  latestTags?: Maybe<PaginatedTags>;
  /** Authors language_id */
  localAuthors?: Maybe<Array<Maybe<Author>>>;
  /** Local News */
  localPosts?: Maybe<LocalPosts>;
  /** Team all by lang */
  localTeam?: Maybe<Array<Maybe<Team>>>;
  menu?: Maybe<Array<Maybe<Menu>>>;
  podcast?: Maybe<Podcast>;
  /** Get all dashboard podcasts */
  podcasts?: Maybe<Array<Maybe<Podcast>>>;
  post?: Maybe<Post>;
  posts?: Maybe<PaginatedPosts>;
  /** Search for posts */
  postsSearch?: Maybe<PaginatedPosts>;
  qrCode?: Maybe<QrCode>;
  /** Post related */
  relatedPosts?: Maybe<Array<Maybe<Post>>>;
  seoMeta?: Maybe<SeoMeta>;
  settings?: Maybe<Array<Maybe<Setting>>>;
  socialLinks?: Maybe<SocialLinks>;
  /** Dashboard static page as-is without any transformations */
  staticPage?: Maybe<StaticPage>;
  tag?: Maybe<Tag>;
  /** Team all - en only */
  team?: Maybe<Array<Maybe<Team>>>;
  tickerMeta?: Maybe<TickerMeta>;
  topPeople?: Maybe<Array<Maybe<TopPeople>>>;
  topPeopleItem?: Maybe<TopPeople>;
  translates?: Maybe<Array<Maybe<Translate>>>;
  universalBlocks?: Maybe<Array<Maybe<UniversalBlock>>>;
};


/** Base placement */
export type LocaleAuthorArgs = {
  slug: Scalars['String'];
};


/** Base placement */
export type LocaleBannersArgs = {
  countryIso?: InputMaybe<Scalars['String']>;
  places: Array<InputMaybe<Scalars['String']>>;
  type?: InputMaybe<Scalars['String']>;
};


/** Base placement */
export type LocaleCalendarEventsArgs = {
  categorySlug?: InputMaybe<Scalars['String']>;
  cityId?: InputMaybe<Scalars['ID']>;
  countryCode?: InputMaybe<Scalars['String']>;
  length?: InputMaybe<Scalars['Int']>;
  monthDate?: InputMaybe<Scalars['DateTime']>;
  offset?: InputMaybe<Scalars['Int']>;
  onlyWithPromocode?: InputMaybe<Scalars['Boolean']>;
};


/** Base placement */
export type LocaleCategoryArgs = {
  slug: Scalars['String'];
};


/** Base placement */
export type LocaleCoinArgs = {
  slug: Scalars['String'];
};


/** Base placement */
export type LocaleCurrencyArgs = {
  name: Scalars['String'];
};


/** Base placement */
export type LocaleGuideArgs = {
  id?: InputMaybe<Scalars['ID']>;
  slug?: InputMaybe<Scalars['String']>;
};


/** Base placement */
export type LocaleGuideCategoryArgs = {
  id?: InputMaybe<Scalars['ID']>;
  slug?: InputMaybe<Scalars['String']>;
};


/** Base placement */
export type LocaleGuideCategoryOrGuideArgs = {
  slug: Scalars['String'];
};


/** Base placement */
export type LocaleGuidesArgs = {
  guideCategorySlug?: InputMaybe<Scalars['String']>;
  length?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
  sorting?: InputMaybe<SortEnum>;
};


/** Base placement */
export type LocaleHotPostsArgs = {
  promo?: InputMaybe<Scalars['Boolean']>;
};


/** Base placement */
export type LocaleIcoEventArgs = {
  slug: Scalars['String'];
};


/** Base placement */
export type LocaleIcoEventsOngoingArgs = {
  length?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
};


/** Base placement */
export type LocaleIcoEventsPastArgs = {
  length?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
};


/** Base placement */
export type LocaleIcoEventsUpcomingArgs = {
  length?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
};


/** Base placement */
export type LocaleLatestAuthorsArgs = {
  length?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
};


/** Base placement */
export type LocaleLatestTagsArgs = {
  length?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
};


/** Base placement */
export type LocaleMenuArgs = {
  menuType?: Scalars['String'];
};


/** Base placement */
export type LocalePodcastArgs = {
  slug?: InputMaybe<Scalars['String']>;
};


/** Base placement */
export type LocalePostArgs = {
  id?: InputMaybe<Scalars['ID']>;
  slug?: InputMaybe<Scalars['String']>;
};


/** Base placement */
export type LocalePostsArgs = {
  beforePostId?: InputMaybe<Scalars['ID']>;
  categorySlug?: InputMaybe<Scalars['String']>;
  length?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Scalars['String']>;
  place?: InputMaybe<Scalars['String']>;
  promo?: InputMaybe<Scalars['Boolean']>;
};


/** Base placement */
export type LocalePostsSearchArgs = {
  length?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
};


/** Base placement */
export type LocaleQrCodeArgs = {
  url: Scalars['String'];
};


/** Base placement */
export type LocaleRelatedPostsArgs = {
  excludeIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  length?: InputMaybe<Scalars['Int']>;
  postId: Scalars['ID'];
};


/** Base placement */
export type LocaleSeoMetaArgs = {
  url: Scalars['String'];
};


/** Base placement */
export type LocaleSettingsArgs = {
  slugs: Array<InputMaybe<Scalars['String']>>;
};


/** Base placement */
export type LocaleStaticPageArgs = {
  slug: Scalars['String'];
};


/** Base placement */
export type LocaleTagArgs = {
  slug: Scalars['String'];
};


/** Base placement */
export type LocaleTopPeopleArgs = {
  year: Scalars['Int'];
};


/** Base placement */
export type LocaleTopPeopleItemArgs = {
  slug: Scalars['String'];
  year: Scalars['Int'];
};


/** Base placement */
export type LocaleTranslatesArgs = {
  slugs: Array<InputMaybe<Scalars['String']>>;
};


/** Base placement */
export type LocaleUniversalBlocksArgs = {
  type?: InputMaybe<Scalars['String']>;
};

/** Base menu */
export type Menu = {
  __typename?: 'Menu';
  /** Alt translates */
  altTranslates?: Maybe<Array<Maybe<Translate>>>;
  /** Badge title */
  badgeType?: Maybe<Scalars['Int']>;
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** The unique ID of the menu. */
  id: Scalars['ID'];
  /** Open new window? Or no */
  inNewTab: Scalars['Boolean'];
  /** Parent menu id */
  parentId?: Maybe<Scalars['ID']>;
  /** Menu position depth */
  position: Scalars['Int'];
  /** Rel for menu display */
  rel?: Maybe<Scalars['String']>;
  /** Root type */
  rootType?: Maybe<Scalars['Int']>;
  /** Title translates */
  titleTranslates: Array<Maybe<Translate>>;
  /** Url */
  url: Scalars['String'];
};

export type PaginatedAuthors = {
  __typename?: 'PaginatedAuthors';
  /** Latest authors */
  data?: Maybe<Array<Maybe<Author>>>;
  /** Max page */
  pages?: Maybe<Scalars['Int']>;
};

export type PaginatedEvents = {
  __typename?: 'PaginatedEvents';
  data: Array<Event>;
  /** Has more events */
  hasMore: Scalars['Boolean'];
};

export type PaginatedGuides = {
  __typename?: 'PaginatedGuides';
  /** All guides with offset */
  data: Array<Guide>;
  /** Guides count */
  guidesCount: Scalars['Int'];
  /** Has more posts */
  hasMoreGuides: Scalars['Boolean'];
};

export type PaginatedIcoEvents = {
  __typename?: 'PaginatedIcoEvents';
  /** Latest ico */
  data?: Maybe<Array<Maybe<IcoEvent>>>;
  /** Max page */
  pages?: Maybe<Scalars['Int']>;
};

export type PaginatedPosts = {
  __typename?: 'PaginatedPosts';
  /** Latest posts */
  data?: Maybe<Array<Maybe<Post>>>;
  /** Has more posts */
  hasMorePosts: Scalars['Boolean'];
  /**
   * Max posts
   * @deprecated Will be replaced by hasMorePosts
   */
  postsCount?: Maybe<Scalars['Int']>;
};

export type PaginatedTags = {
  __typename?: 'PaginatedTags';
  /** Latest tags */
  data?: Maybe<Array<Maybe<Tag>>>;
  /** Max page */
  pages?: Maybe<Scalars['Int']>;
};

/** Dashboard podcast */
export type Podcast = {
  __typename?: 'Podcast';
  /** Platform link */
  amazonMusic?: Maybe<Scalars['String']>;
  /** Platform link */
  apple?: Maybe<Scalars['String']>;
  /** Platform link */
  audible?: Maybe<Scalars['String']>;
  /** Podcast authors with podcaster bio */
  authorsWithDesc?: Maybe<Array<Maybe<PodcastAuthorDesc>>>;
  /** Podcast audio files and player relation */
  buzzsproutPodcast?: Maybe<BuzzsproutPodcast>;
  /** Platform link */
  castbox?: Maybe<Scalars['String']>;
  /** Platform link */
  castro?: Maybe<Scalars['String']>;
  /** Platform link */
  deezer?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  /** Small text disclaimer at the bottom of page */
  disclaimerPrefix?: Maybe<Scalars['String']>;
  /** Platform link */
  goodpods?: Maybe<Scalars['String']>;
  /** Platform link */
  google?: Maybe<Scalars['String']>;
  /** The unique ID of the podcast. */
  id?: Maybe<Scalars['ID']>;
  /** Platform link */
  iheartradio?: Maybe<Scalars['String']>;
  /** Platform link */
  listenNotes?: Maybe<Scalars['String']>;
  /** Platform link */
  overcast?: Maybe<Scalars['String']>;
  /** Platform link */
  playerfm?: Maybe<Scalars['String']>;
  /** Platform link */
  pocketCasts?: Maybe<Scalars['String']>;
  /** Platform link */
  podcastAddict?: Maybe<Scalars['String']>;
  /** Platform link */
  podcastIndex?: Maybe<Scalars['String']>;
  /** Platform link */
  podchaser?: Maybe<Scalars['String']>;
  /** Platform link */
  podfriend?: Maybe<Scalars['String']>;
  /** website url part */
  slug?: Maybe<Scalars['String']>;
  /** Platform link */
  spotify?: Maybe<Scalars['String']>;
  /** Podcast post tag */
  tag?: Maybe<Tag>;
  /** Name of concrete podcast */
  title?: Maybe<Scalars['String']>;
  /** Platform link */
  tunein?: Maybe<Scalars['String']>;
};

/** Dashboard podcast author custom bio */
export type PodcastAuthorDesc = {
  __typename?: 'PodcastAuthorDesc';
  /** Author info */
  author?: Maybe<Author>;
  /** Podcasters bio */
  description?: Maybe<Scalars['String']>;
  /** The unique ID of the podcast. */
  id?: Maybe<Scalars['ID']>;
  /** Buzzsprout podcast */
  podcast?: Maybe<Podcast>;
};

/** Base post */
export type Post = {
  __typename?: 'Post';
  alternates?: Maybe<Array<Maybe<Language>>>;
  /** Author info */
  author?: Maybe<Author>;
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** Category info */
  category?: Maybe<Category>;
  /** Delete time */
  deletedAt?: Maybe<Scalars['DateTime']>;
  /** The unique ID of the post. */
  id: Scalars['ID'];
  /** Pixel Url */
  pixelUrl: Scalars['String'];
  /** Badge info */
  postBadge?: Maybe<PostBadge>;
  /** Post more options */
  postOptions?: Maybe<PostOptions>;
  /** Post translate */
  postTranslate?: Maybe<PostTranslate>;
  /** Post related */
  relatedPosts?: Maybe<Array<Maybe<Post>>>;
  showShares: Scalars['Boolean'];
  showStats: Scalars['Boolean'];
  /** Slug */
  slug: Scalars['String'];
  /** Tags */
  tags?: Maybe<Array<Maybe<Tag>>>;
  /** Post more topics */
  topics?: Maybe<Array<Maybe<Topic>>>;
  /** Relative url */
  url: Scalars['String'];
  /** Views */
  views?: Maybe<Scalars['Int']>;
};


/** Base post */
export type PostRelatedPostsArgs = {
  excludeIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  length?: InputMaybe<Scalars['Int']>;
};

/** Base post badge */
export type PostBadge = {
  __typename?: 'PostBadge';
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** PostBadge id. */
  id: Scalars['ID'];
  /** PostBadge label. */
  label: Scalars['String'];
  /** Category translates. */
  postBadgeTranslates?: Maybe<Array<Maybe<PostBadgeTranslate>>>;
};

/** Base post badge */
export type PostBadgeTranslate = {
  __typename?: 'PostBadgeTranslate';
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** PostBadgeTranslate title. */
  title: Scalars['String'];
};

/** Post options */
export type PostOptions = {
  __typename?: 'PostOptions';
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** Hide disclaimer from post page */
  hideDisclaimer: Scalars['Boolean'];
  /** The unique ID of the post. */
  id: Scalars['ID'];
  /** Promo post */
  isPromo: Scalars['Boolean'];
};

/** Base post */
export type PostTranslate = {
  __typename?: 'PostTranslate';
  /** Post audio */
  audio?: Maybe<Scalars['String']>;
  /** Author info */
  author?: Maybe<Author>;
  /** Post avatar */
  avatar?: Maybe<Scalars['String']>;
  /** Post Body */
  bodyText?: Maybe<Scalars['String']>;
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** Description */
  description?: Maybe<Scalars['String']>;
  /** Priority for editors choice */
  editorsPriority?: Maybe<Scalars['Int']>;
  /** Lead text */
  facebookLeadText?: Maybe<Scalars['String']>;
  /** Facebook Shares */
  facebookShares: Scalars['Int'];
  id: Scalars['ID'];
  /** Lead text */
  leadText?: Maybe<Scalars['String']>;
  /** Linkedin Shares (deprecated, to be removed in future) */
  linkedinShares: Scalars['Int'];
  /** Meta noindex */
  noIndex: Scalars['Boolean'];
  /** Published time */
  published: Scalars['DateTime'];
  /** Published time human-format */
  publishedHumanFormat?: Maybe<Scalars['String']>;
  /** Reddit Shares */
  redditShares: Scalars['Int'];
  /** Other shares */
  shares: Scalars['Int'];
  /** Social Description */
  socialDescription?: Maybe<Scalars['String']>;
  /** Title */
  title: Scalars['String'];
  /** Total Shares */
  totalShares: Scalars['Int'];
  /** Lead text */
  twitterLeadText?: Maybe<Scalars['String']>;
  /** Twitter Shares */
  twitterShares: Scalars['Int'];
  /** Post youtube */
  youtube?: Maybe<Scalars['String']>;
};

/** QR code */
export type QrCode = {
  __typename?: 'QrCode';
  /** Base64 QR code image */
  image?: Maybe<Scalars['String']>;
};

/** Base placement */
export type Query = {
  __typename?: 'Query';
  locale?: Maybe<Locale>;
};


/** Base placement */
export type QueryLocaleArgs = {
  short?: InputMaybe<Scalars['String']>;
};

/** Base seo meta data */
export type SeoMeta = {
  __typename?: 'SeoMeta';
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** The unique ID of the seo meta. */
  id: Scalars['ID'];
  /** Title */
  seoMetaDescription?: Maybe<Scalars['String']>;
  /** Title */
  seoMetaKeywords?: Maybe<Scalars['String']>;
  /** Title */
  seoMetaTitle?: Maybe<Scalars['String']>;
  /** Url */
  seoMetaUrl?: Maybe<Scalars['String']>;
};

/** Base setting */
export type Setting = {
  __typename?: 'Setting';
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** The unique ID of the Settings. */
  id: Scalars['ID'];
  /** Setting key. */
  key?: Maybe<Scalars['String']>;
  /** Setting value */
  value?: Maybe<Scalars['String']>;
};

/** Base social links */
export type SocialLinks = {
  __typename?: 'SocialLinks';
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  facebookUrl: Scalars['String'];
  googlePlusUrl: Scalars['String'];
  /** The unique ID of the language. */
  id: Scalars['ID'];
  linkedinUrl: Scalars['String'];
  telegramAccount: Scalars['String'];
  telegramUrl: Scalars['String'];
  twitterAccount: Scalars['String'];
  twitterUrl: Scalars['String'];
  youtubeUrl: Scalars['String'];
};

/** Simple sorting enum */
export const enum SortEnum {
  /** Sorts from old to new */
  Asc = 'asc',
  /** Sorts from new to old */
  Desc = 'desc'
};

/** Static page */
export type StaticPage = {
  __typename?: 'StaticPage';
  about?: Maybe<Scalars['String']>;
  /** HTML content of the page */
  content: Scalars['String'];
  coverImg?: Maybe<Scalars['String']>;
  coverImgCaption?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  seoDescription?: Maybe<Scalars['String']>;
  seoKeywords?: Maybe<Scalars['String']>;
  seoTitle?: Maybe<Scalars['String']>;
  socialImg?: Maybe<Scalars['String']>;
  socialImgCaption?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  type?: Maybe<Scalars['Int']>;
  updatedAt: Scalars['DateTime'];
};

/** Base tag */
export type Tag = {
  __typename?: 'Tag';
  /** Alternates */
  alternates?: Maybe<Array<Maybe<Language>>>;
  /** Tag avatar. */
  avatar?: Maybe<Scalars['String']>;
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** Coin related to tag. */
  coin?: Maybe<Coin>;
  /** Created at. */
  createdAt: Scalars['DateTime'];
  /** Tag id. */
  id: Scalars['ID'];
  posts?: Maybe<PaginatedPosts>;
  /** Tag redirect relative url. */
  redirectRelativeUrl?: Maybe<Scalars['String']>;
  /** Tag slug. */
  slug?: Maybe<Scalars['String']>;
  /** Tag translations array */
  tagTranslates?: Maybe<Array<Maybe<TagTranslate>>>;
  /** Updated at. */
  updatedAt: Scalars['DateTime'];
};


/** Base tag */
export type TagPostsArgs = {
  length?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Scalars['String']>;
};

/** Base tag translate */
export type TagTranslate = {
  __typename?: 'TagTranslate';
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** Created at. */
  createdAt: Scalars['DateTime'];
  /** Tag description. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Tag keywords. */
  keywords?: Maybe<Scalars['String']>;
  /** Tag description. */
  metaDescription?: Maybe<Scalars['String']>;
  /** Tag title. */
  metaTitle?: Maybe<Scalars['String']>;
  /** Tag title. */
  pageTitle?: Maybe<Scalars['String']>;
  /** Tag title. */
  title: Scalars['String'];
  /** Updated at. */
  updatedAt: Scalars['DateTime'];
};

/** Team member data */
export type Team = {
  __typename?: 'Team';
  /** Created at. */
  createdAt: Scalars['DateTime'];
  /** User info */
  description: Scalars['String'];
  /** email */
  email: Scalars['String'];
  /** Facebook acc */
  facebook: Scalars['String'];
  /** Gender enum */
  gender: Scalars['String'];
  /** Google acc */
  google_plus: Scalars['String'];
  /** Tag id. */
  id: Scalars['ID'];
  /** Role */
  job_title: Scalars['String'];
  /** Linked in acc */
  linkedin: Scalars['String'];
  /** Operator */
  operator_id: Scalars['ID'];
  /** User photo */
  photo: Scalars['String'];
  /** Position number */
  position_num: Scalars['Int'];
  /** Show in authors block */
  showInAuthorsPosition?: Maybe<Scalars['Boolean']>;
  /** Skype acc */
  skype?: Maybe<Scalars['String']>;
  /** Username */
  title: Scalars['String'];
  /** Twitter acc */
  twitter: Scalars['String'];
  /** Updated at. */
  updatedAt: Scalars['DateTime'];
  /** url */
  url: Scalars['String'];
};

/** Base coin */
export type TickerMeta = {
  __typename?: 'TickerMeta';
  allowedMarkets: Array<Maybe<Scalars['String']>>;
  coinSymbols: Array<Maybe<Coin>>;
  currencySymbols: Array<Maybe<Currency>>;
  defaultCurrency: Scalars['String'];
};

/** Top people entity */
export type TopPeople = {
  __typename?: 'TopPeople';
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Slug */
  slug?: Maybe<Scalars['String']>;
  /** Sort order */
  sortOrder?: Maybe<Scalars['Int']>;
  translate?: Maybe<TopPeopleTranslate>;
  /** Year */
  year: Scalars['Int'];
};

/** Top people translate entity */
export type TopPeopleTranslate = {
  __typename?: 'TopPeopleTranslate';
  active: Scalars['Boolean'];
  almaMater?: Maybe<Scalars['String']>;
  article1?: Maybe<Post>;
  article1_id?: Maybe<Scalars['ID']>;
  article2?: Maybe<Post>;
  article2_id?: Maybe<Scalars['ID']>;
  article3?: Maybe<Post>;
  article3_id?: Maybe<Scalars['ID']>;
  background?: Maybe<Scalars['String']>;
  birthDate?: Maybe<Scalars['DateTime']>;
  born?: Maybe<Scalars['String']>;
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  disclaimer?: Maybe<Scalars['String']>;
  facebookUrl?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  image?: Maybe<Scalars['String']>;
  imageShare?: Maybe<Scalars['String']>;
  known?: Maybe<Scalars['String']>;
  linkedinUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  newsTag?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['String']>;
  quoteLink?: Maybe<Scalars['String']>;
  quoteLinkWord?: Maybe<Scalars['String']>;
  quoteSource?: Maybe<Scalars['String']>;
  quoteText?: Maybe<Scalars['String']>;
  residence?: Maybe<Scalars['String']>;
  speciality?: Maybe<Scalars['String']>;
  twitterUrl?: Maybe<Scalars['String']>;
  /** Votes counter */
  votes?: Maybe<Scalars['Int']>;
  webPageUrl?: Maybe<Scalars['String']>;
};

/** Base post topic */
export type Topic = {
  __typename?: 'Topic';
  /** topic Post */
  post: Post;
  /** topic priority */
  priority: Scalars['Int'];
  /** Selection topic */
  selection: Scalars['Boolean'];
};

/** Base translate */
export type Translate = {
  __typename?: 'Translate';
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** Translate id. */
  id?: Maybe<Scalars['ID']>;
  /** Translate key. */
  key?: Maybe<Scalars['String']>;
  /** Translate value */
  value?: Maybe<Scalars['String']>;
};

/** Base universal block */
export type UniversalBlock = {
  __typename?: 'UniversalBlock';
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** Universal block id. */
  id: Scalars['ID'];
  /** Universal block order type (may be published, popular). */
  orderType?: Maybe<Scalars['String']>;
  posts?: Maybe<PaginatedPosts>;
  /** Universal block posts limit. */
  postsLimit: Scalars['Int'];
  /** Universal block type (may be nrm_uni_block, top_uni_block). */
  type?: Maybe<Scalars['String']>;
  /** Universal block translations array */
  universalBlockTranslates?: Maybe<Array<Maybe<UniversalBlockTranslate>>>;
};

/** Base universal block */
export type UniversalBlockTranslate = {
  __typename?: 'UniversalBlockTranslate';
  /** Unique Object cache key by locale. */
  cacheKey?: Maybe<Scalars['String']>;
  /** Universal block id. */
  id: Scalars['ID'];
  /** Universal block title. */
  title: Scalars['String'];
};

export type AuthorFragmentFragment = { __typename?: 'Author', id: string, avatar?: string | null, twitter?: string | null, linkedin?: string | null, email?: string | null, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', showInAuthors?: boolean | null, name: string } | null> | null };

export type EventCategoryFragmentFragment = { __typename?: 'EventCategory', id: string, title: string, slug: string, description?: string | null };

export type EventFragmentFragment = { __typename?: 'Event', id: string, imageUrl: string, title: string, description?: string | null, promocode?: string | null, startDate: any, endDate: any, website?: string | null, city?: { __typename?: 'City', id: string, title: string } | null, country?: { __typename?: 'Country', code: string, title: string, code2: string } | null, categories: Array<{ __typename?: 'EventCategory', id: string, title: string, slug: string, description?: string | null }> };

export type BuzzsproutPodcastFieldsFragment = { __typename?: 'BuzzsproutPodcast', id?: string | null, title?: string | null, artworkUrl?: string | null, backgroundUrl?: string | null, websiteAddress?: string | null, author?: string | null, description?: string | null, contactEmail?: string | null, mainCategory?: string | null, subCategory?: string | null, keywords?: string | null, language?: string | null, timezone?: string | null, explicit?: string | null };

export type AuthorWithDescFieldsFragment = { __typename?: 'PodcastAuthorDesc', description?: string | null, podcast?: { __typename?: 'Podcast', title?: string | null } | null, author?: { __typename?: 'Author', id: string, avatar?: string | null, slug: string, gender?: string | null, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', name: string } | null> | null } | null };

export type TeamFragmentFragment = { __typename?: 'Team', id: string, title: string, email: string, twitter: string, linkedin: string, photo: string, job_title: string };

export type AboutTeamQueryVariables = Exact<{
  short: Scalars['String'];
}>;


export type AboutTeamQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', localAuthors?: Array<{ __typename?: 'Author', id: string, avatar?: string | null, twitter?: string | null, linkedin?: string | null, email?: string | null, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', showInAuthors?: boolean | null, name: string } | null> | null } | null> | null, authors?: Array<{ __typename?: 'Author', id: string, avatar?: string | null, twitter?: string | null, linkedin?: string | null, email?: string | null, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', showInAuthors?: boolean | null, name: string } | null> | null } | null> | null, team?: Array<{ __typename?: 'Team', id: string, title: string, email: string, twitter: string, linkedin: string, photo: string, job_title: string } | null> | null, localTeam?: Array<{ __typename?: 'Team', id: string, title: string, email: string, twitter: string, linkedin: string, photo: string, job_title: string } | null> | null } | null };

export type ArticleQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  slug: Scalars['String'];
  relatedLength?: InputMaybe<Scalars['Int']>;
}>;


export type ArticleQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', post?: { __typename?: 'Post', cacheKey?: string | null, id: string, deletedAt?: any | null, slug: string, views?: number | null, pixelUrl: string, showShares: boolean, showStats: boolean, postOptions?: { __typename?: 'PostOptions', cacheKey?: string | null, hideDisclaimer: boolean, isPromo: boolean } | null, alternates?: Array<{ __typename?: 'Language', cacheKey?: string | null, id: string, short: string, domain?: string | null, code: string } | null> | null, postTranslate?: { __typename?: 'PostTranslate', cacheKey?: string | null, id: string, title: string, leadText?: string | null, twitterLeadText?: string | null, facebookLeadText?: string | null, bodyText?: string | null, description?: string | null, socialDescription?: string | null, avatar?: string | null, youtube?: string | null, audio?: string | null, editorsPriority?: number | null, published: any, publishedHumanFormat?: string | null, facebookShares: number, twitterShares: number, redditShares: number, totalShares: number, noIndex: boolean, author?: { __typename?: 'Author', id: string, slug: string, avatar?: string | null, gender?: string | null, innovationCircleUrl?: string | null, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, avatar?: string | null, gender?: string | null, innovationCircleUrl?: string | null, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null, postBadge?: { __typename?: 'PostBadge', cacheKey?: string | null, id: string, label: string, postBadgeTranslates?: Array<{ __typename?: 'PostBadgeTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null, category?: { __typename?: 'Category', cacheKey?: string | null, id: string, slug: string, categoryTranslates?: Array<{ __typename?: 'CategoryTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null, tags?: Array<{ __typename?: 'Tag', cacheKey?: string | null, id: string, slug?: string | null, tagTranslates?: Array<{ __typename?: 'TagTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null> | null, topics?: Array<{ __typename?: 'Topic', selection: boolean, post: { __typename?: 'Post', cacheKey?: string | null, id: string, views?: number | null, slug: string, category?: { __typename?: 'Category', cacheKey?: string | null, id: string } | null, postTranslate?: { __typename?: 'PostTranslate', cacheKey?: string | null, id: string, title: string, leadText?: string | null, published: any, avatar?: string | null, author?: { __typename?: 'Author', id: string, slug: string, avatar?: string | null, gender?: string | null, innovationCircleUrl?: string | null, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null } } | null> | null, relatedPosts?: Array<{ __typename?: 'Post', cacheKey?: string | null, id: string, slug: string, category?: { __typename?: 'Category', cacheKey?: string | null, id: string } | null, postTranslate?: { __typename?: 'PostTranslate', cacheKey?: string | null, avatar?: string | null, title: string, author?: { __typename?: 'Author', id: string, slug: string, avatar?: string | null, gender?: string | null, innovationCircleUrl?: string | null, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null } | null> | null } | null } | null };

export type QueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  slug: Scalars['String'];
}>;


export type QueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', post?: { __typename?: 'Post', cacheKey?: string | null, id: string, slug: string, views?: number | null, postTranslate?: { __typename?: 'PostTranslate', cacheKey?: string | null, id: string, title: string, leadText?: string | null, avatar?: string | null, editorsPriority?: number | null, published: any, publishedHumanFormat?: string | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, innovationCircleUrl?: string | null, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null, postBadge?: { __typename?: 'PostBadge', cacheKey?: string | null, id: string, label: string, postBadgeTranslates?: Array<{ __typename?: 'PostBadgeTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null } | null } | null };

export type ArticleStoryQueryVariables = Exact<{
  short: Scalars['String'];
  slug: Scalars['String'];
}>;


export type ArticleStoryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', post?: { __typename?: 'Post', cacheKey?: string | null, pixelUrl: string, postBadge?: { __typename?: 'PostBadge', id: string, label: string, postBadgeTranslates?: Array<{ __typename?: 'PostBadgeTranslate', title: string } | null> | null } | null, postTranslate?: { __typename?: 'PostTranslate', cacheKey?: string | null, title: string, leadText?: string | null, bodyText?: string | null, avatar?: string | null, publishedHumanFormat?: string | null } | null, category?: { __typename?: 'Category', id: string, slug: string } | null, tags?: Array<{ __typename?: 'Tag', id: string, slug?: string | null, tagTranslates?: Array<{ __typename?: 'TagTranslate', title: string } | null> | null } | null> | null } | null } | null };

export type AuthorPageQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  slug: Scalars['String'];
  length?: InputMaybe<Scalars['Int']>;
}>;


export type AuthorPageQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, avatar?: string | null, gender?: string | null, innovationCircleUrl?: string | null, email?: string | null, twitter?: string | null, facebook?: string | null, googlePlus?: string | null, linkedin?: string | null, createdAt: any, alternates?: Array<{ __typename?: 'Language', cacheKey?: string | null, id: string, short: string, domain?: string | null, code: string } | null> | null, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string, description?: string | null, seoTitle?: string | null, seoDescription?: string | null } | null> | null, posts?: { __typename?: 'PaginatedPosts', postsCount?: number | null, data?: Array<{ __typename?: 'Post', cacheKey?: string | null, id: string, slug: string, postTranslate?: { __typename?: 'PostTranslate', cacheKey?: string | null, id: string, title: string, avatar?: string | null, published: any, publishedHumanFormat?: string | null, leadText?: string | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null, category?: { __typename?: 'Category', cacheKey?: string | null, id: string, slug: string, categoryTranslates?: Array<{ __typename?: 'CategoryTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null, postBadge?: { __typename?: 'PostBadge', cacheKey?: string | null, id: string, label: string, postBadgeTranslates?: Array<{ __typename?: 'PostBadgeTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null } | null> | null } | null } | null } | null };

export type AuthorPagePostsQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  slug: Scalars['String'];
  offset: Scalars['Int'];
  length: Scalars['Int'];
}>;


export type AuthorPagePostsQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', author?: { __typename?: 'Author', cacheKey?: string | null, id: string, posts?: { __typename?: 'PaginatedPosts', postsCount?: number | null, data?: Array<{ __typename?: 'Post', cacheKey?: string | null, id: string, slug: string, postTranslate?: { __typename?: 'PostTranslate', cacheKey?: string | null, id: string, title: string, avatar?: string | null, published: any, publishedHumanFormat?: string | null, leadText?: string | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null, category?: { __typename?: 'Category', cacheKey?: string | null, id: string, slug: string, categoryTranslates?: Array<{ __typename?: 'CategoryTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, innovationCircleUrl?: string | null, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null, postBadge?: { __typename?: 'PostBadge', cacheKey?: string | null, id: string, label: string, postBadgeTranslates?: Array<{ __typename?: 'PostBadgeTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null } | null> | null } | null } | null } | null };

export type BannersQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  places: Array<Scalars['String']> | Scalars['String'];
}>;


export type BannersQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', banners?: Array<{ __typename?: 'Banner', cacheKey?: string | null, id: string, bannerType: string, bannerPlace: string, bannerUrl?: string | null, bannerImage?: string | null, bannerTitle?: string | null, bannerWeight?: number | null, bannerComment?: string | null, bannerPriority?: number | null, bannerCode?: string | null, bannerOptions?: string | null } | null> | null } | null };

export type BasicDataQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  slugs: Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>;
}>;


export type BasicDataQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', translates?: Array<{ __typename?: 'Translate', cacheKey?: string | null, key?: string | null, value?: string | null } | null> | null } | null };

export type CalendarEventQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  monthDate?: InputMaybe<Scalars['DateTime']>;
  offset?: InputMaybe<Scalars['Int']>;
  categorySlug?: InputMaybe<Scalars['String']>;
  cityId?: InputMaybe<Scalars['ID']>;
  countryCode?: InputMaybe<Scalars['String']>;
  length?: InputMaybe<Scalars['Int']>;
  onlyWithPromocode?: InputMaybe<Scalars['Boolean']>;
}>;


export type CalendarEventQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', calendarEvents: { __typename?: 'PaginatedEvents', hasMore: boolean, data: Array<{ __typename?: 'Event', id: string, imageUrl: string, title: string, description?: string | null, promocode?: string | null, startDate: any, endDate: any, website?: string | null, city?: { __typename?: 'City', id: string, title: string } | null, country?: { __typename?: 'Country', code: string, title: string, code2: string } | null, categories: Array<{ __typename?: 'EventCategory', id: string, title: string, slug: string, description?: string | null }> }> } } | null };

export type CarouselEventsQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
}>;


export type CarouselEventsQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', carouselEvents: Array<{ __typename?: 'Event', id: string, imageUrl: string, title: string, description?: string | null, promocode?: string | null, startDate: any, endDate: any, website?: string | null, city?: { __typename?: 'City', id: string, title: string } | null, country?: { __typename?: 'Country', code: string, title: string, code2: string } | null, categories: Array<{ __typename?: 'EventCategory', id: string, title: string, slug: string, description?: string | null }> }> } | null };

export type CategoryQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  slug: Scalars['String'];
  offset?: InputMaybe<Scalars['Int']>;
  length?: InputMaybe<Scalars['Int']>;
  hideFromMainPage?: InputMaybe<Scalars['Boolean']>;
}>;


export type CategoryQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', category?: { __typename?: 'Category', cacheKey?: string | null, id: string, createdAt: any, alternates?: Array<{ __typename?: 'Language', cacheKey?: string | null, id: string, short: string, domain?: string | null, code: string } | null> | null, categoryTranslates?: Array<{ __typename?: 'CategoryTranslate', cacheKey?: string | null, id: string, title: string, metaTitle?: string | null, description?: string | null, metaDescription?: string | null, keywords?: string | null } | null> | null, posts?: { __typename?: 'PaginatedPosts', postsCount?: number | null, data?: Array<{ __typename?: 'Post', cacheKey?: string | null, id: string, slug: string, views?: number | null, showShares: boolean, showStats: boolean, category?: { __typename?: 'Category', cacheKey?: string | null, id: string, slug: string, categoryTranslates?: Array<{ __typename?: 'CategoryTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null, postTranslate?: { __typename?: 'PostTranslate', cacheKey?: string | null, id: string, title: string, leadText?: string | null, avatar?: string | null, published: any, publishedHumanFormat?: string | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, innovationCircleUrl?: string | null, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null, postBadge?: { __typename?: 'PostBadge', cacheKey?: string | null, id: string, label: string, postBadgeTranslates?: Array<{ __typename?: 'PostBadgeTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null } | null> | null } | null } | null } | null };

export type CategoryPagePostsQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  slug: Scalars['String'];
  offset?: InputMaybe<Scalars['Int']>;
  length?: InputMaybe<Scalars['Int']>;
  hideFromMainPage?: InputMaybe<Scalars['Boolean']>;
}>;


export type CategoryPagePostsQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', category?: { __typename?: 'Category', cacheKey?: string | null, id: string, posts?: { __typename?: 'PaginatedPosts', postsCount?: number | null, data?: Array<{ __typename?: 'Post', cacheKey?: string | null, id: string, slug: string, views?: number | null, showShares: boolean, showStats: boolean, postTranslate?: { __typename?: 'PostTranslate', cacheKey?: string | null, id: string, title: string, avatar?: string | null, published: any, publishedHumanFormat?: string | null, leadText?: string | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, innovationCircleUrl?: string | null, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null, category?: { __typename?: 'Category', cacheKey?: string | null, id: string, slug: string, categoryTranslates?: Array<{ __typename?: 'CategoryTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null, postBadge?: { __typename?: 'PostBadge', cacheKey?: string | null, id: string, label: string, postBadgeTranslates?: Array<{ __typename?: 'PostBadgeTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null } | null> | null } | null } | null } | null };

export type CoinMetaQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  slug: Scalars['String'];
}>;


export type CoinMetaQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', coin?: { __typename?: 'Coin', name: string, label?: string | null, decimals?: Array<{ __typename?: 'Decimals', value: number, currency: string } | null> | null } | null } | null };

export type CoinPriceIndexPageQueryVariables = Exact<{
  pageUrl: Scalars['String'];
  coinSlug: Scalars['String'];
  guideSlug?: InputMaybe<Scalars['String']>;
  short?: InputMaybe<Scalars['String']>;
  slugsMap?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
}>;


export type CoinPriceIndexPageQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', i18n?: Array<{ __typename?: 'Translate', cacheKey?: string | null, key?: string | null, value?: string | null } | null> | null, seoMeta?: { __typename?: 'SeoMeta', cacheKey?: string | null, id: string, seoMetaUrl?: string | null, seoMetaTitle?: string | null, seoMetaDescription?: string | null, seoMetaKeywords?: string | null } | null, posts?: { __typename?: 'Tag', cacheKey?: string | null, id: string, postsByTime?: { __typename?: 'PaginatedPosts', postsCount?: number | null, data?: Array<{ __typename?: 'Post', cacheKey?: string | null, id: string, slug: string, views?: number | null, showShares: boolean, showStats: boolean, postTranslate?: { __typename?: 'PostTranslate', cacheKey?: string | null, id: string, title: string, avatar?: string | null, published: any, publishedHumanFormat?: string | null, leadText?: string | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null, category?: { __typename?: 'Category', cacheKey?: string | null, id: string } | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null, postBadge?: { __typename?: 'PostBadge', cacheKey?: string | null, id: string, label: string, postBadgeTranslates?: Array<{ __typename?: 'PostBadgeTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null } | null> | null } | null, postsByViews?: { __typename?: 'PaginatedPosts', postsCount?: number | null, data?: Array<{ __typename?: 'Post', cacheKey?: string | null, id: string, slug: string, views?: number | null, showShares: boolean, showStats: boolean, postTranslate?: { __typename?: 'PostTranslate', cacheKey?: string | null, id: string, title: string, avatar?: string | null, published: any, publishedHumanFormat?: string | null, leadText?: string | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null, category?: { __typename?: 'Category', cacheKey?: string | null, id: string } | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null, postBadge?: { __typename?: 'PostBadge', cacheKey?: string | null, id: string, label: string, postBadgeTranslates?: Array<{ __typename?: 'PostBadgeTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null } | null> | null } | null } | null, guideCategory?: { __typename?: 'GuideCategory', slug: string, translate?: { __typename?: 'GuideCategoryTranslate', title: string } | null, guides?: Array<{ __typename?: 'Guide', slug: string, coverImg: string, coverImgCaption: string, translate?: { __typename?: 'GuideTranslate', title: string } | null } | null> | null } | null } | null };

export type EditorsChoiceQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
}>;


export type EditorsChoiceQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', editorsPosts?: Array<{ __typename?: 'Post', cacheKey?: string | null, id: string, slug: string, category?: { __typename?: 'Category', slug: string, id: string } | null, postTranslate?: { __typename?: 'PostTranslate', cacheKey?: string | null, id: string, title: string, avatar?: string | null, published: any, publishedHumanFormat?: string | null } | null } | null> | null } | null };

export type EventsFilterQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
}>;


export type EventsFilterQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', eventMonths: Array<any>, eventCategories: Array<{ __typename?: 'EventCategory', description?: string | null, id: string, title: string, slug: string }>, eventCities: Array<{ __typename?: 'City', id: string, title: string }>, eventCountries: Array<{ __typename?: 'Country', title: string, code: string, code2: string }> } | null };

export type GlossaryPageQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
}>;


export type GlossaryPageQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', glossary?: Array<{ __typename?: 'GlossaryItem', id: string, title: string, link: string } | null> | null } | null };

export type AllGuideCategoriesQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
}>;


export type AllGuideCategoriesQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', allGuideCategories: Array<{ __typename?: 'GuideCategory', id: string, cacheKey?: string | null, slug: string, description: string, createdAt?: any | null, updatedAt?: any | null, guidesCount: number, translate?: { __typename?: 'GuideCategoryTranslate', id: string, cacheKey?: string | null, title: string, description: string, deletedAt?: any | null, createdAt?: any | null, updatedAt?: any | null } | null }> } | null };

export type GuideCategoryOrGuideQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  slug: Scalars['String'];
}>;


export type GuideCategoryOrGuideQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', guideCategoryOrGuide?: { __typename?: 'Guide', slug: string, coverImg: string, coverImgCaption: string, socialImg: string, socialImgCaption: string, id: string, translate?: { __typename?: 'GuideTranslate', title: string, about: string, fullText: string, seoTitle: string, seoKeywords: string, seoDescription: string, published: boolean } | null } | { __typename?: 'GuideCategory', slug: string, description: string, translate?: { __typename?: 'GuideCategoryTranslate', title: string, description: string } | null } | null } | null };

export type PaginatedGuidesQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  guideCategorySlug?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  length?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<SortEnum>;
  query?: InputMaybe<Scalars['String']>;
}>;


export type PaginatedGuidesQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', guides: { __typename?: 'PaginatedGuides', hasMoreGuides: boolean, guidesCount: number, data: Array<{ __typename?: 'Guide', id: string, slug: string, coverImg: string, coverImgCaption: string, translate?: { __typename?: 'GuideTranslate', title: string } | null }> } } | null };

export type InfiniteScrollArticlesQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  promo?: InputMaybe<Scalars['Boolean']>;
  beforePostId?: InputMaybe<Scalars['ID']>;
  categorySlug?: InputMaybe<Scalars['String']>;
  relatedLength?: InputMaybe<Scalars['Int']>;
}>;


export type InfiniteScrollArticlesQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', posts?: { __typename?: 'PaginatedPosts', hasMorePosts: boolean, data?: Array<{ __typename: 'Post', cacheKey?: string | null, id: string, deletedAt?: any | null, slug: string, views?: number | null, pixelUrl: string, showShares: boolean, showStats: boolean, postOptions?: { __typename: 'PostOptions', cacheKey?: string | null, hideDisclaimer: boolean, isPromo: boolean } | null, alternates?: Array<{ __typename: 'Language', cacheKey?: string | null, id: string, short: string, domain?: string | null, code: string } | null> | null, postTranslate?: { __typename: 'PostTranslate', cacheKey?: string | null, id: string, title: string, leadText?: string | null, twitterLeadText?: string | null, facebookLeadText?: string | null, bodyText?: string | null, description?: string | null, socialDescription?: string | null, avatar?: string | null, youtube?: string | null, audio?: string | null, editorsPriority?: number | null, published: any, publishedHumanFormat?: string | null, facebookShares: number, twitterShares: number, redditShares: number, totalShares: number, noIndex: boolean, author?: { __typename?: 'Author', cacheKey?: string | null, avatar?: string | null, gender?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null, author?: { __typename: 'Author', cacheKey?: string | null, id: string, slug: string, avatar?: string | null, gender?: string | null, innovationCircleUrl?: string | null, authorTranslates?: Array<{ __typename: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null, postBadge?: { __typename: 'PostBadge', cacheKey?: string | null, id: string, label: string, postBadgeTranslates?: Array<{ __typename: 'PostBadgeTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null, category?: { __typename?: 'Category', cacheKey?: string | null, id: string, slug: string, categoryTranslates?: Array<{ __typename: 'CategoryTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null, tags?: Array<{ __typename: 'Tag', cacheKey?: string | null, id: string, slug?: string | null, tagTranslates?: Array<{ __typename: 'TagTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null> | null, topics?: Array<{ __typename: 'Topic', selection: boolean, post: { __typename: 'Post', cacheKey?: string | null, id: string, views?: number | null, slug: string, category?: { __typename: 'Category', cacheKey?: string | null, id: string } | null, postTranslate?: { __typename: 'PostTranslate', cacheKey?: string | null, id: string, title: string, leadText?: string | null, published: any, avatar?: string | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null } } | null> | null, relatedPosts?: Array<{ __typename: 'Post', cacheKey?: string | null, id: string, slug: string, category?: { __typename: 'Category', cacheKey?: string | null, id: string } | null, postTranslate?: { __typename: 'PostTranslate', cacheKey?: string | null, avatar?: string | null, title: string, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null } | null> | null } | null> | null } | null } | null };

export type InnovationCirclePostsQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  offset: Scalars['Int'];
  length: Scalars['Int'];
  relatedLength?: InputMaybe<Scalars['Int']>;
}>;


export type InnovationCirclePostsQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', posts?: { __typename?: 'PaginatedPosts', postsCount?: number | null, hasMorePosts: boolean, data?: Array<{ __typename: 'Post', cacheKey?: string | null, id: string, deletedAt?: any | null, slug: string, views?: number | null, pixelUrl: string, showShares: boolean, showStats: boolean, postOptions?: { __typename: 'PostOptions', cacheKey?: string | null, hideDisclaimer: boolean, isPromo: boolean } | null, alternates?: Array<{ __typename: 'Language', cacheKey?: string | null, id: string, short: string, domain?: string | null, code: string } | null> | null, postTranslate?: { __typename: 'PostTranslate', cacheKey?: string | null, id: string, title: string, leadText?: string | null, twitterLeadText?: string | null, facebookLeadText?: string | null, bodyText?: string | null, description?: string | null, socialDescription?: string | null, avatar?: string | null, youtube?: string | null, audio?: string | null, editorsPriority?: number | null, published: any, publishedHumanFormat?: string | null, facebookShares: number, twitterShares: number, redditShares: number, totalShares: number, noIndex: boolean, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null, author?: { __typename: 'Author', cacheKey?: string | null, id: string, slug: string, avatar?: string | null, gender?: string | null, innovationCircleUrl?: string | null, authorTranslates?: Array<{ __typename: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null, postBadge?: { __typename: 'PostBadge', cacheKey?: string | null, id: string, label: string, postBadgeTranslates?: Array<{ __typename: 'PostBadgeTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null, category?: { __typename: 'Category', cacheKey?: string | null, id: string, slug: string, categoryTranslates?: Array<{ __typename: 'CategoryTranslate', cacheKey?: string | null, id: string, title: string } | null> | null, posts?: { __typename: 'PaginatedPosts', postsCount?: number | null, data?: Array<{ __typename: 'Post', cacheKey?: string | null, id: string, slug: string, views?: number | null, pixelUrl: string, showShares: boolean, showStats: boolean, alternates?: Array<{ __typename: 'Language', cacheKey?: string | null, id: string, short: string, domain?: string | null, code: string } | null> | null, postTranslate?: { __typename: 'PostTranslate', cacheKey?: string | null, id: string, title: string, leadText?: string | null, twitterLeadText?: string | null, facebookLeadText?: string | null, bodyText?: string | null, description?: string | null, socialDescription?: string | null, avatar?: string | null, youtube?: string | null, audio?: string | null, editorsPriority?: number | null, published: any, publishedHumanFormat?: string | null, totalShares: number, noIndex: boolean, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null, author?: { __typename: 'Author', cacheKey?: string | null, id: string, slug: string, avatar?: string | null, authorTranslates?: Array<{ __typename: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null, postBadge?: { __typename: 'PostBadge', cacheKey?: string | null, id: string, label: string, postBadgeTranslates?: Array<{ __typename: 'PostBadgeTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null, category?: { __typename: 'Category', cacheKey?: string | null, id: string, slug: string, categoryTranslates?: Array<{ __typename: 'CategoryTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null, tags?: Array<{ __typename: 'Tag', cacheKey?: string | null, id: string, slug?: string | null, tagTranslates?: Array<{ __typename: 'TagTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null> | null } | null> | null } | null } | null, tags?: Array<{ __typename: 'Tag', cacheKey?: string | null, id: string, slug?: string | null, tagTranslates?: Array<{ __typename: 'TagTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null> | null, topics?: Array<{ __typename: 'Topic', selection: boolean, post: { __typename: 'Post', cacheKey?: string | null, id: string, views?: number | null, slug: string, category?: { __typename: 'Category', cacheKey?: string | null, id: string } | null, postTranslate?: { __typename: 'PostTranslate', cacheKey?: string | null, id: string, title: string, leadText?: string | null, published: any, avatar?: string | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null } } | null> | null, relatedPosts?: Array<{ __typename: 'Post', cacheKey?: string | null, id: string, slug: string, category?: { __typename: 'Category', cacheKey?: string | null, id: string } | null, postTranslate?: { __typename: 'PostTranslate', cacheKey?: string | null, avatar?: string | null, title: string, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null } | null> | null } | null> | null } | null } | null };

export type LanguagesQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
}>;


export type LanguagesQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', languages?: Array<{ __typename?: 'Language', cacheKey?: string | null, id: string, code: string, domain?: string | null, gaCode: string, robots: string, short: string, subscribes?: Array<string | null> | null, timezone: string, title: string, hidden: boolean } | null> | null } | null };

export type LocalPostsQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  length?: InputMaybe<Scalars['Int']>;
}>;


export type LocalPostsQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', localPosts?: { __typename?: 'LocalPosts', cacheKey?: string | null, alternates?: Array<{ __typename?: 'Language', cacheKey?: string | null, id: string, short: string, domain?: string | null, code: string } | null> | null, posts?: { __typename?: 'PaginatedPosts', postsCount?: number | null, data?: Array<{ __typename?: 'Post', cacheKey?: string | null, id: string, slug: string, views?: number | null, showShares: boolean, showStats: boolean, postTranslate?: { __typename?: 'PostTranslate', cacheKey?: string | null, id: string, title: string, leadText?: string | null, avatar?: string | null, published: any, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null, postBadge?: { __typename?: 'PostBadge', cacheKey?: string | null, id: string, label: string, postBadgeTranslates?: Array<{ __typename?: 'PostBadgeTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null } | null> | null } | null } | null } | null };

export type LocalPostsPageQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  length?: InputMaybe<Scalars['Int']>;
}>;


export type LocalPostsPageQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', localPosts?: { __typename?: 'LocalPosts', title?: string | null, description?: string | null, keywords?: string | null, cacheKey?: string | null, alternates?: Array<{ __typename?: 'Language', cacheKey?: string | null, id: string, short: string, domain?: string | null, code: string } | null> | null, posts?: { __typename?: 'PaginatedPosts', postsCount?: number | null, data?: Array<{ __typename?: 'Post', cacheKey?: string | null, id: string, slug: string, views?: number | null, showShares: boolean, showStats: boolean, category?: { __typename?: 'Category', cacheKey?: string | null, id: string, slug: string, categoryTranslates?: Array<{ __typename?: 'CategoryTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null, postTranslate?: { __typename?: 'PostTranslate', cacheKey?: string | null, id: string, title: string, leadText?: string | null, avatar?: string | null, published: any, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, innovationCircleUrl?: string | null, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null, postBadge?: { __typename?: 'PostBadge', cacheKey?: string | null, id: string, label: string, postBadgeTranslates?: Array<{ __typename?: 'PostBadgeTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null } | null> | null } | null } | null } | null };

export type MainPageCarouselQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
}>;


export type MainPageCarouselQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', carouselPosts?: Array<{ __typename?: 'Post', cacheKey?: string | null, id: string, slug: string, postTranslate?: { __typename?: 'PostTranslate', id: string, title: string, avatar?: string | null, published: any, publishedHumanFormat?: string | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null, category?: { __typename?: 'Category', cacheKey?: string | null, id: string, slug: string, categoryTranslates?: Array<{ __typename?: 'CategoryTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null> | null } | null };

export type MainPagePostsQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  offset: Scalars['Int'];
  length: Scalars['Int'];
  place?: InputMaybe<Scalars['String']>;
}>;


export type MainPagePostsQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', posts?: { __typename?: 'PaginatedPosts', postsCount?: number | null, hasMorePosts: boolean, data?: Array<{ __typename?: 'Post', cacheKey?: string | null, id: string, slug: string, postTranslate?: { __typename?: 'PostTranslate', cacheKey?: string | null, id: string, title: string, avatar?: string | null, published: any, publishedHumanFormat?: string | null, leadText?: string | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, innovationCircleUrl?: string | null, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null, category?: { __typename?: 'Category', cacheKey?: string | null, id: string, slug: string, categoryTranslates?: Array<{ __typename?: 'CategoryTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null, postBadge?: { __typename?: 'PostBadge', cacheKey?: string | null, id: string, label: string, postBadgeTranslates?: Array<{ __typename?: 'PostBadgeTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null } | null> | null } | null } | null };

export type MainPageReleasesQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  length: Scalars['Int'];
  hideFromMainPage?: InputMaybe<Scalars['Boolean']>;
}>;


export type MainPageReleasesQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', pressReleases?: { __typename?: 'Category', cacheKey?: string | null, id: string, slug: string, categoryTranslates?: Array<{ __typename?: 'CategoryTranslate', cacheKey?: string | null, id: string, title: string } | null> | null, posts?: { __typename?: 'PaginatedPosts', data?: Array<{ __typename?: 'Post', cacheKey?: string | null, id: string, slug: string, postTranslate?: { __typename?: 'PostTranslate', cacheKey?: string | null, id: string, title: string, avatar?: string | null } | null, category?: { __typename?: 'Category', cacheKey?: string | null, id: string } | null } | null> | null } | null } | null, marketReleases?: { __typename?: 'Category', cacheKey?: string | null, id: string, slug: string, categoryTranslates?: Array<{ __typename?: 'CategoryTranslate', cacheKey?: string | null, id: string, title: string } | null> | null, posts?: { __typename?: 'PaginatedPosts', data?: Array<{ __typename?: 'Post', cacheKey?: string | null, id: string, slug: string, postTranslate?: { __typename?: 'PostTranslate', cacheKey?: string | null, id: string, title: string, avatar?: string | null } | null, category?: { __typename?: 'Category', cacheKey?: string | null, id: string } | null } | null> | null } | null } | null } | null };

export type ReleasesCategoryFieldsFragment = { __typename?: 'Category', cacheKey?: string | null, id: string, slug: string, categoryTranslates?: Array<{ __typename?: 'CategoryTranslate', cacheKey?: string | null, id: string, title: string } | null> | null, posts?: { __typename?: 'PaginatedPosts', data?: Array<{ __typename?: 'Post', cacheKey?: string | null, id: string, slug: string, postTranslate?: { __typename?: 'PostTranslate', cacheKey?: string | null, id: string, title: string, avatar?: string | null } | null, category?: { __typename?: 'Category', cacheKey?: string | null, id: string } | null } | null> | null } | null };

export type MarketsPageQueryQueryVariables = Exact<{
  pageUrl: Scalars['String'];
  short?: InputMaybe<Scalars['String']>;
  slugsMap?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
}>;


export type MarketsPageQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', i18n?: Array<{ __typename?: 'Translate', cacheKey?: string | null, key?: string | null, value?: string | null } | null> | null, seoMeta?: { __typename?: 'SeoMeta', cacheKey?: string | null, id: string, seoMetaUrl?: string | null, seoMetaTitle?: string | null, seoMetaDescription?: string | null, seoMetaKeywords?: string | null } | null, markets?: { __typename?: 'Tag', cacheKey?: string | null, id: string, postsByTime?: { __typename?: 'PaginatedPosts', postsCount?: number | null, data?: Array<{ __typename?: 'Post', cacheKey?: string | null, id: string, slug: string, views?: number | null, showShares: boolean, showStats: boolean, postTranslate?: { __typename?: 'PostTranslate', cacheKey?: string | null, id: string, title: string, avatar?: string | null, published: any, publishedHumanFormat?: string | null, leadText?: string | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null, category?: { __typename?: 'Category', cacheKey?: string | null, id: string, slug: string } | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null, postBadge?: { __typename?: 'PostBadge', cacheKey?: string | null, id: string, label: string, postBadgeTranslates?: Array<{ __typename?: 'PostBadgeTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null } | null> | null } | null, postsByViews?: { __typename?: 'PaginatedPosts', postsCount?: number | null, data?: Array<{ __typename?: 'Post', cacheKey?: string | null, id: string, slug: string, views?: number | null, showShares: boolean, showStats: boolean, postTranslate?: { __typename?: 'PostTranslate', cacheKey?: string | null, id: string, title: string, avatar?: string | null, published: any, publishedHumanFormat?: string | null, leadText?: string | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null, category?: { __typename?: 'Category', cacheKey?: string | null, id: string } | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null, postBadge?: { __typename?: 'PostBadge', cacheKey?: string | null, id: string, label: string, postBadgeTranslates?: Array<{ __typename?: 'PostBadgeTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null } | null> | null } | null } | null, trading101?: { __typename?: 'Tag', cacheKey?: string | null, id: string, postsByTime?: { __typename?: 'PaginatedPosts', postsCount?: number | null, data?: Array<{ __typename?: 'Post', cacheKey?: string | null, id: string, slug: string, views?: number | null, showShares: boolean, showStats: boolean, postTranslate?: { __typename?: 'PostTranslate', cacheKey?: string | null, id: string, title: string, avatar?: string | null, published: any, publishedHumanFormat?: string | null, leadText?: string | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null, category?: { __typename?: 'Category', cacheKey?: string | null, id: string } | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null, postBadge?: { __typename?: 'PostBadge', cacheKey?: string | null, id: string, label: string, postBadgeTranslates?: Array<{ __typename?: 'PostBadgeTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null } | null> | null } | null } | null } | null };

export type MenuQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  menuType: Scalars['String'];
}>;


export type MenuQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', menu?: Array<{ __typename?: 'Menu', cacheKey?: string | null, id: string, parentId?: string | null, url: string, badgeType?: number | null, rel?: string | null, position: number, inNewTab: boolean, titleTranslates: Array<{ __typename?: 'Translate', cacheKey?: string | null, id?: string | null, value?: string | null } | null> } | null> | null } | null };

export type NewsRotatorQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  promo?: InputMaybe<Scalars['Boolean']>;
}>;


export type NewsRotatorQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', editorsPosts?: Array<{ __typename?: 'Post', cacheKey?: string | null, id: string, slug: string, postTranslate?: { __typename?: 'PostTranslate', cacheKey?: string | null, id: string, title: string, avatar?: string | null, published: any, publishedHumanFormat?: string | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null, category?: { __typename?: 'Category', cacheKey?: string | null, id: string, slug: string, categoryTranslates?: Array<{ __typename?: 'CategoryTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null> | null, hotPosts?: Array<{ __typename?: 'Post', cacheKey?: string | null, id: string, slug: string, views?: number | null, showShares: boolean, showStats: boolean, postTranslate?: { __typename?: 'PostTranslate', cacheKey?: string | null, id: string, title: string, avatar?: string | null, published: any, publishedHumanFormat?: string | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null, category?: { __typename?: 'Category', cacheKey?: string | null, id: string, slug: string, categoryTranslates?: Array<{ __typename?: 'CategoryTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null> | null } | null };

export type PodcastQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
}>;


export type PodcastQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', podcast?: { __typename?: 'Podcast', slug?: string | null, title?: string | null, description?: string | null, apple?: string | null, spotify?: string | null, google?: string | null, amazonMusic?: string | null, audible?: string | null, iheartradio?: string | null, tunein?: string | null, podcastAddict?: string | null, podchaser?: string | null, podcastIndex?: string | null, pocketCasts?: string | null, deezer?: string | null, listenNotes?: string | null, playerfm?: string | null, overcast?: string | null, castro?: string | null, castbox?: string | null, podfriend?: string | null, goodpods?: string | null, disclaimerPrefix?: string | null, tag?: { __typename?: 'Tag', slug?: string | null } | null, buzzsproutPodcast?: { __typename?: 'BuzzsproutPodcast', id?: string | null, title?: string | null, artworkUrl?: string | null, backgroundUrl?: string | null, websiteAddress?: string | null, author?: string | null, description?: string | null, contactEmail?: string | null, mainCategory?: string | null, subCategory?: string | null, keywords?: string | null, language?: string | null, timezone?: string | null, explicit?: string | null } | null, authorsWithDesc?: Array<{ __typename?: 'PodcastAuthorDesc', description?: string | null, podcast?: { __typename?: 'Podcast', title?: string | null } | null, author?: { __typename?: 'Author', id: string, avatar?: string | null, slug: string, gender?: string | null, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', name: string } | null> | null } | null } | null> | null } | null } | null };

export type PodcastsQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
}>;


export type PodcastsQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', podcasts?: Array<{ __typename?: 'Podcast', title?: string | null, slug?: string | null, description?: string | null, disclaimerPrefix?: string | null, apple?: string | null, google?: string | null, tunein?: string | null, spotify?: string | null, tag?: { __typename?: 'Tag', slug?: string | null } | null, buzzsproutPodcast?: { __typename?: 'BuzzsproutPodcast', id?: string | null, title?: string | null, artworkUrl?: string | null, backgroundUrl?: string | null, websiteAddress?: string | null, author?: string | null, description?: string | null, contactEmail?: string | null, mainCategory?: string | null, subCategory?: string | null, keywords?: string | null, language?: string | null, timezone?: string | null, explicit?: string | null } | null, authorsWithDesc?: Array<{ __typename?: 'PodcastAuthorDesc', description?: string | null, podcast?: { __typename?: 'Podcast', title?: string | null } | null, author?: { __typename?: 'Author', id: string, avatar?: string | null, slug: string, gender?: string | null, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', name: string } | null> | null } | null } | null> | null } | null> | null } | null };

export type QrCodeQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  url: Scalars['String'];
}>;


export type QrCodeQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', qrCode?: { __typename?: 'QrCode', image?: string | null } | null } | null };

export type RelatedPostsQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  postId: Scalars['ID'];
  excludeIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>> | InputMaybe<Scalars['ID']>>;
  relatedLength?: InputMaybe<Scalars['Int']>;
}>;


export type RelatedPostsQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', relatedPosts?: Array<{ __typename?: 'Post', cacheKey?: string | null, id: string, slug: string, category?: { __typename?: 'Category', cacheKey?: string | null, id: string } | null, postTranslate?: { __typename?: 'PostTranslate', cacheKey?: string | null, avatar?: string | null, title: string, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, innovationCircleUrl?: string | null, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null } | null> | null } | null };

export type SearchPagePostsQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  offset: Scalars['Int'];
  length: Scalars['Int'];
  query: Scalars['String'];
}>;


export type SearchPagePostsQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', postsSearch?: { __typename?: 'PaginatedPosts', postsCount?: number | null, hasMorePosts: boolean, data?: Array<{ __typename?: 'Post', id: string, slug: string, views?: number | null, showShares: boolean, showStats: boolean, postTranslate?: { __typename?: 'PostTranslate', cacheKey?: string | null, id: string, title: string, leadText?: string | null, avatar?: string | null, published: any, publishedHumanFormat?: string | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null, category?: { __typename?: 'Category', cacheKey?: string | null, id: string, slug: string, categoryTranslates?: Array<{ __typename?: 'CategoryTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null, postBadge?: { __typename?: 'PostBadge', cacheKey?: string | null, id: string, label: string, postBadgeTranslates?: Array<{ __typename?: 'PostBadgeTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null } | null> | null } | null } | null };

export type SeoMetaQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  url: Scalars['String'];
}>;


export type SeoMetaQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', seoMeta?: { __typename?: 'SeoMeta', cacheKey?: string | null, id: string, seoMetaUrl?: string | null, seoMetaTitle?: string | null, seoMetaDescription?: string | null, seoMetaKeywords?: string | null } | null } | null };

export type SettingsQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  slugs: Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>;
}>;


export type SettingsQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', settings?: Array<{ __typename?: 'Setting', cacheKey?: string | null, key?: string | null, value?: string | null } | null> | null } | null };

export type SocialLinksQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
}>;


export type SocialLinksQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', socialLinks?: { __typename?: 'SocialLinks', cacheKey?: string | null, id: string, facebookUrl: string, twitterUrl: string, telegramUrl: string, linkedinUrl: string, googlePlusUrl: string, youtubeUrl: string, twitterAccount: string, telegramAccount: string } | null } | null };

export type StaticPageQueryVariables = Exact<{
  short: Scalars['String'];
  slug: Scalars['String'];
}>;


export type StaticPageQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', staticPage?: { __typename?: 'StaticPage', id: string, title: string, socialImg?: string | null, socialImgCaption?: string | null, coverImg?: string | null, coverImgCaption?: string | null, about?: string | null, seoTitle?: string | null, seoKeywords?: string | null, seoDescription?: string | null, createdAt: any, updatedAt: any, content: string } | null } | null };

export type TagPageQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  slug: Scalars['String'];
  order?: InputMaybe<Scalars['String']>;
  offset: Scalars['Int'];
  length: Scalars['Int'];
}>;


export type TagPageQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', tag?: { __typename?: 'Tag', cacheKey?: string | null, id: string, slug?: string | null, avatar?: string | null, createdAt: any, updatedAt: any, redirectRelativeUrl?: string | null, alternates?: Array<{ __typename?: 'Language', cacheKey?: string | null, short: string, domain?: string | null, id: string, code: string } | null> | null, tagTranslates?: Array<{ __typename?: 'TagTranslate', cacheKey?: string | null, id: string, title: string, metaTitle?: string | null, pageTitle?: string | null, description?: string | null, metaDescription?: string | null, keywords?: string | null } | null> | null, posts?: { __typename?: 'PaginatedPosts', postsCount?: number | null, data?: Array<{ __typename?: 'Post', cacheKey?: string | null, id: string, slug: string, views?: number | null, showShares: boolean, showStats: boolean, postTranslate?: { __typename?: 'PostTranslate', cacheKey?: string | null, id: string, title: string, avatar?: string | null, published: any, publishedHumanFormat?: string | null, leadText?: string | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null, category?: { __typename?: 'Category', cacheKey?: string | null, id: string, slug: string } | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null, postBadge?: { __typename?: 'PostBadge', cacheKey?: string | null, id: string, label: string, postBadgeTranslates?: Array<{ __typename?: 'PostBadgeTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null } | null> | null } | null } | null } | null };

export type TagPagePostsQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  slug: Scalars['String'];
  order?: InputMaybe<Scalars['String']>;
  offset: Scalars['Int'];
  length: Scalars['Int'];
}>;


export type TagPagePostsQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', tag?: { __typename?: 'Tag', cacheKey?: string | null, id: string, posts?: { __typename?: 'PaginatedPosts', postsCount?: number | null, data?: Array<{ __typename?: 'Post', cacheKey?: string | null, id: string, slug: string, views?: number | null, showShares: boolean, showStats: boolean, postTranslate?: { __typename?: 'PostTranslate', cacheKey?: string | null, id: string, title: string, avatar?: string | null, published: any, publishedHumanFormat?: string | null, leadText?: string | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null, category?: { __typename?: 'Category', cacheKey?: string | null, id: string } | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null, postBadge?: { __typename?: 'PostBadge', cacheKey?: string | null, id: string, label: string, postBadgeTranslates?: Array<{ __typename?: 'PostBadgeTranslate', cacheKey?: string | null, id: string, title: string } | null> | null } | null } | null> | null } | null } | null } | null };

export type TickersGraphsQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  widgetType?: InputMaybe<Scalars['String']>;
  fiatCurrencies?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
}>;


export type TickersGraphsQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', tickerMeta?: { __typename?: 'TickerMeta', coinSymbols: Array<{ __typename?: 'Coin', name: string, graphs?: Array<{ __typename?: 'Graph', cacheKey?: string | null, id: string, fiatCurrencyCode: string, graph: string } | null> | null } | null> } | null } | null };

export type TickersMetaQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
}>;


export type TickersMetaQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', tickerMeta?: { __typename?: 'TickerMeta', defaultCurrency: string, currencySymbols: Array<{ __typename?: 'Currency', name: string, sign: string } | null>, coinSymbols: Array<{ __typename?: 'Coin', cacheKey?: string | null, id: string, name: string, label?: string | null, slug: string, logo?: string | null, priority: number, guideSlug: string, tickersDesktop: boolean, tickersMobile: boolean, decimals?: Array<{ __typename?: 'Decimals', value: number, currency: string } | null> | null, decimalsHeaderMobile?: Array<{ __typename?: 'Decimals', value: number, currency: string } | null> | null, decimalsHeaderDesktop?: Array<{ __typename?: 'Decimals', value: number, currency: string } | null> | null, tag?: { __typename?: 'Tag', slug?: string | null } | null } | null> } | null } | null };

export type TranslateQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  slugs: Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>;
}>;


export type TranslateQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', translates?: Array<{ __typename?: 'Translate', cacheKey?: string | null, key?: string | null, value?: string | null } | null> | null } | null };

export type UniBlocksQueryQueryVariables = Exact<{
  short?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
}>;


export type UniBlocksQueryQuery = { __typename?: 'Query', locale?: { __typename?: 'Locale', universalBlocks?: Array<{ __typename?: 'UniversalBlock', cacheKey?: string | null, id: string, type?: string | null, universalBlockTranslates?: Array<{ __typename?: 'UniversalBlockTranslate', cacheKey?: string | null, id: string, title: string } | null> | null, posts?: { __typename?: 'PaginatedPosts', data?: Array<{ __typename?: 'Post', cacheKey?: string | null, id: string, slug: string, postTranslate?: { __typename?: 'PostTranslate', cacheKey?: string | null, id: string, title: string, avatar?: string | null, author?: { __typename?: 'Author', cacheKey?: string | null, id: string, slug: string, authorTranslates?: Array<{ __typename?: 'AuthorTranslate', cacheKey?: string | null, id: string, name: string } | null> | null } | null } | null, category?: { __typename?: 'Category', cacheKey?: string | null, id: string } | null } | null> | null } | null } | null> | null } | null };

export const AuthorFragmentFragmentDoc = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthorFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Author"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"twitter"}},{"kind":"Field","name":{"kind":"Name","value":"linkedin"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"showInAuthors"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<AuthorFragmentFragment, unknown>;
export const EventCategoryFragmentFragmentDoc = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventCategoryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventCategory"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<EventCategoryFragmentFragment, unknown>;
export const EventFragmentFragmentDoc = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"promocode"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"city"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"code2"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventCategoryFragment"}}]}}]}},...EventCategoryFragmentFragmentDoc.definitions]} as unknown as DocumentNode<EventFragmentFragment, unknown>;
export const BuzzsproutPodcastFieldsFragmentDoc = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"buzzsproutPodcastFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BuzzsproutPodcast"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"artworkUrl"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundUrl"}},{"kind":"Field","name":{"kind":"Name","value":"websiteAddress"}},{"kind":"Field","name":{"kind":"Name","value":"author"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"mainCategory"}},{"kind":"Field","name":{"kind":"Name","value":"subCategory"}},{"kind":"Field","name":{"kind":"Name","value":"keywords"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"explicit"}}]}}]} as unknown as DocumentNode<BuzzsproutPodcastFieldsFragment, unknown>;
export const AuthorWithDescFieldsFragmentDoc = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"authorWithDescFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PodcastAuthorDesc"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"podcast"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<AuthorWithDescFieldsFragment, unknown>;
export const TeamFragmentFragmentDoc = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Team"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"twitter"}},{"kind":"Field","name":{"kind":"Name","value":"linkedin"}},{"kind":"Field","name":{"kind":"Name","value":"photo"}},{"kind":"Field","name":{"kind":"Name","value":"job_title"}}]}}]} as unknown as DocumentNode<TeamFragmentFragment, unknown>;
export const ReleasesCategoryFieldsFragmentDoc = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"releasesCategoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"categoryTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"length"},"value":{"kind":"Variable","name":{"kind":"Name","value":"length"}}},{"kind":"Argument","name":{"kind":"Name","value":"hideFromMainPage"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hideFromMainPage"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ReleasesCategoryFieldsFragment, unknown>;
export const AboutTeamDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AboutTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"localAuthors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthorFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"authors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthorFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TeamFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"localTeam"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TeamFragment"}}]}}]}}]}},...AuthorFragmentFragmentDoc.definitions,...TeamFragmentFragmentDoc.definitions]} as unknown as DocumentNode<AboutTeamQuery, AboutTeamQueryVariables>;
export const ArticleQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ArticleQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"relatedLength"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"post"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"views"}},{"kind":"Field","name":{"kind":"Name","value":"pixelUrl"}},{"kind":"Field","name":{"kind":"Name","value":"postOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"hideDisclaimer"}},{"kind":"Field","name":{"kind":"Name","value":"isPromo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"alternates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"short"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"leadText"}},{"kind":"Field","name":{"kind":"Name","value":"twitterLeadText"}},{"kind":"Field","name":{"kind":"Name","value":"facebookLeadText"}},{"kind":"Field","name":{"kind":"Name","value":"bodyText"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"socialDescription"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"innovationCircleUrl"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"youtube"}},{"kind":"Field","name":{"kind":"Name","value":"audio"}},{"kind":"Field","name":{"kind":"Name","value":"editorsPriority"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"publishedHumanFormat"}},{"kind":"Field","name":{"kind":"Name","value":"facebookShares"}},{"kind":"Field","name":{"kind":"Name","value":"twitterShares"}},{"kind":"Field","name":{"kind":"Name","value":"redditShares"}},{"kind":"Field","name":{"kind":"Name","value":"totalShares"}},{"kind":"Field","name":{"kind":"Name","value":"noIndex"}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"innovationCircleUrl"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"postBadge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"postBadgeTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"categoryTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"tagTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"topics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selection"}},{"kind":"Field","name":{"kind":"Name","value":"post"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"views"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"leadText"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"innovationCircleUrl"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"relatedPosts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"length"},"value":{"kind":"Variable","name":{"kind":"Name","value":"relatedLength"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"innovationCircleUrl"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"showShares"}},{"kind":"Field","name":{"kind":"Name","value":"showStats"}}]}}]}}]}}]} as unknown as DocumentNode<ArticleQueryQuery, ArticleQueryQueryVariables>;
export const QueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Query"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"post"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"views"}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"leadText"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"editorsPriority"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"publishedHumanFormat"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"innovationCircleUrl"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"postBadge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"postBadgeTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<QueryQuery, QueryQueryVariables>;
export const ArticleStoryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"articleStory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"post"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"postBadge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"postBadgeTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pixelUrl"}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"leadText"}},{"kind":"Field","name":{"kind":"Name","value":"bodyText"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"publishedHumanFormat"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"tagTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ArticleStoryQuery, ArticleStoryQueryVariables>;
export const AuthorPageQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AuthorPageQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"length"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"author"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"innovationCircleUrl"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"twitter"}},{"kind":"Field","name":{"kind":"Name","value":"facebook"}},{"kind":"Field","name":{"kind":"Name","value":"googlePlus"}},{"kind":"Field","name":{"kind":"Name","value":"linkedin"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"alternates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"short"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"seoTitle"}},{"kind":"Field","name":{"kind":"Name","value":"seoDescription"}}]}},{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"StringValue","value":"postPublishedTime","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"IntValue","value":"0"}},{"kind":"Argument","name":{"kind":"Name","value":"length"},"value":{"kind":"Variable","name":{"kind":"Name","value":"length"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"publishedHumanFormat"}},{"kind":"Field","name":{"kind":"Name","value":"leadText"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"categoryTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"postBadge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"postBadgeTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"postsCount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AuthorPageQueryQuery, AuthorPageQueryQueryVariables>;
export const AuthorPagePostsQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AuthorPagePostsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"length"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"author"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"StringValue","value":"postPublishedTime","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"length"},"value":{"kind":"Variable","name":{"kind":"Name","value":"length"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"publishedHumanFormat"}},{"kind":"Field","name":{"kind":"Name","value":"leadText"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"categoryTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"innovationCircleUrl"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"postBadge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"postBadgeTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"postsCount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AuthorPagePostsQueryQuery, AuthorPagePostsQueryQueryVariables>;
export const BannersDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Banners"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"places"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"banners"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"places"},"value":{"kind":"Variable","name":{"kind":"Name","value":"places"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bannerType"}},{"kind":"Field","name":{"kind":"Name","value":"bannerPlace"}},{"kind":"Field","name":{"kind":"Name","value":"bannerUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bannerImage"}},{"kind":"Field","name":{"kind":"Name","value":"bannerTitle"}},{"kind":"Field","name":{"kind":"Name","value":"bannerWeight"}},{"kind":"Field","name":{"kind":"Name","value":"bannerComment"}},{"kind":"Field","name":{"kind":"Name","value":"bannerPriority"}},{"kind":"Field","name":{"kind":"Name","value":"bannerCode"}},{"kind":"Field","name":{"kind":"Name","value":"bannerOptions"}}]}}]}}]}}]} as unknown as DocumentNode<BannersQuery, BannersQueryVariables>;
export const BasicDataQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BasicDataQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slugs"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"translates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slugs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slugs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<BasicDataQueryQuery, BasicDataQueryQueryVariables>;
export const CalendarEventDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CalendarEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"monthDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categorySlug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cityId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"countryCode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"length"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"onlyWithPromocode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendarEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"monthDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"monthDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"categorySlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categorySlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"cityId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cityId"}}},{"kind":"Argument","name":{"kind":"Name","value":"countryCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"countryCode"}}},{"kind":"Argument","name":{"kind":"Name","value":"length"},"value":{"kind":"Variable","name":{"kind":"Name","value":"length"}}},{"kind":"Argument","name":{"kind":"Name","value":"onlyWithPromocode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"onlyWithPromocode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasMore"}}]}}]}}]}},...EventFragmentFragmentDoc.definitions]} as unknown as DocumentNode<CalendarEventQuery, CalendarEventQueryVariables>;
export const CarouselEventsDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CarouselEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"carouselEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventFragment"}}]}}]}}]}},...EventFragmentFragmentDoc.definitions]} as unknown as DocumentNode<CarouselEventsQuery, CarouselEventsQueryVariables>;
export const CategoryQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CategoryQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"length"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hideFromMainPage"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"NullValue"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"alternates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"short"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"metaTitle"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"metaDescription"}},{"kind":"Field","name":{"kind":"Name","value":"keywords"}}]}},{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"length"},"value":{"kind":"Variable","name":{"kind":"Name","value":"length"}}},{"kind":"Argument","name":{"kind":"Name","value":"hideFromMainPage"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hideFromMainPage"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"views"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"categoryTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"leadText"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"publishedHumanFormat"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"innovationCircleUrl"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"postBadge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"postBadgeTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"showShares"}},{"kind":"Field","name":{"kind":"Name","value":"showStats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postsCount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CategoryQueryQuery, CategoryQueryQueryVariables>;
export const CategoryPagePostsQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CategoryPagePostsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"length"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hideFromMainPage"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"NullValue"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"StringValue","value":"postPublishedTime","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"length"},"value":{"kind":"Variable","name":{"kind":"Name","value":"length"}}},{"kind":"Argument","name":{"kind":"Name","value":"hideFromMainPage"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hideFromMainPage"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"views"}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"publishedHumanFormat"}},{"kind":"Field","name":{"kind":"Name","value":"leadText"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"innovationCircleUrl"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"categoryTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"postBadge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"postBadgeTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"showShares"}},{"kind":"Field","name":{"kind":"Name","value":"showStats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postsCount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CategoryPagePostsQueryQuery, CategoryPagePostsQueryQueryVariables>;
export const CoinMetaQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CoinMetaQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"coin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CoinMetaQueryQuery, CoinMetaQueryQueryVariables>;
export const CoinPriceIndexPageDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CoinPriceIndexPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageUrl"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"coinSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"guideSlug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"defaultValue":{"kind":"StringValue","value":"","block":false}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"defaultValue":{"kind":"StringValue","value":"en","block":false}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slugsMap"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"defaultValue":{"kind":"ListValue","values":[]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"i18n"},"name":{"kind":"Name","value":"translates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slugs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slugsMap"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"seoMeta"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageUrl"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"seoMetaUrl"}},{"kind":"Field","name":{"kind":"Name","value":"seoMetaTitle"}},{"kind":"Field","name":{"kind":"Name","value":"seoMetaDescription"}},{"kind":"Field","name":{"kind":"Name","value":"seoMetaKeywords"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"posts"},"name":{"kind":"Name","value":"tag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"coinSlug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"postsByTime"},"name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"IntValue","value":"0"}},{"kind":"Argument","name":{"kind":"Name","value":"length"},"value":{"kind":"IntValue","value":"5"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"views"}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"publishedHumanFormat"}},{"kind":"Field","name":{"kind":"Name","value":"leadText"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"postBadge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"postBadgeTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"showShares"}},{"kind":"Field","name":{"kind":"Name","value":"showStats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postsCount"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"postsByViews"},"name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"StringValue","value":"postViews","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"IntValue","value":"0"}},{"kind":"Argument","name":{"kind":"Name","value":"length"},"value":{"kind":"IntValue","value":"5"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"views"}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"publishedHumanFormat"}},{"kind":"Field","name":{"kind":"Name","value":"leadText"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"postBadge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"postBadgeTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"showShares"}},{"kind":"Field","name":{"kind":"Name","value":"showStats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postsCount"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"guideCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"guideSlug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"translate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guides"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"coverImg"}},{"kind":"Field","name":{"kind":"Name","value":"coverImgCaption"}},{"kind":"Field","name":{"kind":"Name","value":"translate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CoinPriceIndexPageQuery, CoinPriceIndexPageQueryVariables>;
export const EditorsChoiceQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EditorsChoiceQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editorsPosts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"publishedHumanFormat"}}]}}]}}]}}]}}]} as unknown as DocumentNode<EditorsChoiceQueryQuery, EditorsChoiceQueryQueryVariables>;
export const EventsFilterDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EventsFilter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"eventCities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"eventMonths"}},{"kind":"Field","name":{"kind":"Name","value":"eventCountries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"code2"}}]}}]}}]}}]} as unknown as DocumentNode<EventsFilterQuery, EventsFilterQueryVariables>;
export const GlossaryPageQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GlossaryPageQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"glossary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"link"}}]}}]}}]}}]} as unknown as DocumentNode<GlossaryPageQueryQuery, GlossaryPageQueryQueryVariables>;
export const AllGuideCategoriesDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllGuideCategories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allGuideCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"guidesCount"}},{"kind":"Field","name":{"kind":"Name","value":"translate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AllGuideCategoriesQuery, AllGuideCategoriesQueryVariables>;
export const GuideCategoryOrGuideDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GuideCategoryOrGuide"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guideCategoryOrGuide"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GuideCategory"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"translate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Guide"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"coverImg"}},{"kind":"Field","name":{"kind":"Name","value":"coverImgCaption"}},{"kind":"Field","name":{"kind":"Name","value":"socialImg"}},{"kind":"Field","name":{"kind":"Name","value":"socialImgCaption"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"translate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"about"}},{"kind":"Field","name":{"kind":"Name","value":"fullText"}},{"kind":"Field","name":{"kind":"Name","value":"seoTitle"}},{"kind":"Field","name":{"kind":"Name","value":"seoKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"seoDescription"}},{"kind":"Field","name":{"kind":"Name","value":"published"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GuideCategoryOrGuideQuery, GuideCategoryOrGuideQueryVariables>;
export const PaginatedGuidesDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PaginatedGuides"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"guideCategorySlug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"length"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sorting"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SortEnum"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guides"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"guideCategorySlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"guideCategorySlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"length"},"value":{"kind":"Variable","name":{"kind":"Name","value":"length"}}},{"kind":"Argument","name":{"kind":"Name","value":"sorting"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sorting"}}},{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasMoreGuides"}},{"kind":"Field","name":{"kind":"Name","value":"guidesCount"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"coverImg"}},{"kind":"Field","name":{"kind":"Name","value":"coverImgCaption"}},{"kind":"Field","name":{"kind":"Name","value":"translate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<PaginatedGuidesQuery, PaginatedGuidesQueryVariables>;
export const InfiniteScrollArticlesQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InfiniteScrollArticlesQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"promo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"beforePostId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categorySlug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"relatedLength"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"length"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"StringValue","value":"postPublishedTime","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"promo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"promo"}}},{"kind":"Argument","name":{"kind":"Name","value":"beforePostId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"beforePostId"}}},{"kind":"Argument","name":{"kind":"Name","value":"categorySlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categorySlug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasMorePosts"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"views"}},{"kind":"Field","name":{"kind":"Name","value":"pixelUrl"}},{"kind":"Field","name":{"kind":"Name","value":"postOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"hideDisclaimer"}},{"kind":"Field","name":{"kind":"Name","value":"isPromo"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"alternates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"short"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"leadText"}},{"kind":"Field","name":{"kind":"Name","value":"twitterLeadText"}},{"kind":"Field","name":{"kind":"Name","value":"facebookLeadText"}},{"kind":"Field","name":{"kind":"Name","value":"bodyText"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"socialDescription"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"youtube"}},{"kind":"Field","name":{"kind":"Name","value":"audio"}},{"kind":"Field","name":{"kind":"Name","value":"editorsPriority"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"publishedHumanFormat"}},{"kind":"Field","name":{"kind":"Name","value":"facebookShares"}},{"kind":"Field","name":{"kind":"Name","value":"twitterShares"}},{"kind":"Field","name":{"kind":"Name","value":"redditShares"}},{"kind":"Field","name":{"kind":"Name","value":"totalShares"}},{"kind":"Field","name":{"kind":"Name","value":"noIndex"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"innovationCircleUrl"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postBadge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"postBadgeTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"categoryTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"tagTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"topics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selection"}},{"kind":"Field","name":{"kind":"Name","value":"post"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"views"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"leadText"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"relatedPosts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"length"},"value":{"kind":"Variable","name":{"kind":"Name","value":"relatedLength"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"showShares"}},{"kind":"Field","name":{"kind":"Name","value":"showStats"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]}}]}}]} as unknown as DocumentNode<InfiniteScrollArticlesQueryQuery, InfiniteScrollArticlesQueryQueryVariables>;
export const InnovationCirclePostsDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"innovationCirclePosts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"length"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"relatedLength"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"length"},"value":{"kind":"Variable","name":{"kind":"Name","value":"length"}}},{"kind":"Argument","name":{"kind":"Name","value":"place"},"value":{"kind":"StringValue","value":"innovation-circle","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"views"}},{"kind":"Field","name":{"kind":"Name","value":"pixelUrl"}},{"kind":"Field","name":{"kind":"Name","value":"postOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"hideDisclaimer"}},{"kind":"Field","name":{"kind":"Name","value":"isPromo"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"alternates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"short"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"leadText"}},{"kind":"Field","name":{"kind":"Name","value":"twitterLeadText"}},{"kind":"Field","name":{"kind":"Name","value":"facebookLeadText"}},{"kind":"Field","name":{"kind":"Name","value":"bodyText"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"socialDescription"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"youtube"}},{"kind":"Field","name":{"kind":"Name","value":"audio"}},{"kind":"Field","name":{"kind":"Name","value":"editorsPriority"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"publishedHumanFormat"}},{"kind":"Field","name":{"kind":"Name","value":"facebookShares"}},{"kind":"Field","name":{"kind":"Name","value":"twitterShares"}},{"kind":"Field","name":{"kind":"Name","value":"redditShares"}},{"kind":"Field","name":{"kind":"Name","value":"totalShares"}},{"kind":"Field","name":{"kind":"Name","value":"noIndex"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"innovationCircleUrl"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postBadge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"postBadgeTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"categoryTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"IntValue","value":"0"}},{"kind":"Argument","name":{"kind":"Name","value":"length"},"value":{"kind":"IntValue","value":"10"}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"StringValue","value":"postPublishedTime","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"views"}},{"kind":"Field","name":{"kind":"Name","value":"pixelUrl"}},{"kind":"Field","name":{"kind":"Name","value":"alternates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"short"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"leadText"}},{"kind":"Field","name":{"kind":"Name","value":"twitterLeadText"}},{"kind":"Field","name":{"kind":"Name","value":"facebookLeadText"}},{"kind":"Field","name":{"kind":"Name","value":"bodyText"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"socialDescription"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"youtube"}},{"kind":"Field","name":{"kind":"Name","value":"audio"}},{"kind":"Field","name":{"kind":"Name","value":"editorsPriority"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"publishedHumanFormat"}},{"kind":"Field","name":{"kind":"Name","value":"totalShares"}},{"kind":"Field","name":{"kind":"Name","value":"noIndex"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postBadge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"postBadgeTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"categoryTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"tagTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"showShares"}},{"kind":"Field","name":{"kind":"Name","value":"showStats"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postsCount"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"tagTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"topics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selection"}},{"kind":"Field","name":{"kind":"Name","value":"post"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"views"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"leadText"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"relatedPosts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"length"},"value":{"kind":"Variable","name":{"kind":"Name","value":"relatedLength"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"showShares"}},{"kind":"Field","name":{"kind":"Name","value":"showStats"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postsCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasMorePosts"}}]}}]}}]}}]} as unknown as DocumentNode<InnovationCirclePostsQuery, InnovationCirclePostsQueryVariables>;
export const LanguagesQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LanguagesQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"languages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"gaCode"}},{"kind":"Field","name":{"kind":"Name","value":"robots"}},{"kind":"Field","name":{"kind":"Name","value":"short"}},{"kind":"Field","name":{"kind":"Name","value":"subscribes"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}}]}}]}}]}}]} as unknown as DocumentNode<LanguagesQueryQuery, LanguagesQueryQueryVariables>;
export const LocalPostsQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LocalPostsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"length"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"localPosts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"alternates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"short"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"length"},"value":{"kind":"Variable","name":{"kind":"Name","value":"length"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"views"}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"leadText"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"postBadge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"postBadgeTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"showShares"}},{"kind":"Field","name":{"kind":"Name","value":"showStats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postsCount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<LocalPostsQueryQuery, LocalPostsQueryQueryVariables>;
export const LocalPostsPageQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LocalPostsPageQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"length"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"localPosts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"keywords"}},{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"alternates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"short"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"length"},"value":{"kind":"Variable","name":{"kind":"Name","value":"length"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"views"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"categoryTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"leadText"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"innovationCircleUrl"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"postBadge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"postBadgeTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"showShares"}},{"kind":"Field","name":{"kind":"Name","value":"showStats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postsCount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<LocalPostsPageQueryQuery, LocalPostsPageQueryQueryVariables>;
export const MainPageCarouselQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MainPageCarouselQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"carouselPosts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"publishedHumanFormat"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"categoryTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<MainPageCarouselQueryQuery, MainPageCarouselQueryQueryVariables>;
export const MainPagePostsQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MainPagePostsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"length"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"place"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"defaultValue":{"kind":"StringValue","value":"index","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"StringValue","value":"postPublishedTime","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"length"},"value":{"kind":"Variable","name":{"kind":"Name","value":"length"}}},{"kind":"Argument","name":{"kind":"Name","value":"place"},"value":{"kind":"Variable","name":{"kind":"Name","value":"place"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"publishedHumanFormat"}},{"kind":"Field","name":{"kind":"Name","value":"leadText"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"innovationCircleUrl"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"categoryTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"postBadge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"postBadgeTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"postsCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasMorePosts"}}]}}]}}]}}]} as unknown as DocumentNode<MainPagePostsQueryQuery, MainPagePostsQueryQueryVariables>;
export const MainPageReleasesQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MainPageReleasesQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"length"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hideFromMainPage"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"BooleanValue","value":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"pressReleases"},"name":{"kind":"Name","value":"category"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"StringValue","value":"press-releases","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"releasesCategoryFields"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"marketReleases"},"name":{"kind":"Name","value":"category"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"StringValue","value":"market-releases","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"releasesCategoryFields"}}]}}]}}]}},...ReleasesCategoryFieldsFragmentDoc.definitions]} as unknown as DocumentNode<MainPageReleasesQueryQuery, MainPageReleasesQueryQueryVariables>;
export const MarketsPageQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MarketsPageQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageUrl"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"defaultValue":{"kind":"StringValue","value":"en","block":false}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slugsMap"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"defaultValue":{"kind":"ListValue","values":[]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"i18n"},"name":{"kind":"Name","value":"translates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slugs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slugsMap"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"seoMeta"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageUrl"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"seoMetaUrl"}},{"kind":"Field","name":{"kind":"Name","value":"seoMetaTitle"}},{"kind":"Field","name":{"kind":"Name","value":"seoMetaDescription"}},{"kind":"Field","name":{"kind":"Name","value":"seoMetaKeywords"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"markets"},"name":{"kind":"Name","value":"tag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"StringValue","value":"markets","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"postsByTime"},"name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"IntValue","value":"0"}},{"kind":"Argument","name":{"kind":"Name","value":"length"},"value":{"kind":"IntValue","value":"6"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"views"}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"publishedHumanFormat"}},{"kind":"Field","name":{"kind":"Name","value":"leadText"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"postBadge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"postBadgeTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"showShares"}},{"kind":"Field","name":{"kind":"Name","value":"showStats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postsCount"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"postsByViews"},"name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"StringValue","value":"postViews","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"IntValue","value":"0"}},{"kind":"Argument","name":{"kind":"Name","value":"length"},"value":{"kind":"IntValue","value":"5"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"views"}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"publishedHumanFormat"}},{"kind":"Field","name":{"kind":"Name","value":"leadText"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"postBadge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"postBadgeTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"showShares"}},{"kind":"Field","name":{"kind":"Name","value":"showStats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postsCount"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"trading101"},"name":{"kind":"Name","value":"tag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"StringValue","value":"trading101","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"postsByTime"},"name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"IntValue","value":"0"}},{"kind":"Argument","name":{"kind":"Name","value":"length"},"value":{"kind":"IntValue","value":"12"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"views"}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"publishedHumanFormat"}},{"kind":"Field","name":{"kind":"Name","value":"leadText"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"postBadge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"postBadgeTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"showShares"}},{"kind":"Field","name":{"kind":"Name","value":"showStats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postsCount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MarketsPageQueryQuery, MarketsPageQueryQueryVariables>;
export const MenuQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MenuQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menu"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menuType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"badgeType"}},{"kind":"Field","name":{"kind":"Name","value":"rel"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"inNewTab"}},{"kind":"Field","name":{"kind":"Name","value":"titleTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MenuQueryQuery, MenuQueryQueryVariables>;
export const NewsRotatorQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NewsRotatorQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"promo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editorsPosts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"publishedHumanFormat"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"categoryTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"hotPosts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"promo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"promo"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"publishedHumanFormat"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"categoryTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"views"}},{"kind":"Field","name":{"kind":"Name","value":"showShares"}},{"kind":"Field","name":{"kind":"Name","value":"showStats"}}]}}]}}]}}]} as unknown as DocumentNode<NewsRotatorQueryQuery, NewsRotatorQueryQueryVariables>;
export const PodcastQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PodcastQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"podcast"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tag"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"buzzsproutPodcast"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"buzzsproutPodcastFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"authorsWithDesc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"authorWithDescFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"apple"}},{"kind":"Field","name":{"kind":"Name","value":"spotify"}},{"kind":"Field","name":{"kind":"Name","value":"google"}},{"kind":"Field","name":{"kind":"Name","value":"amazonMusic"}},{"kind":"Field","name":{"kind":"Name","value":"audible"}},{"kind":"Field","name":{"kind":"Name","value":"iheartradio"}},{"kind":"Field","name":{"kind":"Name","value":"tunein"}},{"kind":"Field","name":{"kind":"Name","value":"podcastAddict"}},{"kind":"Field","name":{"kind":"Name","value":"podchaser"}},{"kind":"Field","name":{"kind":"Name","value":"podcastIndex"}},{"kind":"Field","name":{"kind":"Name","value":"pocketCasts"}},{"kind":"Field","name":{"kind":"Name","value":"deezer"}},{"kind":"Field","name":{"kind":"Name","value":"listenNotes"}},{"kind":"Field","name":{"kind":"Name","value":"playerfm"}},{"kind":"Field","name":{"kind":"Name","value":"overcast"}},{"kind":"Field","name":{"kind":"Name","value":"castro"}},{"kind":"Field","name":{"kind":"Name","value":"castbox"}},{"kind":"Field","name":{"kind":"Name","value":"podfriend"}},{"kind":"Field","name":{"kind":"Name","value":"goodpods"}},{"kind":"Field","name":{"kind":"Name","value":"disclaimerPrefix"}}]}}]}}]}},...BuzzsproutPodcastFieldsFragmentDoc.definitions,...AuthorWithDescFieldsFragmentDoc.definitions]} as unknown as DocumentNode<PodcastQueryQuery, PodcastQueryQueryVariables>;
export const PodcastsQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PodcastsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"podcasts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tag"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"tag"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"buzzsproutPodcast"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"buzzsproutPodcastFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"authorsWithDesc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"authorWithDescFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"disclaimerPrefix"}},{"kind":"Field","name":{"kind":"Name","value":"apple"}},{"kind":"Field","name":{"kind":"Name","value":"google"}},{"kind":"Field","name":{"kind":"Name","value":"tunein"}},{"kind":"Field","name":{"kind":"Name","value":"spotify"}}]}}]}}]}},...BuzzsproutPodcastFieldsFragmentDoc.definitions,...AuthorWithDescFieldsFragmentDoc.definitions]} as unknown as DocumentNode<PodcastsQueryQuery, PodcastsQueryQueryVariables>;
export const QrCodeQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"QrCodeQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"qrCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]}}]} as unknown as DocumentNode<QrCodeQueryQuery, QrCodeQueryQueryVariables>;
export const RelatedPostsQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RelatedPostsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"excludeIds"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"defaultValue":{"kind":"ListValue","values":[]}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"relatedLength"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"relatedPosts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}},{"kind":"Argument","name":{"kind":"Name","value":"excludeIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"excludeIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"length"},"value":{"kind":"Variable","name":{"kind":"Name","value":"relatedLength"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"innovationCircleUrl"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<RelatedPostsQueryQuery, RelatedPostsQueryQueryVariables>;
export const SearchPagePostsQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchPagePostsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"defaultValue":{"kind":"StringValue","value":"en","block":false}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"length"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postsSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"length"},"value":{"kind":"Variable","name":{"kind":"Name","value":"length"}}},{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"views"}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"leadText"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"publishedHumanFormat"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"categoryTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"postBadge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"postBadgeTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"showShares"}},{"kind":"Field","name":{"kind":"Name","value":"showStats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postsCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasMorePosts"}}]}}]}}]}}]} as unknown as DocumentNode<SearchPagePostsQueryQuery, SearchPagePostsQueryQueryVariables>;
export const SeoMetaQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SeoMetaQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"seoMeta"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"seoMetaUrl"}},{"kind":"Field","name":{"kind":"Name","value":"seoMetaTitle"}},{"kind":"Field","name":{"kind":"Name","value":"seoMetaDescription"}},{"kind":"Field","name":{"kind":"Name","value":"seoMetaKeywords"}}]}}]}}]}}]} as unknown as DocumentNode<SeoMetaQueryQuery, SeoMetaQueryQueryVariables>;
export const SettingsQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SettingsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slugs"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"settings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slugs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slugs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<SettingsQueryQuery, SettingsQueryQueryVariables>;
export const SocialLinksDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SocialLinks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"socialLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"facebookUrl"}},{"kind":"Field","name":{"kind":"Name","value":"twitterUrl"}},{"kind":"Field","name":{"kind":"Name","value":"telegramUrl"}},{"kind":"Field","name":{"kind":"Name","value":"linkedinUrl"}},{"kind":"Field","name":{"kind":"Name","value":"googlePlusUrl"}},{"kind":"Field","name":{"kind":"Name","value":"youtubeUrl"}},{"kind":"Field","name":{"kind":"Name","value":"twitterAccount"}},{"kind":"Field","name":{"kind":"Name","value":"telegramAccount"}}]}}]}}]}}]} as unknown as DocumentNode<SocialLinksQuery, SocialLinksQueryVariables>;
export const StaticPageDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StaticPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"staticPage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"socialImg"}},{"kind":"Field","name":{"kind":"Name","value":"socialImgCaption"}},{"kind":"Field","name":{"kind":"Name","value":"coverImg"}},{"kind":"Field","name":{"kind":"Name","value":"coverImgCaption"}},{"kind":"Field","name":{"kind":"Name","value":"about"}},{"kind":"Field","name":{"kind":"Name","value":"seoTitle"}},{"kind":"Field","name":{"kind":"Name","value":"seoKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"seoDescription"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]}}]}}]} as unknown as DocumentNode<StaticPageQuery, StaticPageQueryVariables>;
export const TagPageQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TagPageQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"length"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"redirectRelativeUrl"}},{"kind":"Field","name":{"kind":"Name","value":"alternates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"short"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tagTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"metaTitle"}},{"kind":"Field","name":{"kind":"Name","value":"pageTitle"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"metaDescription"}},{"kind":"Field","name":{"kind":"Name","value":"keywords"}}]}},{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"length"},"value":{"kind":"Variable","name":{"kind":"Name","value":"length"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"views"}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"publishedHumanFormat"}},{"kind":"Field","name":{"kind":"Name","value":"leadText"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"postBadge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"postBadgeTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"showShares"}},{"kind":"Field","name":{"kind":"Name","value":"showStats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postsCount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<TagPageQueryQuery, TagPageQueryQueryVariables>;
export const TagPagePostsQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TagPagePostsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"length"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"length"},"value":{"kind":"Variable","name":{"kind":"Name","value":"length"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"views"}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"publishedHumanFormat"}},{"kind":"Field","name":{"kind":"Name","value":"leadText"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"postBadge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"postBadgeTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"showShares"}},{"kind":"Field","name":{"kind":"Name","value":"showStats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postsCount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<TagPagePostsQueryQuery, TagPagePostsQueryQueryVariables>;
export const TickersGraphsQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TickersGraphsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"widgetType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fiatCurrencies"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tickerMeta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"coinSymbols"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"graphs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"widgetType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"widgetType"}}},{"kind":"Argument","name":{"kind":"Name","value":"fiatCurrencies"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fiatCurrencies"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fiatCurrencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"graph"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<TickersGraphsQueryQuery, TickersGraphsQueryQueryVariables>;
export const TickersMetaQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TickersMetaQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tickerMeta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"defaultCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"currencySymbols"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sign"}}]}},{"kind":"Field","name":{"kind":"Name","value":"coinSymbols"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"decimals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}}]}},{"kind":"Field","name":{"kind":"Name","value":"decimalsHeaderMobile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}}]}},{"kind":"Field","name":{"kind":"Name","value":"decimalsHeaderDesktop"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tag"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"guideSlug"}},{"kind":"Field","name":{"kind":"Name","value":"tickersDesktop"}},{"kind":"Field","name":{"kind":"Name","value":"tickersMobile"}}]}}]}}]}}]}}]} as unknown as DocumentNode<TickersMetaQueryQuery, TickersMetaQueryQueryVariables>;
export const TranslateQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TranslateQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slugs"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"translates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slugs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slugs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<TranslateQueryQuery, TranslateQueryQueryVariables>;
export const UniBlocksQueryDocument = /*#__PURE__*/ {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"uniBlocksQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"short"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"short"},"value":{"kind":"Variable","name":{"kind":"Name","value":"short"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"universalBlocks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"universalBlockTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"posts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"postTranslate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorTranslates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cacheKey"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<UniBlocksQueryQuery, UniBlocksQueryQueryVariables>;