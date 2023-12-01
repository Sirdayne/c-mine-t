<script lang="ts">
import { ArticleQueryDocument, useQuery } from '~/graphql';
import { computed, onMounted, ref, watchEffect } from 'vue';
import { TableOfContentsViewModel } from '~/lib/table-of-contents';
import { provideTOCViewModel } from '~/lib/table-of-contents';
import { useContext, useRoute, useStore, defineComponent, useMeta } from '~/lib/framework';
import { getMappedPost } from '~/assets/helpers/posts';
import HeaderZoneBannerWrapper from '~/components/Header/HeaderZoneBannerWrapper.vue';
import { useFeatureManager } from '~/lib/feature-manager';
import { useDeviceInfo } from '~/lib/device-detector';
import ExplainedExpandableContents from '~/components/Explained/ExplainedExpandableContents.vue';
import SharesList from '~/components/Shared/SharesList/SharesList.vue';
import PostContent from '~/components/Post/PostContent.vue';
import PostTickersLiveDataMobilePopup from '~/components/Post/LiveData/PostTickersLiveDataMobilePopup.vue';
import PostCopiedPopover from '~/components/Post/PostCopiedPopover.vue';
import { useCopyToClipboard } from '~/lib/clipboard';
import getProperty from '~/assets/libs/getProperty';
import Affix from '~/components/Shared/Affix.vue';
import { TableOfContents } from '~/lib/table-of-contents';
import { getArticlePageMeta } from '~/assets/helpers/meta/article';
import ExplainedIntro from '~/components/Explained/ExplainedIntro.vue';
import { ROOT } from '~/store/types';

const COPIED_TIMEOUT = 2000;

export default defineComponent({
  name: 'ExplainedArticle',
  components: {
    ExplainedIntro,
    TableOfContents,
    Affix,
    PostCopiedPopover,
    PostTickersLiveDataMobilePopup,
    PostContent,
    SharesList,
    ExplainedExpandableContents,
    HeaderZoneBannerWrapper,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const deviceInfo = useDeviceInfo();
    const featureManager = useFeatureManager();
    const context = useContext();

    const currentLanguage = computed(() => store.state.currentLanguage);

    const asiaMobileLayoutEnabled = computed(() => featureManager.isEnabled('asia_mobile_layout') && deviceInfo.mobile);

    const languages = computed(() => store.state.languages);

    const explainedQuery = useQuery({
      query: ArticleQueryDocument,
      variables: {
        short: computed(() => currentLanguage.value.short),
        slug: computed(() => route.value.params.slug),
      },
    });

    const i18n = computed(() => store.state.i18n);

    const bottomZoneHeight = computed(() => store.state.viewport.bottomZoneHeight);

    const mobileTickerPopupStyle = computed(() => {
      return { bottom: `${bottomZoneHeight.value || 0}px` };
    });
    const showPostLiveTickerData = computed(() => store.state.tickers.showPostLiveTickerData);

    const explainedPost = computed(() => {
      return getMappedPost(explainedQuery.data.value?.locale?.post, {
        languageDomain: currentLanguage.value.languageDomain,
        languageCode: currentLanguage.value.languageCode,
        timeZone: currentLanguage.value.timeZone,
        i18n,
        pathname: route.value.path,
        languageShort: currentLanguage.value.short,
      });
    });

    const tocVM = new TableOfContentsViewModel(true);
    provideTOCViewModel(tocVM);

    const onContentReady = (contentEl: HTMLElement): void => {
      tocVM.buildTableOfContent(contentEl);
    };

    const urlIsCopied = ref<boolean>(false);

    const copyToClipboard = useCopyToClipboard();
    const copyUrlHandler = (options): void => {
      const withPopup = getProperty(options, 'withPopup', true);
      const postUrl = getProperty(options, 'postUrl', '');
      if (withPopup) {
        urlIsCopied.value = true;
        setTimeout(() => {
          urlIsCopied.value = false;
        }, COPIED_TIMEOUT);
        return;
      }
      copyToClipboard(postUrl);
    };

    onMounted(() => {
      context?.$chartBeat.sendPageView({ sections: 'explained' });
    });

    useMeta(() => {
      return getArticlePageMeta({
        currentLanguage: currentLanguage.value,
        languages: languages.value,
        meta: explainedPost.value.meta,
        routeName: route.value?.name,
        article: explainedPost,
        isCn: computed(() => store.getters[ROOT.IS_CN]).value,
      });
    });

    watchEffect(() => {
      if (explainedQuery.data.value?.locale?.post === null) {
        context.error({ statusCode: 404 });
      }
    });

    return {
      explainedPost,
      asiaMobileLayoutEnabled,
      deviceInfo,
      onContentReady,
      showPostLiveTickerData,
      mobileTickerPopupStyle,
      copyUrlHandler,
      urlIsCopied,
      i18n,
    };
  },

  head: {},
});
</script>

<template>
  <div
    v-if="explainedPost.article"
    class="min-h-screen"
  >
    <ExplainedIntro :post="explainedPost.article" />
    <HeaderZoneBannerWrapper
      data-testid="explained-leaderboard-banner"
      :class="asiaMobileLayoutEnabled && 'asia-header-zone-mobile__lb'"
      class="mb-4 mt-4"
    />
    <div class="container mb-8">
      <div class="explained-content">
        <div class="mb-8 relative">
          <div class="relative">
            <ExplainedExpandableContents v-if="!deviceInfo.desktop" />
            <div
              v-if="!deviceInfo.mobile"
              class="absolute top-0 bottom-0 z-[1]"
            >
              <SharesList
                v-once
                :post="explainedPost.article"
                data-testid="explained-shares-list"
                class="hidden md:sticky md:top-5 md:!block"
              />
            </div>
            <PostContent
              :key="explainedPost.article.id"
              :post-id="explainedPost.article.id"
              :post="explainedPost.article.fullText"
              :slug="explainedPost.article.slug"
              without-live-data
              without-inline-ad
              data-testid="explained-content"
              class="shadow-[0_2px_32px_0px_#00000014] bg-[#0000000D]"
              @contentReady="onContentReady"
            />
          </div>
          <TransitionGroup
            appear
            name="fade"
          >
            <SharesList
              v-if="!deviceInfo.desktop"
              key="explained-page-mobile-shares"
              :style="mobileTickerPopupStyle"
              :post="explainedPost.article"
              data-testid="explained-mobile-shares-list"
              class="fixed z-[1] left-0 bottom-0 w-[100vw] will-change-[bottom] transition-[bottom].15 md:hidden"
              @copied="copyUrlHandler"
            />
            <PostCopiedPopover
              v-if="urlIsCopied"
              key="explained-copied-popover"
              :label="i18n.socialClipboardLabel"
            />
            <PostTickersLiveDataMobilePopup
              v-if="showPostLiveTickerData"
              key="explained-page-live-data"
              :style="mobileTickerPopupStyle"
              class="fixed z-10 left-0 bottom-0 w-full will-change-auto"
            />
          </TransitionGroup>
        </div>
        <div v-if="deviceInfo.desktop">
          <Affix>
            <div
              class="font-semibold text-xxl leading-[34px] text-fg-default mb-5"
              data-testid="explained-navigation-title"
            >
              {{ i18n.guideSidebarContents }}
            </div>
            <TableOfContents
              with-link-index
              data-test-id="explained-navigation-link"
              data-test-id-active="explained-navigation-link-active"
            />
          </Affix>
        </div>
      </div>
    </div>
  </div>
  <div
    v-else
    class="min-h-screen"
  />
</template>

<style scoped lang="scss">
@import '~/assets/styles/_mixins.scss';

.explained-content {
  @include grid-container;
}
</style>
