import { expect, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class PriceIndexes extends BasePage {
  // Locators
  headerTickerValue = this.page.locator("//span[@class='tickers-desktop__coin-value']");
  headerTickerValueMobile = this.page.locator("//span[contains(@class, 'tickers-mobile__value')]");
  headerTickerMobileValueAsia = this.page.locator("//span[@class='asia-tickers-mobile__item-value']");
  headerTicker = this.page.locator("//a[@class='tickers-desktop__link']");
  headerTickerMobile = this.page.locator("//li[@class='tickers-mobile__item']");
  currentCurrencySymbol = this.page.locator("//h3[@class='price-index-item__price']//span");
  pageTitle = this.page.locator('//h1');
  currencySelector = this.page.locator("//div[@class='currency-select__wrap']");
  priceIndexesCard = this.page.locator("//a[contains(@class, 'price-index-item')]");

  // Coin card
  cardLogo = this.page.locator("//div[contains(@class, 'price-index-item__col_icon')]");
  cardLogoJP = this.page.locator("//span[contains(@class, 'jp-price-index-item__icon')]");
  cardName = this.page.locator("//h2[contains(@class, 'item__name')]");
  cardNameJP = this.page.locator("//span[@class='jp-price-index-item__name']");
  cardShortName = this.page.locator("//span[contains(@class, 'item__currency')]");
  cardPrice = this.page.locator("//div[@class='price-index-item__col price-index-item__col_digits']/h3");
  cardPriceJP = this.page.locator("//span[@class='jp-price-index-item__price']");
  cardPercentage = this.page.locator("//span[contains(@class, 'item__percent')]");
  cardPercentageJP = this.page.locator("//span[contains(@class, 'jp-price-index-item__percent')]");
  cardChart = this.page.locator("//div[contains(@class, 'item__col_chart')]");
  cardChartJP = this.page.locator("//div[@class='jp-price-index-item__chart']");
  cardVolumesJP = this.page.locator("//div[@class='jp-price-index-item__volumes']");

  // Latest news
  latestNewsCard = this.page.locator('//article');
  articleImage = this.page.locator('//article//img');
  articleLeadText = this.page.locator("//article//p[contains(@class, 'text')]");
  articleBadge = this.page.locator("//article//span[contains(@class, 'badge')]");
  articleTitle = this.page.locator("//article//a[contains(@class, 'title')]");
  articleDate = this.page.locator('//article//time');
  articleAuthor = this.page.locator("//article//a[contains(@class, 'author')]");

  async checkCoinCardsJP() {
    const amountOfCards = await this.priceIndexesCard.count();
    const elements = [
      this.cardLogoJP,
      this.cardNameJP,
      this.cardPriceJP,
      this.cardPercentageJP,
      this.cardChartJP,
      this.cardVolumesJP,
    ];
    await this.elementsToBeVisible(elements);
    for (const element of elements) {
      await expect(element).toHaveCount(amountOfCards);
    }
  }

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
    await this.currencySelector.click();
    await this.page.locator(`//div[@class='currency-select__list-item']/span[contains(text(), '${code}')]`).click();
  }

  async checkFiatSymbol(symbol: string, short: string) {
    let currency: string;
    if ('jp'.includes(short)) {
      currency = (await this.cardPriceJP.first().innerText()).split(' ')[0];
    } else {
      currency = await this.currentCurrencySymbol.first().innerText();
    }
    if (currency === symbol) {
      return true;
    } else {
      return false;
    }
  }

  async matchingHeaderAndBodyValuesCheck(isMobile: boolean | undefined, short: string) {
    let currentSymbolHeader: string;
    if (isMobile) {
      if ('br'.includes(short)) {
        currentSymbolHeader = (await this.headerTickerValueMobile.first().innerText()).slice(0, 2);
      } else if (['cn', 'jp'].includes(short)) {
        currentSymbolHeader = (await this.headerTickerMobileValueAsia.first().innerText()).slice(0, 1);
      } else {
        currentSymbolHeader = (await this.headerTickerValueMobile.first().innerText()).slice(0, 1);
      }
    } else {
      if ('br'.includes(short)) {
        currentSymbolHeader = (await this.headerTickerValue.first().innerText()).slice(0, 2);
      } else {
        currentSymbolHeader = (await this.headerTickerValue.first().innerText()).slice(0, 1);
      }
    }
    if ('jp'.includes(short)) {
      expect(currentSymbolHeader).toEqual((await this.cardPriceJP.first().innerText()).split(' ')[0]);
    } else {
      expect(currentSymbolHeader).toEqual(await this.currentCurrencySymbol.first().innerText());
    }
  }

  async matchPrices(isMobile: boolean | undefined) {
    let headTickers: Locator[];
    if (isMobile) {
      headTickers = await this.headerTickerMobile.all();
    } else {
      headTickers = await this.headerTicker.all();
    }
    const cards = await this.priceIndexesCard.all();

    for (const headTicker of headTickers) {
      const headTickerName = await headTicker.locator('//span[1]').innerText();

      for (const card of cards) {
        const cardShortName = (await card.locator("//span[contains(@class, 'item__currency')]").innerText()).slice(
          0,
          3
        );

        if (headTickerName === cardShortName) {
          let headTickerPrice = (await headTicker.locator('//span[2]').innerText()).slice(1);
          let cardPrice = (
            await card.locator("//div[@class='price-index-item__col price-index-item__col_digits']/h3").innerText()
          ).slice(1);
          headTickerPrice = headTickerPrice.replace(',', '.');
          cardPrice = cardPrice.replace(',', '.');
          if (headTickerPrice.includes('.') || cardPrice.includes('.')) {
            if (headTickerPrice.includes('.5')) {
              expect
                .soft(
                  Math.ceil(parseFloat(headTickerPrice)),
                  `Header ${headTickerPrice} for ${headTickerName} / Card ${cardPrice} for ${cardShortName}`
                )
                .toEqual(Math.ceil(parseFloat(cardPrice)));
            } else {
              expect
                .soft(
                  Math.round(parseFloat(headTickerPrice)),
                  `Header ${headTickerPrice} for ${headTickerName} / Card ${cardPrice} for ${cardShortName}`
                )
                .toEqual(Math.round(parseFloat(cardPrice)));
            }
          } else {
            expect
              .soft(
                headTickerPrice,
                `Header ${headTickerPrice} for ${headTickerName} / Card ${cardPrice} for ${cardShortName}`
              )
              .toEqual(cardPrice);
          }
          break;
        }
      }
    }
  }

  async matchPercents() {
    const headTickers = await this.headerTicker.all();
    const cards = await this.priceIndexesCard.all();

    for (const headTicker of headTickers) {
      const headTickerName = await headTicker.locator('//span[1]').innerText();

      for (const card of cards) {
        const cardShortName = (await card.locator("//span[contains(@class, 'item__currency')]").innerText()).slice(
          0,
          3
        );

        if (headTickerName === cardShortName) {
          const headTickerPercent = await headTicker.locator('//span[3]').innerText();
          const cardPercent = await card.locator("//span[contains(@class, 'item__percent')]").innerText();
          expect.soft(headTickerPercent).toEqual(cardPercent);
          break;
        }
      }
    }
  }
}
