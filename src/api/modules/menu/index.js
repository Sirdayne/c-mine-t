import { fetchQuery } from '~/api/modules/shared';
import menuQuery from '~/graphql/queries/menu.graphql';
import getProperty from '~/assets/libs/getProperty';
import { getMappedMenu } from '~/assets/helpers/menu';
import { HOUR } from '~/assets/helpers/timeConstants';

export const fetchMobileMenu = async (options = {}) => {
  const { languageShort, apolloTransport } = options;
  const { status, errors, data } = await fetchQuery({
    defaultData: {
      menu: [],
    },
    query: menuQuery,
    variables: {
      menuType: 'headerMobile',
    },
    languageShort,
    apolloTransport,
    sentryTag: 'fetch-mobile-menu',
    cacheTimeInMS: HOUR,
  });
  const menu = getProperty(data, 'menu', []);
  return {
    status,
    errors,
    data: getMappedMenu(menu),
  };
};

export const fetchDesktopMenu = async (options = {}) => {
  const { languageShort, apolloTransport } = options;
  const { status, errors, data } = await fetchQuery({
    defaultData: {
      menu: [],
    },
    query: menuQuery,
    variables: {
      menuType: 'header',
    },
    languageShort,
    apolloTransport,
    sentryTag: 'fetch-desktop-menu',
    cacheTimeInMS: HOUR,
  });
  const menu = getProperty(data, 'menu', []);
  return {
    status,
    errors,
    data: getMappedMenu(menu),
  };
};

export const fetchFooterMenu = async (options = {}) => {
  const { languageShort, apolloTransport } = options;
  const { status, errors, data } = await fetchQuery({
    defaultData: {
      menu: [],
    },
    query: menuQuery,
    variables: {
      menuType: 'footer',
    },
    languageShort,
    apolloTransport,
    sentryTag: 'fetch-footer-menu',
    cacheTimeInMS: HOUR,
  });
  const menu = getProperty(data, 'menu', []);
  return {
    status,
    errors,
    data: getMappedMenu(menu),
  };
};
