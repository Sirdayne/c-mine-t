import { APIRequestContext, Locator, Page } from '@playwright/test';
import { PageLinks } from '../helpers/globalConstants';
import { expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly pageLinks: PageLinks;

  constructor(page: Page) {
    this.page = page;
    this.pageLinks = new PageLinks();
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async getCountTabs() {
    const [newTab] = await Promise.all([this.page.context().waitForEvent('page')]);
    const countTabs = newTab.context().pages().length;
    await newTab.waitForLoadState('domcontentloaded');
    await newTab.close();
    return countTabs;
  }

  async pageIsScrolled() {
    const pixels = await this.page.evaluate(() => window.pageYOffset);
    return pixels > 5;
  }

  async getPageTitle() {
    return await this.page.locator('//h1').first().innerText();
  }

  async elementsToBeVisible(locators: Locator[]) {
    for (const locator of locators) {
      await expect.soft(locator.first(), `${locator} is not visible`).toBeVisible();
    }
  }

  async closeLanguageOffer() {
    const closeButton = this.page.locator("//button[contains(@class, 'language-offer__close-btn')]").last();
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }
  }

  async closeCookies() {
    const closeButtonCookies = this.page.locator("//button[@class='btn privacy-policy__accept-btn']");
    if (await closeButtonCookies.isVisible()) {
      await closeButtonCookies.click();
    }
  }

  async checkLinks(request: APIRequestContext, host: string, links: Locator) {
    for (const link of await links.all()) {
      let url = String(await link.getAttribute('href'));
      if (!url?.includes('https')) {
        url = host + url;
      }
      const response = await fetch(url);
      expect.soft(response.status, `${url} ${response.status}`).toBe(200);
    }
  }
}
