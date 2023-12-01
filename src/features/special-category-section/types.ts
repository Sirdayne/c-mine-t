import type { Locale } from '~/graphql/generated';
export interface PostLike {
  id: string | number;
  title: string;
  url: string;
  cover: string;
}

export interface CategoryLike {
  slug: string;
  title: string;
}

export interface CategorySectionLike {
  posts: PostLike[];
  category: CategoryLike;
  postsCount: number;
}

export type GtmLocatorVariant = 'pressreleases' | 'marketreleases';

export interface ReleasesQueryPayload {
  locale: Locale;
}
