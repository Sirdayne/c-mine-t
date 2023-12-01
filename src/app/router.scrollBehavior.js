import { getBackButtonListener } from '~/lib/shared';

const BackButtonListener = getBackButtonListener();
/**
 *
 * @param {import('vue-router').Route} to
 * @param {import('vue-router').Route} from
 * @param savedPosition
 * @returns {Promise<unknown>}
 */
export default function routerScrollBehavior(to, from, savedPosition) {
  if (to.name === from.name && to.name === 'about') return savedPosition;
  if (to.name === from.name && to.hash.length) return savedPosition;

  return new Promise((resolve) => {
    setTimeout(async () => {
      const y = await BackButtonListener.scrollToPreviousPosition();
      resolve({
        y,
        behavior: 'smooth',
      });
    }, 100);
  });
}
