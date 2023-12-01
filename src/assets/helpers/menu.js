import getProperty from '~/assets/libs/getProperty';
import { POST_BADGES } from '~/app.config';

export const getMappedMenu = (menu = []) => {
  const hierarchicalMenu = {};
  const children = [];
  menu.forEach((item) => {
    const translations = getProperty(item, 'titleTranslates[0]', {});
    const id = item.id;
    const parentId = item.parentId;
    const title = translations.value;
    const position = item.position;
    if (!parentId) {
      hierarchicalMenu[id] = {
        position,
        id,
        title,
        url: item.url,
        target: item.inNewTab ? '_blank' : '_self',
        rel: item.rel,
        isExternal: !/^\//.test(item.url),
        children: [],
      };
    } else if (title) {
      const badge = getProperty(POST_BADGES, item.badgeType, {});
      children.push({
        parentId,
        position,
        id,
        title,
        url: item.url,
        target: item.inNewTab ? '_blank' : '_self',
        rel: item.rel,
        isExternal: !/^\//.test(item.url),
        badgeType: badge.key,
        badgeI18nKey: badge.i18nKey,
      });
    }
  });
  children.forEach((item) => {
    if (hierarchicalMenu[item.parentId] !== undefined) {
      hierarchicalMenu[item.parentId].children.push(item);
    }
  });
  return Object.values(hierarchicalMenu)
    .sort((a, b) => a.position - b.position)
    .map((item) => ({
      ...item,
      children: item.children.sort((a, b) => a.position - b.position),
    }));
};
