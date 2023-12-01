import { Store } from 'vuex';
import { Banner as GraphQLBanner } from '~/graphql';
import { AbstractBannerRepository } from './AbstractBannerRepository';

export class VuexBannerRepository extends AbstractBannerRepository {
  constructor(private readonly _store: Store<any>) {
    super();
  }

  getBannersByPlace(place: string): GraphQLBanner[] {
    const storeBanners = this._store.state.banners?.[place] ?? [];
    // @ts-expect-error unsafe store access. check out "getMappedBannerOptions"
    return storeBanners.map((bannerOptions) => bannerOptions.graphqlBanner);
  }
}
