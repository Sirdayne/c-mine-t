import { expect, test } from './helpers/fixtures';
import { About } from './pages/aboutPage';
import { AuthorPage } from './pages/authorPage';
import { hosts } from './helpers/hosts';

let about: About;

for (const [short, host] of Object.entries(hosts)) {
  test.describe('about page tests', () => {
    test.beforeEach(async ({ page }) => {
      about = new About(page);
      await about.goto(host + about.pageLinks.about);
    });

    test.describe('elements overview', () => {
      test(`[${short}] about page elements overview @smoke`, async ({}) => {
        await about.authorsTab.click();
        await about.checkPageElements(short);
      });

      test(`[${short}] team card elements overview @smoke`, async ({}) => {
        await about.managementTab.click();
        await about.checkTeamCardElements();
      });
    });

    test(`[${short}] about page advertising @smoke`, async ({ page }) => {
      await about.getInTouchAdvertiseLink.click();
      await expect(page).toHaveURL(/advertise/);
    });

    test.describe('tabs overview', () => {
      test(`[${short}] about page management tab`, async ({}) => {
        await about.authorsTab.click();
        const cardNameAbout = await about.teamCardName.first().innerText();
        await about.managementTab.click();
        const cardNameManag = await about.teamCardName.first().innerText();
        expect(cardNameAbout).not.toEqual(cardNameManag);
      });

      test(`[${short}] team tabs anchors`, async ({ page }) => {
        if (!'en'.includes(short)) {
          await about.localTeamTab.click();
          await expect.soft(page).toHaveURL(/about\?members-of=local-team/);
        }
        await about.authorsTab.click();
        await expect.soft(page).toHaveURL(/about\?members-of=authors/);
        await about.managementTab.click();
        await expect(page).toHaveURL(/about\?members-of=management-team/);
      });
    });

    test(`[${short}] go to authors`, async ({ page }) => {
      const author = new AuthorPage(page);
      if (!['en', 'de', 'jp', 'cn'].includes(short)) {
        // No local team members in this locales
        await about.localTeamTab.click();
        await about.teamCard.first().click();
        await expect.soft(author.authorTitle).toBeVisible();
      }
      await about.authorsTab.click();
      await about.teamCard.first().click();
      await expect(author.authorTitle).toBeVisible();
    });
  });
}
