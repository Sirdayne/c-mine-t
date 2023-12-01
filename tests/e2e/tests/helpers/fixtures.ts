import { test as base } from '@playwright/test';

// Declare the types of your fixtures.
type Fixtures = {
  abortRequests: void;
  // eslint-disable-next-line @typescript-eslint/ban-types
  hosts: Object;
};

export const test = base.extend<Fixtures>({
  abortRequests: [
    async ({ page }, use) => {
      const urls = ['bc.cointelegraph.com'];
      await page.route('**/*', (route) => {
        const requestUrl = route.request().url();
        return urls.some((url) => requestUrl.includes(url)) ? route.abort() : route.continue();
      });
      await use();
    },
    { auto: true },
  ],

  // eslint-disable-next-line no-empty-pattern
  hosts: async ({}, use) => {
    const env = ''; // Default = production
    const hosts = {
      en: `https://${env}cointelegraph.com`,
      ar: `https://ar.${env}cointelegraph.com`,
      de: `https://de.${env}cointelegraph.com`,
      es: `https://es.${env}cointelegraph.com`,
      it: `https://it.${env}cointelegraph.com`,
      fr: `https://fr.${env}cointelegraph.com`,
      br: `https://br.${env}cointelegraph.com`,
      tr: `https://tr.${env}cointelegraph.com`,
      jp: `https://jp.${env}cointelegraph.com`,
      cn: `https://${env}cointelegraphcn.com`,
    };
    await use(hosts);
  },
});

export { expect, Locator } from '@playwright/test';
