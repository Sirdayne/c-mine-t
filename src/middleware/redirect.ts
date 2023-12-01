import { defineNuxtMiddleware } from '~/lib/framework';

export const REDIRECT_MAP: Record<string, string> = {
  '/tags/press-release': '/press-releases',
  '/bitcoin-price-index': '/bitcoin-price',
  '/ethereum-price-index': '/ethereum-price',

  // TODO: temporary for CDT-2832
  '/news/phygital-nft-store-debuts-in-dubai-mall': '/phygital-nft-store-debuts-in-dubai-mall',
  // TODO: temporary for CDT-3225
  '/news/pioneering-the-future-of-web3-with-quicknode-and-polygon-labs':
    '/pioneering-the-future-of-web3-with-quicknode-and-polygon-labs',
  // TODO: temporary for CDT-3476
  '/news/esports-evolution-is-on-the-way-with-moxy': '/esports-evolution-is-on-the-way-with-moxy',
  // TODO: temporary for CDT-3789
  '/news/camino-network-hub': '/sponsored/camino-network-hub',
};

export default defineNuxtMiddleware(async ({ route, redirect }) => {
  const to = REDIRECT_MAP[route.path];

  if (to) {
    // do full page load on client-side because some paths handled by main
    if (typeof globalThis.location === 'object') {
      globalThis.location.pathname = to;

      // blocks navigation forever to prevent 404
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      await new Promise(() => {});
    } else {
      redirect(to);
    }
  }
});
