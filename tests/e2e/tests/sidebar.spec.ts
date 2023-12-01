import { test, expect } from './helpers/fixtures';
import { Sidebar } from './pages/sidebar/sidebar';
import { hosts } from './helpers/hosts';

let sidebar: Sidebar;

for (const [short, host] of Object.entries(hosts)) {
  test.describe('sidebar tests', () => {
    test.beforeEach(async ({ page }) => {
      sidebar = new Sidebar(page);
      await sidebar.goto(host + sidebar.pageLinks.post);
    });

    test.describe('editors choice', () => {
      test(`[${short}] editors choice widget overview @smoke`, async ({ isMobile }) => {
        test.skip(isMobile === true, 'Sidebar not displayed on mobile devices');
        const countOfArticles = 5;
        await expect.soft(sidebar.editorsChoiceTitle).toBeVisible();
        await expect(sidebar.editorsChoiceWidgetArticle).toHaveCount(countOfArticles);
      });

      test(`[${short}] click on article in editors choice widget`, async ({ page, isMobile }) => {
        test.skip(isMobile === true, 'Sidebar not displayed on mobile devices');
        for (const article of await sidebar.editorsChoiceWidgetArticle.all()) {
          const articleTitle = await article.innerText();
          const articleLink = await article.getAttribute('href');
          if (articleLink !== null && articleLink.includes('magazine')) {
            const [newTab] = await Promise.all([page.context().waitForEvent('page'), article.click()]);
            expect.soft(await newTab.title()).toContain(articleTitle);
          } else {
            await article.click();
            await page.waitForTimeout(1000);
            expect.soft(await page.title()).toContain(articleTitle);
          }
        }
      });
    });

    test.describe('youtube widget', () => {
      test(`[${short}] youtube widget overview`, async ({ isMobile }) => {
        test.skip(isMobile === true, 'Sidebar not displayed on mobile devices');
        if (await sidebar.youtubeContainer.first().isVisible()) {
          await sidebar.youtubeContainer.first().scrollIntoViewIfNeeded();
          const elements = [sidebar.youtubePauseButton, sidebar.youtubeSubscribeButton];
          await sidebar.elementsToBeVisible(elements);
        }
      });

      test(`[${short}] click on youtube subscribe button`, async ({ page, isMobile }) => {
        test.skip(isMobile === true, 'Sidebar not displayed on mobile devices');
        if (await sidebar.youtubeContainer.first().isVisible()) {
          const [newTab] = await Promise.all([
            page.context().waitForEvent('page'),
            await sidebar.youtubeSubscribeButton.first().click(),
          ]);
          await expect(newTab).toHaveURL(/youtube.com/);
        }
      });
    });

    test.describe('advertisement', () => {
      test(`[${short}] click on banners`, async ({ isMobile }) => {
        test.skip(isMobile === true, 'Sidebar not displayed on mobile devices');
        for (const banner of await sidebar.banners.all()) {
          await banner.click();
          expect.soft(await sidebar.getCountTabs()).toEqual(2);
        }
      });

      test(`[${short}] click on promo buttons`, async ({ isMobile }) => {
        test.skip(isMobile === true, 'Sidebar not displayed on mobile devices');
        for (const button of await sidebar.promoButtons.all()) {
          await button.click();
          expect.soft(await sidebar.getCountTabs()).toEqual(2);
        }
      });

      test(`[${short}] promo button disclaimer`, async ({ isMobile }) => {
        test.skip(['fr', 'jp', 'cn'].includes(short), 'Promo buttons not displayed on this version');
        test.skip(isMobile === true, 'Sidebar not displayed on mobile devices');
        await sidebar.promoButtons.first().hover();
        const elements = [
          sidebar.promoButtonDisclaimer,
          sidebar.promoButtonDisclaimerLogo,
          sidebar.promoButtonDisclaimerText,
        ];
        await sidebar.elementsToBeVisible(elements);
      });

      test(`[${short}] click on advertise with us link`, async ({ page, isMobile }) => {
        test.skip(['fr'].includes(short), 'Banners not displayed on FR version');
        test.skip(isMobile === true, 'Sidebar not displayed on mobile devices');
        const [newTab] = await Promise.all([
          page.context().waitForEvent('page'),
          sidebar.advertiseLink.first().click(),
        ]);
        expect.soft(newTab.context().pages().length).toEqual(2);
        await expect(newTab).toHaveURL(/advertise/);
      });
    });

    test(`[${short}] price indexes widget`, async ({ isMobile }) => {
      test.skip(['tr', 'jp'].includes(short), 'Widget not displayed on this version');
      test.skip(isMobile === true, 'Sidebar not displayed on mobile devices');
      await expect(sidebar.priceIndexesWidget).toBeVisible();
    });
  });
}
