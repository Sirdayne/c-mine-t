import { Language } from '~/store/types/Language';

export interface MetaOptions {
  languages: Array<Language>;
  pathname: string;
  languageShort: string;
  apolloTransport: () => void;
}
