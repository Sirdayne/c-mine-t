import { expect } from '@playwright/test';
import { BasePage } from './basePage';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { Leaderboard } from './leaderboard/leaderboard';
import { Sidebar } from './sidebar/sidebar';

export class CalculatorPage extends BasePage {
  leaderboard = new Leaderboard(this.page);
  sidebar = new Sidebar(this.page);
  footer = new Footer(this.page);
  header = new Header(this.page);

  // Page meta
  title = this.page.getByTestId('calculator-title');
  description = this.page.getByTestId('calculator-description');

  // Calculator
  calculatorBlock = this.page.getByTestId('converter');
  leftInput = this.page.getByTestId('calculator-left-input');
  rightInput = this.page.getByTestId('calculator-right-input');
  leftSelect = this.page.getByTestId('calculator-left-select');
  rightSelect = this.page.getByTestId('calculator-right-select');
  leftOption = this.page.locator('//ul[@id="vs1__listbox"]//li');
  rightOption = this.page.locator('//ul[@id="vs2__listbox"]//li');
  fiatOption = this.page.getByTestId('calculator-options-list-fiat');
  cryptoOption = this.page.getByTestId('calculator-options-list-crypto');
  reverstConvert = this.page.getByTestId('calculator-flip-button');
  cryptoRates = this.page.getByTestId('calculator-crypto-rates');
  fiatRates = this.page.getByTestId('calculator-fiat-rates');
  lastUpdatedDate = this.page.getByTestId('calculator-last-updated');

  // Crypto to fiat links
  cryptoToFiatTitle = this.page.getByTestId('calculator-crypto-to-fiat-title');
  cryptoToFiatLink = this.page.getByTestId('calculator-crypto-to-fiat-link');

  // Posts
  trandingTitle = this.page.getByTestId('calculator-trending-title');
  postCard = this.page.getByTestId('post-card');
  postCardLink = this.page.locator('//a[@class="post-card__figure-link"]');
  postCardTitle = this.page.getByTestId('post-card-title');
  postCardAuthor = this.page.getByTestId('post-card-author-link');
  postCardPublicationDate = this.page.getByTestId('post-card-pulished-date');
  postCardImage = this.page.getByTestId('post-card-image');
  postCardLabel = this.page.getByTestId('post-card-badge');

  async checkCalculatorPageElements(isMobile: boolean | undefined, short: string) {
    const locators = [
      this.title,
      this.description,
      this.calculatorBlock,
      this.cryptoToFiatTitle,
      this.cryptoToFiatLink,
      this.trandingTitle,
      this.postCard,
    ];
    await this.elementsToBeVisible(locators);
    await this.header.checkHeaderIsVisible();
    await this.footer.checkFooterIsVisible();
    await this.leaderboard.checkLeaderboardIsVisible(isMobile, short);
    await this.sidebar.checkSidebarIsVisible(isMobile);
  }

  async checkCurrencyConverterElements() {
    const locators = [
      this.leftInput,
      this.rightInput,
      this.leftSelect,
      this.rightSelect,
      this.reverstConvert,
      this.cryptoRates,
      this.fiatRates,
      this.lastUpdatedDate,
    ];
    await this.elementsToBeVisible(locators);
  }

  async checkPostCardElements() {
    const locators = [
      this.postCardTitle,
      this.postCardAuthor,
      this.postCardLabel,
      this.postCardImage,
      this.postCardPublicationDate,
    ];
    await this.elementsToBeVisible(locators);
  }

  async getRightInputValue() {
    return await this.rightInput.inputValue();
  }

  async checkCalculatorFields() {
    // Entering the amount in the left field
    const amount = '2';
    let beforeRightInputValue = this.getRightInputValue();
    await this.leftInput.fill(amount);
    await expect.soft(this.leftInput).toHaveValue('2');
    expect.soft(this.getRightInputValue).not.toEqual(beforeRightInputValue);
    // Selecting option in the left field
    beforeRightInputValue = this.getRightInputValue();
    await this.leftSelect.click();
    await this.leftOption.nth(1).click();
    expect.soft(this.leftOption.nth(1).getAttribute('aria-expanded')).toBeTruthy();
    expect.soft(this.getRightInputValue).not.toEqual(beforeRightInputValue);
    // Selecting option in the right field
    beforeRightInputValue = this.getRightInputValue();
    await this.rightSelect.click();
    await this.rightOption.nth(1).click();
    expect.soft(this.rightOption.nth(1).getAttribute('aria-expanded')).toBeTruthy();
    expect.soft(this.getRightInputValue).not.toEqual(beforeRightInputValue);
  }
}
