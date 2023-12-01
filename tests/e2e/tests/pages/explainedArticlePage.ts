import { BasePage } from './basePage';
import { Leaderboard } from './leaderboard/leaderboard';
import { Sidebar } from './sidebar/sidebar';
import { Header } from './header/header';
import { Footer } from './footer/footer';

export class explainedArticlePage extends BasePage {
  leaderboard = new Leaderboard(this.page);
  sidebar = new Sidebar(this.page);
  header = new Header(this.page);
  footer = new Footer(this.page);

  // Explained article
  explainedArticle = this.page.locator('//article/a');

  // Breadcrumbs
  homeLink = this.page.getByTestId('explained-breadcrumb-link-0');
  explainedPageLink = this.page.getByTestId('explained-breadcrumb-link-1');
  explainedArticleLink = this.page.getByTestId('explained-breadcrumb-link-2');

  // Article meta
  articleImage = this.page.locator('//div[contains(@class,"bg-cover")]');
  articleMeta = this.page.getByTestId('explained-post-meta');
  authorLink = this.page.locator('//a[contains(@class, "post-meta__author-link")]');
  authorImage = this.page.locator('//div[contains(@class, "post-meta__author-image")]');
  articlePublishDate = this.page.locator('//time');
  title = this.page.getByTestId('explained-post-title');
  articleLeaderboard = this.page.getByTestId('explained-leaderboard-banner');

  // Article content
  articleContent = this.page.getByTestId('explained-content');
  articleBlock = this.page.locator('//div[@data-ct-widget="explained-block"]');
  articleBlockTitle = this.page.locator('//h2');

  // Shares
  articleShares = this.page.getByTestId('explained-shares-list');
  articleMobileShares = this.page.getByTestId('explained-mobile-shares-list');
  facebook = this.page.getByTestId('shares-link-facebook');
  twitter = this.page.getByTestId('shares-link-twitter');
  telegram = this.page.getByTestId('shares-link-telegram');
  reddit = this.page.getByTestId('shares-link-reddit');
  linkedin = this.page.getByTestId('shares-link-linkedin');
  whatsapp = this.page.getByTestId('shares-link-whatsapp');
  copy = this.page.getByTestId('shares-link-copy');
  backToTop = this.page.getByTestId('shares-link-to-top');

  // Navigation
  articleNavigationTitle = this.page.getByTestId('explained-navigation-title');
  articleNavigationLink = this.page.getByTestId('explained-navigation-link');
  articleMobileNavigation = this.page.getByTestId('guide-mobile-navigation-title');
  articleMobileNavigationLink = this.page.getByTestId('explained-navigation-mobile-link');
  articleMobileShowButton = this.page.getByTestId('explained-mobile-navigation-show-button');
  articleNavigationLinkActive = this.page.getByTestId('explained-navigation-link explained-navigation-link-active');
  articleMobileNavigationLinkActive = this.page.getByTestId(
    'explained-navigation-mobile-link explained-navigation-mobile-link-active'
  );

  async checkArticleElements(isMobile: boolean | undefined, short: string) {
    let elements = [
      this.articleImage,
      this.articlePublishDate,
      this.authorImage,
      this.authorLink,
      this.title,
      this.articleContent,
      this.articleShares,
      this.articleNavigationTitle,
      this.articleNavigationLink,
    ];
    if (short !== 'fr') {
      elements.unshift(this.articleLeaderboard);
    }
    if (isMobile) {
      elements = elements.slice(0, -3);
      elements.push(this.articleMobileShares, this.articleMobileNavigation);
    }
    await this.elementsToBeVisible(elements);
  }
}
