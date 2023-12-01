import { expect, test } from '@playwright/test';
import { AdvertisePage } from './pages/advertisePage';
import { hosts } from './helpers/hosts';

test('[en] send lead to kommo via plumbum @smoke', async ({ page, request }) => {
  const advertise = new AdvertisePage(page);
  const responseBody = await advertise.sendLead(request, 'plumbum', hosts['en']);
  test.skip(responseBody === null, 'No Kommo integration on QA env');
  expect(await responseBody['success']).toEqual(true);
});

test('[en] send lead to kommo via artisan @smoke', async ({ page, request }) => {
  const advertise = new AdvertisePage(page);
  const responseBody = await advertise.sendLead(request, 'artisan', hosts['en']);
  test.skip(responseBody === null, 'No Kommo integration on QA env');
  expect(await responseBody['result']).toEqual('success');
});

test('[en] send lead to kommo via UI form @smoke', async ({ page }) => {
  const advertise = new AdvertisePage(page);
  await advertise.goto(hosts['en'] + advertise.pageLinks.advertise);
  await advertise.contactUsButton.click();
  await advertise.fillFormAndSend();
  await advertise.successTitle.waitFor({ state: 'visible' });
  expect.soft(advertise.successTitle).toBeVisible();
  expect(advertise.successDesc).toBeVisible();
});
