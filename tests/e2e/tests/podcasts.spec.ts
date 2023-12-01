import { test, expect } from './helpers/fixtures';
import { PodcastsPage } from './pages/podcastsPage';
import { hosts } from './helpers/hosts';

let podcasts: PodcastsPage;

test.beforeEach(async ({ page }) => {
  podcasts = new PodcastsPage(page);
  await podcasts.goto(hosts['en'] + podcasts.pageLinks.podcasts);
});

test('[en] podcasts page elements @smoke', async ({ isMobile }) => {
  await podcasts.checkPodcastsPageElements(isMobile);
});

test('[en] podcast overview @smoke', async () => {
  const podcastCount = await podcasts.podcastImage.count();
  await podcasts.checkPodcastElements();
  await expect(podcasts.podcastBlock).toHaveCount(podcastCount);
});

test('[en] play podcast', async () => {
  await podcasts.podcastBlock.last().scrollIntoViewIfNeeded();
  await podcasts.podcastPlayButton.first().click();
  await expect(podcasts.podcastPauseButton).toBeVisible();
});

test('[en] check platform links', async () => {
  for (let i = 0; i < 4; i++) {
    const link = podcasts.podcastPlatformsLinks.nth(i);
    await link.click();
    expect.soft(await podcasts.getCountTabs()).toEqual(2);
  }
});
