import { expect, test } from './helpers/fixtures';
import { MainPage } from './pages/mainPage';
import { AuthorPage } from './pages/authorPage';
import { CookiesPanel } from './pages/cookiesPanel/cookiesPanel';
import { Leaderboard } from './pages/leaderboard/leaderboard';
import { hosts } from './helpers/hosts';

let main: MainPage;

for (const [short, host] of Object.entries(hosts)) {
  test.describe('main page tests', () => {
    test.beforeEach(async ({ page }) => {
      main = new MainPage(page);
      await main.goto(host);
    });

    test(`[${short}] meta title of the main page`, async ({ page }) => {
      expect(page).toHaveTitle(main.metaSeoTitles[short]);
    });

    test.describe('carousel tests', () => {
      test(`[${short}] carousel overview @smoke`, async ({ isMobile }) => {
        test.skip(isMobile === true, 'Carousel present only on desktop');
        await expect.soft(main.carouselImage).toBeVisible();
        await expect.soft(main.carouselPublicationDate).toBeVisible();
        await expect.soft(main.carouselAuthor).toBeVisible();
        await expect(main.carouselTitle).not.toBeEmpty();
      });

      test(`[${short}] carousel title click`, async ({ page, isMobile }) => {
        test.skip(isMobile === true, 'Carousel present only on desktop');
        const articleTitle = await main.carouselTitle.innerText();
        const postLink = await main.carouselTitleLink.first().getAttribute('href');
        if (postLink !== null && postLink.includes('magazine')) {
          const [newTab] = await Promise.all([
            page.context().waitForEvent('page'),
            main.carouselTitle.click(),
            page.waitForTimeout(2000),
          ]);
          expect(await newTab.title()).toContain(articleTitle);
        } else {
          await main.carouselTitle.click();
          await page.waitForTimeout(2000);
          expect(await page.title()).toContain(articleTitle);
        }
      });

      test(`[${short}] go to author page from the carousel`, async ({ page, isMobile }) => {
        test.skip(isMobile === true, 'Carousel present only on desktop');
        const author = new AuthorPage(page);
        const postAuthor = await main.carouselAuthor.innerText();
        await main.carouselAuthor.click();
        expect(await author.getAuthorPageTitle()).toEqual(postAuthor);
      });
    });

    test.describe('post cards tests', () => {
      test(`[${short}] post card overview @smoke`, async ({ isMobile }) => {
        await main.checkPostCardElements(isMobile, short);
      });

      test(`[${short}] go to author page from the post card`, async ({ page, isMobile }) => {
        const author = new AuthorPage(page);
        let postAuthor = main.postAuthor;
        if (isMobile && ['jp', 'cn'].includes(short)) {
          postAuthor = main.postAuthorAsia;
        }
        const postAuthorName = await postAuthor.first().innerText();
        await postAuthor.first().click();
        await page.waitForTimeout(3000);
        const authorPageTitle = await author.getAuthorPageTitle();
        expect(postAuthorName).toContain(authorPageTitle);
      });

      test(`[${short}] post card lead text is visible and not empty`, async ({ isMobile }) => {
        test.skip(isMobile === true, 'Post lead text present only on desktop');
        await expect.soft(main.postLeadtext.first()).toBeVisible();
        await expect(main.postLeadtext.first()).not.toBeEmpty();
      });

      test(`[${short}] click on load more posts button`, async ({ page, isMobile }) => {
        let postListingItem = main.postListingItem;
        let loadMoreButton = main.loadMoreButton;
        let listingItemBefore = 30;
        if (isMobile && ['jp', 'cn'].includes(short)) {
          listingItemBefore = 25;
          postListingItem = main.postListingItmeAsia;
          loadMoreButton = main.loadMoreButtonAsia;
        } else if (isMobile) {
          listingItemBefore = 23;
        }
        await expect.soft(postListingItem).toHaveCount(listingItemBefore);
        await loadMoreButton.click();
        await page.waitForTimeout(1000);
        expect(await postListingItem.count()).toBeGreaterThan(listingItemBefore);
      });

      test(`[${short}] click on post card`, async ({ page, isMobile }) => {
        let postTitle = main.postTitle;
        let postLink = main.postLink;
        if (isMobile && ['jp', 'cn'].includes(short)) {
          postTitle = main.postTitleAsia;
          postLink = main.postLinkAsia;
        }
        const articleTitle = await postTitle.first().innerText();
        const articleLink = await postLink.first().getAttribute('href');
        await postTitle.first().click();
        await page.waitForTimeout(2000);
        if (articleLink !== null && articleLink.includes('magazine')) {
          const [newTab] = await Promise.all([page.context().waitForEvent('page')]);
          expect(await newTab.title()).toContain(articleTitle);
        } else {
          expect((await page.title()).toLowerCase()).toContain(articleTitle.toLowerCase());
        }
      });
    });

    test.describe('editors choice tests', () => {
      test(`[${short}] count of editors choice tab posts @smoke`, async ({ isMobile }) => {
        const countOfEditorsChoicePosts = 5;
        if (isMobile && ['jp', 'cn'].includes(short)) {
          await expect(main.editorsChoiceArticleAsia).toHaveCount(countOfEditorsChoicePosts);
        } else {
          await main.editorsChoiceTab.click();
          await expect(main.activeTabPosts).toHaveCount(countOfEditorsChoicePosts);
        }
      });

      test(`[${short}] click on editors choice post`, async ({ page, isMobile }) => {
        let editorsChoiceArticle = main.activeTabPosts;
        if (isMobile && ['jp', 'cn'].includes(short)) {
          editorsChoiceArticle = main.editorsChoiceArticleAsia;
        } else {
          await main.editorsChoiceTab.click();
        }
        const editorsChoicePostTitle = await editorsChoiceArticle.first().innerText();
        const editorsChoicePostLink = await editorsChoiceArticle.first().getAttribute('href');
        if (editorsChoicePostLink !== null && editorsChoicePostLink.includes('magazine')) {
          const [newTab] = await Promise.all([
            page.context().waitForEvent('page'),
            editorsChoiceArticle.first().click(),
            page.waitForTimeout(2000),
          ]);
          expect(await newTab.title()).toContain(editorsChoicePostTitle);
        } else {
          await editorsChoiceArticle.first().click();
          await page.waitForTimeout(2000);
          expect(await page.title()).toContain(editorsChoicePostTitle);
        }
      });
    });

    test.describe('hot stories tests', () => {
      test(`[${short}] count of hot stories tab posts`, async ({ isMobile }) => {
        test.skip(isMobile && ['jp', 'cn'].includes(short), 'Hot stories not exist on Asian mobile template');
        test.skip(['cn'].includes(short), 'On CN desktop version, hot stories articles not added');
        await main.hotStoriesTab.click();
        expect(await main.activeTabPosts.count()).toBeGreaterThanOrEqual(1);
      });

      test(`[${short}] click on hot stories post`, async ({ page, isMobile }) => {
        test.skip(isMobile && ['jp', 'cn'].includes(short), 'Hot stories not exist on Asian mobile template');
        test.skip(['cn'].includes(short), 'On CN desktop version, hot stories articles not added');
        await main.hotStoriesTab.click();
        const hotStoriesPostTitle = await main.activeTabPosts.first().innerText();
        await main.activeTabPosts.first().click();
        await page.waitForTimeout(2000);
        expect(await page.title()).toContain(hotStoriesPostTitle);
      });
    });

    test.describe('press releases tests', () => {
      test(`[${short}] press releases block elements @smoke`, async ({ isMobile }) => {
        const countOfPressReleasesPosts = 3;
        if (isMobile) {
          await expect.soft(main.pressReleasesLoadMoreButton.first()).toBeVisible();
          await expect.soft(main.pressReleasePosts).toHaveCount(countOfPressReleasesPosts);
          await expect(main.pressReleasesBlockTitle.first()).not.toBeEmpty();
        } else {
          await expect.soft(main.pressReleasesButton.nth(0)).toBeVisible();
          await expect.soft(main.pressReleasesButton.nth(1)).toBeVisible();
          await expect(main.pressReleasesBlockTitle.first()).not.toBeEmpty();
        }
        await expect.soft(main.pressReleaseImage.first()).toBeVisible();
        await expect.soft(main.pressReleaseTitle.first()).toBeVisible();
      });

      test(`[${short}] go to press release page`, async ({ page }) => {
        await main.pressReleasesBlockTitle.first().click();
        await expect(page).toHaveURL(host + '/press-releases');
      });

      test(`[${short}] go to press release post`, async ({ page }) => {
        await main.pressReleasePosts.first().click();
        await expect(page).toHaveURL(/press-releases/);
      });
    });

    test.describe('youtube stretch banner tests', () => {
      test(`[${short}] youtube stretch banner overview`, async () => {
        if (await main.youtubeStretchBanner.isVisible()) {
          await expect.soft(main.youtubeStretchBanner).toBeVisible();
          await expect.soft(main.youtubeStretchBannerTitle).not.toBeEmpty();
          await expect.soft(main.youtubeStretchBannerDescription).not.toBeEmpty();
          await expect.soft(main.youtubeStretchBannerSubscribe).toBeVisible();
          await expect(main.youtubeStretchBannerVideo).toBeVisible();
        }
      });

      test(`[${short}] youtube stretch banner subscribe`, async ({ page }) => {
        if (await main.youtubeStretchBanner.isVisible()) {
          const [newTab] = await Promise.all([
            page.context().waitForEvent('page'),
            main.youtubeStretchBannerSubscribe.click(),
          ]);
          await expect(newTab).toHaveURL(/youtube.com/);
        }
      });

      test(`[${short}] youtube stretch banner title`, async ({ page }) => {
        if (await main.youtubeStretchBanner.isVisible()) {
          const [newTab] = await Promise.all([
            page.context().waitForEvent('page'),
            main.youtubeStretchBannerTitle.click(),
          ]);
          await expect(newTab).toHaveURL(/youtube.com/);
        }
      });
    });

    test.describe('universal block tests', () => {
      test(`[${short}] innovation circle universal block overview`, async ({ isMobile }) => {
        test.skip();
        test
          .info()
          .annotations.push({ type: 'bug', description: 'https://cointelegraph.atlassian.net/browse/CDT-2275' });
        const countOfPostsInUniversalBlock = 4;
        if (isMobile) {
          await expect.soft(main.universalBlockLoadMoreButton.last()).toBeVisible();
        } else {
          await expect.soft(main.universalBlockButtonPrev.last()).toBeVisible();
          await expect.soft(main.universalBlockButtonNext.last()).toBeVisible();
        }
        await expect.soft(main.universalBlockTitle.last()).toHaveText('Innovation Circle');
        await expect.soft(main.universalBlockItemImage.last()).toBeVisible();
        await expect.soft(main.universalBlockItemTitle.last()).toBeVisible();
        await expect.soft(main.universalBlockItem).toHaveCount(countOfPostsInUniversalBlock);
      });

      test(`[${short}] universal block overview`, async ({ isMobile }) => {
        const countOfPostsInUniversalBlock = 4;
        if (await main.universalBlock.isVisible()) {
          if (isMobile) {
            await expect.soft(main.universalBlockLoadMoreButton.first()).toBeVisible();
          } else {
            await expect.soft(main.universalBlockButtonPrev.first()).toBeVisible();
            await expect.soft(main.universalBlockButtonNext.first()).toBeVisible();
          }
          await expect.soft(main.universalBlockTitle.first()).not.toBeEmpty();
          await expect.soft(main.universalBlockItemImage.first()).toBeVisible();
          await expect.soft(main.universalBlockItemTitle.first()).toBeVisible();
          await expect.soft(main.universalBlockItem).toHaveCount(countOfPostsInUniversalBlock);
        }
      });

      test(`[${short}] universal block load more articles`, async ({ isMobile }) => {
        const countOfPostsInUniversalBlockBefore = 4;
        const countOfPostsInUniversalBlockAfter = 8;
        if (await main.universalBlock.isVisible()) {
          if (isMobile) {
            await expect.soft(main.universalBlockItem).toHaveCount(countOfPostsInUniversalBlockBefore);
            await main.universalBlockLoadMoreButton.click();
            await expect.soft(main.universalBlockItem).toHaveCount(countOfPostsInUniversalBlockAfter);
          } else {
            test.skip(isMobile === false, 'Load more button present only on mobile');
          }
        }
      });

      test(`[${short}] universal block open article`, async ({ page }) => {
        if (await main.universalBlock.isVisible()) {
          const universalBlockArticleTitle = await main.universalBlockItemTitle.first().getAttribute('title');
          await main.universalBlockItem.first().click();
          await expect(page).toHaveTitle(String(universalBlockArticleTitle));
        }
      });
    });

    test.describe('banners tests', () => {
      test(`[${short}] go to leaderboard`, async ({ page, isMobile, context }) => {
        test.skip(['fr'].includes(short), 'On FR not displayed banners');
        const leaderboard = new Leaderboard(page);
        let leaderboardLocator = leaderboard.leaderboard;
        if (isMobile && ['jp', 'cn'].includes(short)) {
          leaderboardLocator = leaderboard.leaderboardAsiaMobile;
        }
        const countOfTabs = 2;
        await page.waitForTimeout(2000);
        await Promise.all([context.waitForEvent('page'), leaderboardLocator.click()]);
        const pagesCount = context.pages().length;
        expect(pagesCount).toEqual(countOfTabs);
      });

      test(`[${short}] click on banners`, async ({ page }) => {
        test.skip(['ar', 'br', 'de'].includes(short), 'Temporary skip, because mobile chrome bug');
        const countOfTabs = 2;
        for (const banner of await main.advertiseBanners.all()) {
          const pagePromise = page.context().waitForEvent('page');
          await banner.click();
          const newTab = await pagePromise;
          expect(newTab.context().pages().length).toEqual(countOfTabs);
          newTab.close();
        }
      });
    });

    test(`[${short}] accept cookies panel`, async ({ page }) => {
      const cookies = new CookiesPanel(page);
      await cookies.acceptCookies();
      await expect(cookies.cookiesContainer).not.toBeVisible();
    });

    test(`[${short}] back to top button`, async ({ isMobile }) => {
      let loadMoreButton = main.loadMoreButton;
      if (isMobile && ['jp', 'cn'].includes(short)) {
        loadMoreButton = main.loadMoreButtonAsia;
      }
      expect(await main.pageIsScrolled()).toBeFalsy();
      await loadMoreButton.scrollIntoViewIfNeeded();
      await main.backToTopButton.click();
      expect(await main.pageIsScrolled()).toBeTruthy();
    });

    test.describe('historical widget', () => {
      test(`[${short}] historical block overview`, async ({ isMobile }) => {
        test.skip(!['en'].includes(short), 'Historical collection block displayed only for EN version');
        await main.checkHistoricalWidgetElements(isMobile);
      });

      test(`[${short}] click on historical title link`, async ({ page }) => {
        test.skip(!['en'].includes(short), 'Historical collection block displayed only for EN version');
        const pagePromise = page.context().waitForEvent('page');
        await main.recentlyCollectedTitleLink.click();
        const newTab = await pagePromise;
        await expect(newTab).toHaveURL(/historical/);
      });

      test(`[${short}] read article button click`, async ({ page, isMobile }) => {
        test.skip(!['en'].includes(short), 'Historical collection block displayed only for EN version');
        test.skip(isMobile, 'Read button not display on mobile');
        await main.recentlyCollectedItem.first().hover();
        await main.recentlyCollectedReadButton.first().click();
        await expect(page).not.toHaveURL(host);
      });

      test(`[${short}] collect article button click`, async ({ page, isMobile }) => {
        test.skip(!['en'].includes(short), 'Historical collection block displayed only for EN version');
        test.skip(isMobile, 'Collect button not display on mobile');
        await main.recentlyCollectedItem.first().hover();
        const pagePromise = page.context().waitForEvent('page');
        await main.recentlyCollectedCollectButton.first().click();
        const newTab = await pagePromise;
        await expect(newTab).toHaveURL(/mint.cointelegraph.com/);
      });

      test(`[${short}] slider item click`, async ({ page }) => {
        test.skip(!['en'].includes(short), 'Historical collection block displayed only for EN version');
        const pagePromise = page.context().waitForEvent('page');
        await main.recentlyCollectedItem.first().click();
        const newTab = await pagePromise;
        await expect(newTab).toHaveURL(/mint.cointelegraph.com/);
      });
    });
  });
}
