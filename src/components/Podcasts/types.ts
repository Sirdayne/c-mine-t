export type PlayerType = 'small' | 'large';

export interface AuthorPodcast {
  __typename: string;
  slug: string;
}
export interface AuthorsWithDesc {
  __typename: string;
  podcast: AuthorPodcast;
  description: string;
}
export interface Author {
  __typename: string;
  id: string | number;
  slug: string;
  authorTranslates: {
    __typename: string;
    name: string;
  };
}
export interface BuzzsproutPodcast {
  __typename: string;
  id: number;
  title: string;
  artworkUrl: string;
  backgroundUrl: string | null;
  websiteAddress: string | null;
  author: string;
  description: string;
  contactEmail: string;
  mainCategory: string | null;
  subCategory: string | null;
  keywords: string | null;
  language: string;
  timezone: string;
  explicit: boolean;
}

export interface Podcast {
  __typename: string;
  id: string | number;
  buzzsproutPodcast: BuzzsproutPodcast;
  authorWithDesc: AuthorsWithDesc;
  playerType: PlayerType;
  slug: string;
  title: string;
  description: string;
  apple: boolean;
  spotify: boolean;
  google: boolean;
  amazonMusic: boolean;
  audible: boolean;
  iheartradio: boolean;
  tunein: boolean;
  podcastAddict: boolean;
  podchaser: boolean;
  podcastIndex: boolean;
  pocketCasts: boolean;
  deezer: boolean;
  listenNotes: boolean;
  playerfm: boolean;
  overcast: boolean;
  castro: boolean;
  castbox: boolean;
  podfriend: boolean;
  goodpods: boolean;
  disclaimerPrefix: string | null;
}
