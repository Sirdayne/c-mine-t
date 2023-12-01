import { BasePage } from './basePage';
import { Leaderboard } from './leaderboard/leaderboard';
import { expect } from '@playwright/test';

export class GlossaryPage extends BasePage {
  leaderboard = new Leaderboard(this.page);

  // Page elements
  glossaryTitle = this.page.getByTestId('glossary-title');
  glossaryDescription = this.page.getByTestId('glossary-description');
  glossaryNote = this.page.getByTestId('glossary-note');
  glossaryAlphabet = this.page.getByTestId('glossary-alphabet');
  glossaryInput = this.page.getByTestId('glossary-input').locator('visible=true');
  glossaryResults = this.page.getByTestId('glossary-results');

  glossaryLetter = this.page.getByTestId('glossary-letter').locator('visible=true');
  glossaryGhead = this.page.getByTestId('glossary-ghead');
  glossaryLinks = this.page.getByTestId('glossary-link').locator('visible=true');

  async checkGlossaryAlphabet() {
    const letters = await this.glossaryLetter.all();
    const gheads = await this.glossaryGhead.all();
    for (let i = 1; i < letters.length; i++) {
      const text = await letters[i].innerText();
      await letters[i].click();
      await this.page.waitForTimeout(1000);
      expect.soft(await this.pageIsScrolled()).toBeTruthy();
      await expect.soft(gheads[i]).toContainText(text);
    }
  }

  async checkGlossaryAlphabetInput() {
    const letters = await this.glossaryLetter.all();
    const input = this.glossaryInput;
    for (let i = 0; i < letters.length; i++) {
      const text = await letters[i].innerText();
      await input.fill(text);
      await this.page.waitForTimeout(500);
      await expect.soft(this.page.locator(`//div[@id='glossary-${text}']`)).toBeVisible();
      await input.fill('');
    }
  }

  async checkPageElements(isMobile: boolean | undefined) {
    const locators = [
      this.leaderboard.leaderboard,
      this.glossaryTitle,
      this.glossaryDescription,
      this.glossaryAlphabet,
      this.glossaryInput,
      this.glossaryResults,
      this.glossaryNote,
    ];
    if (isMobile) {
      await this.elementsToBeVisible(locators.slice(0, -1));
    } else {
      await this.elementsToBeVisible(locators);
    }
  }
}
