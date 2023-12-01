import { expect, test } from './helpers/fixtures';
import { PostPage } from './pages/postPage';
import { AuthorPage } from './pages/authorPage';
import { hosts } from './helpers/hosts';

let post: PostPage;

for (const [short, host] of Object.entries(hosts)) {
  test.describe('post page tests', () => {
    test.beforeEach(async ({ page }) => {
      post = new PostPage(page);
      await post.goto(host + post.pageLinks.post);
    });

    test(`[${short}] post page elements @smoke`, async ({ isMobile }) => {
      await post.checkPostElements(isMobile, short);
    });

    test(`[${short}] click on post author link`, async ({ page }) => {
      const author = new AuthorPage(page);
      const authorName = await post.authorName.first().innerText();
      await post.authorName.first().click();
      await expect.soft(page).toHaveURL(/authors/);
      const authorPageName = await author.getAuthorPageTitle();
      expect(authorPageName.toUpperCase()).toEqual(authorName);
    });

    test.describe('post audio player', () => {
      test.skip(short !== 'en', 'Audio player exist only for EN version');

      test(`[${short}] listen the post audio`, async () => {
        const postAudioDurationBefore = await post.listenToArticleTimer.first().innerText();
        await post.listenToArticlePlayButton.first().click();
        await post.page.waitForTimeout(4000);
        await post.listenToArticlePlayButton.first().click();
        const postAudioDurationAfter = await post.listenToArticleTimer.first().innerText();
        expect(postAudioDurationBefore).not.toEqual(postAudioDurationAfter);
      });

      test(`[${short}] post audio file link`, async () => {
        const audioLink = await post.downloadAsMp3Button.first().getAttribute('href');
        expect(audioLink).toContain('mp3');
      });
    });

    test(`[${short}] join us social block`, async ({ isMobile }) => {
      test.skip(short !== 'en', 'join us social block exist only for EN version');
      test.skip(isMobile === true, 'Temporarily disabled for mobile because of Chrome issue');
      for (const link of await post.joinUsBlockItem.all()) {
        await link.click();
        expect.soft(await post.getCountTabs()).toEqual(2);
      }
    });

    test(`[${short}] click on tag link`, async ({ page }) => {
      const tagLink = await post.postTag.first().getAttribute('href');
      await post.postTag.first().click();
      await expect(page).toHaveURL(host + tagLink);
    });

    test.describe('post related news', () => {
      test.skip(short === 'jp', 'On JP version, we are using Popin for related articles');

      test(`[${short}] related news overview`, async () => {
        await expect.soft(post.relatedNewsBlockTitle.first()).toBeVisible();
        await expect.soft(post.relatedNewsPostImage.first()).toBeVisible();
        await expect(post.relatedNewsTitle.first()).toBeVisible();
      });

      test(`[${short}] click on related news post`, async ({ page }) => {
        const relatedPostTitle = await post.relatedNewsTitle.first().innerText();
        await post.relatedNewsTitle.first().click();
        await page.waitForTimeout(2000);
        expect(await page.title()).toContain(relatedPostTitle);
      });
    });

    test(`[${short}] click on banner under the post`, async ({ isMobile }) => {
      let banner = post.desktopAdvertiseBanner;
      if (isMobile) {
        banner = post.mobileAdvertiseBanner;
      }
      if (await banner.first().isVisible()) {
        await banner.first().click();
        expect(await post.getCountTabs()).toEqual(2);
      }
    });

    test(`[${short}] infinity scroll`, async () => {
      test.slow();
      const articleCount = 4;
      expect(await post.scrollToLastPost()).toBeGreaterThanOrEqual(articleCount);
    });

    test.describe('historical widget', () => {
      test(`[${short}] collect article button click`, async ({ page }) => {
        test.skip(!['en'].includes(short), 'Historical collection block displayed only for EN version');
        const pagePromise = page.context().waitForEvent('page');
        await post.collectButton.first().click();
        const newTab = await pagePromise;
        await expect(newTab).toHaveURL(/mint.cointelegraph.com/);
      });

      test(`[${short}] collectors block visibility`, async () => {
        test.skip(!['en'].includes(short), 'Historical collection block displayed only for EN version');
        await expect(post.collectorsBlock.first()).toBeVisible();
      });
    });
  });
}
