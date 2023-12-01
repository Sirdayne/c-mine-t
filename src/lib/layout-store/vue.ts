import { onBeforeUnmount, onMounted, Ref, unref } from 'vue';
import { useRouter, useState } from '~/lib/framework';
import { createInjection } from '~/lib/shared';

export interface LayoutUiState {
  headerVariant: 'dark' | 'light';
}

export class LayoutUiStore {
  constructor(private readonly _state: Ref<LayoutUiState>) {}

  private _unrefState(): Readonly<LayoutUiState> {
    return unref(this._state);
  }

  private _updateState(partialState: Partial<LayoutUiState>): void {
    this._state.value = {
      ...this._state.value,
      ...partialState,
    };
  }

  getHeaderVariant(): LayoutUiState['headerVariant'] {
    return this._unrefState()['headerVariant'];
  }

  setHeaderVariant(headerVariant: LayoutUiState['headerVariant']): void {
    this._updateState({ headerVariant });
  }
}

const defaultLayoutUiState = (): LayoutUiState => {
  return {
    headerVariant: 'light',
  };
};

export const { provide: _provideLayoutUiStore, use: useLayoutUiStore } =
  createInjection<LayoutUiStore>('layout-ui-store');

const _useLayoutUiStoreFactory = (): LayoutUiStore => {
  const stateRef = useState('layout-ui-state', defaultLayoutUiState);

  onMounted(() => {
    const router = useRouter();

    const unwatchRouter = router.afterEach((to, from) => {
      if (to.name === from.name) return;

      stateRef.value = defaultLayoutUiState();
    });

    onBeforeUnmount(unwatchRouter);
  });

  return new LayoutUiStore(stateRef);
};

export const provideLayotUiStore = (layoutUiStore = _useLayoutUiStoreFactory()): void => {
  _provideLayoutUiStore(layoutUiStore);
};
