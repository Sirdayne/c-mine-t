import { createInjection } from '~/lib/shared';
import { AsyncStore, useAutoRunAsyncStore, useTransferAsyncStore } from '~/lib/async-store';
import { type ChangellyCoinMappings } from './ChangellyCoinMappings';

const EMPTY_MAPPINGS: ChangellyCoinMappings = {
  byTags: {},
  byTitle: {},
};

const CHANGELLY_MAPPING_JSON_URL =
  'https://s3.eu-central-1.amazonaws.com/s3.cointelegraph.com/changelly-coin-mapping.json';

export class ChangellyCoinMappingsStore extends AsyncStore<ChangellyCoinMappings> {
  constructor() {
    super(() => this._loadMappings());
  }

  private async _loadMappings(): Promise<ChangellyCoinMappings> {
    const response = await fetch(CHANGELLY_MAPPING_JSON_URL);
    return await response.json();
  }

  findTargetCoinByPost(post: any): string | null {
    return this.findTargetCoinByPostTitle(post.title) || this.findTargetCoinByPostTags(post.tags);
  }

  findTargetCoinByPostTitle(postTitle: string): string | null {
    const mapping = this.getMappings()['byTitle'];
    postTitle = postTitle.toLowerCase();

    for (const coin in mapping) {
      const substrings = mapping[coin];

      for (const substring of substrings) {
        for (const word of postTitle.split(' ')) {
          if (word === substring.toLocaleLowerCase()) {
            return coin;
          }
        }
      }
    }

    return null;
  }

  findTargetCoinByPostTags(tags: { slug: string }[]) {
    const mapping = this.getMappings()['byTags'];

    for (const coin in mapping) {
      const coinTagSlugs = mapping[coin];

      for (const { slug } of tags) {
        if (coinTagSlugs.includes(slug)) return coin;
      }
    }

    return null;
  }

  getMappings(): ChangellyCoinMappings {
    try {
      return this.unwrap();
    } catch (error) {
      console.error('Changelly widget init error:', error);
      return EMPTY_MAPPINGS;
    }
  }
}

const ij = createInjection<ChangellyCoinMappingsStore>('changelly-coins-mappings-store');

export const provideChangellyCoinMappingsStore = (): ChangellyCoinMappingsStore => {
  const store = new ChangellyCoinMappingsStore();

  useTransferAsyncStore(store, 'changelly-coin-mappings');
  useAutoRunAsyncStore(store, { ssr: false });
  ij.provide(store);

  return store;
};

export const useChangellyCoinMappingsStore = ij.use;
