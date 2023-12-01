import sample from 'lodash/sample';
import getProperty from '~/assets/libs/getProperty';
import { encodeToBase64 } from '~/assets/libs/base64';
import { getThumbnail } from '~/assets/libs/getThumbnail';
import {
  MAIN_PAGE_POSTS_POSITIONS_DESKTOP,
  MAIN_PAGE_POSTS_POSITIONS_MOBILE,
  MAIN_PAGE_POSTS_POSITIONS_MOBILE_JP,
  BANNER_TYPES,
  BANNER_PLACES,
  BANNERS_SIZES,
} from '~/app.config';
import parseJSON from '~/assets/libs/parseJSON';

const PROMO_BUTTONS = [
  'etoro-button',
  'etoro2-button',
  'etoro3-button',
  'hitbtc-button',
  'changelly-button',
  'crypto-button',
  'nexo-button',
  'tokenbox-button',
  'binance-button',
  'ledger-button',
  'okex-button',
  'syncbond-button',
  'bybit-button',
  'bybit2-button',
  'coinapp-button',
  'nbc-button',
  'exodus-button',
  'coinsmart-button',
  'aml-button',
  'coinsquare-button',
  'stoic-button',
  'coinloan-button',
  'crypto-com-button',
  'coinbase-button',
  'nebeus-button',
  'kucoin-button',
  'crescent-button',
  'uphold-button',
  'xgo-button',
  'bitget-button',
  'adbutler',
];

const getBannersIdsMap = (banners = []) => {
  return banners.reduce((acc, { priority = 0, weight = 0, id }) => {
    if (!weight) {
      return acc;
    }
    const bannerValues = Array.from({ length: weight }, () => id);
    if (!acc.has(priority)) {
      acc.set(priority, bannerValues);
    } else {
      acc.set(priority, [...acc.get(priority), ...bannerValues]);
    }
    return acc;
  }, new Map());
};

export const getIdFromAdbutlerCode = (string = '') => {
  const [, id] = /window\.plc(\d+)/g.exec(string) || [];
  return id;
};

export const tryParseAdbutlerZoneId = (bannerOptions) => {
  for (const key in bannerOptions) {
    const value = bannerOptions[key];
    const maybeZoneId = typeof value === 'string' && value.split('adbutler://')[1];

    if (maybeZoneId) return maybeZoneId;
  }

  return null;
};

/**
 *
 * @param {import('~/graphql').Banner} graphqlBanner Banner type from GraphQL scheme
 * @returns {{ graphqlBanner: import('~/graphql').Banner }}
 */
export const getMappedBannerOptions = (graphqlBanner) => {
  if (!graphqlBanner || typeof graphqlBanner !== 'object') {
    return null;
  }
  const parsedAdbutlerZoneId = tryParseAdbutlerZoneId(graphqlBanner);
  const type = graphqlBanner.bannerType;
  const isImage = type === BANNER_TYPES.IMAGE;
  const isHtml = type === BANNER_TYPES.HTML5;
  const isWidget = type === BANNER_TYPES.WIDGET;
  const isSidePromoButton = isWidget && PROMO_BUTTONS.includes(graphqlBanner.bannerUrl);
  const isStretch = type === BANNER_TYPES.STRETCH;
  const isAdbutler = type === BANNER_TYPES.ADBUTLER;
  const isAdbutlerYoutube = type === BANNER_TYPES.ADBUTLER_YOUTUBE;
  const isPromoButton = type === BANNER_TYPES.PROMO_BUTTON;
  const isPromoButtonStack = type === BANNER_TYPES.PROMO_BUTTON_STACK;
  const isSticky = type === BANNER_TYPES.INDEX_STICKY;
  const hasAnything =
    isImage ||
    isHtml ||
    isWidget ||
    isStretch ||
    isAdbutler ||
    isAdbutlerYoutube ||
    isPromoButton ||
    isPromoButtonStack ||
    isSticky;

  if (!hasAnything) {
    return null;
  }

  let trackingPixelUrl = '';
  let widgetType = '';
  let youtubeVideoId = '';
  let stretchType = '';

  let adbutlerZoneIdFromCode = null;

  if (isWidget) {
    widgetType = graphqlBanner.bannerUrl;
  }

  if (isAdbutler || isAdbutlerYoutube) {
    adbutlerZoneIdFromCode = getIdFromAdbutlerCode(graphqlBanner.bannerCode);
  }

  if (isSticky) {
    trackingPixelUrl = graphqlBanner.bannerImage;
  }
  const parsedOptions = parseJSON({
    inputValue: graphqlBanner.bannerOptions,
    defaultValue: null,
  });
  return {
    id: graphqlBanner.id,
    type,
    isImage,
    isHtml,
    isWidget,
    isSidePromoButton,
    isStretch,
    isAdbutler,
    isAdbutlerYoutube,
    isPromoButton,
    isPromoButtonStack,
    isSticky,
    place: graphqlBanner.bannerPlace,
    url: graphqlBanner.bannerUrl,
    base64: encodeToBase64(graphqlBanner.bannerUrl),
    image: graphqlBanner.bannerImage,
    title: graphqlBanner.bannerTitle,
    comment: graphqlBanner.bannerComment,
    priority: graphqlBanner.bannerPriority,
    weight: graphqlBanner.bannerWeight,
    code: graphqlBanner.bannerCode,
    options: parsedOptions,
    trackingPixelUrl,
    youtubeVideoId,
    widgetType,
    stretchType,
    adbutlerZoneId: parsedAdbutlerZoneId || adbutlerZoneIdFromCode,
    graphqlBanner: graphqlBanner,
  };
};

export const getMappedAdbutlerData = (placements, options) => {
  const bannerData = getProperty(placements, 'placement_1', null);
  const place = getProperty(options, 'place', '');
  if (!bannerData || typeof bannerData !== 'object') {
    return null;
  }
  const imageUrl = bannerData.image_url;
  const imageWidth = place ? BANNERS_SIZES[place] : bannerData.width;
  const isImage = !!imageUrl;
  let imageRetinaUrl = '';
  if (imageUrl) {
    const baseImageUrl = getThumbnail({
      imageUrl: bannerData.image_url,
      width: imageWidth,
    });
    const retinaImageUrl = getThumbnail({
      imageUrl: bannerData.image_url,
      width: imageWidth * 2,
    });
    imageRetinaUrl = `${baseImageUrl} 1x, ${retinaImageUrl} 2x`;
  }
  let redirectUrl = '';
  let redirectBase64Url = '';
  if (bannerData.redirect_url) {
    redirectUrl = bannerData.redirect_url.replace(/^.*https:\/\/servedbyadbutler/g, 'https://servedbyadbutler');
    redirectBase64Url = encodeToBase64(redirectUrl);
  }
  const isHtml = !!bannerData.body;
  return {
    id: bannerData.id,
    isImage,
    isHtml,
    imageUrl,
    imageRetinaUrl,
    imageWidth,
    imageHeight: bannerData.height,
    imageAlt: bannerData.alt_text,
    redirectUrl,
    redirectBase64Url,
    target: bannerData.target,
    trackingPixelUrl: bannerData.tracking_pixel,
    code: bannerData.body,
    accompaniedHtml: bannerData.accompanied_html,
    options: options || {},
  };
};

export const getMainBannerPositions = (options) => {
  const isMobile = getProperty(options, 'isMobile', true);
  const isJp = getProperty(options, 'isJp', false);
  let positions;
  if (isMobile && isJp) {
    positions = MAIN_PAGE_POSTS_POSITIONS_MOBILE_JP;
  } else if (isMobile) {
    positions = MAIN_PAGE_POSTS_POSITIONS_MOBILE;
  } else {
    positions = MAIN_PAGE_POSTS_POSITIONS_DESKTOP;
  }
  return positions.slice();
};

export const reduceBannersByPriorityAndWeight = (banners = []) => {
  const bannersIds = getBannersIdsMap(banners);
  const idsGroupedByPriority = Array.from(bannersIds.values());
  return idsGroupedByPriority.reduce((acc, ids) => {
    const sampleId = sample(ids);
    const sampleBanner = banners.find(({ id }) => id === sampleId);
    return acc.push(sampleBanner) && acc;
  }, []);
};

export const sortBannersByPriority = (banners = []) => {
  return banners.sort((a, b) => a.priority - b.priority);
};

/**
 * @param {boolean} ssr Get banners for SSR or CSR
 */
export const getBannersPlaces = () => {
  return [
    BANNER_PLACES.MAIN_POSTS_DESKTOP,
    BANNER_PLACES.MAIN_POSTS_MOBILE,
    BANNER_PLACES.MAIN_POSTS_NON_STRETCH_MOBILE,
    BANNER_PLACES.MAIN_STICKY,
    BANNER_PLACES.LEADERBOARD_DESKTOP,
    BANNER_PLACES.LEADERBOARD_MOBILE,
    BANNER_PLACES.PROMO_BUTTON_INDEX_MOBILE,
    BANNER_PLACES.BETWEEN_POSTS_MOBILE,
    BANNER_PLACES.BETWEEN_POSTS_YOUTUBE_MOBILE,
    BANNER_PLACES.PROMO_BUTTON_ARTICLE_MOBILE,
    BANNER_PLACES.BETWEEN_POSTS_DESKTOP,
    BANNER_PLACES.PROMO_BUTTON_TAG_DESKTOP,
    BANNER_PLACES.PROMO_BUTTON_TAG_MOBILE,
    BANNER_PLACES.PROMO_BUTTON_CATEGORY_DESKTOP,
    BANNER_PLACES.PROMO_BUTTON_CATEGORY_MOBILE,
    BANNER_PLACES.PROMO_BUTTON_STACK_INDEX_MOBILE,
    BANNER_PLACES.PROMO_BUTTON_STACK_ARTICLE_MOBILE,
    BANNER_PLACES.PROMO_BUTTON_STACK_TAG_MOBILE,
    BANNER_PLACES.SIDEBAR,
    BANNER_PLACES.HEADER_DESKTOP,
    BANNER_PLACES.PROMO_BUTTON_PRICE_INDEX_DESKTOP,
    BANNER_PLACES.PROMO_BUTTON_PRICE_INDEX_MOBILE,
    BANNER_PLACES.PROMO_BUTTON_PRICE_INDEX_CALCULATOR,
    BANNER_PLACES.PROMO_BUTTON_PRICE_INDEX_CALCULATOR_MOBILE,
    BANNER_PLACES.PROMO_BUTTON_PRICE_INDEX_OVERVIEW_DESKTOP,
    BANNER_PLACES.PROMO_BUTTON_PRICE_INDEX_OVERVIEW_MOBILE,
    BANNER_PLACES.PROMO_BUTTON_PRICE_INDEX_HISTORY_DESKTOP,
    BANNER_PLACES.PROMO_BUTTON_PRICE_INDEX_HISTORY_MOBILE,
    BANNER_PLACES.PROMO_BUTTON_PRICE_INDEXES_DESKTOP,
    BANNER_PLACES.PROMO_BUTTON_PRICE_INDEXES_MOBILE,
    BANNER_PLACES.RELATED_NEWS_SLOT_2,
    BANNER_PLACES.BILLBOARD_MOBILE,
    BANNER_PLACES.IN_ARTICLE_AFTER_30_PERCENTS_MOBILE,
    BANNER_PLACES.IN_ARTICLE_AFTER_30_PERCENTS_DESKTOP,
    BANNER_PLACES.IN_MOBILE_HEADER,
    BANNER_PLACES.AFTER_ARTICLE_BODY_MOBILE,
    BANNER_PLACES.AFTER_ARTICLE_BODY_DESKTOP,
    BANNER_PLACES.PODCASTS_MOBILE_YOUTUBE,
    BANNER_PLACES.PODCASTS_MOBILE_SQUARE_BANNER,
    BANNER_PLACES.PODCASTS_MOBILE_PROMO_BUTTON,
    BANNER_PLACES.PODCASTS_MOBILE_PROMO_BUTTONS_STACK,
    BANNER_PLACES.LIVE_DATA_POPUP_PROMO_BUTTON,
    BANNER_PLACES.LEARN_SIDEBAR_DESKTOP,
    BANNER_PLACES.LEARN_SIDEBAR_DESKTOP_PROMO_BUTTON_STACK,
  ];
};
