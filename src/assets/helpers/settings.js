import getProperty from '~/assets/libs/getProperty';
import filterNoneObjects from '~/assets/libs/filterNoneObjects';

export const getMappedSettings = (options) => {
  const settings = getProperty(options, 'settings', []);
  const map = getProperty(options, 'map', {});
  const mapped = {};
  Object.entries(map).forEach(([key, value]) => {
    const { value: setting } = settings.find((item) => item.key === value) || {};
    mapped[key] = setting || value;
  });
  return mapped;
};

export const getMappedSocials = (socials) => {
  if (!socials || typeof socials !== 'object') {
    return {};
  }
  const mapped = {};
  Object.entries(socials).forEach(([key, value]) => {
    const valuesObject = getProperty(value, 'repeatableData.items', value) || {};
    mapped[key] = filterNoneObjects(Object.values(valuesObject))
      .filter((item) => item.status)
      .sort((a, b) => a.position - b.position)
      .map((item) => {
        const id = (item.iconName || item.icon).toLowerCase().replace(/\W/g, '');
        return {
          id,
          name: item.title,
          url: item.url,
          gtmClassName: item.gtmClass,
          iconName: `icon-socials-${id}`,
          allowedBreakpoints: item.sizesAllowed,
        };
      });
  });
  return mapped;
};

export const getMappedSocialsLinks = (links = {}) => {
  const facebook = getProperty(links, 'facebookUrl', '');
  const twitter = getProperty(links, 'twitterUrl', '');
  const telegram = getProperty(links, 'telegramUrl', '');
  const linkedin = getProperty(links, 'linkedinUrl', '');
  const googlePlus = getProperty(links, 'googlePlusUrl', '');
  const youtube = getProperty(links, 'youtubeUrl', '');
  const twitterAccount = getProperty(links, 'twitterAccount', '');
  const telegramAccount = getProperty(links, 'telegramAccount', '');
  return {
    facebook,
    twitter,
    telegram,
    linkedin,
    googlePlus,
    youtube,
    twitterAccount,
    telegramAccount,
  };
};
