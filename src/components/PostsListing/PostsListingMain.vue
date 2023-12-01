<script lang="ts" setup>
import PostsListing from './PostsListing.vue';
import { useStore } from '~/lib/framework';
import { computed, ref, toRef } from 'vue';
import { useQuery } from '~/graphql';
import mainPagePostsQuery from '~/graphql/queries/mainPagePosts.graphql';
import { useDeviceInfo } from '~/lib/device-detector';
import filterNoneObjects from '~/assets/libs/filterNoneObjects';
import { getMappedPostPreview } from '~/assets/helpers/posts';
import getProperty from '~/assets/libs/getProperty';
import {
  BANNER_PLACES,
  MAIN_PAGE_POSTS_LENGTH,
  MAIN_PAGE_POSTS_LENGTH_MOBILE,
  MAIN_PAGE_POSTS_POSITIONS_DESKTOP,
  MAIN_PAGE_POSTS_POSITIONS_MOBILE,
} from '~/app.config';
import { getRandomElement, mergeToByPosition, swapPromoButtonWithSquareBannerPosition } from './utils';

interface ExcludedBanner {
  index: number;
  id: string;
}

const props = defineProps<{
  postsOffset: number;
  adsEnabled: boolean;
  afterLoadMoreBannerVisible: boolean;
  hasMoreActive: boolean;
  index: number;
}>();
const emit = defineEmits<{
  (event: 'load-more', offset: number): void;
}>();

const excludedBanners = ref<ExcludedBanner[]>([]);
const onCloseAd = (banner: any, index: number) => {
  /**
   * https://jira.cointelegraph.com/browse/CDT-3111
   * Load one more post after hide banner
   * Swap banner with posts to make default grid behaviour (square banner in the middle)
   * */
  excludedBanners.value.push({
    index,
    id: banner.id,
  });
};
const deviceInfo = useDeviceInfo();
const store = useStore();
const i18n = computed(() => store.state.i18n);
const short = computed(() => store.state.currentLanguage.short);
const bannerAfterLoadMore = computed(() => store.state.banners[BANNER_PLACES.MAIN_POSTS_NON_STRETCH_MOBILE]?.[4]);

const offset = toRef(props, 'postsOffset');

const banners = computed(() => store.state.banners);
const selectedBanners = computed<any[]>(() => {
  const selectedBanners: any[] = deviceInfo.mobile
    ? getProperty(banners.value, BANNER_PLACES.MAIN_POSTS_NON_STRETCH_MOBILE, [])
    : getProperty(banners.value, BANNER_PLACES.MAIN_POSTS_DESKTOP, []);
  return selectedBanners.filter(({ id }) => !excludedBanners.value.some((item) => item.id === id));
});

const bannersOptions = computed(() => {
  const banners = [...selectedBanners.value].filter((item) => !item.isStretch).sort((a, b) => a.priority - b.priority);
  const promoButton: any | null = getRandomElement(
    getProperty(banners, BANNER_PLACES.PROMO_BUTTON_STACK_INDEX_MOBILE, [])
  );
  if (promoButton && deviceInfo.mobile) {
    banners.push(promoButton);
  }
  return banners;
});

const length = computed(() => {
  const initialLength = deviceInfo.mobile ? MAIN_PAGE_POSTS_LENGTH_MOBILE : MAIN_PAGE_POSTS_LENGTH;
  if (props.adsEnabled) {
    return initialLength - bannersOptions.value.length;
  }
  return initialLength;
});

const postsQuery = useQuery({
  query: mainPagePostsQuery,
  variables: {
    short,
    offset,
    length,
  },
});

const currentLanguage = computed(() => store.state.currentLanguage);

const postsQueryResponse = computed(
  () =>
    postsQuery.data.value?.locale ?? {
      postsCount: 0,
      hasMorePosts: false,
      posts: {
        data: [],
      },
    }
);

const bannerPositions = computed(() => {
  const positions = deviceInfo.mobile ? MAIN_PAGE_POSTS_POSITIONS_MOBILE : MAIN_PAGE_POSTS_POSITIONS_DESKTOP;
  return positions.filter((position) => !excludedBanners.value.some(({ index }) => position === index));
});

const stretchBanner = computed(() => {
  const stretchedBanners = selectedBanners.value.filter((item) => item.isStretch);
  return getRandomElement(stretchedBanners);
});

const hasMorePosts = computed(() => postsQueryResponse.value.posts.hasMorePosts);

const postsBanners = computed<any[]>(() => {
  const postsRaw = postsQueryResponse.value.posts.data;
  const mappedPosts = filterNoneObjects(postsRaw).map((item) =>
    getMappedPostPreview(item, {
      languageDomain: currentLanguage.value.languageDomain,
      languageCode: currentLanguage.value.code,
      timeZone: currentLanguage.value.timezone,
      languageShort: currentLanguage.value.short,
    })
  );
  if (props.adsEnabled) {
    const postsWithBanners = mergeToByPosition(mappedPosts, bannersOptions.value, bannerPositions.value);
    if (stretchBanner.value) {
      postsWithBanners.push(stretchBanner.value);
    }
    return deviceInfo.mobile ? swapPromoButtonWithSquareBannerPosition(postsWithBanners) : postsWithBanners;
  }

  if (props.afterLoadMoreBannerVisible && bannerAfterLoadMore.value) {
    mappedPosts.push(bannerAfterLoadMore.value);
  }
  return mappedPosts;
});

const handleLoadMore = () => {
  emit('load-more', offset.value + length.value);
};
</script>

<template>
  <PostsListing
    :has-more="hasMoreActive && hasMorePosts"
    :i18n="i18n"
    :pending="postsQuery.fetching.value"
    :posts="postsBanners"
    :ads-enabled="adsEnabled"
    :uni-blocks-visible="adsEnabled"
    theme="main"
    @load-more="handleLoadMore"
    @close-ad="onCloseAd"
  />
</template>
