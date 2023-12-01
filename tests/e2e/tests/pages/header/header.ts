import { expect, Locator } from '@playwright/test';
import { BasePage } from '../basePage';

export class Header extends BasePage {
  headerContainer = this.page.getByTestId('header-container');

  // Search
  search = this.page.getByTestId('search');
  searchMobile = this.page.getByTestId('search-mobile');
  searchInput = this.page.getByTestId('search-input');
  searchInputMobile = this.page.getByTestId('search-input-mobile');
  searchSubmitButton = this.page.getByTestId('search-input-submit-button');
  searchInputMobileAsia = this.page.getByTestId('search-input-asia-mobile');

  // Language
  languageButton = this.page.getByTestId('language-button');
  languageLink = this.page.getByTestId('language-link');
  mobileLanguageLink = this.page.getByTestId('mobile-language-link');
  mobileLanguageLinkAsia = this.page.getByTestId('mobile-asia-language-link');
  mobileLanguageButtonAsia = this.page.getByTestId('mobile-asia-language-button');

  // Menu
  mobileBurger = this.page.getByTestId('mobile-burger');
  mobileBurgerAsia = this.page.getByTestId('mobile-burger-asia');

  // Links
  advertiseLink = this.page.getByTestId('advertise-link');
  careersLink = this.page.getByTestId('careers-link');
  menuLinks = this.page.getByTestId('menu-link');

  // Logo
  logo = this.page.getByTestId('logo');
  mobileLogo = this.page.getByTestId('mobile-logo');

  // Banner
  desktopBanner = this.page.getByTestId('desktop-banner');
  mobileBanner = this.page.getByTestId('mobile-banner');

  // Tickers
  tickersDesktopLink = this.page.getByTestId('tickers-desktop-link');
  tickersMobileLink = this.page.getByTestId('tickers-mobile-link');
  tickersMobileLinkAsia = this.page.locator("//a[@class='asia-tickers-mobile__link']");
  currencyButton = this.page.getByTestId('currency-button');
  mobileCurrencyButton = this.page.getByTestId('mobile-currency-button');
  tickersPrice = this.page.getByTestId('tickers-price');
  mobileTickersPrice = this.page.getByTestId('mobile-tickers-price');
  mobileTickersPriceAsia = this.page.locator("//span[@class='asia-tickers-mobile__item-value']");

  async checkHeaderElements(isMobile: boolean | undefined, short: string) {
    const desktopElements = [
      this.logo,
      this.tickersDesktopLink,
      this.currencyButton,
      this.tickersPrice,
      this.languageButton,
      this.advertiseLink,
      this.search,
      this.careersLink,
    ];
    const mobileElements = [
      this.mobileLogo,
      this.tickersMobileLink,
      this.mobileCurrencyButton,
      this.mobileTickersPrice,
      this.searchMobile,
      this.mobileBurger,
    ];
    const mobileElementsAsia = [
      this.mobileLogo,
      this.tickersMobileLinkAsia,
      this.mobileTickersPriceAsia,
      this.mobileBurgerAsia,
    ];
    if (!isMobile) {
      if ('en'.includes(short)) {
        await this.elementsToBeVisible(desktopElements);
      } else if ('fr'.includes(short)) {
        await this.elementsToBeVisible(desktopElements.slice(0, -2)); // FR don't have banner and careers link
      } else {
        await this.elementsToBeVisible(desktopElements.slice(0, -1)); // franchises don't have banner in header
      }
    } else {
      if (['cn', 'jp'].includes(short)) {
        await this.elementsToBeVisible(mobileElementsAsia);
      } else {
        await this.elementsToBeVisible(mobileElements);
      }
    }
  }

  async getLanguageButton(isMobile: boolean | undefined, short: string) {
    let button: Locator;
    if (isMobile) {
      if (['cn', 'jp'].includes(short)) {
        button = this.mobileBurgerAsia;
      } else {
        button = this.mobileBurger;
      }
    } else {
      button = this.languageButton;
    }
    return button;
  }

  async getLanguageLinks(isMobile: boolean | undefined, short: string): Promise<[Locator, number]> {
    let links: Locator;
    let linksCount: number;
    const button = await this.getLanguageButton(isMobile, short);
    if (isMobile) {
      if (['cn', 'jp'].includes(short)) {
        await button.click();
        await this.mobileLanguageButtonAsia.click();
        links = this.mobileLanguageLinkAsia;
        linksCount = await this.mobileLanguageLinkAsia.count();
        await button.click();
      } else {
        await button.click();
        await this.page.waitForTimeout(1000);
        links = this.mobileLanguageLink;
        linksCount = await this.mobileLanguageLink.count();
        await button.last().click();
      }
    } else {
      await button.click();
      links = this.languageLink;
      linksCount = await this.languageLink.count();
      await button.click();
    }
    return [links, linksCount];
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

  async selectCurrencyByCode(isMobile: boolean | undefined, currency: string) {
    await this.page.waitForTimeout(1000);
    if (isMobile) {
      await this.mobileCurrencyButton.click();
    } else {
      await this.currencyButton.click();
    }
    await this.page.getByRole('button', { name: `${currency}` }).click();
  }

  async checkCurrencySymbols(isMobile: boolean | undefined, symbol: string) {
    let tickersPrice: Locator;
    if (isMobile) {
      tickersPrice = this.mobileTickersPrice;
    } else {
      tickersPrice = this.tickersPrice;
    }
    for (const price of await tickersPrice.all()) {
      const priceText = await price.innerText();
      expect.soft(priceText).toContain(symbol);
    }
  }

  async checkHeaderIsVisible() {
    await expect(this.headerContainer).toBeVisible();
  }
}
