/**
 * TODO: temporary implementation of Cloudflare Image Resizer
 * Should be refactored after release of CDT-2228
 */

/**
 * @param sourceImageUrl Absolute URL of original (source) image, example: https://s3.cointelegraph.com/bla-blah
 * @param width Expect width in pixels (positive integer), example: 740
 * @returns absolute URL to optimized image or `null` to fallback to legacy behaviour
 */
const getCloudflareResizedImageUrl = ({ sourceImageUrl, width }) => {
  if (!String(sourceImageUrl).includes('cointelegraph.com')) {
    return sourceImageUrl;
  }

  /**
   * Check out Cloudflare docs on how URLs should be generated
   * @see {@link https://developers.cloudflare.com/images/image-resizing/url-format/}
   */
  return `https://images.cointelegraph.com/cdn-cgi/image/format=auto,onerror=redirect,quality=90,width=${width}/${sourceImageUrl}`;
};

/**
 * @deprecated use src/lib/image
 */
export const getThumbnail = (options = {}) => {
  const { imageUrl = '', width = 740, defaultImage = '' } = options;

  if (!imageUrl) return defaultImage;

  return getCloudflareResizedImageUrl({ sourceImageUrl: imageUrl, width });
};

export const getImageSources = (options = {}) => {
  const { imageUrl, defaultImage, sizes } = options;

  if (!imageUrl) return defaultImage;

  const sizesReducer = (acc, size) => {
    return [...acc, getCloudflareResizedImageUrl({ sourceImageUrl: imageUrl, width: size })];
  };

  return sizes.map(({ media, srcset }) => ({
    media,
    srcset: srcset.reduce(sizesReducer, []).join(', '),
  }));
};
