export const mapDataFromI18n = (i18n = {}, mapCb = Function.prototype) => {
  const localI18n = { ...i18n };
  const entries = Object.entries(i18n);
  const items = entries
    .reduce((acc, [key, value]) => {
      const matches = key.match(/[0-9]+/);
      const index = +matches - 1;
      const newKey = key.replace(+matches, '');
      if (matches === null) {
        return acc;
      }
      acc[index] = {
        ...acc[index],
        [newKey]: value,
      };
      delete localI18n[key];
      return acc;
    }, [])
    .map(mapCb);
  return {
    items,
    i18n: localI18n,
  };
};

export const buildActionUrl = (id = '') => `https://us3.api.mailchimp.com/3.0/lists/${id}/members/`;
