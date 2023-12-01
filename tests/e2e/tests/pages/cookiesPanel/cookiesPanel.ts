import { BasePage } from '../basePage';

export class CookiesPanel extends BasePage {
  cookiesContainer = this.page.locator("//div[@class='bottom-zone']");
  closeButton = this.page.locator("//button[@class='btn privacy-policy__close-btn']");
  acceptButton = this.page.locator("//button[@class='btn privacy-policy__accept-btn']");

  async closeCookies() {
    await this.closeButton.click();
  }

  async acceptCookies() {
    await this.acceptButton.click();
  }
}
