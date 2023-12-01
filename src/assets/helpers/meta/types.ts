import { Language } from '~/store/types/Language';
import { Podcast } from '~/components/Podcasts/types';

export type MetaTagsType = {
  url: string;
  title: string;
  description: string;
  keywords: string;
};

export type PageMetaOptions = {
  currentLanguage: Language;
  languages: Array<Language>;
  meta: MetaTagsType;
  routeName: string;
};

export type JSONSchemaOptions = {
  currentLanguage: Language;
  meta: MetaTagsType;
  canonical: string;
};

export interface PodcastsPageJSONSchemaOptions extends JSONSchemaOptions {
  podcasts: Array<Podcast>;
}

export interface PodcastsPageMetaOptions extends PageMetaOptions {
  podcasts: Array<Podcast>;
}
