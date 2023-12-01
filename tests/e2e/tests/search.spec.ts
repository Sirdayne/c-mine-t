import { test, expect } from './helpers/fixtures';
import { Search } from './pages/search/search';
import { hosts } from './helpers/hosts';

let search: Search;

for (const [short, host] of Object.entries(hosts)) {
  test.describe('search page tests', () => {
    test.beforeEach(async ({ page }) => {
      search = new Search(page);
      await search.goto(host);
      await search.closeLanguageOffer();
    });

    test.describe('search', () => {
      test(`[${short}] search article @smoke`, async ({ page, isMobile }) => {
        await search.searchArticle('USDC', isMobile, short);
        await expect(page).toHaveURL(/search/);
      });

      test(`[${short}] empty search`, async ({ page, isMobile }) => {
        await search.searchArticle('', isMobile, short);
        await expect(page).toHaveURL(host);
      });

      test(`[${short}] search with broken request`, async ({ page, isMobile }) => {
        await search.searchArticle('AFASDFASFSA', isMobile, short);
        await expect.soft(page).toHaveURL(/search/);
        await expect(search.searchMessage).toContainText(/AFASDFASFSA/);
      });
    });

    test.describe('article', () => {
      test(`[${short}] article card elements`, async ({ isMobile }) => {
        await search.searchArticle('USDC', isMobile, short);
        const elements = [
          search.articleCover,
          search.articleAuthor,
          search.articlePublicationDate,
          search.articleText,
          search.articleTitle,
        ];
        await search.elementsToBeVisible(elements);
      });

      test(`[${short}] open article`, async ({ page, isMobile }) => {
        await search.searchArticle('USDC', isMobile, short);
        const articleTitle = await search.articleTitle.first().innerText();
        await search.articleTitle.first().click();
        await page.waitForLoadState('networkidle');
        expect(await page.title()).toContain(articleTitle);
      });

      test(`[${short}] click on author name`, async ({ page, isMobile }) => {
        test.skip(['de', 'jp'].includes(short), 'TODO: Research why page is scrolling by itself');
        await search.searchArticle('USDC', isMobile, short);
        const authorName = await search.articleAuthor.first().innerText();
        const pagePromise = page.context().waitForEvent('page');
        await search.articleAuthor.first().click();
        const newTab = await pagePromise;
        expect(await newTab.title()).toContain(authorName);
      });
    });

    test(`[${short}] load more articles`, async ({ page, isMobile }) => {
      await search.searchArticle('USDC', isMobile, short);
      await page.waitForTimeout(2000);
      const articleCountBefore = await search.article.count();
      await search.article.last().scrollIntoViewIfNeeded();
      await page.waitForTimeout(2000);
      const articleCountAfter = await search.article.count();
      expect(articleCountAfter).toBeGreaterThan(articleCountBefore);
    });

    test(`[${short}] click on back to top button`, async ({ page, isMobile }) => {
      await search.searchArticle('USDC', isMobile, short);
      await page.waitForTimeout(2000);
      expect(await search.pageIsScrolled()).toBeFalsy();
      if (isMobile) {
        await search.article.last().scrollIntoViewIfNeeded();
        await search.backToTopButtonMobile.click();
      } else {
        await search.backToTopButton.scrollIntoViewIfNeeded();
        await search.backToTopButton.click();
      }
      expect(await search.pageIsScrolled()).toBeTruthy();
    });
  });
}
