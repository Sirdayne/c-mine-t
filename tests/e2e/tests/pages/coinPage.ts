import { expect } from '@playwright/test';
import { BasePage } from './basePage';

export class CoinPage extends BasePage {
  // Locators
  coinPageTitle = this.page.locator('//h1');
  marketOverviewBlock = this.page.locator("//div[contains(@class, 'ccc-widget ccc-summary')]");
  valueWidget = this.page.locator("//div[contains(@class, 'ccc-widget ccc-chart-v3')]");
  historicalBlock = this.page.locator("//div[contains(@class, 'price-index-history__wrap')]");
  coinPageContent = this.page.locator(
    "//div[@class='price-index-history bb-price-index__history-block price-index-history_has-button']"
  );
  otherCryptoBlock = this.page.locator("//div[@class='bb-price-index__others-block price-index-other']");
  coinNewsBlock = this.page.locator("//div[contains(@class, 'bb-price-index__posts-by-tag')]");
  loadMoreButton = this.page.locator("//button[contains(@class, 'btn posts-listing__more-btn')]");
  priceIndexesNavigationLink = this.page.locator("(//div[contains(@class, 'bb-price-index__links-col')]//a)[2]");
  homeNavigationLink = this.page.locator("(//div[contains(@class, 'bb-price-index__links-col')]//a)[1]");

  // Calculator
  calculatorBlock = this.page.getByTestId('converter');
  calculatorCoinInput = this.page.getByTestId('calculator-left-input');
  calculatorFiatInput = this.page.getByTestId('calculator-right-input');
  calculatorDropDown = this.page.locator("//div[@class='vs__dropdown-toggle']");
  calculatorDropDownOptions = this.page.getByTestId('calculator-options-list-fiat');

  // Coin overview blocks
  priceValue = this.page.locator("//span[@class='price-value']");
  periodTabs = this.page.locator("//a[contains(@class, 'tabperiods')]");
  coinCharts = this.page.locator("//div[@class='amcharts-chart-div']");

  // Other Cryptocurrencies block
  otherTitle = this.page.locator("//h2[@class='price-index-other__title']");
  otherItem = this.page.locator("//a[@class='price-index-other__item']");
  otherItemIcon = this.page.locator("//div[contains(@class,'price-index-other__item__icon')]");
  otherItemTitle = this.page.locator("//div[@class='price-index-other__item__title__label']");
  otherItemShortName = this.page.locator("//div[@class='price-index-other__item__title__currency']");
  otherItemPrice = this.page.locator("//div[@class='price-index-other__item__price']");
  otherViewAll = this.page.locator("//div[@class='price-index-other__all']/a");

  // Articles
  articleCard = this.page.locator("//article[contains(@class, 'post-card-inline')]");
  articleImage = this.page.locator("//article[@class='post-card-inline']//img");
  articleImageAR = this.page.locator("//article[contains(@class, 'post-card-inline')]//figure");
  articleBadge = this.page.locator("//article//span[contains(@class, 'post-card-inline__badge')]");
  articleTitle = this.page.locator("//span[@class='post-card-inline__title']");
  articleDate = this.page.locator("//time[@class='post-card-inline__date']");
  articleAuthor = this.page.locator("//p[@class='post-card-inline__author']");
  articleDescription = this.page.locator("//p[@class='post-card-inline__text']");
  articleViews = this.page.locator("//span[@class='post-card-inline__stats-item']");

  currencySymbols = {
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    RUR: '₽',
    USD: '$',
    KRW: '₩',
    TRY: '₺',
    BRL: 'R',
    CNY: '¥',
  };

  async selectFiatByCode(code: string) {
    await this.page.locator(`//div[@class='tabLinksCointainer__title'][contains(text(), '${code}')]`).first().click();
  }

  async checkFiatSymbol(symbol: string) {
    for (const value of await this.priceValue.all()) {
      if (await value.isVisible()) {
        const currency = (await value.innerText()).slice(0, 1);
        if (currency === symbol) {
          return true;
        } else {
          return false;
        }
      }
    }
  }

  async checkArticleElements(short: string) {
    const elements = [
      this.articleTitle,
      this.articleImage,
      this.articleImageAR,
      this.articleBadge,
      this.articleDate,
      this.articleAuthor,
      this.articleDescription,
      this.articleViews,
    ];
    for (let i = 0; i < elements.length; i++) {
      if (['ar', 'de', 'tr', 'br', 'cn'].includes(short) && elements[i] === this.articleViews) {
        // This franchises don't have article stats
        continue;
      } else if (
        (!'ar'.includes(short) && elements[i] === this.articleImageAR) ||
        ('ar'.includes(short) && elements[i] === this.articleImage)
      ) {
        // AR version has different locator for article image
        continue;
      } else {
        await expect.soft(elements[i].first(), `${elements[i]} is not visible`).toBeVisible();
      }
    }
  }
}
