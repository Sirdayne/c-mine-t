import { type MaybeRef } from '@vueuse/core';
import { ref, unref } from 'vue';

export class StorySlider {
  private readonly _activeSlideIndexRef = ref(0);

  constructor(
    private readonly _storyElRef: MaybeRef<HTMLElement | null>,
    private readonly _slideCountRef: MaybeRef<number>
  ) {}

  getActiveSlideIndex(): number {
    return unref(this._activeSlideIndexRef);
  }

  isSlideActive(slideIndex: number): boolean {
    return this.getActiveSlideIndex() === slideIndex;
  }

  isLastSlide(slideIndex: number): boolean {
    return this._getSlideCount() - 1 === slideIndex;
  }

  slideTo(targetSlideIndex: number): void {
    const storyContainer = this._getStoryEl();

    if (storyContainer && targetSlideIndex !== this.getActiveSlideIndex()) {
      this._setActiveSlideIndex(targetSlideIndex);

      storyContainer.scroll({
        left: storyContainer.clientWidth * (targetSlideIndex + 1),
      });
    }
  }

  slideToFirst(): void {
    this.slideTo(0);
  }

  slideToPrev(fromSlideIndex: number): void {
    const prevSlideIndex = fromSlideIndex - 1;

    if (prevSlideIndex >= 0) this.slideTo(prevSlideIndex);
  }

  slideToNext(fromSlideIndex: number): void {
    const nextSlideIndex = fromSlideIndex + 1;

    if (this.isLastSlide(nextSlideIndex)) {
      this.slideToFirst();
    } else {
      this.slideTo(nextSlideIndex);
    }
  }

  handleScroll(): void {
    const storyEl = this._getStoryEl();
    const nextActiveSlideIndex = storyEl.scrollLeft / storyEl.clientWidth - 1;
    this._setActiveSlideIndex(nextActiveSlideIndex);
  }

  reset(): void {
    this._setActiveSlideIndex(0);
    this.slideToFirst();
  }

  private _getSlideCount(): number {
    return unref(this._slideCountRef);
  }

  private _getStoryEl(): HTMLElement {
    const storyEl = unref(this._storyElRef);

    if (!storyEl) throw new Error('no story element in ref');

    return storyEl;
  }

  private _setActiveSlideIndex(slideIndex: number): void {
    this._activeSlideIndexRef.value = slideIndex;
  }
}
