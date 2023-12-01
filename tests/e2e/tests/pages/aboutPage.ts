import { BasePage } from './basePage';

export class About extends BasePage {
  // locators
  title = this.page.getByTestId('about-page-title');
  description = this.page.getByTestId('about-page-description');
  teamBlockTitle = this.page.getByTestId('about-page-team-block-title');
  teamBlockDesc = this.page.getByTestId('about-page-team-block-description');

  getInTouchBlock = this.page.getByTestId('about-page-get-in-touch');
  getInTouchTitle = this.page.getByTestId('about-page-get-in-touch-title');
  getInTouchAdvertiseLink = this.page.getByTestId('about-page-get-in-touch-adversite-link');
  getInTouchContactLink = this.page.getByTestId('about-page-get-in-touch-contact-link');

  brandResourcesBlock = this.page.getByTestId('about-page-brand-resources');
  brandResourcesTitle = this.page.getByTestId('about-page-brand-resources-title');
  brandResourcesLink = this.page.getByTestId('about-page-brand-resources-link');

  authorsTab = this.page.getByTestId('about-page-tab-authors');
  managementTab = this.page.getByTestId('about-page-tab-management-team');
  localTeamTab = this.page.getByTestId('about-page-tab-local-team');

  teamCardsGrid = this.page.getByTestId('about-page-team-grid');
  teamCard = this.page.getByTestId('about-page-team-card');
  teamCardName = this.page.getByTestId('about-page-team-card-name');
  teamCardImage = this.page.getByTestId('about-page-team-card-image');
  teamCardSocialIcon = this.page.getByTestId('about-page-team-card-social-link');
  teamCardJobTitle = this.page.getByTestId('about-page-team-card-job-title');

  aboutFooter = this.page.getByTestId('about-page-footer');

  async checkPageElements(short: string) {
    const locators = [
      this.title,
      this.description,
      this.teamBlockTitle,
      this.teamBlockDesc,
      this.getInTouchBlock,
      this.getInTouchTitle,
      this.getInTouchContactLink,
      this.brandResourcesBlock,
      this.brandResourcesTitle,
      this.brandResourcesLink,
      this.teamCardsGrid,
      this.authorsTab,
      this.managementTab,
      this.aboutFooter,
      this.localTeamTab,
    ];
    if ('en'.includes(short)) {
      await this.elementsToBeVisible(locators.slice(0, -1));
    } else {
      await this.elementsToBeVisible(locators);
    }
  }

  async checkTeamCardElements() {
    const locators = [
      this.teamCard,
      this.teamCardImage,
      this.teamCardName,
      this.teamCardSocialIcon,
      this.teamCardJobTitle,
    ];
    await this.elementsToBeVisible(locators);
  }
}
