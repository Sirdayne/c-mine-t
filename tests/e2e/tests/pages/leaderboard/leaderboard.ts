import { expect } from '@playwright/test';
import { BasePage } from '../basePage';

export class Leaderboard extends BasePage {
  leaderboard = this.page.locator("//div[contains(@class,'header-zone layout__header')]//div[@class='container']");
  leaderboardAsiaMobile = this.page.locator("//div[contains(@class, 'container asia-header-zone-mobile__lb')]");

  async checkLeaderboardIsVisible(isMobile: boolean | undefined, short: string) {
    if (!['fr'].includes(short)) {
      if (isMobile && ['cn', 'jp'].includes(short)) {
        await expect(this.leaderboardAsiaMobile).toBeVisible();
      } else {
        await expect(this.leaderboard).toBeVisible();
      }
    }
  }
}
