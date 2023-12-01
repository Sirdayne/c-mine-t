import { BasePage } from './basePage';
import { Leaderboard } from './leaderboard/leaderboard';
import { Sidebar } from './sidebar/sidebar';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { expect } from '@playwright/test';

export class TagPage extends BasePage {
  leaderboard = new Leaderboard(this.page);
  sidebar = new Sidebar(this.page);
  header = new Header(this.page);
  footer = new Footer(this.page);

  // Page elements
  pageTitle = this.page.locator('//h1');
  pageDescription = this.page.locator("//div[@class='tag-about__desc-col']");
  pageImage = this.page.locator("//div[@class='tag-about__cover-wrp']");
  postsListing = this.page.locator("//ul[@class='posts-listing__list']");
  pageArticle = this.page.locator('//article');
  loadMoreButton = this.page.locator("//button[@class='btn posts-listing__more-btn']");

  // Promo buttons
  promoButton = this.page.locator("//div[contains(@class,'tag-page__promo-button')]");
  promoButtonMobile = this.page.locator("//div[contains(@class,'promo-button-stack__button')]//a");
  promoButtonDisclaimer = this.page.locator("(//div[contains(@class, 'promo-button-disclaimer')])[1]");
  promoButtonDisclaimerMobile = this.page.locator("//div[contains(@class,'promo-button-stack__disclaimer')]");

  // Article elements
  article = this.page.locator('//article');
  articleTitle = this.page.locator("//span[@class ='post-card-inline__title']");
  articleImage = this.page.locator('//article//img');
  articleBadge = this.page.locator("//span[contains(@class,'post-card-inline__badge')]");
  articlePublicationDate = this.page.locator('//article//time');
  articleAuthor = this.page.locator("//a[@class='post-card-inline__link']");
  articleDescription = this.page.locator("//p[@class='post-card-inline__text']");
  articlesViews = this.page.locator("//span[@class='post-card-inline__stats-item']");

  async checkPageElements(isMobile: boolean | undefined, short: string) {
    const locators = [this.pageTitle, this.pageDescription, this.pageImage, this.postsListing, this.loadMoreButton];
    await this.elementsToBeVisible(locators);
    await this.header.checkHeaderIsVisible();
    await this.footer.checkFooterIsVisible();
    await this.leaderboard.checkLeaderboardIsVisible(isMobile, short);
    await this.sidebar.checkSidebarIsVisible(isMobile);
  }

  async checkArticleElements(short: string) {
    const locators = [
      this.articleImage,
      this.articleTitle,
      this.articlePublicationDate,
      this.articleBadge,
      this.articleAuthor,
      this.articleDescription,
      this.articlesViews,
    ];
    for (const locator of locators) {
      if (['ar', 'br', 'de', 'tr', 'cn'].includes(short) && locator === this.articlesViews) {
        // For these franchise's views count is hidden
        continue;
      } else {
        await expect.soft(locator.first()).toBeVisible();
      }
    }
  }
}
