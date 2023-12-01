import { expect } from '@playwright/test';
import { BasePage } from '../basePage';

export class Sidebar extends BasePage {
  sidebar = this.page.getByTestId('sidebar');

  // Editor's choice
  editorsChoiceWidget = this.page.getByTestId('editors-choice-widget');
  editorsChoiceTitle = this.page.getByTestId('editors-choice-widget-title');
  editorsChoiceWidgetArticle = this.page.getByTestId('editors-choice-widget-article');

  // Banners
  banners = this.page.getByTestId('sidebar-banner').locator('a');
  advertiseLink = this.page.getByTestId('sidebar-advertise-with-us');

  // Promo buttons
  promoButtons = this.page.getByTestId('promo-button');
  promoButtonDisclaimer = this.page.getByTestId('promo-button-disclaimer');
  promoButtonDisclaimerLogo = this.page.getByTestId('promo-button-logo');
  promoButtonDisclaimerText = this.page.getByTestId('promo-button-disclaimer-text');

  // YouTube
  youtubeContainer = this.page.getByTestId('youtube-banner');
  youtubeIframe = this.page.frameLocator("//div[contains(@class,'banner-youtube')]//iframe").first();
  youtubeVideoContainer = this.youtubeIframe.locator('//video');
  youtubeLargePlayButton = this.youtubeIframe.locator("//button[contains(@class,'ytp-large-play-button')]");
  youtubePlayButton = this.youtubeIframe.locator("//button[@title='Play']");
  youtubePauseButton = this.youtubeIframe.locator("//button[@title='Pause']");
  youtubeSubscribeButton = this.page.getByTestId('youtube-subscribe-button');

  // Price indexes widget
  priceIndexesWidget = this.page.getByTestId('price-index-widget');

  async checkSidebarIsVisible(isMobile: boolean | undefined) {
    if (!isMobile) {
      await expect(this.sidebar).toBeVisible();
    }
  }
}
