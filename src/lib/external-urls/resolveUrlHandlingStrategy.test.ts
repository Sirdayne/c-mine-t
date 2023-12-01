import { describe, test, expect } from '@jest/globals';
import { beforeEach } from 'node:test';
import Router from 'vue-router';
import { resolveUrlHandlingStrategy, UrlHandlingStrategy } from './resolveUrlHandlingStrategy';

const INTERNAL_URLS = [
  'https://cointelegraph.com/news/btc-20k-again',
  'https://cointelegraph.com/press-releases',
  'https://cointelegraph.com/market-releases',
  'https://cointelegraph.com',
];

const EXTERNAL_URLS = [
  'https://cointelegraph.com/top-people-2023',
  'https://cointelegraph.com/magazine',
  'https://cointelegraph.com/accelerate',
  'https://cointelegraph.com/magazine',
  'https://cointelegraph.com/historical',
  'https://coindesk.com',
];

describe('resolveUrlHandlingStrategy', () => {
  /**
   * routes copy-pasted from runtime of Nuxt 2 for cointelegraph.com
   */
  const fakeRouter = new Router({
    mode: 'abstract',
    routes: [
      {
        name: 'press-releases',
        path: '/press-releases',
      },
      {
        name: 'news-slug',
        path: '/news/:slug?',
      },
      {
        name: 'index',
        path: '',
      },
      {
        name: 'all',
        path: '/*',
      },
    ],
  });

  describe('when window.location origin is cointelegraph.com', () => {
    beforeEach(() => {
      window.location.href = 'https://cointelegraph.com';
    });

    test.each(INTERNAL_URLS)('%s resolves to internal strategy', (rawInternalUrl) => {
      const internalUrl = new URL(rawInternalUrl);

      expect(resolveUrlHandlingStrategy({ toUrl: internalUrl, matcher: fakeRouter })).toBe(
        UrlHandlingStrategy.INTERNAL
      );
    });

    test.each(EXTERNAL_URLS)('%s resolves to external strategy', (rawExternalUrl) => {
      const externalUrl = new URL(rawExternalUrl);

      expect(resolveUrlHandlingStrategy({ toUrl: externalUrl, matcher: fakeRouter })).toBe(
        UrlHandlingStrategy.EXTERNAL
      );
    });
  });
});
