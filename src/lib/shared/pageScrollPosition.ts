let BackButtonSingleton: BackButtonListener;

// TODO: Next step for refactoring the smart scroll:
// - make an observable in popstate and release a back redirect just when it will be true
// - rewrite as a library with tests and documentation

// Make a smart scroll in previous page without history
export class BackButtonListener {
  history: string[] = [];

  temporaryTop: number = 0;
  top: number = 0;

  previousPath: string = '';

  names = {
    to: '',
    from: '',
    previous: '',
  };

  isCurrentInfinityScroll: boolean = false;
  isBack: boolean = false;

  callback: () => void = () => console.error('No callback in BackButtonListener constructor!');

  handlerFunc: (resolve: any) => void;

  constructor() {
    this.handlerFunc = () => {
      this.isBack = true;

      // For the case when in infinitive articles list we want back to previous page
      if (this.names.to === 'news-slug') {
        this.callback(this.history.pop());
      }
    };
  }

  setCallback(callback: () => void) {
    this.callback = callback;
  }

  setListenerToBackButton() {
    globalThis.addEventListener('popstate', this.handlerFunc);
  }

  updateInfinitiveScrollState(path: string) {
    this.isCurrentInfinityScroll = this.currentPath !== path;
  }

  scrollToPreviousPosition(): Promise<number> {
    return new Promise((resolve) => {
      if (this.isBack) {
        if (this.names.previous === 'news-slug' && this.isCurrentInfinityScroll) {
          resolve(0);
        } else {
          resolve(this.temporaryTop);
        }
      } else {
        resolve(0);
      }

      this.isBack = false;
      this.temporaryTop = 0;
      this.isCurrentInfinityScroll = false;
    });
  }

  setPositions(from: string, to: string, fromName: string, toName: string, topPosition: number) {
    if (from) {
      if (this.top && this.previousPath === to) {
        this.temporaryTop = this.top;
        this.names.previous = this.names.from;
      }

      if (!this.isBack) {
        this.history.push(from);
      }

      this.top = topPosition;
      this.previousPath = from;
      this.names.to = toName;
      this.names.from = fromName;
    }
  }

  removeListenerToBackButton = () => {
    globalThis.removeEventListener('popstate', this.handlerFunc);
  };
}

export const getBackButtonListener = () => {
  if (!BackButtonSingleton) {
    BackButtonSingleton = new BackButtonListener();
  }

  return BackButtonSingleton;
};
