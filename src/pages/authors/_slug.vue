<template>
  <div
    :class="isRtl && 'author-page_rtl'"
    class="author-page"
  >
    <div class="container">
      <div class="author-page__rows">
        <div class="author-page__author-col">
          <AuthorAbout
            v-if="author"
            class="author-page__author"
            :author="author"
            :i18n="i18n"
          />
          <PostsListing
            class="author-page__posts"
            theme="double-column"
            :pending="isPending"
            :has-more="hasMore"
            :posts="posts"
            :i18n="i18n"
            @load-more="handleLoadMore"
          />
        </div>
        <div
          v-if="!isMounted || !isMobileBreakpoint"
          class="author-page__sidebar-col"
        >
          <Sidebar />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import { ROOT, VIEWPORT } from '~/store/types';
import { fetchAuthorPageInitialState, fetchAuthorPagePosts } from '~/api/modules/author';
import getProperty from '~/assets/libs/getProperty';
import { getAuthorPageMeta } from '~/assets/helpers/meta';
import { pushVirtualPageView } from '~/assets/helpers/dataLayerEvents';
import { pathValidator } from '~/assets/helpers/utils';

export default {
  name: 'AuthorPage',
  components: {
    AuthorAbout: () => import('~/components/AuthorPage/AuthorAbout'),
    PostsListing: () => import('~/components/PostsListing/PostsListing'),
    Sidebar: () => import('~/components/Sidebar/Sidebar'),
  },
  validate: pathValidator,
  async asyncData({ store: { state }, params, route, error, app }) {
    const data = await fetchAuthorPageInitialState({
      slug: params.slug,
      languageDomain: state.currentLanguage.domain,
      languageCode: state.currentLanguage.code,
      timeZone: state.currentLanguage.timezone,
      pathname: route.path,
      languageShort: state.currentLanguage.short,
      apolloTransport: app.$apolloTransport,
    });
    const noPosts = Array.isArray(data.posts) && data.posts.length === 0;
    return !data.author || noPosts ? error({ statusCode: 404 }) : data;
  },
  data() {
    return {
      isPending: false,
      author: null,
      posts: [],
      alternates: [],
      postsOffset: 0,
      postsAmount: 0,
      meta: null,
      isMounted: false,
    };
  },
  computed: {
    ...mapState({
      currentLanguage: ({ currentLanguage }) => currentLanguage,
      languages: ({ languages }) => languages,
      i18n: ({ i18n }) => i18n,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
    ...mapGetters('viewport', {
      isMobileBreakpoint: VIEWPORT.IS_MOBILE_BREAKPOINT,
    }),
    hasMore() {
      return this.postsAmount > 0 && this.postsOffset < this.postsAmount;
    },
  },
  mounted() {
    this.isMounted = true;
    this.setAlternates({
      alternates: this.alternates,
      url: getProperty(this.meta, 'url', ''),
    });
    this.pushVirtualPageView();
    this.sendChartBeatPageView();
  },
  methods: {
    ...mapActions({
      setAlternates: ROOT.SET_ALTERNATES,
    }),
    async handleLoadMore() {
      this.isPending = true;
      const {
        data: { posts, postsCount },
      } = await fetchAuthorPagePosts({
        slug: this.$route.params.slug,
        offset: this.postsOffset,
        languageCode: this.currentLanguage.code,
        timeZone: this.currentLanguage.timezone,
        languageShort: this.currentLanguage.short,
        apolloTransport: this.$apolloTransport,
      });
      this.isPending = false;
      this.posts = this.posts.concat(posts);
      this.postsOffset += posts.length;
      if (postsCount > 0) {
        this.postsAmount = postsCount;
      }
    },
    pushVirtualPageView() {
      const { title, url } = this.meta || {};
      const { url: domain } = this.currentLanguage;
      return pushVirtualPageView({
        url: domain + url,
        title,
        category: '',
        tags: [],
      });
    },
    sendChartBeatPageView() {
      this.$chartBeat.sendPageView();
      this.$meta().refresh();
    },
  },
  head() {
    return getAuthorPageMeta({
      author: this.author,
      currentLanguage: this.currentLanguage,
      languages: this.languages,
      meta: this.meta,
      alternates: this.alternates,
      routeName: this.$route.name,
    });
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.author-page {
  margin-top: 20px;
  margin-bottom: 30px;
}
.author-page__rows {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  margin-left: -$gutter;
  margin-right: -$gutter;
}
.author-page__re-try {
  margin-bottom: 20px;
}
.author-page__author-col {
  width: 100%;
  padding-right: $gutter;
  padding-left: $gutter;
  box-sizing: border-box;
}
.author-page__sidebar-col {
  display: none;
}
.author-page__author {
  margin-bottom: 20px;
}
.author-page_rtl .author-page__rows {
  direction: rtl;
}

@media (min-width: $md) {
  .author-page__author-col {
    width: 66.66666667%;
  }
  .author-page__sidebar-col {
    display: block;
    width: 33.33333333%;
    padding-right: $gutter;
    padding-left: $gutter;
    box-sizing: border-box;
    z-index: 1;
  }
}
</style>
