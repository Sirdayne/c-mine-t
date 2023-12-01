import { test, expect } from './helpers/fixtures';
import { AuthorPage } from './pages/authorPage';
import { PostPage } from './pages/postPage';
import { hosts } from './helpers/hosts';

let authorPage: AuthorPage;

for (const [short, host] of Object.entries(hosts)) {
  test.describe('author page tests', () => {
    test.beforeEach(async ({ page }) => {
      authorPage = new AuthorPage(page);
      await authorPage.goto(host + authorPage.pageLinks.authorPage);
    });

    test.describe('check the elements', () => {
      test(`[${short}] author page overview @smoke`, async ({ isMobile }) => {
        let elements = [
          authorPage.authorTitle,
          authorPage.authorSocials,
          authorPage.authorImage,
          authorPage.authorDescription,
          authorPage.articleCard,
          authorPage.sidebar.sidebar,
        ];
        if (isMobile) {
          elements = elements.slice(0, -1);
        }
        await authorPage.elementsToBeVisible(elements);
        expect(await authorPage.articleCard.count()).toBeGreaterThan(10);
      });

      test(`[${short}] article card overview @smoke`, async () => {
        const elements = [
          authorPage.articleTitle,
          authorPage.articlePublicationDate,
          authorPage.articleImage,
          authorPage.articleBadge,
          authorPage.articleAuthor,
        ];
        await authorPage.elementsToBeVisible(elements);
        const articleAuthor = await authorPage.articleAuthor.first().innerText();
        expect(articleAuthor).toEqual(await authorPage.getAuthorPageTitle());
      });
    });

    test(`[${short}] author socials`, async () => {
      for (const link of (await authorPage.authorSocials.all()).slice(0, 2)) {
        await link.click();
        expect(await authorPage.getCountTabs()).toEqual(2);
      }
    });

    test(`[${short}] go to article`, async ({ page }) => {
      const postPage = new PostPage(page);
      const authorTitle = (await authorPage.getAuthorPageTitle()).toUpperCase();
      await authorPage.articleCard.first().click();
      await expect.soft(page).toHaveURL(/news/);
      expect(authorTitle).toEqual(await postPage.authorName.first().innerText());
    });
  });
}
