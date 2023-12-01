import { BasePage } from './basePage';
import { Leaderboard } from './leaderboard/leaderboard';
import { Footer } from './footer/footer';

export class eventsPage extends BasePage {
  leaderboard = new Leaderboard(this.page);
  footer = new Footer(this.page);

  // events page locators:

  // page header and slides
  breadcrumbHome = this.page.getByTestId('events-breadcrumbs-link-0');
  breadcrumbEvents = this.page.getByTestId('events-breadcrumbs-link-1');
  title = this.page.getByTestId('events-page-title');
  letUsKnowButton = this.page.getByTestId('events-let-us-know');
  activeSlide = this.page.getByTestId('events-page-active-slide ');
  activeSlideTitle = this.page.getByTestId('events-page-active-slide-title');
  activeSlideLearnMore = this.page.getByTestId('events-page-active-slide-learn-more');
  activeSlideVisitWebsite = this.page.getByTestId('events-page-active-slide-visit-website');
  carouselElements = this.page.getByTestId('events-page-carousel-slide');
  carouselNextArrow = this.page.getByTestId('events-page-carousel-next-arrow');
  carouselPrevArrow = this.page.getByTestId('events-page-carousel-prev-arrow');

  // modal window
  eventModalCover = this.page.getByTestId('event-modal-cover');
  eventModalCloseButton = this.page.getByTestId('event-modal-close-btn');
  eventModalTitle = this.page.getByTestId('event-modal-title');
  eventModalVisitWebsiteDesktop = this.page.getByTestId('event-modal-desktop-visit-website-link');
  eventModalVisitWebsiteMobile = this.page.getByTestId('event-modal-mobile-visit-website-link');
  eventModalNextButton = this.page.getByTestId('event-modal-desktop-prev-next');
  eventModalPrevButton = this.page.getByTestId('event-modal-desktop-prev-arrow');
  eventModalMeta = this.page.getByTestId('event-modal-meta');
  eventModalDescription = this.page.getByTestId('event-modal-description');
  eventModalCategory = this.page.getByTestId('event-modal-categories');

  // filter
  filterButton = this.page.getByTestId('events-page-calendar-filter-button');
  countryField = this.page.getByTestId('events-page-calendar-filter-countries');
  citiesField = this.page.getByTestId('events-page-calendar-filter-cities');
  monthsField = this.page.getByTestId('events-page-calendar-filter-months');
  eventTypeField = this.page.getByTestId('events-page-calendar-filter-types');
  clearFieldButton = this.page.getByTestId('filter-clear-button');

  // page body and calendar
  calendarTitle = this.page.getByTestId('events-page-calendar-title');
  onlyPromocodeToggle = this.page.getByTestId('events-page-calendar-promocode');
  calendarBlock = this.page.getByTestId('events-page-calendar-events-block');
  calendarCard = this.page.getByTestId('events-page-calendar-events-card');
  calendarSingleEvent = this.page.getByTestId('events-page-calendar-event');
  calendarBlockDay = this.page.getByTestId('events-page-calendar-card-day');
  calendarBlockMonth = this.page.getByTestId('events-page-calendar-card-month');
  eventTitle = this.page.getByTestId('events-page-calendar-event-title');
  eventCategories = this.page.getByTestId('events-page-calendar-event-categories');
  eventPlace = this.page.getByTestId('events-page-calendar-event-place');
  eventShowMoreButton = this.page.getByTestId('events-page-calendar-event-show-more-mobile-arrow');
  eventDescription = this.page.getByTestId('events-page-calendar-event-description');
  eventDuration = this.page.getByTestId('events-page-calendar-event-duration');
  eventVisitWebsiteButton = this.page.getByTestId('events-page-calendar-event-visit-website');
  eventPromocode = this.page.getByTestId('events-page-calendar-event-promocode');
  loadMoreButton = this.page.getByTestId('events-page-calendar-load-more-button');

  // events articles
  articlesBlockTitle = this.page.getByTestId('events-page-posts-section-title');
  articlesSection = this.page.getByTestId('events-page-posts-block');
  articleItem = this.page.getByTestId('post-card');
  articleHover = this.page.getByTestId('post-card-preview-text');
  articleTitle = this.page.getByTestId('post-card-header');
  articleAuthor = this.page.getByTestId('post-card-author-link');
  articleDate = this.page.getByTestId('post-card-pulished-date');
  articleImage = this.page.getByTestId('post-card-image');
  articleBadge = this.page.getByTestId('post-card-badge');

  async checkEventsPageElements(isMobile: boolean | undefined) {
    const locators = [
      this.leaderboard.leaderboard,
      this.title,
      this.breadcrumbHome,
      this.breadcrumbEvents,
      this.letUsKnowButton,
      this.activeSlide,
      this.activeSlideLearnMore,
      this.activeSlideVisitWebsite,
      this.carouselElements,
      this.calendarTitle,
      this.onlyPromocodeToggle,
      this.filterButton,
      this.calendarBlock,
      this.loadMoreButton,
      this.footer.footerContainer,
      this.activeSlideTitle,
    ];
    if (isMobile) {
      locators.pop();
      await this.elementsToBeVisible(locators);
    } else {
      await this.elementsToBeVisible(locators);
    }
  }

  async checkEventModalElements(isMobile: boolean | undefined) {
    const locators = [
      this.eventModalCover,
      this.eventModalCloseButton,
      this.eventModalTitle,
      this.eventModalNextButton,
      this.eventModalPrevButton,
      this.eventModalMeta,
      this.eventModalDescription,
      this.eventModalVisitWebsiteDesktop,
    ];
    if (isMobile) {
      locators.pop();
      locators.push(this.eventModalVisitWebsiteMobile);
      await this.elementsToBeVisible(locators);
    } else {
      await this.elementsToBeVisible(locators);
    }
  }

  async checkFilterElements() {
    const locators = [this.countryField, this.citiesField, this.monthsField, this.eventTypeField];
    await this.elementsToBeVisible(locators);
  }

  async checkEventsCardElements() {
    const locators = [
      this.calendarCard,
      this.calendarSingleEvent,
      this.calendarBlockDay,
      this.calendarBlockMonth,
      this.eventTitle,
      this.eventPlace,
      this.eventShowMoreButton,
      this.eventVisitWebsiteButton,
    ];
    await this.elementsToBeVisible(locators);
  }

  async checkEventsPageArticleBlockElements() {
    const locators = [
      this.articlesBlockTitle,
      this.articlesSection,
      this.articleItem,
      this.articleTitle,
      this.articleAuthor,
      this.articleDate,
      this.articleImage,
      this.articleBadge,
    ];
    await this.elementsToBeVisible(locators);
  }

  countryCodes = {
    Australia: 'AU',
    Bahamas: 'BS',
    Croatia: 'HR',
    Cyprus: 'CY',
    'Czech Republic': 'CZ',
    DDenmark: 'DK',
    France: 'FR',
    Germany: 'DE',
    Ghana: 'GH',
    India: 'IN',
    Indonesia: 'ID',
    Italy: 'IT',
    Latvia: 'LV',
    Netherlands: 'NL',
    'Puerto Rico': 'PR',
    Singapore: 'SG',
    'South Africa': 'ZA',
    'South Korea': 'KR',
    Spain: 'ES',
    Switzerland: 'CH',
    Turkey: 'TR',
    'United Arab Emirates': 'AE',
    'United Kingdom': 'GB',
    'United States': 'US',
    Vietnam: 'VN',
  };
}
