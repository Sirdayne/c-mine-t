import { expect, Locator } from '@playwright/test';
import { BasePage } from './basePage';
import { AuthorPage } from './authorPage';

export class IndividualPodcast extends BasePage {
  authorPage = new AuthorPage(this.page);

  // Locators
  breadcrumbLinks = this.page.getByTestId('podcast-breadcrumb-links').locator('a');
  title = this.page.locator('//h1');
  authorLink = this.page.getByTestId('authors-link');
  description = this.page.getByTestId('podcast-description');
  listenOnBlock = this.page.getByTestId('podcast-listen-on-block');
  listenOnIcon = this.page.getByTestId('podcast-listen-on-icon');
  episodeContainer = this.page.locator("//div[@id='episode_12318862']");
  disclaimer = this.page.locator("//div[contains(@class, 'podcast-disclaimer')]");
  sidebar = this.page.getByTestId('podcast-sidebar');

  // About the hosts
  aboutHostsTitle = this.page.getByTestId('podcast-about-hosts-title');
  hostsWrapper = this.page.getByTestId('podcast-hosts-wrapper');
  authorImage = this.page.getByTestId('podcast-authors-image');
  authorLinkInHosts = this.page.getByTestId('podcast-authors-link');
  authorDescription = this.page.getByTestId('podcast-authors-description');

  // Carousel
  carouselTitle = this.page.getByTestId('podcast-carousel-title');
  carouselItem = this.page.getByTestId('podcast-carousel-item');
  carouselArrows = this.page.getByTestId('podcast-carousel-arrow');

  // Related articles
  relatedArticlesBlock = this.page.getByTestId('podcast-related-article-block');
  relatedArticleItem = this.page.getByTestId('podcast-related-article-link');
  relatedArticleBlockTitle = this.page.getByTestId('podcast-related-article-block-title');
  relatedArticleImage = this.page.getByTestId('podcast-related-article-image');
  relatedArticleTitle = this.page.getByTestId('podcast-related-article-title');

  // Mobile ad placements
  youtubeContainer = this.page.locator("//div[contains(@class,'banner-youtube')]");
  youtubeIframe = this.page.frameLocator("//div[contains(@class,'banner-youtube')]//iframe");
  youtubeLargePlayButton = this.youtubeIframe.locator("//button[contains(@class,'ytp-large-play-button')]");
  youtubePlayButton = this.youtubeIframe.locator("//button[@title='Play']");
  youtubePauseButton = this.youtubeIframe.locator("//button[@title='Pause']");

  mobileBanner = this.page.getByTestId('podcast-mobile-banner');
  promoButtonStack = this.page.getByTestId('podcast-promo-button-stack');
  promoButtonItem = this.page.getByTestId('promo-button-link');
  promoButtonStackDisclaimer = this.page.getByTestId('promo-button-stack-disclaimer');

  async checkAuthorlinks(Links: Locator) {
    for (const link of await Links.all()) {
      const podcastAuthorName = await link.innerText();
      await link.click();
      await expect.soft(this.page).toHaveURL(/authors/);
      await this.page.waitForTimeout(2000);
      const authorPageTitle = await this.authorPage.getAuthorPageTitle();
      expect.soft(podcastAuthorName).toContain(authorPageTitle);
      await this.page.goBack();
    }
  }
}
