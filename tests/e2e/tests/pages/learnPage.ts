import { BasePage } from './basePage';

export class Learn extends BasePage {
  // learn page elements
  breadcrumbHome = this.page.getByTestId('guide-categories-link-0');
  breadcrumbLearn = this.page.getByTestId('guide-categories-link-1');

  learnTitle = this.page.getByTestId('learn-title');
  learnLeadDesc = this.page.getByTestId('learn-leading-description');
  learnDesc = this.page.getByTestId('learn-description');
  category = this.page.getByTestId('learn-category');
  categorySelected = this.page.getByTestId('learn-category-selected');
  categoryTitle = this.page.getByTestId('learn-category-title');
  guideCategoryTitle = this.page.getByTestId('guide-category-title');
  guideCategoryDesc = this.page.getByTestId('guide-category-description');
  guideItem = this.page.getByTestId('guide-card rounded-lg');
  guideImage = this.page.getByTestId('guide-image');
  guideTitle = this.page.getByTestId('guide-title');
  searchField = this.page.getByTestId('search-guides-input');
  searchQueryClear = this.page.getByTestId('search-guides-input-clear-icon');
  searchResultTitle = this.page.getByTestId('search-guide-result-title');

  // learn post page elements
  learnPostBreadcrumbHome = this.page.getByTestId('guide-breadcrumb-link-0');
  learnPostBreadcrumbLearn = this.page.getByTestId('guide-breadcrumb-link-1');
  learnPostBreadcrumbTitle = this.page.getByTestId('guide-breadcrumb-link-2');
  learnPostTitle = this.page.getByTestId('guide-title');
  learnPostImage = this.page.getByTestId('guide-cover');
  learnPostShareList = this.page.getByTestId('guide-shares-list');
  learnPostContent = this.page.getByTestId('guide-content');
  learnPostNavigationTitle = this.page.getByTestId('guide-navigation-title');
  learnPostNavigationLink = this.page.getByTestId('guide-navigation-link');
  learnPostNavigationLinkActive = this.page.getByTestId('guide-navigation-link guide-navigation-link-active');

  //shares
  learnSharesFB = this.page.getByTestId('shares-link-facebook');
  learnSharesTW = this.page.getByTestId('shares-link-twitter');
  learnSharesTG = this.page.getByTestId('shares-link-telegram');
  learnSharesReddit = this.page.getByTestId('shares-link-reddit');
  learnSharesLinked = this.page.getByTestId('shares-link-linkedin');
  learnSharesWA = this.page.getByTestId('shares-link-whatsapp');
  learnSharesCopy = this.page.getByTestId('shares-link-copy');
  learnSharesToTop = this.page.getByTestId('shares-link-to-top');
  copyPopUp = this.page.locator("//span[@class='shares-list-copy__popup']");

  // mobile
  learnMobileNavigationTitle = this.page.getByTestId('guide-mobile-navigation-title');
  learnMobileNavigationLink = this.page.getByTestId('guide-navigation-mobile-link');
  learnMobileNavigationLinkActive = this.page.getByTestId(
    'guide-navigation-mobile-link guide-navigation-mobile-link-active'
  );
  learnMobileShareList = this.page.getByTestId('guide-mobile-shares-list');

  async checkLearnPageElements() {
    const locators = [
      this.breadcrumbHome,
      this.breadcrumbLearn,
      this.learnTitle,
      this.learnLeadDesc,
      this.learnDesc,
      this.searchField,
      this.category,
      this.categorySelected,
      this.guideCategoryTitle,
      this.guideCategoryDesc,
      this.guideItem,
      this.guideImage,
      this.guideTitle,
    ];
    await this.elementsToBeVisible(locators);
  }

  async checkLearnPostElements(isMobile: boolean | undefined) {
    const locators = [
      this.learnPostBreadcrumbHome,
      this.learnPostBreadcrumbLearn,
      this.learnPostBreadcrumbTitle,
      this.learnPostImage,
      this.learnPostShareList,
      this.learnPostContent,
      this.learnPostNavigationTitle,
      this.learnPostNavigationLink,
    ];
    const locatorsMobile = [
      this.learnPostBreadcrumbHome,
      this.learnPostBreadcrumbLearn,
      this.learnPostBreadcrumbTitle,
      this.learnPostImage,
      this.learnMobileShareList,
      this.learnPostContent,
      this.learnMobileNavigationTitle,
      this.learnMobileNavigationLink,
    ];
    if (!isMobile) {
      await this.elementsToBeVisible(locators);
    } else {
      await this.learnMobileNavigationTitle.click();
      await this.elementsToBeVisible(locatorsMobile);
    }
  }

  shareLinks = [
    this.learnSharesFB,
    this.learnSharesTW,
    this.learnSharesTG,
    this.learnSharesReddit,
    this.learnSharesLinked,
    this.learnSharesWA,
  ];
}
