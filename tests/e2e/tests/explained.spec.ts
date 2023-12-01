import { test, expect, Locator } from './helpers/fixtures';
import { explainedArticlePage } from './pages/explainedArticlePage';
import { hosts } from './helpers/hosts';

let explained: explainedArticlePage;

for (const [short, host] of Object.entries(hosts)) {
  test.describe('explained article tests', () => {
    test.beforeEach(async ({ page }) => {
      explained = new explainedArticlePage(page);
      await explained.goto(host + explained.pageLinks.explained);
      await explained.explainedArticle.first().click();
    });

    test(`[${short}] check article elements @smoke`, async ({ isMobile }) => {
      await explained.checkArticleElements(isMobile, short);
    });

    test(`[${short}] click on article author link`, async ({ page }) => {
      const authorLink = await explained.authorLink.getAttribute('href');
      await explained.authorLink.click();
      await expect(page).toHaveURL(host + String(authorLink));
    });

    test(`[${short}] click on article leaderboard`, async () => {
      test.skip(short === 'fr', 'Leaderboard not displayed on FR');
      await explained.closeCookies();
      await explained.articleLeaderboard.scrollIntoViewIfNeeded();
      await explained.articleLeaderboard.click();
      expect(await explained.getCountTabs()).toEqual(2);
    });

    test.describe('navigation', () => {
      test(`[${short}] explained navigation leads to proper heading @smoke`, async ({ page, isMobile }) => {
        let linkText: string;
        if (!isMobile) {
          linkText = await explained.articleNavigationLink.nth(1).innerText();
          await explained.articleNavigationLink.nth(1).click();
        } else {
          await explained.articleMobileNavigation.click();
          linkText = await explained.articleMobileNavigationLink.nth(1).innerText();
          await explained.articleMobileNavigationLink.nth(1).click();
        }
        await expect(page.locator('h2').filter({ hasText: `${linkText.slice(3)}` })).toBeVisible();
      });

      test(`[${short}] explained navigation link selected`, async ({ isMobile }) => {
        let linkText: string;
        let selectedLink: Locator;
        let navigationLink: Locator;
        if (!isMobile) {
          navigationLink = explained.articleNavigationLink.nth(2);
          linkText = await navigationLink.innerText();
          await navigationLink.click();
          selectedLink = explained.articleNavigationLinkActive;
        } else {
          await explained.articleMobileNavigation.click();
          navigationLink = explained.articleMobileNavigationLink.nth(2);
          linkText = await navigationLink.innerText();
          await navigationLink.click();
          selectedLink = explained.articleMobileNavigationLinkActive;
        }
        await expect(selectedLink).toHaveText(linkText);
      });
    });

    test.describe('breadcrumbs', () => {
      test(`[${short}] click on home link`, async ({ page }) => {
        await explained.homeLink.locator('a').click();
        await expect(page).toHaveURL(host);
      });

      test(`[${short}] click on explained link`, async ({ page }) => {
        await explained.explainedPageLink.locator('a').click();
        await expect(page).toHaveURL(host + explained.pageLinks.explained);
      });

      test(`[${short}] click on article link`, async ({ page }) => {
        await page.waitForTimeout(1000);
        const articleLink = page.url();
        await explained.explainedArticleLink.locator('a').click();
        await expect(page).toHaveURL(articleLink);
      });
    });
  });
}
