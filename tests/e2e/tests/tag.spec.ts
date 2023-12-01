import { expect, test } from './helpers/fixtures';
import { TagPage } from './pages/tagPage';
import { PostPage } from './pages/postPage';
import { hosts } from './helpers/hosts';

let tagPage: TagPage;

for (const [short, host] of Object.entries(hosts)) {
  test.describe('tag page tests', () => {
    test.beforeEach(async ({ page }) => {
      tagPage = new TagPage(page);
      await tagPage.goto(host + tagPage.pageLinks.tagPage);
    });

    test.describe('page elements', () => {
      test(`[${short}] tag page elements @smoke`, async ({ isMobile }) => {
        await tagPage.checkPageElements(isMobile, short);
      });

      test(`[${short}] tag article elements @smoke`, async () => {
        await tagPage.checkArticleElements(short);
      });
    });

    test(`[${short}] load more button`, async () => {
      const articlesBefore = 15;
      const articlesAfter = 30;
      await expect.soft(tagPage.pageArticle).toHaveCount(articlesBefore);
      await tagPage.loadMoreButton.scrollIntoViewIfNeeded();
      await expect(tagPage.pageArticle).toHaveCount(articlesAfter);
    });

    test(`[${short}] check a tag of the article`, async ({ page }) => {
      const postPage = new PostPage(page);
      const pageTitle = await tagPage.pageTitle.innerText();
      await tagPage.articleTitle.first().click();
      const postTag = await postPage.postTag.first().innerText();
      expect(pageTitle.toLowerCase()).toContain(postTag.slice(1).toLowerCase());
    });

    test.describe('promo button', () => {
      test.skip(['cn', 'jp', 'es', 'fr'].includes(short), 'No promo button on these franchises');

      test(`[${short}] promo button is visible`, async ({ isMobile }) => {
        if (isMobile) {
          await expect(tagPage.promoButtonMobile.first()).toBeVisible();
        } else {
          await expect(tagPage.promoButton).toBeVisible();
        }
      });

      test(`[${short}] promo button disclaimer`, async ({ isMobile }) => {
        if (isMobile) {
          await expect(tagPage.promoButtonDisclaimerMobile).toBeVisible();
        } else {
          await tagPage.promoButton.hover();
          await expect(tagPage.promoButtonDisclaimer).toBeVisible();
        }
      });

      test(`[${short}] click promo button`, async ({ isMobile }) => {
        if (isMobile) {
          await tagPage.promoButtonMobile.first().click();
        } else {
          await tagPage.promoButton.click();
        }
        expect(await tagPage.getCountTabs()).toEqual(2);
      });
    });
  });
}
