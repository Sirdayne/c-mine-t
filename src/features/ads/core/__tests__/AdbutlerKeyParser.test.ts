import { describe, expect, test } from '@jest/globals';
import {
  FAKE_GRAPHQL_BANNER_WITH_ADBUTLER_SNIPPET,
  FAKE_GRAPHQL_BANNER_WITH_ADBUTLER_URL,
  FAKE_GRAPHQL_BANNER_WITH_EDITORS_CHOICE_WIDGET,
} from '../__mocks__/fake-graphql-banners';
import { AdbutlerKeyParser, DEFAULT_ADBUTLER_ACCOUNT_ID } from '../AdbutlerKeyParser';

describe('AdbutlerKeyParser', () => {
  test('parses key from banner with adbutler snippet', () => {
    const parsedKey = new AdbutlerKeyParser().parseFromBanner(FAKE_GRAPHQL_BANNER_WITH_ADBUTLER_SNIPPET);

    expect(parsedKey).not.toBeNull();
    expect(parsedKey?.getZoneId()).toBe('351403');
    expect(parsedKey?.getAccountId()).toBe(DEFAULT_ADBUTLER_ACCOUNT_ID);
  });

  describe('parses key from banner with adbutler url in any field', () => {
    const banner = { ...FAKE_GRAPHQL_BANNER_WITH_ADBUTLER_URL, bannerUrl: null };
    const fakeAdbutlerUrl = 'adbutler://123456';

    // this fields would not be set from dashboard
    const bannerFieldsToSkip = new Set(['__typename', 'id', 'cacheKey', 'post']);
    const bannerFieldsToTest = Object.keys(banner).filter((field) => !bannerFieldsToSkip.has(field));

    test.each(bannerFieldsToTest)('parses from baner field %j', (field) => {
      const bannerWithAdbutlerUrl = { ...banner, [field]: fakeAdbutlerUrl };
      const parsedKey = new AdbutlerKeyParser().parseFromBanner(bannerWithAdbutlerUrl as never);
      expect(parsedKey).not.toBeNull();
      expect(parsedKey?.getZoneId()).toBe('123456');
    });
  });

  test('parses nothing for banner without adbutler data', () => {
    const parsedKey = new AdbutlerKeyParser().parseFromBanner(FAKE_GRAPHQL_BANNER_WITH_EDITORS_CHOICE_WIDGET);

    expect(parsedKey).toBeNull();
  });
});
