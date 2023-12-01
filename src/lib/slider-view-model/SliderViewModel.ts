import { ref, unref } from 'vue';
import { type MaybeRef } from '@vueuse/core';

export class SliderViewModel {
  private readonly _currentSlideIndexRef = ref(0);

  constructor(
    private readonly _containerElRef: MaybeRef<HTMLElement | null>,
    private readonly _slideCountRef: MaybeRef<number>,
    /**
     * Fix slideTo position in case you have multiple slides in viewport
     * */
    private readonly _slidesInViewport: MaybeRef<number> = 1,
    /**
     * Prevent from DOM interaction in cases when we don't need to scroll to DOM element
     * */
    private readonly _preventInteractWithDOM: MaybeRef<boolean> = false
  ) {}

  getCurrentSlideIndex(): number {
    return unref(this._currentSlideIndexRef);
  }

  isLastSlide(slideIndex: number): boolean {
    return this._getSlideCount() - 1 === slideIndex;
  }

  isOnLastSlide(): boolean {
    return this.isLastSlide(this.getCurrentSlideIndex());
  }

  isOnFirstSlide(): boolean {
    return this.getCurrentSlideIndex() === 0;
  }

  slideTo(targetSlideIndex: number, smooth?: boolean): void {
    this._setCurrentSlideIndex(targetSlideIndex);

    if (this._preventInteractWithDOM) return;

    const containerEl = this._getContainerEl();

    let nextScrollLeft = Math.floor(containerEl.offsetWidth * targetSlideIndex);

    if (unref(this._slidesInViewport) && !this.isOnFirstSlide()) {
      nextScrollLeft = Math.floor(
        (containerEl.offsetWidth / unref(this._slidesInViewport as number)) * targetSlideIndex
      );
    }

    if (this._isRtl()) nextScrollLeft = -nextScrollLeft;

    containerEl.scroll({
      left: nextScrollLeft,
      behavior: smooth ? 'smooth' : void 0,
    });
  }

  slideToFirst(): void {
    this.slideTo(0, false);
  }

  slideToPrev(fromSlideIndex: number = this.getCurrentSlideIndex()): void {
    const prevSlideIndex = Math.max(0, fromSlideIndex - 1);

    this.slideTo(prevSlideIndex, true);
  }

  slideToNext(fromSlideIndex: number = this.getCurrentSlideIndex()): void {
    if (this.isLastSlide(fromSlideIndex)) {
      this.slideToFirst();
    } else {
      const nextSlideIndex = fromSlideIndex + 1;
      this.slideTo(nextSlideIndex, true);
    }
  }

  onScrollEnd(): void {
    const containerEl = this._getContainerEl();
    const nextActiveSlideIndex = Math.round(Math.abs(containerEl.scrollLeft) / containerEl.offsetWidth);
    this._setCurrentSlideIndex(nextActiveSlideIndex);
  }

  private _getSlideCount(): number {
    return unref(this._slideCountRef);
  }

  private _getContainerEl(): HTMLElement {
    const containerEl = unref(this._containerElRef);

    if (!containerEl) throw new Error('no slider container');

    return containerEl;
  }

  private _setCurrentSlideIndex(slideIndex: number): void {
    this._currentSlideIndexRef.value = slideIndex;
  }

  private _isRtl(): boolean {
    return document.documentElement.dir === 'rtl';
  }
}
