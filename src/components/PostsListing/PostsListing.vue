<template>
  <div
    ref="postsListing"
    :class="[isRtl && 'posts-listing_rtl', theme]"
    class="group"
  >
    <ul
      class="grid gap-5 mb-5 group-[.inline]:block group-[.double-column]:grid-cols-1 sm:group-[.double-column]:grid-cols-2 group-[.main]:grid-cols-1 sm:group-[.main]:grid-cols-2 lg:group-[.main]:grid-cols-3"
    >
      <template v-for="(item, index) in posts">
        <li
          v-if="uniBlocksVisible && uniBlockIndex === index"
          :key="`uni-block-${index}`"
          class="group-[.inline]:mb-8 sm:col-span-2 lg:col-span-3"
        >
          <UniBlock
            theme="card"
            :type="UNI_BLOCK_TYPES.BETWEEN_POSTS"
          />
        </li>
        <li
          v-if="uniBlocksVisible && uniBlock2Index === index"
          :key="`uni-block-${index}`"
          class="group-[.inline]:mb-8 sm:col-span-2 lg:col-span-3"
        >
          <UniBlock
            :is-community-posts="true"
            theme="card"
            :type="UNI_BLOCK_TYPES.INNOVATION_CIRCLE_POSTS"
          />
        </li>
        <li
          v-if="stretchBannerPosition === index && stretchBannerAdSlotProps && isAdVisible"
          :key="`stretch-${index}`"
          class="group-[.inline]:mb-8 sm:col-span-2 lg:col-span-3"
        >
          <AdSlot
            v-bind="stretchBannerAdSlotProps"
            :config="{ closable: true }"
            @close="adVisible = false"
          />
        </li>
        <li
          v-if="mintWidgetPosition === index && isEn && isMainPage && adsEnabled"
          :key="`mint-widget-${index}`"
          class="group-[.inline]:mb-8 sm:col-span-2 lg:col-span-3"
        >
          <MintRecentlyCollectedWidget />
        </li>
        <li
          v-if="!item.type"
          :key="`${index}-${item.id}`"
          class="group-[.inline]:mb-8"
        >
          <PostCardInline
            v-if="theme === 'inline'"
            :i18n="i18n"
            :post-data="item"
            :theme="theme"
            :gtm-prefix="gtmPrefix"
            :gtm-suffix="gtmSuffix"
            :gtm-locator-type="gtmLocatorType === 'category' ? item.categorySlug : gtmLocatorType"
            @click.native="sendDataLayerEvent(item.id)"
          />
          <PostCard
            v-else
            :i18n="i18n"
            :post-data="item"
            data-testid="post-card"
            @click.native="sendDataLayerEvent(item.id)"
          />
        </li>

        <li
          v-else-if="item.isPromoButton"
          :key="`promo-button-${index}-${item.id}`"
          class="group-[.inline]:mb-8"
        >
          <AdSlot
            :place="item.graphqlBanner.bannerPlace"
            :config="{ closable: true }"
            class="posts-listing__promo-button"
          />
        </li>

        <li
          v-else-if="item.type && item.isMagazinePost"
          :key="`banner-${index}-${item.id}`"
          class="group-[.inline]:mb-8"
        >
          <!-- banner magazine placeholder -->
          <!-- TODO: remove after refactoring this component -->
          <span />
        </li>
        <li
          v-else-if="item.type && !item.isStretch"
          :key="`banner-${index}-${item.id}`"
          class="group-[.inline]:mb-8"
        >
          <Banner
            :banner-options="item"
            :class="$style.banner"
            :i18n="i18n"
            closable
            @close="$emit('close-ad', item, index)"
          />
        </li>
        <li
          v-if="hasBottomZoneSlot && defaultPostsLength === index"
          :key="index"
          class="group-[.inline]:mb-8"
        >
          <slot name="bottomZone" />
        </li>
      </template>
    </ul>
    <div
      v-if="showNavigation"
      class="posts-listing__navigation"
    >
      <div class="posts-listing__more-wrp">
        <button
          v-if="hasMore && i18n.postsLoadMore"
          :class="pending && 'btn_pending'"
          :disabled="disabled"
          class="btn posts-listing__more-btn"
          @click="handleLoadMoreClick"
        >
          <span class="btn__wrp">
            <span
              v-if="!pending"
              class="btn__icon posts-listing__more-icon"
            />
            <span
              v-else
              class="btn__spinner"
            />
            <span
              v-if="!pending"
              class="btn__cap"
            >
              {{ i18n.postsLoadMore }}
            </span>
            <span
              v-else
              class="btn__cap"
            >
              {{ i18n.postsLoading }}
            </span>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ROOT } from '~/store/types';
import {
  MAIN_PAGE_POSTS_STRETCH_POSITION,
  MAIN_PAGE_POSTS_STRETCH_POSITION_MOBILE,
  MAIN_PAGE_RECENTLY_COLLECTED_WIDGET_POSITION,
  MAIN_PAGE_RECENTLY_COLLECTED_WIDGET_POSITION_MOBILE,
  UNI_BLOCK_BETWEEN_POSTS_POSITION,
  UNI_BLOCK_BETWEEN_POSTS_POSITION_MOBILE,
  UNI_BLOCK_INNOVATION_CIRCLE_POSITION,
  UNI_BLOCK_TYPES,
} from '~/app.config';
import { useAutoLoadMore } from '~/components/useAutoLoadMore';
import { AdSlot } from '~/features/ads';
import { mainPageLinksEvent } from '~/assets/helpers/dataLayerEvents';
import { MintRecentlyCollectedWidget } from '~/features/mint-collectors/';
import { useDeviceInfo } from '~/lib/device-detector';

export default {
  name: 'PostsListing',
  components: {
    MintRecentlyCollectedWidget,
    AdSlot,
    PostCard: () => import('./PostCard'),
    PostCardInline: () => import('~/components/PostsListing/PostCardInline.vue'),
    Banner: () => import('~/components/Banners/Banner'),
    UniBlock: () => import('~/components/Shared/UniBlock'),
  },
  props: {
    theme: {
      type: String,
      default: '',
      validator(value) {
        return ['main', 'double-column', 'inline', 'without-image'].includes(value);
      },
    },
    pending: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
    },
    hasMore: {
      type: Boolean,
      default: true,
    },
    showNavigation: {
      type: Boolean,
      default: true,
    },
    posts: {
      type: Array,
      default: () => [],
    },
    defaultPostsLength: {
      type: Number,
      default: 30,
    },
    i18n: {
      type: Object,
      default: () => ({}),
    },
    scrollAutoLoad: {
      type: Boolean,
      default: true,
    },
    gtmPrefix: {
      type: String,
      default: () => null,
    },
    gtmSuffix: {
      type: String,
      default: () => null,
    },
    gtmLocatorType: {
      type: String,
      default: () => null,
    },
    uniBlocksVisible: {
      type: Boolean,
      default: () => false,
    },
    adsEnabled: {
      type: Boolean,
      default: () => true,
    },
  },
  setup() {
    return {
      deviceInfo: useDeviceInfo(),
    };
  },
  data() {
    return {
      adVisible: true,
      squareBannerVisible: true,
      UNI_BLOCK_TYPES,
    };
  },
  computed: {
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
      isEn: ROOT.IS_EN,
    }),
    placeholderList() {
      return Array(this.defaultPostsLength).fill(0);
    },
    isMainPage() {
      return this.$route.name === 'index';
    },
    mintWidgetPosition() {
      if (this.deviceInfo.mobile) {
        return MAIN_PAGE_RECENTLY_COLLECTED_WIDGET_POSITION_MOBILE;
      }
      return MAIN_PAGE_RECENTLY_COLLECTED_WIDGET_POSITION;
    },
    stretchBannerPosition() {
      if (this.deviceInfo.mobile) {
        return MAIN_PAGE_POSTS_STRETCH_POSITION_MOBILE;
      }
      return MAIN_PAGE_POSTS_STRETCH_POSITION;
    },

    /**
     * As of banners for main page retrieved during "asyncData"
     * and mixed with posts and stretch placement uses
     * same place "index" as another banners,
     * there is no way to determine AdSlot "index" of "index" placement
     *
     * Should create separate stretch placement and migrate all stretches
     *
     * @returns <AdSlot /> props for stretch placement
     */
    stretchBannerAdSlotProps() {
      const thisBanner = this.posts.find((item) => item.isStretch);
      const storeBanners = this.$store.state.banners;

      if (thisBanner) {
        for (const place in storeBanners) {
          const storeBannersForPlace = storeBanners[place];
          for (let index = 0; index < storeBannersForPlace.length; index += 1) {
            const banner = storeBannersForPlace[index];

            if (thisBanner.id === banner.id)
              return {
                index,
                place,
              };
          }
        }
      }

      return null;
    },

    uniBlockIndex() {
      if (this.$route.name !== 'index') {
        return -1;
      }
      if (!this.stretchBannerOptions) {
        if (this.deviceInfo.mobile) {
          return MAIN_PAGE_POSTS_STRETCH_POSITION_MOBILE;
        } else {
          return MAIN_PAGE_POSTS_STRETCH_POSITION;
        }
      }
      return this.deviceInfo.mobile && this.isEn
        ? UNI_BLOCK_BETWEEN_POSTS_POSITION_MOBILE
        : UNI_BLOCK_BETWEEN_POSTS_POSITION;
    },

    uniBlock2Index() {
      if (this.$route.name !== 'index') {
        return -1;
      }
      return UNI_BLOCK_INNOVATION_CIRCLE_POSITION;
    },
    hasBottomZoneSlot() {
      return Boolean(this.$slots.bottomZone);
    },
    isAdVisible() {
      return this.adsEnabled && this.adVisible;
    },
  },

  mounted() {
    if (this.scrollAutoLoad) {
      useAutoLoadMore({
        target: this.$refs.postsListing,
        callback: this.handleLoadMoreClick,
      });
    }
  },

  methods: {
    handleLoadMoreClick() {
      if (this.pending || !this.hasMore) {
        return;
      }
      this.$emit('load-more');
    },
    getItemIndex(id) {
      const postsWithoutBanners = this.posts.filter((post) => !post.adbutlerDataUrl);
      return postsWithoutBanners.findIndex((item) => item.id === id);
    },
    sendDataLayerEvent(id) {
      const index = this.getItemIndex(id);
      const text = index >= 12 ? 'main_other' : `main_${index + 1}`;
      if (this.isEn) {
        mainPageLinksEvent(text);
      }
    },
  },
};
</script>

<style module lang="scss">
.banner {
  display: flex;
  flex-direction: column;
  background-color: #f6f7f8;
  box-shadow: 0 1px 20px 0 rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
}
</style>

<style scoped lang="scss">
@use '~/assets/styles/_icons-common.scss' as icons;
@import '~/assets/styles/_vars.scss';

.posts-listing__promo-button {
  width: 100%;
}

.posts-listing__navigation {
  position: relative;
  font-size: 0.875rem;
  white-space: nowrap;
  color: #000000;
}

.posts-listing__more-icon {
  width: 12px;
  height: 12px;
  margin-right: 8px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.posts-listing__more-icon {
  @include icons.arrow-clockwise;
}

.posts-listing__more-wrp {
  position: relative;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.posts-listing__more-btn {
  display: block;
}

.posts-listing__more-btn:hover {
  text-decoration: underline;
}

.posts-listing_rtl {
  direction: rtl;
}

.posts-listing_rtl .posts-listing__more-icon {
  margin-left: 8px;
  margin-right: 0;
}
</style>
