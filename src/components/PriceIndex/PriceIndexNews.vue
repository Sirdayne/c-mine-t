<template>
  <div class="bb-price-index__posts-by-tag">
    <h2 class="bb-price-index__posts-by-tag-title">
      {{ localI18n.postsByTagBlockTitle }}
    </h2>
    <PostsListing
      :key="postData.key"
      theme="inline"
      :pending="postData.isPending"
      :has-more="hasMore"
      :posts="postData.posts"
      :i18n="i18n"
      :scroll-auto-load="false"
      :gtm-prefix="`markets_priceindex_${coinSlug.toLowerCase()}_news`"
      gtm-suffix="clickon_author"
      gtm-locator-type="author"
      @load-more="handleLoadMore(postData)"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { fetchPriceIndexPosts } from '~/api/modules/priceIndex';
import { PRICE_INDEX_PAGE_POSTS_LENGTH } from '~/app.config';
import PostsListing from '~/components/PostsListing/PostsListing';

export default {
  name: 'PriceIndexNews',
  components: {
    PostsListing,
  },
  props: {
    localI18n: {
      type: Object,
      default: () => ({}),
    },
    postData: {
      type: Object,
      default: () => ({}),
    },
    coinSlug: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      currentLanguage: ({ currentLanguage }) => currentLanguage,
      i18n: ({ i18n }) => i18n,
    }),
    hasMore() {
      return this.postData && this.postData.postsAmount > 0 && this.postData.postsOffset < this.postData.postsAmount;
    },
  },
  methods: {
    async handleLoadMore(postData) {
      postData.isPending = true;
      const {
        data: { posts, postsCount },
      } = await fetchPriceIndexPosts({
        slug: this.coinSlug,
        order: postData.order,
        offset: postData.postsOffset,
        length: PRICE_INDEX_PAGE_POSTS_LENGTH,
        languageDomain: this.currentLanguage.domain,
        languageCode: this.currentLanguage.code,
        timeZone: this.currentLanguage.timezone,
        languageShort: this.currentLanguage.short,
        apolloTransport: this.$apolloTransport,
      });
      postData.isPending = false;
      postData.posts = postData.posts.concat(posts);
      postData.postsOffset += posts.length;
      if (postsCount > 0) {
        postData.postsAmount = postsCount;
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import '~/assets/styles/_vars.scss';

.bb-price-index__posts-by-tag-title {
  margin: 0 0 16px;
  color: #253137;
  font-size: 15px;
  font-weight: 700;
  @media (min-width: $sm) {
    font-size: 22px;
  }
}
.bb-price-index__tabs-wrp {
  display: flex;
  flex-direction: column-reverse;
  width: 100%;
  margin-bottom: 24px;
}
.bb-price-index__tabs {
  display: flex;
  width: 100%;
  height: 40px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.bb-price-index__tab {
  flex: none;
  padding: 0;
}
.bb-price-index__tab-btn {
  display: block;
  width: 100%;
  min-width: 100px;
  height: 40px;
  font-size: 0.875rem;
  color: #555555;
  border-bottom: 1px solid transparent;
  transition: border-color 0.15s;
}
.bb-price-index__tab-btn:hover,
.bb-price-index__tab-btn_selected,
.bb-price-index__tab-btn.bb-price-index__tab-btn_selected:hover {
  border-color: #ffcd04;
  cursor: default;
}
.bb-price-index__tab-btn:hover {
  cursor: pointer;
}
.bb-price-index__promo-button {
  width: 100%;
  margin-bottom: 10px;
}

@media (min-width: $sm) {
  .bb-price-index__tabs-wrp {
    flex-direction: row;
  }
  .bb-price-index__tabs {
    width: auto;
  }
  .bb-price-index__tab {
    width: auto;
    margin-right: 8px;
  }
  .bb-price-index__tab-btn {
    width: auto;
    padding-left: 6px;
    padding-right: 6px;
  }
}
</style>
