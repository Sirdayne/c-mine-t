import { expect, test } from './helpers/fixtures';
import { marketsPage } from './pages/marketsPage';
import { hosts } from './helpers/hosts';

let markets: marketsPage;

for (const [short, host] of Object.entries(hosts)) {
  test.describe('markets page tests', () => {
    test.beforeEach(async ({ page }) => {
      markets = new marketsPage(page);
      await markets.goto(host + markets.pageLinks.markets);
    });

    test.describe('elements overview', () => {
      test(`[${short}] markets page elements overview @smoke`, async ({ isMobile }) => {
        await markets.checkMarketsPageElements(isMobile, short);
      });

      test(`[${short}] charts elements overview`, async ({ page }) => {
        await page.waitForLoadState('networkidle');
        await markets.checkChartsElements();
      });

      test(`[${short}] post elements overview @smoke`, async () => {
        await markets.checkPostElements(short);
      });
    });

    test(`[${short}] markets currency selector`, async () => {
      for (const [key, value] of Object.entries(markets.currencySymbols)) {
        await markets.selectFiatByCode(key);
        expect.soft(markets.checkFiatSymbol(value)).toBeTruthy();
      }
    });

    test(`[${short}] open charts`, async ({ page, isMobile }) => {
      const charts = [markets.firstChart, markets.secondChart, markets.thirdChart];
      for (const chart of charts) {
        await chart.click();
        await expect.soft(page).toHaveURL(/price/);
        await page.goBack();
        if (isMobile) {
          break;
        }
      }
    });

    test.describe('view more buttons', () => {
      test(`[${short}] charts view more button`, async ({ page }) => {
        await markets.chartViewMoreButton.click();
        await expect(page).toHaveURL(/price-indexes/);
      });

      test(`[${short}] posts view more button`, async ({ page }) => {
        await markets.marketsViewMoreButton.click();
        await expect(page).toHaveURL(/markets/);
      });
    });

    test.describe('markets posts', () => {
      test(`[${short}] markets regular post open`, async () => {
        const post = markets.marketsPostTitle.first();
        await markets.checkPostTitle(post);
      });

      test(`[${short}] trading 101 post open`, async () => {
        test.skip(['ar', 'fr'].includes(short), "AR and FR don't have Trading block");
        const post = markets.tradingPostTitle.first();
        await markets.checkPostTitle(post);
      });

      test(`[${short}] markets post author`, async ({ page }) => {
        const authorName = await markets.marketsPostAuthor.first().innerText();
        await markets.marketsPostAuthor.first().click();
        await expect.soft(page).toHaveURL(/authors/);
        const authorPageName = await markets.authorPage.getAuthorPageTitle();
        expect(authorPageName).toEqual(authorName);
      });
    });

    test(`[${short}] trading 101 next and previous buttons`, async ({ isMobile }) => {
      test.skip(['ar', 'fr'].includes(short), "AR and FR don't have Trading block");
      test.skip(['de', 'jp'].includes(short), "DE and JP don't have more than 3 articles in this block");
      const post = markets.tradingPostTitle.first();
      await markets.checkSliderAndButtons(post, isMobile);
    });
  });
}
