import { describe, expect, beforeEach, test } from '@jest/globals';
import { AdItemResolver } from '../AdItemResolver';
import { AdItemErrorCollector } from '../AdItemErrorCollector';
import { CustomRenderingItemParser } from '../CustomRenderingItemParser';
import { AdbutlerKeyParser } from '../AdbutlerKeyParser';
import { AdItemOptionsParser } from '../AdItemOptionsParser';
import { LegacyCustomRenderingItemParserContext } from '../LegacyCustomRenderingItemParserContext';
import { LegacyCustomRenderingItemParser } from '../LegacyCustomRenderingItemParser';
import { HtmlJsonCustomRenderingItemParser } from '../HtmlJsonCustomRenderingItemParser';
import { CustomRenderingViews } from '../CustomRenderingViews';
import { MockAdbutlerManager } from '../__mocks__/MockAdbutlerManager';
import {
  FAKE_HTML_ADBUTLER_PLACEMENT,
  FAKE_LEADERBOARD_ADBUTLER_PLACEMENT,
  FAKE_PROMO_BUTTON_ADBUTLER_PLACEMENT,
} from '../__mocks__/fake-adbutler-placements';
import {
  FAKE_GRAPHQL_BANNER_WITH_ADBUTLER_URL,
  FAKE_GRAPHQL_BANNER_WITH_EDITORS_CHOICE_WIDGET,
  FAKE_GRAPHQL_BANNER_WITH_PROMO_BUTTON_STACK,
  FAKE_GRAPHQL_BANNER_WITH_STATIC_PROMO_BUTTON_AS_WIDGET,
  FAKE_GRAPHQL_BANNER_WITH_STRETCH_YOUTUBE,
  FAKE_GRAPHQL_BANNER_WITH_YOUTUBE,
} from '../__mocks__/fake-graphql-banners';

describe('AdItemFactory', () => {
  let mockAdbutlerManager: MockAdbutlerManager;
  let errorCollector: AdItemErrorCollector;
  let adItemFactory: AdItemResolver;

  beforeEach(() => {
    errorCollector = new AdItemErrorCollector();
    mockAdbutlerManager = new MockAdbutlerManager();

    const customRenderingItemParser = new CustomRenderingItemParser(errorCollector);
    adItemFactory = new AdItemResolver(
      mockAdbutlerManager as never,
      new AdbutlerKeyParser(),
      new AdItemOptionsParser(),
      new LegacyCustomRenderingItemParser(
        new LegacyCustomRenderingItemParserContext(),
        customRenderingItemParser,
        errorCollector
      ),
      new HtmlJsonCustomRenderingItemParser(customRenderingItemParser, errorCollector)
    );
  });

  describe('adbutler placements', () => {
    // for ad items from adbutler containing image with link
    test('creates image ad item', async () => {
      mockAdbutlerManager.getPlacement.mockResolvedValue(FAKE_LEADERBOARD_ADBUTLER_PLACEMENT);
      const adItem = await adItemFactory.resolveFromBanner(FAKE_GRAPHQL_BANNER_WITH_ADBUTLER_URL);

      expect(errorCollector.collect()).toEqual([]);
      expect(mockAdbutlerManager.getPlacement).toHaveBeenCalled();
      expect(adItem).not.toBeNull();
      expect(adItem?.getImageUrl()).toBe(FAKE_LEADERBOARD_ADBUTLER_PLACEMENT.image_url);
      expect(adItem?.getBody()).toBeNull();
      expect(adItem?.getCustomRenderingItem()).toBeNull();
      expect(adItem?.getRedirectUrl()).toBe(FAKE_LEADERBOARD_ADBUTLER_PLACEMENT.redirect_url);
    });

    // for ad items from adbutler containing HTML+JSON
    test('creates promo button ad item', async () => {
      mockAdbutlerManager.getPlacement.mockResolvedValue(FAKE_PROMO_BUTTON_ADBUTLER_PLACEMENT);
      const adItem = await adItemFactory.resolveFromBanner(FAKE_GRAPHQL_BANNER_WITH_ADBUTLER_URL);

      expect(errorCollector.collect()).toEqual([]);
      expect(mockAdbutlerManager.getPlacement).toHaveBeenCalled();
      expect(adItem).not.toBeNull();
      expect(adItem?.getCustomRenderingItem()).not.toBeNull();
      expect(adItem?.getRedirectUrl()).toBe(FAKE_PROMO_BUTTON_ADBUTLER_PLACEMENT.redirect_url);
      expect(adItem?.getCustomRenderingItem()).toStrictEqual(
        expect.objectContaining({
          view: CustomRenderingViews.PROMO_BUTTON,
          props: {
            labelColor: '#fafafa',
            backgroundColor: '#10d078',
            backgroundImage: '',
            logoSmallUrl: 'https://s3.cointelegraph.com/storage/uploads/view/9d44f2abdc17f082f1e3132e0056ca61.png',
            logoFullUrl: 'https://s3.cointelegraph.com/storage/uploads/view/c0d561999063c831843798d5fc9baea7.svg',
            tooltipText:
              'Crypto assets are a high-risk investment. You should consider whether you understand the possibility of losing money due to leverage. None of the material should be considered as investment advice.',
            labelText: 'Fast exchange on Changelly',
          },
        })
      );
    });

    // for ad items from adbutler with raw/templated HTML
    test('creates html ad item', async () => {
      mockAdbutlerManager.getPlacement.mockResolvedValue(FAKE_HTML_ADBUTLER_PLACEMENT);
      const adItem = await adItemFactory.resolveFromBanner(FAKE_GRAPHQL_BANNER_WITH_ADBUTLER_URL);

      expect(errorCollector.collect()).toEqual([]);
      expect(mockAdbutlerManager.getPlacement).toHaveBeenCalled();
      expect(adItem).not.toBeNull();
      expect(adItem?.getBody()).toBe(FAKE_HTML_ADBUTLER_PLACEMENT.body);
      expect(adItem?.getImageUrl()).toBeNull();
      expect(adItem?.getCustomRenderingItem()).toBeNull();
    });
  });

  describe('legacy dashboard banners', () => {
    test('creates editors choice widget ad item', async () => {
      const adItem = await adItemFactory.resolveFromBanner(FAKE_GRAPHQL_BANNER_WITH_EDITORS_CHOICE_WIDGET);

      expect(mockAdbutlerManager.getPlacement).not.toHaveBeenCalled();
      expect(errorCollector.collect()).toEqual([]);
      expect(adItem).not.toBeNull();
      expect(adItem?.getCustomRenderingItem()).toStrictEqual(
        expect.objectContaining({
          view: CustomRenderingViews.EDITORS_CHOICE_WIDGET,
          props: {},
        })
      );
    });

    // stretch aka 24pin - full-width banner on main page
    test('creates stretch youtube ad item', async () => {
      const adItem = await adItemFactory.resolveFromBanner(FAKE_GRAPHQL_BANNER_WITH_STRETCH_YOUTUBE);

      expect(mockAdbutlerManager.getPlacement).not.toHaveBeenCalled();
      expect(errorCollector.collect()).toEqual([]);
      expect(adItem?.getCustomRenderingItem()).toStrictEqual(
        expect.objectContaining({
          view: CustomRenderingViews.STRETCH_YOUTUBE,
          props: {
            title: FAKE_GRAPHQL_BANNER_WITH_STRETCH_YOUTUBE.bannerTitle,
            youtubeVideoId: 't5V05fetKvM',
          },
        })
      );
    });

    // sidebar banner with youtube video
    test('creates youtube ad item', async () => {
      const adItem = await adItemFactory.resolveFromBanner(FAKE_GRAPHQL_BANNER_WITH_YOUTUBE);

      expect(mockAdbutlerManager.getPlacement).not.toHaveBeenCalled();
      expect(errorCollector.collect()).toEqual([]);
      expect(adItem.getCustomRenderingItem()).toStrictEqual(
        expect.objectContaining({
          view: CustomRenderingViews.YOUTUBE_VIDEO,
          props: {
            youtubeVideoId: 't5V05fetKvM',
          },
        })
      );
    });

    // TODO: static promo buttons and promo button stack
    // static promo button as sidebar widget
    test('creates static promo button widget ad item', async () => {
      const adItem = await adItemFactory.resolveFromBanner(FAKE_GRAPHQL_BANNER_WITH_STATIC_PROMO_BUTTON_AS_WIDGET);

      expect(mockAdbutlerManager.getPlacement).not.toHaveBeenCalled();
      expect(errorCollector.collect()).toEqual([]);
      expect(adItem?.getRedirectUrl()).toBe('https://xgo.com/referral/606e7672c980d972');
      expect(adItem?.getCustomRenderingItem()).toStrictEqual(
        expect.objectContaining({
          view: CustomRenderingViews.PROMO_BUTTON,
          props: {
            labelColor: '#000000',
            backgroundColor: '#f6f3e7',
            backgroundImage: '',
            logoSmallUrl: '/icons/promo-buttons/xgo-mini.svg',
            logoFullUrl: '/icons/promo-buttons/xgo-full.svg',
            tooltipText: 'xgo.btn.text',
            labelText: 'xgo.btn.label',
          },
        })
      );
    });

    test('creates promo button stack ad item', async () => {
      const adItem = await adItemFactory.resolveFromBanner(FAKE_GRAPHQL_BANNER_WITH_PROMO_BUTTON_STACK);

      expect(mockAdbutlerManager.getPlacement).not.toHaveBeenCalled();
      expect(errorCollector.collect()).toEqual([]);
      expect(adItem?.getCustomRenderingItem()).toEqual(
        expect.objectContaining({
          view: CustomRenderingViews.PROMO_BUTTON_STACK,
          props: {
            promoButtonPlace: 'promo_button_index_mobile',
          },
        })
      );
    });
  });
});
