import { expect, test } from './helpers/fixtures';
import { CoinPage } from './pages/coinPage';
import { hosts } from './helpers/hosts';

let coinPage: CoinPage;

for (const [short, host] of Object.entries(hosts)) {
  test.describe('coin page tests', () => {
    test.beforeEach(async ({ page }) => {
      coinPage = new CoinPage(page);
      await coinPage.goto(host + coinPage.pageLinks.coinPage);
    });

    test.describe('elements overview', () => {
      test(`[${short}] coin page elements overview @smoke`, async () => {
        let elements = [
          coinPage.coinPageTitle,
          coinPage.marketOverviewBlock,
          //coinPage.valueWidget, Details - https://jira.cointelegraph.com/browse/CDT-3718
          //coinPage.historicalBlock,
          coinPage.coinPageContent,
          coinPage.otherCryptoBlock,
          coinPage.coinNewsBlock,
          coinPage.loadMoreButton,
        ];
        if ('ar'.includes(short)) {
          // Somewhat load more button locator can't be found in AR despite it's present
          elements = elements.slice(0, -1);
        } else {
          await coinPage.elementsToBeVisible(elements);
        }
      });

      test(`[${short}] other cryptocurrencies elements overview @smoke`, async () => {
        const elements = [
          coinPage.otherTitle,
          coinPage.otherItem,
          coinPage.otherItemIcon,
          coinPage.otherItemPrice,
          coinPage.otherItemTitle,
          coinPage.otherViewAll,
        ];
        await coinPage.elementsToBeVisible(elements);
        await expect(coinPage.otherItem).toHaveCount(3);
      });

      test(`[${short}] article elements overview @smoke`, async () => {
        await coinPage.checkArticleElements(short);
        await expect(coinPage.articleCard).toHaveCount(5);
      });
    });

    test.describe('breadcrumb links', () => {
      test(`[${short}] price indexes link`, async ({ page }) => {
        await coinPage.priceIndexesNavigationLink.click();
        await expect(page).toHaveURL(/price-indexes/);
      });

      test(`[${short}] home link`, async ({ page }) => {
        await coinPage.homeNavigationLink.click();
        await expect(page).toHaveURL(host);
      });
    });

    test(`[${short}] load more button`, async ({ page }) => {
      test.slow();
      const amountOfCards = await coinPage.articleCard.count();
      await page.waitForLoadState('networkidle');
      await coinPage.loadMoreButton.click();
      await page.waitForTimeout(3000);
      expect(await coinPage.articleCard.count()).toBeGreaterThan(amountOfCards);
    });

    test.describe('check other cryptocurrencies block', () => {
      test(`[${short}] other cryptocurrencies go to coin`, async ({ page }) => {
        const itemName = (await coinPage.otherItemTitle.first().innerText()).toLowerCase();
        const itemShortName = (await coinPage.otherItemShortName.first().innerText())
          .split('/')[0]
          .replace(' ', '')
          .toLowerCase();
        await coinPage.otherItem.first().click();
        await page.waitForTimeout(2000);
        expect((await coinPage.coinPageTitle.innerText()).toLowerCase()).toContain(`${itemName}` || `${itemShortName}`);
      });

      test(`[${short}] other cryptocurrencies view all button`, async ({ page }) => {
        await coinPage.otherViewAll.click();
        await expect(page).toHaveURL(/price-indexes/);
      });
    });

    test(`[${short}] change fiat overview block`, async () => {
      for (const [key, value] of Object.entries(coinPage.currencySymbols)) {
        await coinPage.selectFiatByCode(key);
        expect(await coinPage.checkFiatSymbol(value)).toBeTruthy();
      }
    });

    test.describe('check calculator', () => {
      test(`[${short}] calculator input`, async () => {
        const valueBefore = await coinPage.calculatorFiatInput.inputValue();
        await coinPage.calculatorCoinInput.fill('2');
        expect(await coinPage.calculatorFiatInput.inputValue()).not.toEqual(valueBefore);
      });

      test(`[${short}] calculator change fiat`, async ({ isMobile, page }) => {
        let valueBefore = '';
        let price = '';
        await coinPage.calculatorDropDown.last().click();
        for (const fiat of await coinPage.calculatorDropDownOptions.all()) {
          await coinPage.calculatorDropDown.last().click();
          await page.waitForTimeout(1000);
          await fiat.click();
          if (isMobile) {
            price = await coinPage.calculatorFiatInput.first().inputValue();
          } else {
            price = await coinPage.calculatorFiatInput.last().inputValue();
          }
          const currentValue = price;
          expect.soft(currentValue).not.toEqual(valueBefore);
          valueBefore = price;
        }
      });
    });

    test(`[${short}] coin charts overview`, async ({ page }) => {
      for (const period of await coinPage.periodTabs.all()) {
        await page.waitForLoadState('networkidle');
        await period.click();
        await page.waitForRequest(/ticker-api/);
        await expect(coinPage.coinCharts).toHaveCount(3);
      }
    });
  });
}
