import { BasePage } from '../basePage';
import { Header } from '../header/header';

export class Search extends BasePage {
  header = new Header(this.page);

  pageTitle = this.page.getByTestId('search-title');
  search = this.page.getByTestId('search-input');
  searchHighlights = this.page.getByTestId('search-highlights');
  searchMessage = this.page.getByTestId('search-message');

  // Article
  article = this.page.getByTestId('search-article');
  articleCover = this.page.getByTestId('search-article-cover');
  articleTitle = this.page.getByTestId('search-article-title');
  articlePublicationDate = this.page.getByTestId('search-article-publication-date');
  articleAuthor = this.page.getByTestId('search-article-author').locator('a');
  articleText = this.page.getByTestId('search-article-text');

  // Buttons
  loadMoreButton = this.page.getByTestId('search-load-more-button');
  backToTopButton = this.page.getByTestId('search-to-top-button');
  backToTopButtonMobile = this.page.getByTestId('to-top-button');

  async searchArticle(request: string, isMobile: boolean | undefined, short: string) {
    if (isMobile) {
      if (['jp', 'cn'].includes(short)) {
        await this.header.mobileBurgerAsia.click();
        await this.header.searchInputMobileAsia.fill(request);
      } else {
        await this.header.searchMobile.click();
        await this.header.searchInputMobile.fill(request);
      }
    } else {
      await this.header.search.click();
      await this.header.searchInput.fill(request);
    }
    await this.page.keyboard.press('Enter');
  }
}
