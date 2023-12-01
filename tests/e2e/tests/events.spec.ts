import { expect, test } from './helpers/fixtures';
import { eventsPage } from './pages/eventsPage';
import { AuthorPage } from './pages/authorPage';
import { PostPage } from './pages/postPage';
import { hosts } from './helpers/hosts';

let events: eventsPage;

for (const [short, host] of Object.entries(hosts)) {
  test.describe('Events page tests', () => {
    test.skip(!'en'.includes(short), 'Events published only for EN for now');
    test.beforeEach(async ({ page }) => {
      events = new eventsPage(page);
      await events.goto(host + events.pageLinks.events);
    });

    test.describe('check page elements', () => {
      test(`[${short}] events page elements @smoke`, async ({ isMobile }) => {
        await events.checkEventsPageElements(isMobile);
      });

      test(`[${short}] events modal elements @smoke`, async ({ isMobile }) => {
        await events.activeSlideLearnMore.click();
        await events.checkEventModalElements(isMobile);
      });

      test(`[${short}] filter fields @smoke`, async () => {
        await events.filterButton.click();
        await events.checkFilterElements();
      });

      test(`[${short}] events card elements @smoke`, async () => {
        await events.checkEventsCardElements();
      });

      test(`[${short}] events article section elements @smoke`, async () => {
        await events.checkEventsPageArticleBlockElements();
      });
    });

    test(`[${short}] breadcrumb Home`, async ({ page }) => {
      await events.breadcrumbHome.click();
      await expect(page).toHaveURL(host);
    });

    test(`[${short}] Let us know button @smoke`, async () => {
      const buttonHref = await events.letUsKnowButton.getAttribute('href');
      expect(buttonHref).toEqual('mailto:events@cointelegraph.com');
    });

    test.describe('check slider', () => {
      test(`[${short}] events slider @smoke`, async ({ isMobile }) => {
        // not enough elements in slider to arrows appear on Desktop
        if (!isMobile) {
          let activeSlideTitleFirst = await events.activeSlideTitle.innerText();
          for (let i = 1; i < (await events.carouselElements.count()); i++) {
            const elems = await events.carouselElements.all();
            await elems[i].click();
            const activeSlideTitleSecond = await events.activeSlideTitle.innerText();
            expect.soft(activeSlideTitleFirst).not.toEqual(activeSlideTitleSecond);
            activeSlideTitleFirst = activeSlideTitleSecond;
          }
        } else {
          // there's no active event title in Mobile so this test relies on class value
          // element class has '!opacity-100' value if event is active in slider
          let element = await events.carouselElements.nth(0).getAttribute('class');
          expect.soft(element).toContain('!opacity-100');
          await events.carouselNextArrow.click();
          element = await events.carouselElements.nth(0).getAttribute('class');
          expect.soft(element).not.toContain('!opacity-100');
          await events.carouselPrevArrow.click();
          element = await events.carouselElements.nth(0).getAttribute('class');
          expect(element).toContain('!opacity-100');
        }
      });

      test(`[${short}] slider visit Website @smoke`, async () => {
        await events.activeSlideVisitWebsite.click();
        expect(await events.getCountTabs()).toEqual(2);
      });
    });

    test.describe('check modal window', () => {
      test.beforeEach(async () => {
        await events.activeSlideLearnMore.click();
      });

      test(`[${short}] modal window visit Website`, async ({ isMobile }) => {
        if (isMobile) {
          await events.eventModalVisitWebsiteMobile.click();
        } else {
          await events.eventModalVisitWebsiteDesktop.click();
        }
        expect(await events.getCountTabs()).toEqual(2);
      });

      test(`[${short}] modal window event slider`, async () => {
        const eventModalTitleFirst = await events.eventModalTitle.innerText();
        await events.eventModalNextButton.click();
        const eventModalTitleSecond = await events.eventModalTitle.innerText();
        expect.soft(eventModalTitleFirst).not.toEqual(eventModalTitleSecond);
        await events.eventModalPrevButton.click();
        expect(eventModalTitleFirst).toEqual(await events.eventModalTitle.innerText());
      });

      test(`[${short}] close modal window`, async () => {
        await expect.soft(events.eventModalCover).toBeVisible();
        await events.eventModalCloseButton.click();
        await expect(events.eventModalCover).not.toBeVisible();
      });
    });

    test.describe('check calendar', () => {
      test(`[${short}] only with promocode toggle @smoke`, async () => {
        await events.onlyPromocodeToggle.click();
        for (let i = 0; i < (await events.calendarSingleEvent.count()); i++) {
          const elements = await events.calendarSingleEvent.all();
          await expect(elements[i].getByTestId('events-page-calendar-event-promocode')).toBeVisible();
        }
      });

      test(`[${short}] load more button @smoke`, async ({ page }) => {
        const firstAmount = await events.calendarSingleEvent.count();
        await events.loadMoreButton.click();
        await page.waitForTimeout(1500);
        const secondAmount = await events.calendarSingleEvent.count();
        expect(secondAmount).toBeGreaterThan(firstAmount);
      });
    });

    test.describe('filter options', () => {
      test.beforeEach(async () => {
        await events.filterButton.click();
      });

      test(`[${short}] country filter select option and clear @smoke`, async ({ page }) => {
        const cardsAmountFirst = await events.calendarSingleEvent.count();
        await events.countryField.locator('select').selectOption({ index: 1 });
        await page.waitForTimeout(1500);
        const cardsAmountSecond = await events.calendarSingleEvent.count();
        expect.soft(cardsAmountFirst).toBeGreaterThan(cardsAmountSecond);
        await events.clearFieldButton.click();
        expect(cardsAmountFirst).toEqual(await events.calendarSingleEvent.count());
      });

      test(`[${short}] country filter select option and check`, async ({ page }) => {
        const select = events.countryField.locator('select');
        const optionCountry = (await select.locator('option').nth(1).innerText()).trim();
        await select.selectOption(optionCountry);
        await page.waitForTimeout(1500);
        const eventPlace = (await events.eventPlace.first().innerText()).split(', ');
        expect(events.countryCodes[optionCountry]).toEqual(eventPlace[1]);
      });

      test(`[${short}] cities filter select option and check`, async ({ page }) => {
        const select = events.citiesField.locator('select');
        const optionCity = (await select.locator('option').nth(1).innerText()).trim();
        await select.selectOption(optionCity);
        await page.waitForTimeout(1500);
        const eventCity = (await events.eventPlace.first().innerText()).split(', ');
        expect(optionCity).toEqual(eventCity[0]);
      });

      test(`[${short}] months filter select option and check`, async ({ page }) => {
        const select = events.monthsField.locator('select');
        const optionMonth = (await select.locator('option').nth(1).innerText()).trim();
        await select.selectOption(optionMonth);
        await page.waitForTimeout(1500);
        const eventMonth = await events.calendarBlockMonth.first().innerText();
        expect(optionMonth.toLowerCase()).toContain(eventMonth.toLowerCase());
      });

      test(`[${short}] type filter select option and check`, async ({ page }) => {
        const select = events.eventTypeField.locator('select');
        const optionType = (await select.locator('option').nth(1).innerText()).trim();
        await select.selectOption(optionType);
        await page.waitForTimeout(1500);
        const eventType = await events.eventCategories.first().innerText();
        expect(eventType.toLowerCase()).toContain(optionType.toLowerCase());
      });
    });

    test.describe('event card', () => {
      test(`[${short}] event card visit Website @smoke`, async () => {
        await events.eventVisitWebsiteButton.first().click();
        expect(await events.getCountTabs()).toEqual(2);
      });

      test(`[${short}] event card show more button @smoke`, async () => {
        expect.soft(events.eventDescription.first()).not.toBeVisible();
        expect.soft(events.eventDuration.first()).not.toBeVisible();
        await events.eventShowMoreButton.first().click();
        expect.soft(events.eventDescription.first()).toBeVisible();
        expect(events.eventDuration.first()).toBeVisible();
      });
    });

    test.describe('event articles', () => {
      test(`[${short}] event article hover`, async ({ isMobile }) => {
        test.skip(isMobile, 'No hover on Mobile');
        await events.articleImage.first().hover();
        await expect(events.articleHover.first()).toBeVisible();
      });

      test(`[${short}] event article open @smoke`, async ({ page }) => {
        const postPage = new PostPage(page);
        const title = await events.articleTitle.first().innerText();
        await events.articleTitle.first().click();
        await page.waitForTimeout(5000);
        expect(await postPage.postTitle.first().innerText()).toEqual(title);
      });

      test(`[${short}] event article author`, async ({ page }) => {
        const authorPage = new AuthorPage(page);
        const title = await events.articleAuthor.first().innerText();
        await events.articleAuthor.first().click();
        await page.waitForTimeout(5000);
        expect(await authorPage.authorTitle.innerText()).toEqual(title);
      });
    });
  });
}
