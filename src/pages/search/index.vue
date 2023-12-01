<template>
  <div class="container">
    <div :class="['search-page', isRtl && 'search-page__rtl']">
      <SearchBox
        :query="query"
        class="search-page__search-box"
      />
      <div
        ref="searchPageResults"
        class="search-page__results"
      >
        <div
          v-if="posts.length"
          class="search-page__posts-list"
        >
          <SearchPostCard
            v-for="post in posts"
            :key="post.id"
            :post="post"
            class="search-page__post-item"
            data-testid="search-article"
          />
        </div>
        <div v-else-if="noResults">
          <h2>
            <span data-testid="search-message">{{ i18n.searchNothingFound }} {{ query }}</span>
          </h2>
        </div>
        <div v-else-if="loading">
          <h2>
            <span>{{ i18n.searching }}{{ query }}</span>
          </h2>
        </div>
      </div>
      <SearchNavPanel
        v-if="posts.length"
        :loading="loading"
        :has-more="hasMore"
        class="search-page__nav-panel"
        @load-more="loadResults"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { ROOT } from '~/store/types';
import getProperty from '~/assets/libs/getProperty';
import { getSearchPageMeta } from '~/assets/helpers/meta';
import { fetchSearchPagePosts, fetchSearchPageInitialState } from '~/api/modules/search';
import { useAutoLoadMore } from '~/components/useAutoLoadMore';

export default {
  name: 'SearchPage',
  components: {
    SearchBox: () => import('~/components/Search/SearchBox'),
    SearchPostCard: () => import('~/components/Search/SearchPostCard'),
    SearchNavPanel: () => import('~/components/Search/SearchNavPanel'),
  },
  async asyncData({ store: { state }, route, app }) {
    const initialPageState = await fetchSearchPageInitialState({
      languages: state.languages,
      pathName: route.path,
      languageShort: state.currentLanguage.short,
      apolloTransport: app.$apolloTransport,
    });
    return {
      ...initialPageState,
    };
  },
  data: () => ({
    posts: [],
    query: '',
    loading: false,
    noResults: false,
    offset: 0,
    length: 25,
    hasMore: true,
  }),
  computed: {
    ...mapState({
      currentLanguage: ({ currentLanguage }) => currentLanguage,
      i18n: ({ i18n }) => i18n,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
  },
  watch: {
    '$route.query.query': {
      immediate: true,
      handler(query) {
        this.posts = [];
        this.query = decodeURI(query);
        this.offset = 0;
        this.length = 25;
        this.noResults = false;

        this.loadResults();

        const path = getProperty(this.meta, 'url', '');
        const url = path ? `${path}?query=${this.query}` : '/';

        this.setAlternates({
          url,
          alternates: this.alternates,
        });
      },
    },
  },

  mounted() {
    this.sendChartBeatPageView();

    useAutoLoadMore({
      target: this.$refs.searchPageResults,
      callback: () => {
        if (this.hasMore && !this.loading) {
          this.loadResults();
        }
      },
    });
  },

  methods: {
    ...mapActions({
      setAlternates: ROOT.SET_ALTERNATES,
    }),
    sendChartBeatPageView() {
      this.$chartBeat.sendPageView();
      this.$meta().refresh();
    },
    async loadResults() {
      this.loading = true;

      const {
        data: { posts, postsCount, hasMorePosts },
      } = await fetchSearchPagePosts({
        query: this.query,
        offset: this.offset,
        length: this.length,
        languageDomain: this.currentLanguage.domain,
        languageCode: this.currentLanguage.code,
        timeZone: this.currentLanguage.timezone,
        languageShort: this.currentLanguage.short,
        apolloTransport: this.$apolloTransport,
      });

      this.hasMore = hasMorePosts;
      this.loading = false;
      this.posts = this.posts.concat(posts);
      this.offset += this.length;
      this.length = 10;

      if (!postsCount) {
        this.noResults = true;
      }
    },
  },
  head() {
    const { query, currentLanguage, meta, alternates, i18n, $route } = this;
    return getSearchPageMeta({
      currentLanguage,
      query,
      meta,
      i18n,
      alternates,
      routeName: $route.name,
    });
  },
};
</script>

<style lang="scss" scoped>
@use '~/assets/styles/_icons-common.scss' as icons;
@import '~/assets/styles/_vars.scss';

.search-page {
  &__results {
    margin-top: 20px;
    margin-bottom: 40px;
    padding: 20px;
    -webkit-box-shadow: 0 1px 2px 0 rgb(0 0 0 / 20%);
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 20%);
    background: #fff;
    border-radius: 5px;

    h2 {
      font-family: inherit;
      font-weight: 500;
      line-height: 1.1;
      color: #333333;
      font-size: 30px;
      margin: 5px 0 10px 0;
      word-break: break-word;
      word-wrap: break-word;
    }
  }

  &__post-item {
    margin-bottom: 20px;
  }

  &__rtl {
    direction: rtl;
  }
}
</style>
