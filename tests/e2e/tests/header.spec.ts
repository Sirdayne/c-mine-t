import { test, expect, Locator } from './helpers/fixtures';
import { Header } from './pages/header/header';
import { hosts } from './helpers/hosts';

let header: Header;

for (const [short, host] of Object.entries(hosts)) {
  test.describe('header tests', () => {
    test.beforeEach(async ({ page }) => {
      header = new Header(page);
      await header.goto(host);
    });

    test(`[${short}] header elements overview @smoke`, async ({ isMobile }) => {
      await header.checkHeaderElements(isMobile, short);
    });

    test.describe('language', () => {
      test(`[${short}] change language`, async ({ page, isMobile }) => {
        const links = await header.getLanguageLinks(isMobile, short);
        const button = await header.getLanguageButton(isMobile, short);
        const link = links[0].first();
        await page.waitForTimeout(1000);
        await button.click();
        if (isMobile && ['cn', 'jp'].includes(short)) {
          await header.mobileLanguageButtonAsia.click();
        }
        const url = String(await link.getAttribute('href'));
        await link.click();
        await page.waitForEvent('load');
        expect(page.url()).toContain(url);
      });

      test(`[${short}] check language links`, async ({ page, isMobile, request }) => {
        test.skip(isMobile === true || isMobile === false, 'Fails because of BR');
        const links = await header.getLanguageLinks(isMobile, short);
        const button = await header.getLanguageButton(isMobile, short);
        await page.waitForTimeout(1000);
        await button.click();
        await header.checkLinks(request, host, links[0]);
      });
    });

    test.describe('links', () => {
      test(`[${short}] click on advertise link`, async ({ page, isMobile }) => {
        test.skip(isMobile === true, 'This test for desktop header');
        await header.closeLanguageOffer();
        await header.advertiseLink.click();
        await expect(page).toHaveURL(/advertise/);
      });

      test(`[${short}] click on careers link`, async ({ page, isMobile }) => {
        test.skip(isMobile === true, 'This test for desktop header');
        test.skip(['fr'].includes(short), 'There is no careers link in FR');
        await header.closeLanguageOffer();
        await header.careersLink.click();
        await expect(page).toHaveURL(/careers/);
      });

      test(`[${short}] check menu links`, async ({ isMobile, request }) => {
        test.setTimeout(100 * 1000);
        test.skip(isMobile === true, 'This test for desktop header');
        const links = header.menuLinks;
        await header.checkLinks(request, host, links);
      });
    });

    test.describe('tickers', () => {
      test(`[${short}] click on coin links`, async ({ page, isMobile }) => {
        await header.closeLanguageOffer();
        test.setTimeout(65 * 1000);
        let links: Locator;
        if (isMobile) {
          links = header.tickersMobileLink;
        } else {
          links = header.tickersDesktopLink;
        }
        for (const link of await links.all()) {
          await link.click();
          await expect.soft(page).toHaveURL(/price/);
        }
      });

      test(`[${short}] change currency`, async ({ isMobile }) => {
        test.skip(
          isMobile === true && ['cn', 'jp'].includes(short),
          'Asian mobile layout does not have currency selector'
        );
        for (const [key, value] of Object.entries(header.currencySymbols)) {
          await header.selectCurrencyByCode(isMobile, key);
          await header.checkCurrencySymbols(isMobile, value);
        }
      });
    });

    test(`[${short}] click on logo`, async ({ page, isMobile }) => {
      let logo: Locator;
      if (isMobile) {
        logo = header.mobileLogo;
      } else {
        logo = header.logo;
      }
      await logo.click();
      await expect(page).toHaveURL(host);
    });

    test(`[${short}] click on banner`, async ({ isMobile }) => {
      test.skip(!'en'.includes(short), 'Only EN has banner in header');
      let headerBanner: Locator;
      if (isMobile) {
        headerBanner = header.mobileBanner;
      } else {
        headerBanner = header.desktopBanner;
      }
      test.skip(!(await headerBanner.isVisible()), 'Header banner is not displayed');
      await headerBanner.click();
      expect(await header.getCountTabs()).toEqual(2);
    });
  });
}
