<template>
  <div
    :class="[
      isAsia && 'post_asia',
      isRtl && 'post_rtl',
      (post.isPressRelease || post.isMarketRelease) && 'post_press-release',
    ]"
    class="post"
  >
    <article
      :id="`article-${post.id}`"
      class="post__article"
    >
      <PostMeta
        v-once
        :post="post"
        class="post__block post__block_post-meta"
      />
      <h1
        ref="title"
        class="post__title"
      >
        {{ post.title }}
      </h1>
      <div
        v-if="isPreviewTextVisible"
        class="post__block post__block_lead-text"
      >
        <p
          class="post__lead"
          itemProp="description"
        >
          {{ post.previewText }}
        </p>
      </div>
      <PostActions
        v-if="isPostActionsVisible"
        v-once
        class="post__block post__block_post-actions"
        :audio-src="post.audio"
        :post-id="post.id"
        :views="post.views"
        :is-press-release="post.isPressRelease || post.isMarketRelease"
        :shares="post.shares"
      />
      <PostCover
        v-if="post.cover || post.youtubeVideoIdCover"
        :post="post"
        :immediate="isFirst"
        class="post__block"
        :class="{ post__block_nft: !isNFTVisible }"
      />
      <client-only>
        <MintCollectorsWidget
          v-if="isNFTVisible"
          class="post__block_nft"
          :post-url="post.url"
        />
      </client-only>
      <PostDisclaimerJp
        v-if="isJp && (post.isPressRelease || post.isMarketRelease) && !post.isDisclaimerHidden"
        :i18n="i18n"
        class="post__block post__block_disclaimer-jp"
      />
      <PostSocials
        v-if="isEn && !post.isPromo"
        class="post__socials-block"
      />
      <div class="post__content-wrapper">
        <div
          v-if="!isMobileBreakpoint"
          class="post__content-shares"
        >
          <SharesList
            v-once
            :post="post"
            class="post__block post__block_shares"
          />
        </div>
        <PostContent
          v-if="isPostLiveDataExist"
          ref="postContent"
          :post-id="post.id"
          :post="post.fullText"
          :slug="post.slug"
          :is-first="isFirst"
          :mimic-block="i18n.mimicBlock"
          :changelly-widget-view-model="changellyWidgetVM"
          :is-promo="post.isPromo"
          :is-defined="post.isDefined"
          :post-tags-list="post.tags"
          @needTickersToRender="isPostLiveDataExist"
          @beforeInsertPostTags="onBeforeInsertPostTags"
        />
        <PostDisclaimer
          v-if="(post.isPressRelease || post.isMarketRelease) && !post.isDisclaimerHidden"
          v-once
          :variant="post.isMarketRelease ? 'marketRelease' : 'pressRelease'"
          class="post__block post__block_disclaimer"
        />
        <PostBlockShow class="post__block post__block_b-show" />

        <template v-if="!tagsHidden && post.tags && post.tags.length">
          <div class="post__separator-line" />
          <PostTagsList
            v-once
            :tags-list="post.tags"
            :post-id="post.id"
            class="post__block post__block_tags"
          />
        </template>

        <AdSlot
          :place="afterBodyAdSlotPlace"
          :config="{
            closable: true,
          }"
          class="adslot-after-article"
        />

        <template v-if="isEditorialPost && post.translationId">
          <div class="post__separator-line" />
          <PostReactions
            :post-translate-id="post.translationId"
            :post-id="post.id"
          />
        </template>

        <PostRelatedList
          v-if="isRelatedPostsAllowed"
          :title="i18n.articleRelatedNewsTitle"
          :posts="relatedPosts"
        />

        <ClientOnly>
          <PopInRecommend
            v-if="isPopInRecommendAllowed"
            :canonical="post.absoluteUrl"
            class="post__block post__block_popin-recommend"
          />
        </ClientOnly>

        <PostMoreAbout
          v-if="hasTopics"
          v-once
          class="post__block post__block_more_about"
          :topics="post.topics"
        />
        <img
          v-if="post.trackingPixelUrl"
          class="visually-hidden"
          alt=""
          :src="post.trackingPixelUrl"
        />
      </div>
    </article>
  </div>
</template>

<script>
import { computed, getCurrentInstance } from 'vue';
import { mapGetters, mapState } from 'vuex';
import getProperty from '~/assets/libs/getProperty';
import { useDeviceInfo } from '~/lib/device-detector';
import { ROOT, TICKERS, VIEWPORT } from '~/store/types';
import { fetchRelatedPosts } from '~/api/modules/relatedNews';
import SharesList from '~/components/Shared/SharesList/SharesList';
import PostBlockShow from '~/components/Post/PostBlockShow';
import { PostReactions } from '~/components/Post/ReactionsPicker';
import { AdSlot } from '~/features/ads';
import PostMeta from './PostMeta.vue';
import PostTagsList from './PostTagsList.vue';
import PostRelatedList from './PostRelatedList.vue';
import PostMoreAbout from './PostMoreAbout.vue';
import PostActions from './PostActions.vue';
import PostCover from './PostCover.vue';
import PostContent from './PostContent.vue';
import PostDisclaimer from './PostDisclaimer.vue';
import PostSocials from './PostSocials.vue';
import { MintCollectorsWidget } from '~/features/mint-collectors';
import { useExternalScript } from '~/assets/libs/ExternalScriptManager/useExternalScript';
import { TWITTER_WIDGETS_JS } from '~/app.config';
import { useChangellyWidgetViewModel } from '~/features/changelly-widget';

const COPY_EVENT_NAME = 'copy-url';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Post',
  components: {
    MintCollectorsWidget,
    AdSlot,
    PostSocials,
    PostReactions,
    PostBlockShow,
    SharesList,
    PostContent,
    PostDisclaimer,
    PostActions,
    PostCover,
    PostMeta,
    PostTagsList,
    PostRelatedList,
    PostMoreAbout,
    PostDisclaimerJp: () => import('~/components/Post/PostDisclaimerJp'),
    PopInRecommend: () => import('~/components/Banners/PopInRecommend'),
  },
  props: {
    isFirst: {
      type: Boolean,
    },
    isLast: {
      type: Boolean,
    },
    post: {
      type: Object,
      default: () => ({}),
    },
    excludedRelatedPostsIds: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const deviceInfo = useDeviceInfo();
    const afterBodyAdSlotPlace = computed(() =>
      deviceInfo.mobile ? 'after_article_body_mobile' : 'after_article_body_desktop'
    );
    const isTwitterWidgetLoaded = useExternalScript(TWITTER_WIDGETS_JS);

    const inst = getCurrentInstance().proxy;
    const changellyWidgetVM = useChangellyWidgetViewModel(() => inst.post);

    return {
      afterBodyAdSlotPlace,
      isTwitterWidgetLoaded,
      changellyWidgetVM,
    };
  },
  data() {
    return {
      isShowNext: true,
      relatedPosts: this.post.relatedPosts,
      intersectionPositionBottom: null,
      tagsHidden: false,
    };
  },
  computed: {
    ...mapState({
      i18n: ({ i18n }) => i18n,
      currentLanguage: ({ currentLanguage }) => currentLanguage,
    }),
    ...mapState('viewport', {
      scrollTop: ({ scrollTop }) => scrollTop,
      breakpoint: ({ breakpoint }) => breakpoint,
      viewportHeight: ({ viewportHeight }) => viewportHeight,
      isMobile: ({ userDeviceType: { any } }) => any,
      isPhone: ({ userDeviceType: { phone } }) => phone,
    }),
    ...mapGetters('viewport', {
      isMobileBreakpoint: VIEWPORT.IS_MOBILE_BREAKPOINT,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
      isEn: ROOT.IS_EN,
      isJp: ROOT.IS_JP,
      isAsia: ROOT.IS_ASIA,
    }),
    ...mapGetters('tickers', {
      coins: TICKERS.POST_COINS,
    }),
    hasCoins() {
      return this.coins?.length > 0;
    },
    hasTopics() {
      const topics = getProperty(this.post, 'topics', []);
      return Array.isArray(topics) && topics.length;
    },
    hasRelatedPosts() {
      const { relatedPosts } = this;
      return Array.isArray(relatedPosts) && relatedPosts.length;
    },
    isRelatedPostsAllowed() {
      const { hasRelatedPosts, isJp } = this;
      return Boolean(hasRelatedPosts && !isJp);
    },
    isPopInRecommendAllowed() {
      const { isJp, isFirst } = this;
      return Boolean(isFirst && isJp);
    },
    isFullTextWithTwitterWidgets() {
      const fullText = getProperty(this, 'post.fullText', '');
      return /twitter.com\/widgets\.js/gm.test(fullText);
    },
    isPreviewTextVisible() {
      const { isJp, post } = this;
      return !(isJp || post.isPressRelease || post.isMarketRelease);
    },
    isNFTVisible() {
      return this.isEn && !this.post.isPromo && !this.post.isMarketRelease && !this.post.isPressRelease;
    },
    isEditorialPost() {
      return (
        !this.post.isPressRelease && !this.post.isMarketRelease && !this.post.isPromo && !this.post.isInnovationCircle
      );
    },
    // deprecated CDT-2483
    isPostActionsVisible() {
      return this.post.showShares || this.post.showStats;
    },
  },
  watch: {
    isTwitterWidgetLoaded: {
      handler() {
        if (this.isFullTextWithTwitterWidgets) {
          this.loadTwitterEmbed();
        }
      },
      immediate: true,
    },
  },
  created() {
    this.getRelatedPosts();
  },
  mounted() {
    this.raf = null;
    this.unwatchScrollTop = null;
    this.unwatchBreakpoint = null;
    this.addTitleEventListeners();
  },
  beforeDestroy() {
    this.cleanWatchersObservers();
    this.removeTitleEventListeners();
  },
  methods: {
    onBeforeInsertPostTags() {
      if (!this.post.isPromo) return;

      this.tagsHidden = true;
    },

    loadTwitterEmbed() {
      if (this.isTwitterWidgetLoaded) {
        window.twttr.widgets.load();
      }
    },
    isPostLiveDataExist(val) {
      if (!val) return true;

      if (val && this.hasCoins) {
        return true;
      }
      if (val && !this.coins?.length) {
        return false;
      }
      return false;
    },
    cleanWatchersObservers() {
      if (this.observer && typeof this.observer.disconnect === 'function') {
        this.observer.disconnect();
      }
      this.observer = null;
      if (this.raf && typeof window.cancelAnimationFrame === 'function') {
        window.cancelAnimationFrame(this.raf);
      }
      if (typeof this.unwatchScrollTop === 'function') {
        this.unwatchScrollTop();
      }
      this.unwatchScrollTop = null;
      if (typeof this.unwatchBreakpoint === 'function') {
        this.unwatchBreakpoint();
      }
      this.unwatchBreakpoint = null;
    },
    addTitleEventListeners() {
      const titleEl = this.$refs.title;
      if (!titleEl || !this.isMobile) {
        return;
      }
      const emitOptions = { withPopup: false, postUrl: this.post.absoluteUrl };
      const listenerOptions = { passive: true };
      titleEl.addEventListener('touchstart', () => this.$emit(COPY_EVENT_NAME), listenerOptions);
      titleEl.addEventListener('touchend', () => this.$emit(COPY_EVENT_NAME, emitOptions), listenerOptions);
      titleEl.addEventListener('mouseup', () => this.$emit(COPY_EVENT_NAME, emitOptions), listenerOptions);
    },
    removeTitleEventListeners() {
      const titleEl = this.$refs.title;
      if (!titleEl || !this.isMobile) {
        return;
      }
      const emitOptions = { withPopup: false, postUrl: this.post.absoluteUrl };
      const listenerOptions = { passive: true };
      titleEl.removeEventListener('touchstart', () => this.$emit(COPY_EVENT_NAME), listenerOptions);
      titleEl.removeEventListener('touchend', () => this.$emit(COPY_EVENT_NAME, emitOptions), listenerOptions);
      titleEl.removeEventListener('mouseup', () => this.$emit(COPY_EVENT_NAME, emitOptions), listenerOptions);
    },
    async getRelatedPosts() {
      const { isFirst, currentLanguage, post } = this;
      if (!isFirst) {
        const { data: posts = [], errors } = await fetchRelatedPosts({
          postId: post.id,
          excludeIds: this.excludedRelatedPostsIds,
          languageCode: currentLanguage.code,
          timeZone: currentLanguage.timezone,
          languageShort: currentLanguage.short,
          apolloTransport: this.$apolloTransport,
        });
        this.relatedPosts = !errors ? posts : [];
      }
      this.emitRelatedPostsExcludedIds();
    },
    emitRelatedPostsExcludedIds() {
      const { relatedPosts } = this;
      const excludedIds = relatedPosts.reduce(this.relatedPostsExcludedIdsReducer, []);
      const excludedRelatedIds = excludedIds.slice(0, 2);
      this.$emit('on-related-shown', { excludedRelatedIds });
    },
    relatedPostsExcludedIdsReducer(acc, { id }) {
      return acc.push(id) && acc;
    },
  },
};
</script>

<style scoped lang="scss">
@import '~/assets/styles/_vars.scss';

.post {
  color: #000;
}

.post__article {
  display: block;
}

.post__lead {
  font-size: 1rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.775;
  color: inherit;
  margin: 0;
}

.post__block_post-actions {
  margin-top: 16px;
}

.post__block_lead-text {
  margin-bottom: 16px;
}

.post__block_cover {
  margin: 0 0 24px;
}

.post__block_more_about {
  margin-top: 24px;
  margin-bottom: 16px;
}

.post__block_shares {
  display: none;
}

.post__block_disclaimer {
  margin-top: 16px;
  margin-bottom: 0;
}

.post__block_disclaimer-jp,
.post__block_b-show {
  margin-top: 16px;
  margin-bottom: 12px;
}

.post__block_tags {
  margin-top: 0;
  margin-bottom: 0;
}

.post__block_nft {
  margin: 0 0 16px;
  @media (min-width: $md) {
    margin: 0 0 24px;
  }
}

.post__title {
  font-size: 1.25rem;
  line-height: 1.375;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  color: inherit;
  margin: 8px 0 18px 0;
}

.post__separator-line {
  height: 1px;
  background-color: #eae9e9;
  margin-top: 12px;
  margin-bottom: 12px;
}

.post_rtl .post__title,
.post_rtl .post__lead {
  direction: rtl;
}

.post__socials-block {
  margin: 16px 0;
  @media (min-width: $md) {
    margin: 24px 0;
  }
}

@media (min-width: $md) {
  .post__title {
    font-size: 2.0625rem;
    letter-spacing: -0.6px;
    line-height: 1.375;
  }
  .post_asia .post__title {
    font-size: 1.75rem;
  }
  .post_asia .post__lead {
    font-size: 1.125rem;
  }
  .post__block_b-show {
    margin-left: 74px;
  }
  .post__block_shares {
    position: sticky;
    top: 20px;
    display: block;
  }
  .post__block_post-meta {
    margin-top: 2px;
  }
  .post_press-release .post__block_post-meta {
    margin-top: 10px;
  }
  .post__content-shares {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 1;
  }
  .post__block_popin-recommend,
  .post__separator-line,
  .post__block_content-subscription {
    margin-left: 74px;
  }
  .post__content-wrapper {
    position: relative;
  }
  .post_rtl .post__block_popin-recommend,
  .post_rtl .post__separator-line {
    margin-right: 74px;
    margin-left: 0;
  }
}

@media (min-width: $lg) {
  .post_asia .post__title {
    font-size: 2rem;
  }
  .post_asia .post__lead {
    font-size: 1.25rem;
  }
  .post__block_post-meta {
    margin-top: 2px;
  }
}

.adslot-after-article {
  margin: 12px 0;

  @media (min-width: $md) {
    margin-left: 74px;
  }
}
</style>
