<template>
  <div
    ref="postsListing"
    class="posts-listing"
    :class="[isRtl && 'posts-listing_rtl', `posts-listing_${theme}`]"
  >
    <ul class="posts-listing__list">
      <template v-for="(item, index) in mappedPosts">
        <li
          v-if="uniBlockIndex === index"
          :key="`uni-block-${index}`"
          class="posts-listing__item posts-listing__item_triple"
        >
          <UniBlock
            theme="card"
            :type="UNI_BLOCK_TYPES.INNOVATION_CIRCLE_POSTS"
          />
        </li>
        <li
          v-if="stretchBannerOptions && stretchBannerIndex === index"
          :key="`stretch-${index}`"
          class="posts-listing__item posts-listing__item_triple"
        >
          <div>Stretch placeholder</div>
        </li>
        <li
          v-if="!item.type"
          :key="`${index}-${item.id}`"
          class="posts-listing__item"
        >
          <PostCardInline
            v-if="['inline', 'without-image'].includes(theme)"
            :theme="theme"
            :post-data="item"
            :i18n="i18n"
          />
          <PostCard
            v-else
            :post-data="item"
            :i18n="i18n"
          />
        </li>

        <li
          v-else-if="item.isPromoButton"
          :key="`promo-button-${index}-${item.id}`"
          class="posts-listing__item"
        >
          <AdSlot
            class="posts-listing__promo-button"
            :place="item.graphqlBanner.bannerPlace"
          />
        </li>

        <li
          v-else-if="item.type && item.isMagazinePost"
          :key="`banner-${index}-${item.id}`"
          class="posts-listing__item"
        >
          <!-- banner magazine placeholder -->
          <!-- TODO: remove after refactoring this component -->
        </li>
        <ClientOnly
          v-else-if="item.type && !item.isStretch"
          :key="`banner-${index}-${item.id}`"
        >
          <li class="posts-listing__item">
            <Banner
              :class="$style.banner"
              :banner-options="item"
              :i18n="i18n"
            />
          </li>
        </ClientOnly>
        <li
          v-if="hasBottomZoneSlot && defaultPostsLength === index"
          :key="index"
          class="posts-listing__item posts-listing__item_triple"
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
          class="btn posts-listing__more-btn"
          :class="pending && 'btn_pending'"
          :disabled="disabled"
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
import { MAIN_PAGE_POSTS_STRETCH_POSITION, UNI_BLOCK_BETWEEN_POSTS_POSITION, UNI_BLOCK_TYPES } from '~/app.config';
import { useAutoLoadMore } from '~/components/useAutoLoadMore';
import { AdSlot } from '~/features/ads';

export default {
  name: 'InnovationCirclePostsListing',
  components: {
    AdSlot,
    PostCard: () => import('./PostCard'),
    PostCardInline: () => import('~/components/InnovationCirclePostsListing/PostCardInline'),
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
  },
  data: () => ({
    UNI_BLOCK_TYPES,
  }),
  computed: {
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
    placeholderList() {
      return Array(this.defaultPostsLength).fill(0);
    },
    stretchBannerOptions() {
      const banner = this.posts.find((item) => item.isStretch);
      if (!banner) {
        return null;
      }
      const isYoutube = banner.stretchType === 'youtube';
      const isSponsored = banner.stretchType === 'sponsored';
      const isArticle = banner.stretchType === 'article';
      const isPromo = banner.stretchType === 'promo';
      const shouldHavePostData = isSponsored || isArticle;
      const hasPostData = !!banner.postData;
      return banner && (isYoutube || isPromo || (shouldHavePostData && hasPostData)) ? banner : null;
    },
    stretchBannerIndex() {
      return MAIN_PAGE_POSTS_STRETCH_POSITION;
    },
    uniBlockIndex() {
      if (!this.stretchBannerOptions) {
        return MAIN_PAGE_POSTS_STRETCH_POSITION;
      }
      return UNI_BLOCK_BETWEEN_POSTS_POSITION;
    },
    hasBottomZoneSlot() {
      return Boolean(this.$slots.bottomZone);
    },
    mappedPosts() {
      return this.posts.map((p) => ({
        ...p,
        badgeName: 'Innovation Circle',
        badgeSlug: 'default',
      }));
    },
  },

  mounted() {
    useAutoLoadMore({
      target: this.$refs.postsListing,
      callback: this.handleLoadMoreClick,
    });
  },

  methods: {
    handleLoadMoreClick() {
      if (this.pending || !this.hasMore) {
        return;
      }
      this.$emit('load-more');
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

.posts-listing__list {
  margin: 0 -1 * $gutter;
  padding: 0;
  list-style: none;

  @media (min-width: $sm) {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
  }
}
.posts-listing__item {
  position: relative;
  width: 100%;
  margin-bottom: 20px;
  margin-left: auto;
  margin-right: auto;
  padding-left: $gutter;
  padding-right: $gutter;
  box-sizing: border-box;

  @media (min-width: $xxs) {
    max-width: 480px;
  }
  @media (min-width: $sm) {
    display: flex;
    flex-direction: column;
    width: 50%;
    max-width: none;
    margin-left: 0;
    margin-right: 0;
  }
  @media (min-width: $md) {
    width: 33.33333333%;
  }
}
.posts-listing__promo-button {
  width: 100%;
}
.posts-listing__item_triple {
  @media (min-width: $sm) {
    width: 100%;
  }
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
.posts-listing_double-column .posts-listing__item {
  @media (min-width: $md) {
    width: 50%;
  }
}
.posts-listing_without-image .posts-listing__list,
.posts-listing_without-image .posts-listing__item,
.posts-listing_inline .posts-listing__list,
.posts-listing_inline .posts-listing__item {
  display: block;
}
.posts-listing_without-image .posts-listing__item,
.posts-listing_inline .posts-listing__item {
  width: 100%;
  margin-bottom: 32px;
}
.posts-listing_rtl {
  direction: rtl;
}
.posts-listing_rtl .posts-listing__more-icon {
  margin-left: 8px;
  margin-right: 0;
}
</style>
