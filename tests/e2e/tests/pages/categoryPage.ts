import { expect } from '@playwright/test';
import { BasePage } from './basePage';
import { Footer } from './footer/footer';
import { Leaderboard } from './leaderboard/leaderboard';
import { Sidebar } from './sidebar/sidebar';
import { Header } from './header/header';

export class CategoryPage extends BasePage {
  leaderboard = new Leaderboard(this.page);
  sidebar = new Sidebar(this.page);
  header = new Header(this.page);
  footer = new Footer(this.page);

  // Category
  title = this.page.locator('//h1');
  description = this.page.locator("//div[@class='category-page__description']");
  articlesContainer = this.page.locator("//ul[@class ='posts-listing__list']");
  loadMoreButton = this.page.locator("//button[@class='btn posts-listing__more-btn']");
  name = this.page.locator("//div[@class ='post-meta__category-name']");
  disclaimer = this.page.locator("//div[@class='post-disclaimer__body']");

  // Category articles
  article = this.page.locator('//article');
  articleTitle = this.page.locator("//span[@class ='post-card-inline__title']");
  articleImage = this.page.locator('//article//img');
  articleBadge = this.page.locator("//span[contains(@class,'post-card-inline__badge')]");
  articlePublicationDate = this.page.locator('//article//time');
  articleAuthor = this.page.locator("//a[@class='post-card-inline__link']");
  articleDescription = this.page.locator("//p[@class='post-card-inline__text']");
  articlesViews = this.page.locator("//span[@class='post-card-inline__stats-item']");

  async checkCategoryElements(isMobile: boolean | undefined, short: string) {
    const elements = [this.title, this.description, this.articlesContainer];
    for (const element of elements) {
      if (!['en', 'fr', 'jp', 'cn'].includes(short) && element === this.description) {
        // Rest of franchises don't have category description
        continue;
      } else {
        await expect.soft(element.first(), `${element} is not visible`).toBeVisible();
      }
    }
    await this.header.checkHeaderIsVisible();
    await this.leaderboard.checkLeaderboardIsVisible(isMobile, short);
    await this.sidebar.checkSidebarIsVisible(isMobile);
    await this.footer.checkFooterIsVisible();
  }

  async checkCategoryArticleElements(short: string) {
    const elements = [
      this.articleTitle,
      this.articleImage,
      this.articleBadge,
      this.articlePublicationDate,
      this.articleAuthor,
      this.articleDescription,
      this.articlesViews,
    ];
    for (let i = 0; i < elements.length; i++) {
      if (['ar', 'de', 'br', 'tr', 'cn'].includes(short) && elements[i] === this.articlesViews) {
        // Views count is hidden for this franchises
        continue;
      } else {
        await expect.soft(elements[i].first(), `${elements[i]} is not visible`).toBeVisible();
      }
    }
  }

  async goToPressReleaseArticle(short: string) {
    const pressReleaseFranchiseTitles = {
      en: ['Press Release', 'Press Release'],
      it: ['Comunicati Stampa', 'Comunicati Stampa'],
      de: ['Pressemitteilung', 'Pressemitteilungen'],
      es: ['Comunicados de Prensa', 'Comunicado de Prensa'],
      ar: ['البيانات الصحفية', 'البيانات الصحفية'],
      tr: ['basin bültenleri̇', 'basin bültenleri̇'],
      br: ['Press Release', 'Comunicado de Imprensa'],
      jp: ['プレスリリース', 'プレスリリース配信'],
      kr: ['보도 자료', '보도자료'],
      cn: ['发布新闻', '新闻发布'],
    };
    for (const [locale, title] of Object.entries(pressReleaseFranchiseTitles)) {
      if (locale.includes(short)) {
        const articleBadgeText = await this.articleBadge.first().innerText();
        expect.soft(articleBadgeText.toLowerCase(), `${locale} and ${title[0]}`).toEqual(title[0].toLowerCase());
        await this.articleTitle.first().click();
        const articleCategory = await this.name.first().innerText();
        expect(articleCategory.toLowerCase(), `${locale} and ${title[1]}`).toEqual(title[1].toLowerCase());
      }
    }
  }
}
