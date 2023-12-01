let env = ''; // Default = production
let url = process.env.URL || 'cointelegraph.com';
let prefix = '';

if (url.includes('cointelegraph')) {
  prefix = 'https://';
  url = url.replace(/^https?:\/\//, '');
} else {
  prefix = 'http://';
  url = url.replace(/^http?:\/\//, '');
}

if (process.env.ENV === 'production') {
  env = '';
} else if (process.env.ENV === 'qa') {
  env = 'qa.';
} else if (process.env.ENV === 'stage') {
  env = 'stage.';
}

export const hosts = {
  en: prefix + env + url,
  ar: prefix + `ar.${env + url}`,
  de: prefix + `de.${env + url}`,
  es: prefix + `es.${env + url}`,
  it: prefix + `it.${env + url}`,
  fr: prefix + `fr.${env + url}`,
  br: prefix + `br.${env + url}`,
  tr: prefix + `tr.${env + url}`,
  jp: prefix + `jp.${env + url}`,
  cn: prefix + `cn.${env + url}`,
};
