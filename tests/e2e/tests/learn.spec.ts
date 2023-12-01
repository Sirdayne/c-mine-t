import { test, expect, Locator } from './helpers/fixtures';
import { Learn } from './pages/learnPage';
import { hosts } from './helpers/hosts';

let learn: Learn;

for (const [short, host] of Object.entries(hosts)) {
  test.describe('Learn page tests', () => {
    test.beforeEach(async ({ page }) => {
      learn = new Learn(page);
      await learn.goto(host + learn.pageLinks.learn);
    });

    test(`[${short}] learn page elements @smoke`, async ({}) => {
      await learn.category.first().click();
      await learn.checkLearnPageElements();
    });

    test(`[${short}] learn page breadcrumb`, async ({ page }) => {
      await learn.breadcrumbHome.locator('a').click();
      await expect(page).toHaveURL(host);
    });

    test(`[${short}] learn page description links`, async ({ page }) => {
      await learn.closeCookies();
      for (const item of await learn.learnDesc.locator('a').all()) {
        await item.click();
        expect(page.url).not.toContain(/learn/);
        await page.goBack();
      }
    });

    test.describe('Learn search', () => {
      test(`[${short}] learn page search @smoke`, async ({ page }) => {
        await learn.searchField.fill('bitcoin');
        await page.waitForTimeout(1000);
        expect.soft(learn.searchQueryClear).toBeVisible();
        expect(learn.searchResultTitle).toBeVisible();
      });

      test(`[${short}] learn search clear`, async ({ page }) => {
        await learn.searchField.fill('bitcoin');
        await page.waitForTimeout(1000);
        await learn.searchQueryClear.click();
        expect(learn.searchResultTitle).not.toBeVisible();
      });

      test(`[${short}] learn search post`, async ({ page }) => {
        test.skip(['fr', 'jp'].includes(short), 'not enough guides');
        const postTitleQuery = await learn.learnPostTitle.nth(4).innerText();
        await learn.searchField.fill(postTitleQuery);
        await page.waitForTimeout(1500);
        const postTitle = await learn.learnPostTitle.first().innerText();
        expect(postTitleQuery).toEqual(postTitle);
      });

      test(`[${short}] learn search result title`, async ({ page }) => {
        test.skip(['fr', 'jp'].includes(short), 'not enough guides');
        await learn.searchField.fill('bitcoin');
        await page.waitForTimeout(1000);
        const allResults = await learn.searchResultTitle.innerText();
        await learn.category.nth(1).click();
        await page.waitForTimeout(1000);
        const categoryResults = await learn.searchResultTitle.innerText();
        expect(allResults).not.toEqual(categoryResults);
      });
    });

    test(`[${short}] learn page category buttons`, async ({ page }) => {
      const selectedCategoryFirst = await learn.categorySelected.innerText();
      await learn.category.first().click();
      await page.waitForTimeout(1000);
      const selectedCategorySecond = await learn.categorySelected.innerText();
      expect(selectedCategoryFirst).not.toEqual(selectedCategorySecond);
    });

    test(`[${short}] learn page category button matches category title @smoke`, async ({ page }) => {
      for (const item of await learn.category.all()) {
        await item.click();
        await page.waitForTimeout(1000);
        const selectedCategoryText = (await learn.categorySelected.innerText()).split('\n')[0];
        const guideTitleText = await learn.guideCategoryTitle.innerText();
        expect.soft(selectedCategoryText.toLowerCase()).toEqual(guideTitleText.toLowerCase());
      }
    });

    test(`[${short}] learn page open post @smoke`, async ({ page }) => {
      const guideTitle = await learn.guideTitle.first().innerText();
      await learn.guideTitle.first().click();
      await page.waitForTimeout(1000);
      const postTitle = await learn.learnPostTitle.innerText();
      expect(guideTitle).toEqual(postTitle);
    });
  });

  test.describe('Learn post tests', () => {
    test.beforeEach(async ({ page }) => {
      learn = new Learn(page);
      await learn.goto(host + learn.pageLinks.learn);
      await learn.guideTitle.first().click(); // Since there's no single post for all locales, just open first one for each locale
    });

    test(`[${short}] learn post elements @smoke`, async ({ isMobile }) => {
      await learn.checkLearnPostElements(isMobile);
    });

    test.describe('Learn post breadcrumbs', () => {
      test(`[${short}] learn post breadcrumb learn`, async ({ page }) => {
        await learn.learnPostBreadcrumbLearn.click();
        await expect(page).toHaveURL(host + learn.pageLinks.learn);
      });

      test(`[${short}] learn post breadcrumb home`, async ({ page }) => {
        await learn.learnPostBreadcrumbHome.click();
        await expect(page).toHaveURL(host);
      });
    });

    test.describe('Learn post page content', () => {
      test(`[${short}] learn post content link selected`, async ({ isMobile }) => {
        let linkText: string;
        let selectedLinkText: string;
        let navigationLink: Locator;
        if (!isMobile) {
          navigationLink = learn.learnPostNavigationLink.nth(2);
          linkText = await navigationLink.innerText();
          await navigationLink.click();
          selectedLinkText = await learn.learnPostNavigationLinkActive.innerText();
        } else {
          await learn.learnMobileNavigationTitle.click();
          navigationLink = learn.learnMobileNavigationLink.nth(2);
          linkText = await navigationLink.innerText();
          await navigationLink.click();
          selectedLinkText = await learn.learnMobileNavigationLinkActive.innerText();
        }
        expect(linkText).toEqual(selectedLinkText);
      });

      test(`[${short}] learn post navigation leads to proper heading @smoke`, async ({ page, isMobile }) => {
        let linkText: string;
        await learn.closeCookies();
        if (!isMobile) {
          linkText = await learn.learnPostNavigationLink.nth(1).innerText();
          await learn.learnPostNavigationLink.nth(1).click();
        } else {
          await learn.learnMobileNavigationTitle.click();
          linkText = await learn.learnMobileNavigationLink.nth(1).innerText();
          await learn.learnMobileNavigationLink.nth(1).click();
        }
        try {
          await expect(page.locator('h2').getByText(linkText)).toBeVisible();
        } catch {
          await expect(page.locator('h3').getByText(linkText)).toBeVisible();
        }
      });
    });

    test(`[${short}] learn post share links`, async ({}) => {
      await learn.closeCookies();
      for (const link of learn.shareLinks) {
        await link.click();
        expect(await learn.getCountTabs()).toEqual(2);
      }
    });
  });
}
