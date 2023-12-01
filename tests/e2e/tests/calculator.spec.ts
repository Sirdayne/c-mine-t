import { expect, test } from './helpers/fixtures';
import { CalculatorPage } from './pages/calculatorPage';
import { hosts } from './helpers/hosts';

let calculator: CalculatorPage;

for (const [short, host] of Object.entries(hosts)) {
  test.describe('calculator page tests', () => {
    test.beforeEach(async ({ page }) => {
      calculator = new CalculatorPage(page);
      await calculator.goto(host + calculator.pageLinks.calculator);
    });

    test.describe('elements overview', () => {
      test(`[${short}] calculator page elements @smoke`, async ({ isMobile }) => {
        await calculator.checkCalculatorPageElements(isMobile, short);
      });

      test(`[${short}] currency converter block elements @smoke`, async () => {
        await calculator.checkCurrencyConverterElements();
      });

      test(`[${short}] post card elements @smoke`, async () => {
        await calculator.checkPostCardElements();
      });
    });

    test.describe('currency conversion', () => {
      test(`[${short}] convert crypto to fiat`, async () => {
        await calculator.checkCalculatorFields();
      });

      test(`[${short}] convert fiat to crypto`, async () => {
        await calculator.reverstConvert.click();
        await calculator.checkCalculatorFields();
      });

      test(`[${short}] click on converter reverse button`, async () => {
        const beforeRightInputValue = calculator.getRightInputValue();
        await calculator.reverstConvert.click();
        expect(calculator.getRightInputValue).not.toEqual(beforeRightInputValue);
      });
    });

    test(`[${short}] click on conversions links`, async ({ page }) => {
      const beforeRightInputValue = calculator.getRightInputValue();
      await calculator.cryptoToFiatLink.nth(6).click();
      expect.soft(calculator.getRightInputValue).not.toEqual(beforeRightInputValue);
      const [newTab] = await Promise.all([
        page.context().waitForEvent('page'),
        calculator.cryptoToFiatLink.first().click(),
      ]);
      await expect.soft(newTab).toHaveURL(/price/);
    });

    test(`[${short}] click on tranding article`, async ({ page }) => {
      const postLink = await calculator.postCardLink.first().getAttribute('href');
      const articleTitle = await calculator.postCardTitle.first().innerText();
      await calculator.postCard.first().click();
      await page.waitForTimeout(2000);
      if (postLink !== null && (postLink.includes('magazine') || postLink.includes('explained'))) {
        const [newTab] = await Promise.all([page.context().waitForEvent('page')]);
        expect(await newTab.title()).toContain(articleTitle);
      } else {
        expect(await page.title()).toContain(articleTitle);
      }
    });
  });
}
