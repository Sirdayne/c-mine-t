import { type MaybeRefOrGetter, toValue } from '@vueuse/core';
import { computed } from 'vue';
import { UserCountryStore } from '~/features/user-country';
import { checkAllowed } from './checkAllowed';
import { ChangellyCoinMappingsStore } from './ChangellyCoinMappingsStore';

export class ChangellyWidgetViewModel {
  private readonly _allowedRef = computed(() => {
    const post = toValue(this._postRef);

    return (
      this._userCountryStore.isDone() &&
      this._mappingsStore.isDone() &&
      checkAllowed({
        userCountry: this._userCountryStore.getCountry(),
        postPreviewText: post.previewText,
        postFullText: post.fullText,
        postTags: post.tags,
      })
    );
  });

  private readonly _targetCoin = computed(() => {
    const post = toValue(this._postRef);
    const mappingsStore = toValue(this._mappingsStore);

    return mappingsStore.findTargetCoinByPost(post);
  });

  constructor(
    private readonly _mappingsStore: ChangellyCoinMappingsStore,
    private readonly _userCountryStore: UserCountryStore,
    private readonly _postRef: MaybeRefOrGetter<any>
  ) {}

  isAllowed(): boolean {
    return toValue(this._allowedRef);
  }

  getTargetCoin(): string | null {
    return toValue(this._targetCoin);
  }

  async waitReady(signal: AbortSignal): Promise<void> {
    this._mappingsStore.run();
    this._userCountryStore.run();

    await Promise.all([this._mappingsStore.wait(signal), this._userCountryStore.wait(signal)]);
  }
}
