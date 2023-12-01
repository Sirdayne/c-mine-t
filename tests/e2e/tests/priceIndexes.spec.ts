import { expect, test } from './helpers/fixtures';
import { PriceIndexes } from './pages/priceIndexesPage';
import { hosts } from './helpers/hosts';

let priceIndexes: PriceIndexes;

for (const [short, host] of Object.entries(hosts)) {
  test.describe('price indexes page tests', () => {
    test.beforeEach(async ({ page }) => {
      priceIndexes = new PriceIndexes(page);
      await priceIndexes.goto(host + priceIndexes.pageLinks.priceIndexes);
    });

    test.describe('check elements', () => {
      test(`[${short}] page elements @smoke`, async () => {
        const elements = [
          priceIndexes.pageTitle,
          priceIndexes.currencySelector,
          priceIndexes.priceIndexesCard,
          priceIndexes.latestNewsCard,
        ];
        await priceIndexes.elementsToBeVisible(elements);
        expect.soft((await priceIndexes.priceIndexesCard.all()).length).toBeGreaterThan(0);
        await expect(priceIndexes.latestNewsCard).toHaveCount(10);
      });

      test(`[${short}] coin card elements @smoke`, async () => {
        test.skip(short === 'cn', 'There is a bug with charts. TODO: Create bug report');
        const amountOfCards = await priceIndexes.priceIndexesCard.count();
        const elements = [
          priceIndexes.cardName,
          priceIndexes.cardLogo,
          priceIndexes.cardShortName,
          priceIndexes.cardPercentage,
          priceIndexes.cardPrice,
          //priceIndexes.cardChart, Details - https://jira.cointelegraph.com/browse/CDT-3718
        ];
        if ('jp'.includes(short)) {
          await priceIndexes.checkCoinCardsJP();
        } else {
          await priceIndexes.elementsToBeVisible(elements);
          for (const element of elements) {
            await expect(element).toHaveCount(amountOfCards);
          }
        }
      });

      test(`[${short}] article elements @smoke`, async ({ isMobile }) => {
        const elements = [
          priceIndexes.articleTitle,
          priceIndexes.articleImage,
          priceIndexes.articleDate,
          priceIndexes.articleBadge,
          priceIndexes.articleAuthor,
        ];
        await priceIndexes.elementsToBeVisible(elements);
        if (!isMobile) {
          await priceIndexes.articleImage.first().hover();
          await expect(priceIndexes.articleLeadText.first()).toBeVisible();
        }
      });
    });

    test(`[${short}] opening coin page`, async ({ page }) => {
      await priceIndexes.priceIndexesCard.first().click();
      await expect(page).toHaveURL(/price/);
    });

    test(`[${short}] currency selector`, async () => {
      for (const [key, value] of Object.entries(priceIndexes.currencySymbols)) {
        await priceIndexes.selectFiatByCode(key);
        expect(await priceIndexes.checkFiatSymbol(value, short)).toBeTruthy();
      }
    });

    test.describe('matching values', () => {
      test(`[${short}] matching currency symbol`, async ({ isMobile }) => {
        await priceIndexes.matchingHeaderAndBodyValuesCheck(isMobile, short);
      });

      test(`[${short}] match prices`, async ({ isMobile }) => {
        test.skip('jp'.includes(short) || (isMobile && ['cn', 'jp'].includes(short)), 'Different price indexes layout');
        await priceIndexes.matchPrices(isMobile);
      });

      test(`[${short}] match percents`, async ({ isMobile }) => {
        test.skip(isMobile === true, 'Percents are not displayed on mobile');
        test.skip(short === 'jp', 'TODO: Add short coin name to JP');
        await priceIndexes.matchPercents();
      });
    });
  });
}
