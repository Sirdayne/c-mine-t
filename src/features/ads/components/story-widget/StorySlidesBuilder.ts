/* eslint-disable no-continue, class-methods-use-this */

import { DOMSanitizer } from './DOMSanitizer';
import { SlideMeasurerHelper } from './SlideMeasurerHelper';

const MAX_BODY_SLIDE_COUNT = 3;

export interface StorySlidesBuilderResult {
  readonly hasMore: boolean;
  // slides as HTML
  readonly bodySlides: string[];
}

export class StorySlidesBuilder {
  private readonly _postDoc: Document;
  private readonly _slideMeasurerHelper: SlideMeasurerHelper;

  constructor(slideMeasurerElement: HTMLElement, postBodyHtml: string) {
    this._slideMeasurerHelper = new SlideMeasurerHelper(slideMeasurerElement);

    const parser = new DOMParser();
    this._postDoc = parser.parseFromString(postBodyHtml, 'text/html');
  }

  build(): StorySlidesBuilderResult {
    const bodySlides: string[] = [];
    let hasMore = false;

    this._slideMeasurerHelper.toggleVisibility(true);

    const isMaxSlidesCollected = () => bodySlides.length === MAX_BODY_SLIDE_COUNT;

    /**
     * Prevent from body.childNodes mutation after removing first node
     * When we remove first el, second one moves to first index and loop skips it
     * */
    for (const childNode of this._postDoc.body.childNodes) {
      new DOMSanitizer().sanitize(childNode);
    }
    for (const node of this._postDoc.body.childNodes) {
      if (isMaxSlidesCollected()) {
        hasMore = true;
        break;
      }

      if (!this._isBodyChild(node)) continue;

      const nextSlideHtml = this._slideMeasurerHelper.append(node);

      if (nextSlideHtml) bodySlides.push(nextSlideHtml);
    }

    const lastSlideHtml = this._slideMeasurerHelper.flush();

    if (lastSlideHtml) {
      if (isMaxSlidesCollected()) {
        hasMore = true;
      } else {
        bodySlides.push(lastSlideHtml);
      }
    }

    this._slideMeasurerHelper.toggleVisibility(false);

    return {
      hasMore,
      bodySlides,
    };
  }

  private _isBodyChild(node: Node): boolean {
    return node.parentNode === this._postDoc.body;
  }
}
