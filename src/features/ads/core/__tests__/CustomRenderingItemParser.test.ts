import { beforeEach, describe, expect, test } from '@jest/globals';
import { AdItemErrorCollector, AdItemErrors } from '../AdItemErrorCollector';
import { CustomRenderingItemParser } from '../CustomRenderingItemParser';
import { CustomRenderingViews } from '../CustomRenderingViews';

describe('CustomRenderingItemParser', () => {
  let errorCollector: AdItemErrorCollector;
  let parser: CustomRenderingItemParser;

  beforeEach(() => {
    errorCollector = new AdItemErrorCollector();
    parser = new CustomRenderingItemParser(errorCollector);
  });

  test('parses nothing for unknown view', () => {
    const result = parser.parse('superFakeViewName', {});
    expect(result).toBeNull();
    expect(errorCollector.collect()).toEqual(expect.arrayContaining([AdItemErrors.UNKNOWN_CUSTOM_RENDERING_VIEW]));
  });

  test('parses editors choice', () => {
    const result = parser.parse(CustomRenderingViews.EDITORS_CHOICE_WIDGET, {});
    expect(result).toStrictEqual({
      view: CustomRenderingViews.EDITORS_CHOICE_WIDGET,
      props: {},
    });
    expect(errorCollector.collect()).toStrictEqual([]);
  });

  describe('story widget', () => {
    test('parses nothing for bad props', () => {
      const result = parser.parse('storyWidget', {
        fakeProp: 'kek',
      });

      expect(result).toBeNull();
      expect(errorCollector.collect()).toEqual(expect.arrayContaining([AdItemErrors.INVALID_CUSTOM_RENDERING_PROPS]));
    });

    test('parses custom rendering item for story widget', () => {
      const result = parser.parse('storyWidget', {
        postSlug: 'bitcoin-price-above-100k-bucks',
        badge: 'Accelerate',
      });

      expect(result).toEqual({
        view: CustomRenderingViews.STORY_WIDGET,
        props: {
          postSlug: 'bitcoin-price-above-100k-bucks',
          badge: 'Accelerate',
        },
      });

      expect(errorCollector.collect()).toStrictEqual([]);
    });
  });
});
