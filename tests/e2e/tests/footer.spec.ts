import { test, expect } from './helpers/fixtures';
import { Footer } from './pages/footer/footer';
import { hosts } from './helpers/hosts';

let footer: Footer;

for (const [short, host] of Object.entries(hosts)) {
  test.describe('footer tests', () => {
    test.beforeEach(async ({ page }) => {
      footer = new Footer(page);
      await footer.goto(host);
    });

    test(`[${short}] footer elements overview @smoke`, async ({ isMobile }) => {
      const elements = [
        footer.subscribeFormInput,
        footer.subscribeSumbitButton,
        footer.termsOfService,
        footer.footerSocialLinks,
        footer.footerLinks,
      ];
      await footer.checkFooterIsVisible();
      if (isMobile) {
        await footer.elementsToBeVisible(elements.slice(0, -1));
      } else {
        await footer.elementsToBeVisible(elements);
      }
    });

    test(`[${short}] check footer links`, async ({ isMobile, request }) => {
      test.skip(isMobile === true, 'Footer links present only on desktop');
      test.slow();
      const links = footer.footerLinks;
      await footer.checkLinks(request, host, links);
    });

    test(`[${short}] empty footer subscription form`, async () => {
      for (const [locale, errorMessage] of Object.entries(footer.emptyMessages)) {
        if (locale.includes(short)) {
          await footer.subscribeSumbitButton.first().click();
          expect(await footer.notificationMessage.innerText()).toEqual(errorMessage);
        }
      }
    });

    test(`[${short}] filled footer subscription form`, async () => {
      for (const [locale, successMessage] of Object.entries(footer.successMessages)) {
        if (locale.includes(short)) {
          await footer.subscribeFormInput.fill('atuserherzogqa@gmail.com');
          await footer.subscribeSumbitButton.first().click();
          expect(await footer.notificationMessage.innerText()).toEqual(successMessage);
        }
      }
    });

    test(`[${short}] terms of service and privacy policy`, async ({ page }) => {
      await footer.termsOfService.click();
      await expect(page).toHaveURL(/terms-and-privacy/);
    });

    test(`[${short}] footer social links`, async () => {
      for (const link of await footer.footerSocialLinks.all()) {
        if (await link.isVisible()) {
          await link.click();
          expect.soft(await footer.getCountTabs()).toEqual(2);
        }
      }
    });
  });
}
