import { Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';
import { Leaderboard } from './leaderboard/leaderboard';
import { PostPage } from './postPage';
import { AuthorPage } from './authorPage';

export class marketsPage extends BasePage {
  leaderboard = new Leaderboard(this.page);
  postPage = new PostPage(this.page);
  authorPage = new AuthorPage(this.page);

  // Markets page
  title = this.page.locator('//h1');
  fiatSelector = this.page.locator("//div[@class='markets-fiat__current']");
  description = this.page.locator("//div[@class='markets-header__description']");
  coinChartCard = this.page.locator("//li[@class='markets-header__item']/a[contains(@href, 'price')]");
  firstChart = this.page.locator("(//li[@class='markets-header__item'])[1]");
  secondChart = this.page.locator("(//li[@class='markets-header__item'])[2]");
  thirdChart = this.page.locator("(//li[@class='markets-header__item'])[3]");
  chartTitle = this.page.locator("//div[@class='markets-card__top']");
  chartIcon = this.page.locator("//span[@class='markets-card__icon']");
  chartName = this.page.locator("//span[contains(@class, 'markets-card__name')]");
  chartCurrency = this.page.locator("//span[@class='markets-card__currency']");
  chartPercantage = this.page.locator("//span[contains(@class, 'markets-card__percentage')]");
  chartGraph = this.page.locator("//div[@class='markets-card-chart']");
  chartMeta = this.page.locator("//div[@class='markets-card__row']");
  chartPrices = this.page.locator("//span[@class='markets-card__price']");
  chartViewMoreButton = this.page.locator("//div[@class='markets-header']//div[contains(@class, 'markets-more')]/a");

  // Trading 101
  tradingTitle = this.page.locator("//h2[@class='markets-trading101__title']");
  tradingContent = this.page.locator("//div[@class='market-trading101__slider']");
  tradingSliderIcon = this.page.locator("//button[@class='btn markets-pagination__dot'][1]");
  tradingPreviousbutton = this.page.locator("//button[@class='btn market-trading101__prev']");
  tradingNextButton = this.page.locator("//button[@class='btn market-trading101__next']");
  tradingPost = this.page.locator("//a[@class='market-trading101__link']");
  tradingPostImage = this.page.locator("//div[contains(@class, 'market-trading101__cover')]");
  tradingPostTitle = this.page.locator("//a[@class='market-trading101__link']/p");

  // Market news
  marketNewsTitle = this.page.locator("//h2[@class='markets-news__title']");
  marketsPost = this.page.locator("//article[contains(@class, 'post-card-inline')]");
  marketsPostImage = this.page.locator("//div[contains(@class, 'post-card-inline__cover')]");
  marketsPostBadge = this.page.locator("//span[contains(@class, 'post-card-inline__badge')]");
  marketsPostTitle = this.page.locator("//a[@class='post-card-inline__title-link']/span");
  marketsPostPublicationDate = this.page.locator("//time[@class='post-card-inline__date']");
  marketsPostAuthor = this.page.locator("//a[@class='post-card-inline__link']");
  marketsPostLeadtext = this.page.locator("//p[@class='post-card-inline__text']");
  marketsPostViews = this.page.locator("//span[@class='post-card-inline__stats-item']");
  marketsPostViewsCount = this.page.locator("//span[@class='post-card-inline__stats-item']/span[2]");
  marketsViewMoreButton = this.page.locator("(//a[contains(@class, 'markets-more')])[2]");
  disclaimer = this.page.locator("//div[@class='markets-disclaimer']");

  currencySymbols = {
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    RUR: '₽',
    USD: '$',
    KRW: '₩',
    TRY: '₺',
    BRL: 'R$',
    CNY: '¥',
  };

  async selectFiatByCode(code: string) {
    await this.fiatSelector.click();
    await this.page.locator(`//div[@class='markets-fiat__list']/div[contains(text(), '${code}')]`).click();
  }

  async checkFiatSymbol(symbol: string) {
    const currency = (await this.chartPrices.first().innerText()).slice(0, 1);
    if (currency === symbol) {
      return true;
    } else {
      return false;
    }
  }

  async checkPostTitle(post: Locator) {
    const postTitle = await post.innerText();
    await post.click();
    expect((await this.postPage.postTitle.innerText()).includes(postTitle)).toBeTruthy();
  }

  async checkSliderAndButtons(post: Locator, isMobile: boolean | undefined) {
    const titleText = await post.innerText();
    if (isMobile) {
      await this.tradingSliderIcon.first().click();
      expect.soft((await post.innerText()).includes(titleText)).toBeFalsy();
      await this.tradingSliderIcon.first().click();
      expect((await post.innerText()).includes(titleText)).toBeTruthy();
    } else {
      await this.tradingNextButton.click();
      expect.soft((await post.innerText()).includes(titleText)).toBeFalsy();
      await this.tradingPreviousbutton.click();
      expect((await post.innerText()).includes(titleText)).toBeTruthy();
    }
  }

  async checkMarketsPageElements(isMobile: boolean | undefined, short: string) {
    const locators = [
      this.title,
      this.fiatSelector,
      this.coinChartCard,
      this.chartViewMoreButton,
      this.marketNewsTitle,
      this.marketsPost,
      this.description,
      this.disclaimer,
    ];
    const tradingElements = [
      this.tradingTitle,
      this.tradingContent,
      this.tradingPost,
      this.tradingPostImage,
      this.tradingPostTitle,
      this.tradingNextButton,
      this.tradingPreviousbutton,
    ];
    await this.elementsToBeVisible(locators);
    if (!['ar', 'fr'].includes(short)) {
      // AR and FR don't have Trading block
      if (isMobile) {
        await this.elementsToBeVisible(tradingElements.slice(0, -2));
      } else {
        await this.elementsToBeVisible(tradingElements);
      }
    }
  }

  async checkChartsElements() {
    const locators = [
      this.chartTitle,
      this.chartIcon,
      this.chartName,
      this.chartCurrency,
      this.chartPercantage,
      this.chartGraph,
      this.chartMeta,
      this.chartPrices,
    ];
    for (const locator of locators) {
      await expect.soft(locator.first()).toBeVisible({ timeout: 60 * 1000 });
    }
  }

  async checkPostElements(short: string) {
    // order of the last 3 elements is matter
    const locators = [
      this.marketNewsTitle,
      this.marketsPostImage,
      this.marketsPostAuthor,
      this.marketsPostBadge,
      this.marketsPostTitle,
      this.marketsPostPublicationDate,
      this.marketsViewMoreButton,
      this.marketsPostLeadtext,
      this.marketsPostViews,
      this.marketsPostViewsCount,
    ];
    if (['ar', 'de', 'br', 'tr', 'cn'].includes(short)) {
      if ('cn'.includes(short)) {
        // CN doesn't have lead text here
        await this.elementsToBeVisible(locators.slice(0, -3));
      } else {
        // This franchises don't have article views count
        await this.elementsToBeVisible(locators.slice(0, -2));
      }
    } else {
      await this.elementsToBeVisible(locators);
    }
  }
}
