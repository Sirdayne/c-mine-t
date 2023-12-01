import { expect } from '@playwright/test';
import { BasePage } from './basePage';

export class PostPage extends BasePage {
  // Post author
  authorLink = this.page.locator("//a[@class='post-meta__author-link']");
  authorName = this.page.locator("//div[@class='post-meta__author-name']");
  authorImage = this.page.locator("//div[@class='post-meta__author-image']");

  // Post publication date
  publishDate = this.page.locator("//div[@class='post-meta__publish-date']");

  // Post title
  postTitle = this.page.locator("//h1[@class='post__title']");

  // Post description
  postDescription = this.page.locator("//p[@class='post__lead']");

  // Post category name (for press releases)
  categoryName = this.page.locator("//div[@class ='post-meta__category-name']");

  // Post views and shares
  contentShares = this.page.locator("//div[@class='post__content-shares']");
  mobileContentShares = this.page.locator("//div[@class='shares-list post-page__mobile-shares']");
  totalShares = this.page.locator("(//span[@class='post-actions__item-count'])[2]");
  totalViews = this.page.locator("(//span[@class='post-actions__item-count'])[1]");

  // Post audio player
  listenToArticleTimer = this.page.locator("//div[contains(@class,'post-audio-player__meta')]");
  listenToArticlePlayButton = this.page.locator("//button[contains(@class,'post-audio-player__play-btn')]");
  downloadAsMp3Button = this.page.locator("//a[contains(@class, 'post-audio-player__download-btn')]");

  // Post cover image
  postCoverImage = this.page.locator("//div[@class='post-cover__wrp']");

  // Join us social networks block
  joinUsBlock = this.page.locator("//div[contains(@class, 'post__socials-block')]");
  joinUsBlockTitle = this.page.locator("//h3[contains(@class, 'post-socials__title')]");
  joinUsBlockItem = this.page.locator("//a[contains(@class, 'post-social__link')]");

  // Post content
  postContent = this.page.locator("//div[contains(@class,'post-content')]");

  // Disclaimer in press releases posts
  pressReleaseDisclaimer = this.page.locator("//div[@class='post-disclaimer__body']");

  // Post tags
  blockWithTags = this.page.locator("//ul[@class='tags-list__list']");
  postTag = this.page.locator("//li[@class='tags-list__item']/a");

  // Post related news
  relatedNewsBlockTitle = this.page.locator("//div[@class='related-list__title']");
  relatedNewsTitle = this.page.locator("//div[@class='related-list__item-title']");
  relatedNewsItem = this.page.locator("//li[@class='related-list__item']");
  relatedNewsPostImage = this.page.locator("//div[@class='related-list__item-image']");

  // Advertise banner under the post
  mobileAdvertiseBanner = this.page.locator("//div[@data-e2e='article_mobile_adbutler']");
  desktopAdvertiseBanner = this.page.locator("//div[@date-e2e='article_desktop_adbutler']");
  postBlock = this.page.locator("//div[@class='post-page__item']/div");

  // Historical block
  collectButton = this.page.locator('.w_collectors__button');
  collectorsBlock = this.page.locator('.w_collectors__section');

  async checkPostElements(isMobile: boolean | undefined, short: string) {
    const locators = [
      this.authorImage,
      this.authorName,
      this.publishDate,
      this.postTitle,
      this.postDescription,
      this.postCoverImage,
      this.totalShares,
      this.totalViews,
      this.joinUsBlock,
      this.contentShares,
      this.postContent,
      this.blockWithTags,
      this.relatedNewsItem,
      this.desktopAdvertiseBanner,
      this.mobileAdvertiseBanner,
      this.mobileContentShares,
      this.collectButton,
      this.collectorsBlock,
    ];
    for (let i = 0; i < locators.length; i++) {
      if ((short !== 'en' && locators[i] === this.joinUsBlock) || this.totalShares || this.totalViews) {
        continue;
      } else if (isMobile && locators[i] === this.contentShares) {
        continue;
      } else if (isMobile && locators[i] === this.desktopAdvertiseBanner) {
        continue;
      } else if (!isMobile && locators[i] === this.mobileAdvertiseBanner) {
        continue;
      } else if (!isMobile && locators[i] === this.mobileContentShares) {
        continue;
      } else {
        await expect.soft(locators[i].first()).toBeVisible();
      }
    }
  }

  async scrollToLastPost() {
    let count = 0;
    while (count <= 3) {
      const postContent = await this.postContent.nth(count).boundingBox();
      await this.postCoverImage.last().scrollIntoViewIfNeeded();
      if (postContent != null) {
        await this.page.mouse.wheel(0, postContent.height * 0.5),
          await this.page.mouse.wheel(0, postContent.height * 0.5);
      }
      await this.page.waitForTimeout(3000);
      count++;
    }
    return await this.postTitle.count();
  }
}
