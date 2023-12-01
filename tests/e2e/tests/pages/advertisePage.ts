import { BasePage } from './basePage';
import { APIRequestContext, APIResponse } from '@playwright/test';

let response: APIResponse;
let url: any;

export class AdvertisePage extends BasePage {
  // form elements
  contactUsButton = this.page.frameLocator('iFrame').locator("//button[@data-container-id='64256f26f4099']");
  inputName = this.page.getByTestId('advertise-form-name').locator('input');
  inputEmail = this.page.getByTestId('advertise-form-email').locator('input');
  inputMessaging = this.page.getByTestId('advertise-form-messaging').locator('input');
  inputWebsite = this.page.getByTestId('advertise-form-website').locator('input');
  submitButton = this.page.getByTestId('advertise-submit-btn');

  successTitle = this.page.getByTestId('advertise-success-title');
  successDesc = this.page.getByTestId('advertise-success-description');
  closeFormOnSuccess = this.page.getByTestId('close-advertise-form-btn');

  async sendLead(request: APIRequestContext, apiSource: string, hosts: string) {
    const data = {
      website: 'autotestit.com',
      name: 'Autotest API',
      lead_source: 'lead advertise',
      messaging: '@autotest',
      email: 'autotest@qa.com',
      messenger: '@autotest',
    };
    if (apiSource === 'plumbum') {
      url = 'https://plumbum.cointelegraph.com/lead';
      if (hosts.includes('stage')) {
        url = 'https://plumbum.stage.cointelegraph.com/lead';
      } else if (hosts.includes('qa')) {
        return null;
      }
    } else if (apiSource === 'artisan') {
      url = 'https://artisan.cointelegraph.com/v1/client/feedback/';
      if (hosts.includes('stage')) {
        url = 'https://artisan.stage.cointelegraph.com/v1/client/feedback/';
      } else if (hosts.includes('qa')) {
        return null;
      }
    }

    response = await request.post(url, {
      data: data,
    });
    return await response.json();
  }

  async fillFormAndSend() {
    await this.inputName.fill('autoTestUI');
    await this.inputEmail.fill('autotest@qa.com');
    await this.inputMessaging.fill('@autotest');
    await this.inputWebsite.fill('autotestit.com');
    await this.submitButton.click();
  }
}
