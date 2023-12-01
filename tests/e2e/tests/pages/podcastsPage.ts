import { BasePage } from './basePage';
import { Footer } from './footer/footer';
import { Leaderboard } from './leaderboard/leaderboard';
import { Sidebar } from './sidebar/sidebar';

export class PodcastsPage extends BasePage {
  leaderboard = new Leaderboard(this.page);
  sidebar = new Sidebar(this.page);
  footer = new Footer(this.page);

  // Podcasts header
  title = this.page.getByTestId('podcasts-page-title');
  description = this.page.getByTestId('podcasts-page-description');
  podcastImage = this.page.getByTestId('podcast-image');
  podcastTitle = this.page.getByTestId('podcast-title');

  // Podcasts
  podcastBlock = this.page.getByTestId('podcast-block');
  podcastHead = this.page.getByTestId('podcast-head');
  podcastAuthor = this.page.getByTestId('podcast-author');
  podcastDescription = this.page.getByTestId('podcast-description');
  podcastPlayer = this.page.getByTestId('podcast-player');
  podcastIframe = this.page.frameLocator("//iframe[@id='player_iframe']").last();
  podcastPlayButton = this.podcastIframe.locator("//div[@class='mejs-controls']//button[@title='Play']");
  podcastPauseButton = this.podcastIframe.locator("//div[@class='mejs-controls']//button[@title='Pause']");
  podcastEpisode = this.podcastIframe.locator("//div[@class='multi-episodes']//a");
  podcastEpisodeName = this.podcastIframe.locator("//div[@class='episode-name'] >> visible=true");
  podcastPlatformsLinks = this.page.getByTestId('podcast-platforms-link');

  // Disclaimer
  disclaimerTitle = this.page.getByTestId('podcast-disclaimer-title');
  disclaimerText = this.page.getByTestId('podcast-disclaimer-text');

  async checkPodcastsPageElements(isMobile: boolean | undefined) {
    let locators = [
      this.title,
      this.description,
      this.podcastImage,
      this.podcastTitle,
      this.podcastBlock,
      this.podcastPlatformsLinks,
      this.leaderboard.leaderboard,
      this.disclaimerTitle,
      this.disclaimerText,
      this.footer.footerContainer,
      this.sidebar.sidebar,
    ];
    if (isMobile) {
      locators = locators.slice(0, -1);
    }
    await this.elementsToBeVisible(locators);
  }

  async checkPodcastElements() {
    const locators = [
      this.podcastHead,
      this.podcastAuthor,
      this.podcastDescription,
      this.podcastPlayer,
      this.podcastEpisode,
    ];
    await this.elementsToBeVisible(locators);
  }
}
