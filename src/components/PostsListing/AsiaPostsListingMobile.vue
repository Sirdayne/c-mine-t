<template>
  <div
    ref="postsListing"
    class="asia-posts-listing-mobile"
  >
    <ul class="asia-posts-listing-mobile__list">
      <template v-for="(post, index) in postsBanners">
        <li
          :key="`post-${index}`"
          :class="[
            !post.type && 'asia-posts-listing-mobile__item_post',
            isBig(index) && 'asia-posts-listing-mobile__item_post-big',
            post.type && !post.isStretch && 'asia-posts-listing-mobile__item_b',
          ]"
          class="asia-posts-listing-mobile__item"
        >
          <AsiaPostCardMobile
            v-if="!post.type"
            :is-big="isBig(index)"
            :post="post"
            class="asia-posts-listing-mobile__post"
          />
          <div v-else-if="post.type && !post.isStretch">
            <ClientOnly>
              <Banner
                :banner-options="post"
                :i18n="i18n"
                class="asia-posts-listing-mobile__b"
                closable
                @close="onCloseAd(post, index)"
              />
            </ClientOnly>
          </div>
        </li>
        <li
          v-if="index === 7"
          :key="`press-releases-${index}`"
          class="asia-posts-listing-mobile__item asia-posts-listing-mobile__item_press-releases"
        >
          <!-- eslint-disable-next-line vue/html-self-closing -->
          <slot name="pressReleases"></slot>
        </li>
      </template>
    </ul>
    <div
      v-if="!pending && hasMoreActive"
      class="asia-posts-listing-mobile__load-more-wrap"
    >
      <button
        class="asia-posts-listing-mobile__load-more-btn"
        type="button"
        @click.prevent="handleLoadMoreClick"
      >
        <!-- eslint-disable-next-line vue/html-self-closing -->
        <span class="asia-posts-listing-mobile__load-more-icon"></span>
        {{ pending ? i18n.postsLoading : i18n.postsLoadMore }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Banner from '~/components/Banners/Banner';
import AsiaPostCardMobile from './AsiaPostCardMobile';
import { useAutoLoadMore } from '~/components/useAutoLoadMore';
import { useQuery } from '~/graphql';
import mainPagePostsQuery from '~/graphql/queries/mainPagePosts.graphql';
import { computed, onMounted, ref, toRef } from 'vue';
import { useStore } from '~/lib/framework';
import {
  ASIA_BIG_POST_INDEX,
  BANNER_PLACES,
  MAIN_PAGE_POSTS_LENGTH_MOBILE,
  MAIN_PAGE_POSTS_POSITIONS_MOBILE,
  MAIN_PAGE_POSTS_POSITIONS_MOBILE_JP,
} from '~/app.config';
import filterNoneObjects from '~/assets/libs/filterNoneObjects';
import { getMappedPostPreview } from '~/assets/helpers/posts';
import getProperty from '~/assets/libs/getProperty';
import { getRandomElement, mergeToByPosition, swapPromoButtonWithSquareBannerPosition } from './utils';
import { ROOT } from '~/store/types';

interface ExcludedBanner {
  index: number;
  id: string;
}

const props = defineProps<{
  offset: number;
  adsVisible: boolean;
  afterLoadMoreBannerVisible: boolean;
  hasMoreActive: boolean;
}>();

const emit = defineEmits<{
  (e: 'load-more', offset: number): void;
}>();

const postsListing = ref<HTMLElement | null>(null);

const store = useStore();
const currentLanguage = computed(() => store.state.currentLanguage);
const short = computed(() => store.state.currentLanguage.short);
const i18n = computed<Record<string, string>>(() => store.state.i18n);
const banners = computed(() => store.state.banners);
const isJp = computed(() => store.getters[ROOT.IS_JP]);
const offset = toRef(props, 'offset');

const excludedBanners = ref<ExcludedBanner[]>([]);
const length = computed(() => {
  return MAIN_PAGE_POSTS_LENGTH_MOBILE + excludedBanners.value.length;
});

const postsQuery = useQuery({
  query: mainPagePostsQuery,
  variables: {
    short,
    offset,
    length,
  },
});

const postsQueryResponse = computed(
  () =>
    postsQuery.data.value?.locale?.posts ?? {
      data: [],
      postsCount: 0,
      hasMorePosts: false,
    }
);
const hasMorePosts = computed(() => postsQueryResponse.value.hasMorePosts);

const pending = computed(() => postsQuery.fetching.value);
const selectedBanners = computed(() => banners.value?.[BANNER_PLACES.MAIN_POSTS_NON_STRETCH_MOBILE] || []);
const bannersOptions = computed(() => {
  const banners = [...selectedBanners.value].filter((item) => !item.isStretch).sort((a, b) => a.priority - b.priority);
  const promoButton = getRandomElement(getProperty(banners, BANNER_PLACES.PROMO_BUTTON_STACK_INDEX_MOBILE, []));
  if (promoButton) {
    banners.push(promoButton);
  }
  return banners;
});

const stretchBanner = computed(() => getRandomElement(selectedBanners.value.filter((item: any) => item.isStretch)));
const bannerAfterLoadMore = computed(() => store.state.banners[BANNER_PLACES.MAIN_POSTS_NON_STRETCH_MOBILE]?.[4]);

const postsBanners = computed<any[]>(() => {
  const postsRaw = postsQueryResponse.value.data;
  const mappedPosts = filterNoneObjects(postsRaw).map((item) =>
    getMappedPostPreview(item, {
      languageDomain: currentLanguage.value.languageDomain,
      languageCode: currentLanguage.value.code,
      timeZone: currentLanguage.value.timezone,
      languageShort: currentLanguage.value.short,
    })
  );
  if (props.adsVisible) {
    const positions = isJp.value ? MAIN_PAGE_POSTS_POSITIONS_MOBILE_JP : MAIN_PAGE_POSTS_POSITIONS_MOBILE;
    const postsWithBanners: any = mergeToByPosition(mappedPosts, bannersOptions.value, positions);
    if (stretchBanner.value) {
      postsWithBanners.push(stretchBanner.value);
    }
    return swapPromoButtonWithSquareBannerPosition(postsWithBanners);
  }
  if (props.afterLoadMoreBannerVisible && bannerAfterLoadMore.value) {
    mappedPosts.push(bannerAfterLoadMore.value);
  }
  return mappedPosts;
});

const onCloseAd = (banner: any, index: number) => {
  excludedBanners.value.push({
    index,
    id: banner.id,
  });
};

const lastBannerIndex = computed<number>(() => {
  const reducer = (acc: any, { type = undefined }, i: any) => (type && i) || acc;
  return postsBanners.value.reduce(reducer, -1);
});

const isBig = (index: number): boolean => {
  if (props.adsVisible) {
    return index === ASIA_BIG_POST_INDEX;
  }
  const indexMinusLast = index - lastBannerIndex.value;
  const indexMinusLastOfDivision = indexMinusLast % ASIA_BIG_POST_INDEX;
  return index > lastBannerIndex.value && indexMinusLastOfDivision === 0;
};

const handleLoadMoreClick = () => {
  if (pending.value || !hasMorePosts.value) {
    return;
  }
  emit('load-more', props.offset + length.value);
};

onMounted(() => {
  useAutoLoadMore({
    target: postsListing.value,
    callback: () => handleLoadMoreClick(),
  });
});
</script>

<style lang="scss">
@use '~/assets/styles/_icons-common.scss' as icons;

.asia-posts-listing-mobile {
  padding-left: 16px;
  padding-right: 16px;
  box-sizing: border-box;
}

.asia-posts-listing-mobile__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.asia-posts-listing-mobile__item {
  position: relative;
}

.asia-posts-listing-mobile__item_post {
  border-top: 1px solid #d8d8d8;
}

.asia-posts-listing-mobile__item_post:first-child {
  border-top: none;
}

.asia-posts-listing-mobile__item_post-big,
.asia-posts-listing-mobile__item_b + .asia-posts-listing-mobile__item_post,
.asia-posts-listing-mobile__item_post-big + .asia-posts-listing-mobile__item_post,
.asia-posts-listing-mobile__item_press-releases + .asia-posts-listing-mobile__item_post {
  border: none;
}

.asia-posts-listing-mobile__load-more-wrap,
.asia-posts-listing-mobile__item_post-big {
  margin-left: -16px;
  margin-right: -16px;
}

.asia-posts-listing-mobile__item_b,
.asia-posts-listing-mobile__item_post-big {
  padding-top: 8px;
  padding-bottom: 8px;
}

.asia-posts-listing-mobile__load-more-wrap::before,
.asia-posts-listing-mobile__item_b::before,
.asia-posts-listing-mobile__item_b::after,
.asia-posts-listing-mobile__item_post-big::before,
.asia-posts-listing-mobile__item_post-big::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 8px;
  background: #fafafa;
}

.asia-posts-listing-mobile__load-more-wrap::before,
.asia-posts-listing-mobile__item_b::before,
.asia-posts-listing-mobile__item_post-big::before {
  top: 0;
}

.asia-posts-listing-mobile__item_b::after,
.asia-posts-listing-mobile__item_post-big::after {
  bottom: 0;
}

.asia-posts-listing-mobile__load-more-wrap {
  padding: 18px 0 10px;
  text-align: center;
  position: relative;
}

.asia-posts-listing-mobile__load-more-btn {
  font-size: 14px;
  background: #dddddd;
  color: #333333;
  margin: 0;
  padding: 0;
}

.asia-posts-listing-mobile__load-more-icon {
  @include icons.arrow-clockwise;
  display: inline-block;
  width: 12px;
  height: 12px;
}
</style>
