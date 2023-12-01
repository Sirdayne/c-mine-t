import { expect } from '@playwright/test';
import { BasePage } from './basePage';

export class MainPage extends BasePage {
  // Carousel
  carouselContainer = this.page.locator("//div[@class='main-news-rotator__container']");
  carouselTitle = this.page.locator("//span[@class='main-news-item__title']");
  carouselTitleLink = this.page.locator("//a[@class='main-news-item__title-link']");
  carouselAuthor = this.page.locator("//p[@class='main-news-item__author']/a");
  carouselImage = this.page.locator("//figure[@class='main-news-item__figure']/div");
  carouselPublicationDate = this.page.locator("//footer[@class='main-news-item__footer']/time");

  // Posts cards
  loadMoreButton = this.page.locator("//button[@class='btn posts-listing__more-btn']");
  loadMoreButtonAsia = this.page.locator("//button[@class='asia-posts-listing-mobile__load-more-btn']");
  backToTopButton = this.page.locator("//button[contains(@class,'to-top-button_shown')]");
  postListingItem = this.page.locator("//li[@class='posts-listing__item']");
  postListingItmeAsia = this.page.locator("//li[contains(@class,'asia-posts-listing-mobile__item')]");
  postCard = this.page.locator("//div[contains(@class,'post-card')]");
  postCardAsia = this.page.locator('//article');
  postLink = this.page.locator("//div[contains(@class,'post-card')]/article/a");
  postLinkAsia = this.page.locator("//a[@class='asia-post-card-mobile__title-link']");
  postIllustration = this.page.locator("//span[@class='post-card__title']");
  postIllustrationAsia = this.page.locator("//a[@class='asia-post-card-mobile__figure-link']");
  postBadge = this.page.locator("//span[contains(@class, 'post-card__badge post-card__badge_default')]");
  postTitle = this.page.locator("//span[@class='post-card__title']");
  postTitleAsia = this.page.locator("//div[@class='asia-post-card-mobile__title']");
  postAuthor = this.page.locator("//a[@class='post-card__author-link']");
  postAuthorAsia = this.page.locator("//a[@class='asia-post-card-mobile__author-link']");
  postPublicationDate = this.page.locator("//time[@class='post-card__date']");
  postLeadtext = this.page.locator("//p[@class='post-card__text']");
  advertiseBanners = this.page.locator("//li[@class='posts-listing__item']/div/div/a");

  // Editors choice and Hot stories
  editorsChoiceTab = this.page.locator("//button[contains(@class,'main-news-controls__tab')]").first();
  hotStoriesTab = this.page.locator("//button[contains(@class,'main-news-controls__tab')]").last();
  tabsBlockPosts = this.page.locator("//li[contains(@class, 'main-news-controls__item')]");
  activeTabPosts = this.page.locator("//a[@class='main-news-controls__link'] >> visible=true");
  editorsChoiceArticleAsia = this.page.locator("//a[@class='jp-editors-choice-mobile__news-link']");

  // Press Releases
  pressReleasesContainer = this.page.locator("//div[contains(@class, 'mt-3 py-4 border border-neutral-300')]");
  pressReleasesButton = this.page.locator("//div[contains(@class, 'rounded-containerPill group')]");
  pressReleasesBlockTitle = this.page.locator("//div/a[@href='/press-releases']");
  pressReleaseTitle = this.page.locator("//p[contains(@class, 'font-semibold text-zinc-800')]");
  pressReleaseTitleAsia = this.page.locator("//span[@class='asia-press-releases-mobile__pr-title']");
  pressReleaseImage = this.page.locator("//img[contains(@class, 'w-[--image-width] h-[--image-height]')]");
  pressReleaseImageAsia = this.page.locator("//div[@class='asia-press-releases-mobile__image']");
  pressReleasePosts = this.page.locator("//a[contains(@class, 'overflow-hidden')] >> visible=true");
  pressReleasePostsAsia = this.page.locator("//li[@class='asia-press-releases-mobile__item']");
  pressReleasesLoadMoreButton = this.page.locator("//button[contains(@class, 'leading-none font-emibold')]");
  pressReleasesLoadMoreButtonAsia = this.page.locator("//div[@class='asia-press-releases-mobile__load-more']");
  pressReleasesHidaButton = this.page.locator("//button[contains(@class, 'main-press-releases__action-btn_hide')]");

  // Stretch banners
  youtubeStretchBanner = this.page.locator("//div[@class='stretch-banner-youtube']");
  youtubeStretchBannerTitle = this.page.locator("//a[@class='stretch-banner-youtube__title-link']");
  youtubeStretchBannerDescription = this.page.locator("//p[@class='stretch-banner-youtube__desc']");
  youtubeStretchBannerSubscribe = this.page.locator("//a[@class='stretch-banner-youtube__action-link']");
  youtubeStretchBannerVideo = this.page.locator("//div[@class='stretch-banner-youtube']//img");

  // Universal blocks
  universalBlock = this.page.locator("//div[@class='uni-block uni-block_card']");
  universalBlockTitle = this.universalBlock.locator("//span[@class='uni-block__title']");
  universalBlockButtonPrev = this.universalBlock.locator("//button[contains(@class, 'btn uni-block__btn_prev')]");
  universalBlockButtonNext = this.universalBlock.locator("//button[contains(@class, 'btn uni-block__btn_next')]");
  universalBlockItemList = this.universalBlock.locator("//ul[@class='uni-block__list']");
  universalBlockItem = this.universalBlock.locator("//li[@class='uni-block__item']");
  universalBlockItemImage = this.universalBlock.locator("//li[@class='uni-block__item']//img");
  universalBlockItemTitle = this.universalBlock.locator("//li[@class='uni-block__item']/a/span");
  universalBlockLoadMoreButton = this.universalBlock.locator("//button[@class='btn uni-block__more-btn']");
  universalBlockHideButton = this.universalBlock.locator("//button[@class='btn uni-block__hide-btn']");

  // Historical widget
  recentlyCollectedWidget = this.page.locator('mm-recently-collected');
  recentlyCollectedHeader = this.page.locator('.w_recently_collected__header');
  recentlyCollectedTitleLink = this.page.locator('.w_recently_collected__link');
  recentlyCollectedSlider = this.page.locator('.w_recently_collected_slider');
  recentlyCollectedArrows = this.page.locator('.w_recently_collected_arrows');
  recentlyCollectedItem = this.page.locator('.splide__slide');
  recentlyCollectedReadButton = this.page.locator('.w_collectible__button--empty');
  recentlyCollectedCollectButton = this.page.locator("a :text-is('Collect')");

  async checkPostCardElements(isMobile: boolean | undefined, short: string) {
    let locators = [this.postIllustration, this.postTitle, this.postLeadtext, this.postAuthor, this.postBadge];
    if (isMobile && ['jp', 'cn'].includes(short)) {
      locators = [this.postIllustrationAsia, this.postTitleAsia, this.postAuthorAsia];
    }
    for (const locator of locators) {
      if (isMobile && locator === this.postLeadtext) {
        continue;
      } else {
        await expect.soft(locator.first()).toBeVisible();
      }
    }
  }

  async checkHistoricalWidgetElements(isMobile: boolean | undefined) {
    const locators = [
      this.recentlyCollectedHeader,
      this.recentlyCollectedArrows,
      this.recentlyCollectedTitleLink,
      this.recentlyCollectedSlider,
    ];
    for (const locator of locators) {
      if (isMobile && locator == this.recentlyCollectedArrows) {
        continue;
      } else {
        await expect.soft(locator.first(), `${locator}`).toBeVisible();
      }
    }
  }

  metaSeoTitles = {
    en: 'Cointelegraph: Bitcoin, Ethereum, Crypto News & Price Indexes',
    es: 'Noticias de Cointelegraph sobre blockchain, Bitcoin y Ethereum',
    cn: 'Cointelegraph中文，聚焦全球区块链市场动态',
    de: 'Cointelegraph Bitcoin & Ethereum Blockchain-Nachrichten',
    it: 'Cointelegraph: Notizie su Blockchain, Bitcoin & Ethereum',
    ar: 'Cointelegraph - أخبار بيتكوين وإيثريوم وبلوكتشين',
    jp: 'コインテレグラフ ジャパン | 仮想通貨+Web3.0の最新ニュースサイト｜',
    br: 'Cointelegraph Notícias Bitcoin & Ethereum Blockchain',
    kr: '코인텔레그래프 비트코인&이더리움 블록체인 뉴스',
    tr: 'Cointelegraph Bitcoin & Ethereum Blockchain Haberleri',
    fr: 'Cointelegraph : Bitcoin, Ethereum, Actualités crypto & Index des prix',
  };
}
