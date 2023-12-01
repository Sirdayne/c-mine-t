import { Banner as GraphQLBanner } from '~/graphql';

export abstract class AbstractBannerRepository {
  abstract getBannersByPlace(place: string): GraphQLBanner[];
}
