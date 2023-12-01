import { BasePage } from './basePage';
import { Sidebar } from './sidebar/sidebar';

export class AuthorPage extends BasePage {
  sidebar = new Sidebar(this.page);

  // Locators
  authorTitle = this.page.locator('//h1');
  authorImage = this.page.locator("//div[contains(@class, 'author-about__avatar')]/img");
  authorDescription = this.page.locator("//p[@class='author-about__desc']");
  authorSocials = this.page.locator("//li[@class='author-about__links-item']");

  // Article
  articleCard = this.page.locator("//article[@class='post-card__article']");
  articleImage = this.page.locator("//article[@class='post-card__article']/a");
  articleBadge = this.page.locator('data-testid=post-card-badge');
  articleTitle = this.page.locator('data-testid=post-card-title');
  articleAuthor = this.page.locator('data-testid=post-card-author-link');
  articlePublicationDate = this.page.locator('data-testid=post-card-pulished-date');

  async getAuthorPageTitle() {
    return await this.authorTitle.innerText();
  }
}
