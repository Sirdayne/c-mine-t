import { expect, test } from './helpers/fixtures';
import { IndividualPodcast } from './pages/individualPodcast';
import { PostPage } from './pages/postPage';
import { hosts } from './helpers/hosts';

let individualPodcast: IndividualPodcast;

test.beforeEach(async ({ page }) => {
  individualPodcast = new IndividualPodcast(page);
  await individualPodcast.goto(hosts['en'] + individualPodcast.pageLinks.individualPodcast);
});

test.describe('check elements', () => {
  test('[en] podcast page overview @smoke', async ({ isMobile }) => {
    let elements = [
      individualPodcast.breadcrumbLinks,
      individualPodcast.title,
      individualPodcast.authorLink,
      individualPodcast.description,
      individualPodcast.listenOnBlock,
      individualPodcast.aboutHostsTitle,
      individualPodcast.hostsWrapper,
      individualPodcast.carouselTitle,
      individualPodcast.carouselItem,
      individualPodcast.disclaimer,
      individualPodcast.relatedArticlesBlock,
      individualPodcast.relatedArticleBlockTitle,
      individualPodcast.sidebar,
    ];
    if (isMobile) {
      elements = elements.slice(0, -1);
    }
    await individualPodcast.elementsToBeVisible(elements);
  });

  test('[en] about the hosts block overview @smoke', async () => {
    const elements = [
      individualPodcast.aboutHostsTitle,
      individualPodcast.authorLinkInHosts,
      individualPodcast.authorImage,
      individualPodcast.authorDescription,
    ];
    await individualPodcast.elementsToBeVisible(elements);
  });

  test('[en] other podcasts block overview @smoke', async () => {
    const elements = [
      individualPodcast.carouselTitle,
      individualPodcast.carouselItem,
      individualPodcast.carouselArrows,
    ];
    await individualPodcast.elementsToBeVisible(elements);
  });

  test('[en] related articles block overview @smoke', async () => {
    const elements = [individualPodcast.relatedArticleImage, individualPodcast.relatedArticleTitle];
    await individualPodcast.elementsToBeVisible(elements);
    expect(await individualPodcast.relatedArticleItem.count()).toEqual(6);
  });

  test('[en] mobile ad placements overview', async ({ isMobile }) => {
    test.skip(!isMobile, 'These placements only for mobile');
    const elements = [
      individualPodcast.youtubeContainer,
      individualPodcast.mobileBanner,
      individualPodcast.promoButtonItem,
      individualPodcast.promoButtonStackDisclaimer,
    ];
    await individualPodcast.elementsToBeVisible(elements);
  });
});

test('[en] check breadcrumb links', async ({ page }) => {
  await individualPodcast.breadcrumbLinks.nth(0).click();
  await page.waitForURL('');
  await expect.soft(page).toHaveURL('');
  await page.goBack();
  await individualPodcast.breadcrumbLinks.nth(1).click();
  await expect(page).toHaveURL(/podcasts/);
});

test.describe('check authors', () => {
  test('[en] check author links', async () => {
    await individualPodcast.checkAuthorlinks(individualPodcast.authorLink);
  });

  test('[en] check author links in about the hosts block', async () => {
    await individualPodcast.checkAuthorlinks(individualPodcast.authorLinkInHosts);
  });
});

test('[en] check listen on links', async ({ isMobile }) => {
  test.skip(isMobile, 'Temporarily disabled for mobile because of Chrome issue');
  for (const link of await individualPodcast.listenOnIcon.all()) {
    await link.click();
    expect.soft(await individualPodcast.getCountTabs()).toEqual(2);
  }
});

test.describe('other podcasts block', () => {
  test('[en] check carousel', async () => {
    const firstItemTitle = await individualPodcast.carouselItem.nth(0).innerText();
    await individualPodcast.carouselArrows.nth(1).click();
    const firstItemTitleAfterForwardClick = await individualPodcast.carouselItem.nth(0).innerText();
    expect.soft(firstItemTitle).not.toEqual(firstItemTitleAfterForwardClick);
    await individualPodcast.carouselArrows.nth(0).click();
    const firstItemTitleAgain = await individualPodcast.carouselItem.nth(0).innerText();
    expect(firstItemTitle).toEqual(firstItemTitleAgain);
  });

  test('[en] go to other podcast', async ({ page }) => {
    await individualPodcast.carouselItem.first().click();
    await expect.soft(page).toHaveURL(/podcast/);
  });
});

test('[en] go to related article', async ({ page }) => {
  const postPage = new PostPage(page);
  const relatedTitle = await individualPodcast.relatedArticleTitle.first().innerText();
  await individualPodcast.relatedArticleTitle.first().click();
  await page.waitForTimeout(2000);
  if (page.url().includes('news')) {
    expect(await postPage.getPageTitle()).toContain(relatedTitle);
  } else {
    expect(page).toHaveURL(/cointelegraph/);
  }
});

test.describe('mobile ad placements', () => {
  test('[en] youtube banner autoplay', async ({ isMobile }) => {
    test.skip(!isMobile, 'This placement only for mobile');
    if (await individualPodcast.youtubeContainer.first().isVisible()) {
      await individualPodcast.youtubeContainer.first().scrollIntoViewIfNeeded();
      await expect(individualPodcast.youtubePauseButton).toBeVisible();
    }
  });

  test('[en] square banner click', async ({ isMobile }) => {
    test.skip(!isMobile, 'This placement only for mobile');
    await individualPodcast.mobileBanner.nth(2).click();
    expect(await individualPodcast.getCountTabs()).toEqual(2); // need to add a loop when Chrome issue fixed
  });

  test('[en] promo button click', async ({ isMobile }) => {
    test.skip(!isMobile, 'This placement only for mobile');
    await individualPodcast.promoButtonItem.first().click();
    expect(await individualPodcast.getCountTabs()).toEqual(2); // need to add a loop when Chrome issue fixed
  });
});
