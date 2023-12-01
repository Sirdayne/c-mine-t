import { DEFAULT_META } from '~/app.config';

export const getMappedMeta = (meta) => {
  if (!meta || typeof meta !== 'object') {
    return DEFAULT_META;
  }
  return {
    url: meta.seoMetaUrl || '',
    title: meta.seoMetaTitle || '',
    description: meta.seoMetaDescription || '',
    keywords: meta.seoMetaKeywords || '',
  };
};
