import { getThumbnail } from '~/assets/libs/getThumbnail';

export interface OptimizedImageOptions {
  // absolute URL to original image
  src: string;
  // image width
  width: number;
  // image height
  height: number;
}

/**
 * @returns absolute URL to optimized version of image
 */
export const buildOptimizedImageUrl = ({ src, width }: OptimizedImageOptions): string =>
  getThumbnail({
    width,
    imageUrl: src,
    defaultImage: src,
  });
