<template>
  <div
    class="post-page"
    :class="[isAsia && isMobile && 'post-page_asia', isRtl && 'post-page_rtl']"
  >
    <div class="container">
      <div class="post-page__row">
        <div
          class="post-page__content-col"
          data-gtm-locator="articles"
        >
          <div
            v-for="(post, index) in articles"
            :key="post.id"
            class="post-page__item"
          >
            <Post
              :key="post.id"
              :is-first="post.id === firstArticleId"
              :is-last="post.id === lastArticleId"
              :post="post"
              :excluded-related-posts-ids="excludedRelatedIds"
              class="post-page__article"
              :data-gtm-locator="`a${index + 1}`"
              @copy-url="copyUrlHandler"
              @on-related-shown="onRelatedShownHandler"
              @current-post.native="handleMakePostCurrent(post.id)"
            />

            <PostAdSlots :post-index="index" />
          </div>
        </div>

        <div
          v-if="!isMounted || !isMobileBreakpoint"
          class="post-page__sidebar-col"
        >
          <Sidebar />
        </div>
      </div>
    </div>
    <TransitionGroup
      appear
      name="fade"
    >
      <SharesList
        v-if="!isMounted || isMobileBreakpoint"
        key="'post-page-mobile-shares'"
        class="post-page__mobile-shares"
        :post="currentArticle"
        :style="mobileSharesPositionStyles"
        @copied="copyUrlHandler"
      />
      <PostCopiedPopover
        v-if="urlIsCopied"
        key="post-copied-popover"
        :label="i18n.socialClipboardLabel"
      />
      <PostTickersLiveDataMobilePopup
        v-if="showPostLiveTickerData"
        key="post-page__live-data"
        class="post-page__live-data"
        :style="mobileSharesPositionStyles"
      />
    </TransitionGroup>
  </div>
</template>

<script>
import last from 'lodash/last';
import first from 'lodash/first';
import { mapState, mapGetters, mapActions } from 'vuex';
import { fetchArticlePageInitialState, fetchInfiniteScrollArticle } from '~/api/modules/article';
import { ROOT, FOOTER, VIEWPORT } from '~/store/types';
import getProperty from '~/assets/libs/getProperty';
import { getArticlePageMeta } from '~/assets/helpers/meta';
import { pushVirtualPageView } from '~/assets/helpers/dataLayerEvents';
import { pathValidator } from '~/assets/helpers/utils';
import Post from '~/components/Post/Post';
import SharesList from '~/components/Shared/SharesList/SharesList';
import PostCopiedPopover from '~/components/Post/PostCopiedPopover';
import { ARTICLE_PAGE_INFINITE_ARTICLES_LENGTH } from '~/app.config';
import PostTickersLiveDataMobilePopup from '~/components/Post/LiveData/PostTickersLiveDataMobilePopup.vue';
import { useCopyToClipboard } from '~/lib/clipboard';
import PostAdSlots from '~/components/Post/PostAdSlots.vue';
import { useExternalScript } from '~/assets/libs/ExternalScriptManager/useExternalScript';
import { getBackButtonListener } from '~/lib/shared';

const COPIED_TIMEOUT = 2000;

/**
 * @returns for given category on-scroll loaded article should be from given category
 */
const isOldBehaviourCategory = (categorySlug) =>
  ['innovation-circle', 'press-releases', 'market-releases'].includes(categorySlug);

// polyfill for "Array.findLast"
// TODO: setup polyfilling using "core-js"
// based on https://github.com/es-shims/Array.prototype.findLast/blob/main/implementation.js
const findLast = (array, predicate) => {
  if (!Array.isArray(array)) return;

  for (let index = array.length - 1; index >= 0; index -= 1) {
    const value = array[index];

    if (predicate(value)) return value;
  }

  return void undefined;
};

/**
 * @param articles
 * @param {boolean|null} promo
 * @return last found article matching promo flag. or any last article when promo is null
 */
const peekLastArticleByPromo = (articles, promo) =>
  findLast(articles, (article) => promo === null || article.isPromo === promo) ?? null;

/**
 * @param article return of "fetchArticlePageInitialState().articles.0"
 * @param {import('vue-router').Route} route Current route from asyncData context
 * @param {import('@nuxt/types/app').Context['error']} errorFn nuxt error function from asyncData context
 * @return {void} nothing returned when every check passed successfuly
 * @throws 404 redirect when article can't be visible
 */
const ensureArticleVisible = (article, route, errorFn) => {
  if (article?.isDeleted) {
    errorFn({
      statusCode: 404,
      deletedArticleTitle: article.title,
    });
  }

  if (
    !article ||
    // TODO: remove when explained category view migrated to Duke
    article.isExplained ||
    // Press releases article only from `/press-releases/_slug.vue`
    (article.isPressRelease && route.name !== 'press-releases-slug') ||
    // Market beat article only from `/market-releases/_slug.vue`
    (article.isMarketRelease && route.name !== 'market-releases-slug') ||
    // Innovation Circle article only from `/innovation-circle/_slug.vue`
    (article.isInnovationCircle && route.name !== 'innovation-circle-slug')
  ) {
    errorFn({ statusCode: 404 });
  }
};

const BackButtonListener = getBackButtonListener();

/**
 * Collectors mint widget script url
 * */
const MINT_COLLECTORS_WIDGET = 'https://www.unpkg.com/@mintmade/widgets/dist/collectors.min.js';

export default {
  name: 'ArticlePage',
  components: {
    PostAdSlots,
    PostTickersLiveDataMobilePopup,
    SharesList,
    PostCopiedPopover,
    Post,
    Sidebar: () => import('~/components/Sidebar/Sidebar'),
  },
  validate: pathValidator,
  setup() {
    const copyToClipboard = useCopyToClipboard();
    useExternalScript(MINT_COLLECTORS_WIDGET);

    return {
      copyToClipboard,
    };
  },
  async asyncData({ store: { state }, params, route, error, app }) {
    const data = await fetchArticlePageInitialState({
      slug: params.slug,
      // TODO: currentLanguage props refactoring
      languageDomain: state.currentLanguage.domain,
      languageCode: state.currentLanguage.code,
      timeZone: state.currentLanguage.timezone,
      languageShort: state.currentLanguage.short,
      i18n: state.i18n,
      pathname: route.path,
      apolloTransport: app.$apolloTransport,
    });
    const article = getProperty(data, 'articles.0', null);

    ensureArticleVisible(article, route, error);

    return data;
  },
  data() {
    return {
      hasMore: false,
      articles: [],
      currentAlternates: [],
      currentArticle: null,
      currentMeta: null,
      excludedRelatedIds: [],
      isMounted: false,
      isPending: false,
      urlIsCopied: false,
    };
  },

  computed: {
    ...mapState({
      currentLanguage: ({ currentLanguage }) => currentLanguage,
      languages: ({ languages }) => languages,
      i18n: ({ i18n }) => i18n,
    }),
    ...mapState('tickers', {
      showPostLiveTickerData: ({ showPostLiveTickerData }) => showPostLiveTickerData,
    }),
    ...mapGetters({
      isAsia: ROOT.IS_ASIA,
      isRtl: ROOT.IS_RTL,
      isEn: ROOT.IS_EN,
    }),
    ...mapState('viewport', {
      scrollTop: ({ scrollTop }) => scrollTop,
      viewportWidth: ({ viewportWidth }) => viewportWidth,
      viewportHeight: ({ viewportHeight }) => viewportHeight,
      bottomZoneHeight: ({ bottomZoneHeight }) => bottomZoneHeight,
      isMobile: ({ userDeviceType: { any } }) => any,
    }),
    ...mapGetters('viewport', {
      isMobileBreakpoint: VIEWPORT.IS_MOBILE_BREAKPOINT,
    }),
    firstArticleId() {
      const firstArticle = first(this.articles);
      if (!firstArticle || !firstArticle.id) {
        return null;
      }
      return firstArticle.id;
    },
    lastArticleId() {
      const lastArticle = last(this.articles);
      if (!lastArticle || !lastArticle.id) {
        return null;
      }
      return lastArticle.id;
    },
    mobileSharesPositionStyles() {
      return { bottom: `${this.bottomZoneHeight || 0}px` };
    },
  },
  watch: {
    hasMore: 'handleHasMoreChange',
    scrollTop: 'dispatchCurrentPostEvent',
    'currentArticle.id': 'sendChartBeatPageView',
  },
  mounted() {
    this.isMounted = true;
    this.handleHasMoreChange(this.hasMore);
    this.pushVirtualPageView();
    this.sendChartBeatPageView();
    this.setAlternates({
      alternates: this.currentAlternates,
      url: getProperty(this.currentMeta, 'url', ''),
    });
    this.fetchMoreArticles();
  },
  beforeDestroy() {
    this.showFooter();
    this.articles = [];
  },
  methods: {
    ...mapActions({
      setAlternates: ROOT.SET_ALTERNATES,
    }),
    ...mapActions('footer', {
      showFooter: FOOTER.SHOW,
      hideFooter: FOOTER.HIDE,
    }),

    handleHasMoreChange(value) {
      return value ? '' : this.showFooter();
    },

    handleMakePostCurrent(articleId) {
      const lastArticle = this.articles[this.articles.length - 1];
      const article = this.articles.find((item) => item.id === articleId);

      if (!article) return;
      if (article === lastArticle) this.fetchMoreArticles();

      if (articleId === this.currentArticle.id) return;

      BackButtonListener.updateInfinitiveScrollState(article.url);
      window.history.pushState(null, null, article.url);
      this.currentArticle = article;
      this.pushVirtualPageView();
    },

    async fetchMoreArticles() {
      if (this.isPending) return;

      try {
        const firstArticle = this.articles[0];
        const lastArticle = this.articles[this.articles.length - 1];
        const hasLoadedInfiniteArticleOnce = this.articles.length > 1;

        if (!firstArticle) return;

        let categorySlugArg = firstArticle.categorySlug;
        let promoArg = null;

        const shouldUseShuffleBehaviour = this.isEn && !isOldBehaviourCategory(categorySlugArg);

        if (shouldUseShuffleBehaviour) {
          const lastArticleIsPromo = lastArticle.isPromo;

          /**
           * Sequence:
           * - editorial (first) => editorial => promo => editorial ...
           * - promo (first) => promo => editorial => promo ...
           */

          promoArg = hasLoadedInfiniteArticleOnce ? !lastArticleIsPromo : lastArticleIsPromo;
          categorySlugArg = promoArg ? null : 'latest-news';
        }

        const lastArticleMatchingPromo = peekLastArticleByPromo(this.articles, promoArg);
        const beforePostIdArg = lastArticleMatchingPromo?.id ?? null;

        this.isPending = true;

        const { article, hasMore } = await fetchInfiniteScrollArticle({
          length: ARTICLE_PAGE_INFINITE_ARTICLES_LENGTH,
          languageDomain: this.currentLanguage.domain,
          languageCode: this.currentLanguage.code,
          timeZone: this.currentLanguage.timezone,
          languageShort: this.currentLanguage.short,
          i18n: this.i18n,
          apolloTransport: this.$apolloTransport,
          categorySlug: categorySlugArg,
          beforePostId: beforePostIdArg,
          promo: promoArg,
        });

        if (!article) {
          this.hasMore = false;
          return;
        }

        this.hasMore = hasMore;
        this.articles.push(article);
      } finally {
        this.isPending = false;
      }
    },

    copyUrlHandler(options) {
      const withPopup = getProperty(options, 'withPopup', true);
      const postUrl = getProperty(options, 'postUrl', '');
      if (withPopup) {
        this.urlIsCopied = true;
        setTimeout(() => {
          this.urlIsCopied = false;
        }, COPIED_TIMEOUT);
        return;
      }
      this.copyToClipboard(postUrl);
    },
    pushVirtualPageView() {
      const { url, title, categorySlug: category, tags } = this.currentArticle || {};
      const { url: domain } = this.currentLanguage;
      return pushVirtualPageView({
        url: domain + url,
        title,
        category,
        tags,
      });
    },
    sendChartBeatPageView() {
      const { isFirstPost } = this;
      const { currentArticle: post } = this;
      const categoryName = getProperty(post, 'categoryName', '');
      const author = getProperty(post, 'authorName', '');
      const path = getProperty(post, 'absoluteUrl', '');
      const title = getProperty(post, 'title', '');
      this.$chartBeat.sendPageView({
        sections: categoryName,
        authors: author,
        path,
        title,
      });
      if (isFirstPost) {
        this.$meta().refresh();
      }
    },
    onRelatedShownHandler({ excludedRelatedIds }) {
      this.excludedRelatedIds = excludedRelatedIds;
    },
    dispatchCurrentPostEvent() {
      const { viewportWidth, viewportHeight } = this;
      const centerX = viewportWidth / 2;
      const centerY = viewportHeight * 0.7;
      if (!document || typeof document.elementFromPoint !== 'function') {
        return;
      }
      const $el = document.elementFromPoint(centerX, centerY);
      if (!$el || typeof $el.dispatchEvent !== 'function') {
        return;
      }
      const customEvent = new Event('current-post', { bubbles: true });
      $el.dispatchEvent(customEvent);
    },
  },
  head() {
    return getArticlePageMeta({
      currentLanguage: this.currentLanguage,
      languages: this.languages,
      meta: this.currentMeta,
      article: this.currentArticle,
      alternates: this.currentAlternates,
      routeName: this.$route.name,
    });
  },
};
</script>

<style lang="scss">
@use '~/assets/styles/_icons-common.scss' as icons;
@import '~/assets/styles/_vars.scss';

.post-page__row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 40px;
  margin-left: -$gutter;
  margin-right: -$gutter;
}
.post-page__content-col,
.post-page__sidebar-col {
  box-sizing: border-box;
  padding-right: $gutter;
  padding-left: $gutter;
}
.post-page__content-col {
  width: 100%;
}
.post-page__sidebar-col {
  display: none;
}
.post-page__item {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f2f2f2;
}
.post-page__item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: 0;
}
.post-page__article {
  margin-bottom: 24px;
}
.post-page__article:last-child {
  margin-bottom: 0;
}

.post-page__mobile-shares {
  position: fixed;
  z-index: 1;
  left: 0;
  bottom: 0;
  width: 100vw;
  box-sizing: border-box;
  transition: bottom 0.15s linears;
  will-change: bottom;
}
.post-page__live-data {
  position: fixed;
  z-index: 10;
  left: 0;
  bottom: 0;
  width: 100vw;
  box-sizing: border-box;
  transition: bottom 0.15s linears;
  will-change: bottom;
}
.post-page_asia {
  margin-top: 20px;
}
.post-page_rtl {
  direction: rtl;
}
.post-page_rtl .post-page__pending-cap {
  margin-left: 0;
  margin-right: 8px;
}

@media (min-width: $sm) {
  .post-page__item {
    padding-left: 45px;
    padding-right: 45px;
  }
}
@media (min-width: $md) {
  .post-page__content-col {
    width: $col-10;
  }
  .post-page__sidebar-col {
    display: block;
    width: $col-5;
    margin-left: $col-1;
  }
  .post-page_rtl .post-page__sidebar-col {
    margin-left: 0;
    margin-right: $col-1;
  }
  .post-page__item {
    margin-bottom: 40px;
    padding-bottom: 40px;
    padding-left: 0;
    padding-right: 0;
  }
  .post-page__item:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
  }
  .post-page__mobile-shares {
    display: none;
  }
}
</style>
