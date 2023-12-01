import { MAIN_PAGE_POSTS_POSITIONS_MOBILE } from '~/app.config';

export const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const swapPromoButtonWithSquareBannerPosition = (postsWithBanners: any) => {
  const positionSix = MAIN_PAGE_POSTS_POSITIONS_MOBILE[1];
  const positionNine = MAIN_PAGE_POSTS_POSITIONS_MOBILE[2];
  if (
    postsWithBanners[positionSix]?.type === 'promo_button_stack' &&
    postsWithBanners[positionNine].type === 'adbutler'
  ) {
    const temp = postsWithBanners[positionSix];
    postsWithBanners[positionSix] = postsWithBanners[positionNine];
    postsWithBanners[positionNine] = temp;
  }
  return postsWithBanners;
};

export const mergeToByPosition: any = (destination = [], source = [], positions: number[] = []) => {
  const destinationClone = destination.concat();
  const sourceClone = source.concat();
  const positionsClone = positions.concat();
  const position = positionsClone.shift();
  const banner = sourceClone.shift();
  if (position !== undefined && banner) {
    destinationClone.splice(position, 0, banner);
    return mergeToByPosition(destinationClone, sourceClone, positionsClone);
  }
  return destinationClone;
};
