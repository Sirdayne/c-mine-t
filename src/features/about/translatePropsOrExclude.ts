/**
 * For each given item:
 *
 * Translates specified object keys
 * using their values as translations slug
 *
 * Excludes item from array when
 * some objects have missing translations
 *
 * @param i18n from vuex
 * @param propsToTranslate keys containing i18n slugs
 * @param items items to iterate
 * @returns new array
 */
export const translatePropsOrExclude = <K extends string, T extends Record<K, string>>(
  i18n: any,
  propsToTranslate: K[],
  items: T[]
): T[] => {
  const translatedItems: T[] = [];

  for (const item of items) {
    const translatedItem = { ...item };
    let translated = true;

    for (const prop of propsToTranslate) {
      const i18nKey = item[prop];
      const translation = i18n[i18nKey];
      translated = !!translation && translation !== i18nKey;

      if (!translated) break;

      translatedItem[prop] = translation;
    }

    if (translated) translatedItems.push(translatedItem);
  }

  return translatedItems;
};
