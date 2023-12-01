import { CategoryPage } from './pages/categoryPage';
import { expect, test } from './helpers/fixtures';
import { PostPage } from './pages/postPage';
import { hosts } from './helpers/hosts';

let category: CategoryPage;

for (const [short, host] of Object.entries(hosts)) {
  test.describe('category page tests', () => {
    test.beforeEach(async ({ page }, testInfo) => {
      category = new CategoryPage(page);
      if (testInfo.title.includes('press release')) {
        await category.goto(host + category.pageLinks.pressReleasesPage);
      } else {
        await category.goto(host + category.pageLinks.categoryPage);
      }
    });

    test.describe('elements overview', () => {
      test(`[${short}] page elements overview @smoke`, async ({ isMobile }) => {
        await category.closeLanguageOffer();
        await category.checkCategoryElements(isMobile, short);
      });

      test(`[${short}] article elements overview @smoke`, async () => {
        await category.checkCategoryArticleElements(short);
      });
    });

    test(`[${short}] click on load more button`, async () => {
      test.skip('tr'.includes(short), 'There are no more than 15 articles on TR');
      const articleCountBefore = 15;
      const articleCountAfter = 30;
      await expect.soft(category.article).toHaveCount(articleCountBefore);
      await category.loadMoreButton.scrollIntoViewIfNeeded();
      await expect(category.article).toHaveCount(articleCountAfter);
    });

    test.describe('articles tests', () => {
      test(`[${short}] article opening`, async ({ page }) => {
        const postPage = new PostPage(page);
        const articleTitle = await category.articleTitle.first().innerText();
        await category.articleTitle.first().click();
        expect((await postPage.postTitle.innerText()).includes(articleTitle)).toBeTruthy();
      });

      test(`[${short}] click on article author link`, async ({ page }) => {
        const articleAuthor = await category.articleAuthor.first().innerText();
        await category.articleAuthor.first().click();
        await page.waitForLoadState('networkidle');
        const authorPageTitle = await category.getPageTitle();
        expect(articleAuthor.includes(authorPageTitle)).toBeTruthy();
      });
    });

    test.describe('press releases', () => {
      test(`[${short}] press releases page elements overview @smoke`, async ({ isMobile }) => {
        await category.checkCategoryElements(isMobile, short);
      });

      test(`[${short}] open the press release article`, async () => {
        await category.goToPressReleaseArticle(short);
      });
    });
  });
}
