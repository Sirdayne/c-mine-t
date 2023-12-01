<script lang="ts">
import { defineComponent, useMeta, useRoute, useStore } from '~/lib/framework';
import { type Guide } from '~/graphql';
import { computed, PropType, ref, unref, watch } from 'vue';
import { useDeviceInfo } from '~/lib/device-detector';
import ExpandableContents from '../ExpandableContents.vue';
import PostTickersLiveDataMobilePopup from '~/components/Post/LiveData/PostTickersLiveDataMobilePopup.vue';
import { getArticlePageMeta } from '~/assets/helpers/meta/article';
import { OptimizedImage } from '~/lib/image';
import PostContent from '~/components/Post/PostContent.vue';
import { useTOCViewModel } from '~/lib/table-of-contents';
import { useLayoutUiStore } from '~/lib/layout-store';
import SharesList from '~/components/Shared/SharesList/SharesList.vue';
import { getAbsoluteUrl } from '~/assets/helpers/posts';
import PostCopiedPopover from '~/components/Post/PostCopiedPopover.vue';
import { useCopyToClipboard } from '~/lib/clipboard';
import getProperty from '~/assets/libs/getProperty';
import Affix from '~/components/Shared/Affix.vue';
import { TableOfContents } from '~/lib/table-of-contents';
import { AdSlot } from '~/features/ads';
import { ROOT } from '~/store/types';
import Breadcrumbs, { type Breadcrumb } from '~/components/Shared/Breadcrumbs.vue';

const MOBILE_COVER_WIDTH = 370;
const MOBILE_COVER_HEIGHT = 246;

const TABLET_COVER_WIDTH = 640;
const TABLET_COVER_HEIGHT = 424;

const DESKTOP_COVER_WIDTH = 718;
const DESKTOP_COVER_HEIGHT = 478;

const COPIED_TIMEOUT = 2000;
export default defineComponent({
  name: 'GuidePostView',
  components: {
    Breadcrumbs,
    AdSlot,
    TableOfContents,
    PostCopiedPopover,
    SharesList,
    PostContent,
    OptimizedImage,
    ExpandableContents,
    PostTickersLiveDataMobilePopup,
    Affix,
  },
  props: {
    guide: {
      type: Object as PropType<Guide>,
      default: null,
    },
  },
  setup(props) {
    const store = useStore();
    const route = useRoute();
    const tableOfContentsViewModel = useTOCViewModel();
    const layoutUiStore = useLayoutUiStore();

    const contents = computed(() => store.state.i18n.guideSidebarContents);

    const deviceInfo = useDeviceInfo();
    const currentLanguage = computed(() => store.state.currentLanguage);
    const languages = computed(() => store.state.languages);
    const socialClipboardLabel = computed(() => store.state.i18n.socialClipboardLabel);

    const urlIsCopied = ref<boolean>(false);

    const coverSize = computed(() => {
      if (deviceInfo.desktop) return { height: DESKTOP_COVER_HEIGHT, width: DESKTOP_COVER_WIDTH };

      if (deviceInfo.tablet) return { height: TABLET_COVER_HEIGHT, width: TABLET_COVER_WIDTH };

      return { height: MOBILE_COVER_HEIGHT, width: MOBILE_COVER_WIDTH };
    });

    const sharesGuide = computed(() => {
      return {
        absoluteUrl: getAbsoluteUrl({ domain: currentLanguage.value.domain, url: `/learn/${props.guide.slug}` }) ?? '',
        title: props.guide?.translate?.title ?? '',
        twitterLeadText: '',
        previewText: props.guide.translate?.title ?? '',
        cover: props.guide?.coverImg ?? '',
        id: props.guide?.id ?? '',
      };
    });

    const bottomZoneHeight = computed(() => store.state.viewport.bottomZoneHeight);
    const mobileTickerPopupStyle = computed(() => {
      return { bottom: `${bottomZoneHeight.value || 0}px` };
    });
    const showPostLiveTickerData = computed(() => store.state.tickers.showPostLiveTickerData);

    const onContentReady = (contentEl: HTMLElement): void => {
      tableOfContentsViewModel.buildTableOfContent(contentEl);
    };

    watch(
      () => props.guide,
      () => {
        layoutUiStore.setHeaderVariant('light');
      },
      { immediate: true }
    );

    const copyToClipboard = useCopyToClipboard();

    const copyUrlHandler = (options: any): void => {
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

    const guideCrumbs = computed(() => {
      const { guide } = props;
      const guideTitle = guide.translate?.title;
      const result: Breadcrumb[] = [
        {
          name: 'learn',
          path: '/learn',
        },
      ];

      if (guideTitle) result.push({ name: guideTitle, path: null });

      return result;
    });

    const meta = computed(() => {
      const guide = props.guide;
      return {
        url: route.value.path,
        title: guide?.translate?.seoTitle ?? '',
        description: guide?.translate?.seoDescription ?? '',
        keywords: guide?.translate?.seoKeywords ?? '',
        image: guide?.socialImg ?? '',
      };
    });

    useMeta(() => {
      return getArticlePageMeta({
        currentLanguage: currentLanguage.value,
        isCn: computed(() => store.getters[ROOT.IS_CN]).value,
        languages: languages.value,
        meta: meta.value,
        routeName: route.value?.name,
        article: unref(props.guide),
      });
    });
    return {
      deviceInfo,
      sharesGuide,
      showPostLiveTickerData,
      mobileTickerPopupStyle,
      onContentReady,
      coverSize,
      socialClipboardLabel,
      copyUrlHandler,
      urlIsCopied,
      contents,
      guideCrumbs,
    };
  },
  head: {},
});
</script>
<template>
  <div
    v-if="guide"
    class="container mb-8"
  >
    <Breadcrumbs
      :breadcrumbs="guideCrumbs"
      data-test-id="guide-breadcrumb-link"
      class="mx-auto sm:max-w-[637px] md:max-w-[1160px]"
    />
    <div class="guide">
      <div class="mb-8 relative">
        <h1
          ref="title"
          data-testid="guide-title"
          class="guide__title m-6 font-semibold text-[24px] lg:text-[36px] leading-[1.2em] mr-0 ml-0 mt-0"
        >
          {{ guide.translate.title }}
        </h1>
        <OptimizedImage
          :src="guide.coverImg"
          :width="coverSize.width"
          :height="coverSize.height"
          class="mb-4 md:mb-8"
          data-testid="guide-cover"
        />
        <div class="relative">
          <ExpandableContents v-if="!deviceInfo.desktop" />
          <div
            v-if="!deviceInfo.mobile || false"
            class="absolute top-0 bottom-0 z-[1]"
          >
            <SharesList
              v-once
              :post="sharesGuide"
              data-testid="guide-shares-list"
              class="post__block hidden md:sticky md:top-5 md:!block"
            />
          </div>
          <PostContent
            :key="guide.id"
            :post-id="guide.id"
            :post="guide.translate.fullText"
            :slug="guide.slug"
            data-testid="guide-content"
            @contentReady="onContentReady"
          />
        </div>
        <TransitionGroup
          appear
          name="fade"
        >
          <SharesList
            v-if="!deviceInfo.desktop"
            key="guide-page-mobile-shares"
            :style="mobileTickerPopupStyle"
            :post="sharesGuide"
            data-testid="guide-mobile-shares-list"
            class="fixed z-[1] left-0 bottom-0 w-[100vw] will-change-[bottom] transition-[bottom].15 md:hidden"
            @copied="copyUrlHandler"
          />
          <PostCopiedPopover
            v-if="urlIsCopied"
            key="guide-copied-popover"
            :label="socialClipboardLabel"
          />
          <PostTickersLiveDataMobilePopup
            v-if="showPostLiveTickerData"
            key="guide-page-live-data"
            :style="mobileTickerPopupStyle"
            class="fixed z-10 left-0 bottom-0 w-full will-change-auto"
          />
        </TransitionGroup>
      </div>
      <div v-if="deviceInfo.desktop">
        <Affix>
          <div
            class="font-semibold text-xxl leading-[34px] text-fg-default mb-5"
            data-testid="guide-navigation-title"
          >
            {{ contents }}
          </div>
          <TableOfContents
            data-test-id="guide-navigation-link"
            data-test-id-active="guide-navigation-link-active"
          />
          <AdSlot
            place="learn_sidebar_desktop_stack"
            class="w-full mb-2"
            data-testid="guide-promo-button-stack"
            :config="{
              disclaimerHidden: true,
              promoButtonFullWidth: true,
              promoButtonStackTransparentBackground: true,
              promoButtonDisclaimerHidden: true,
              promoButtonStackWithoutDisclaimer: deviceInfo.desktop,
            }"
          />
        </Affix>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '~/assets/styles/_mixins.scss';

.guide {
  @include grid-container;
}
</style>
