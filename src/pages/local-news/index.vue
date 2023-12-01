<script>
import CategoryBySlug from '~/components/RouterViews/Category/_slug';
import { fetchLocalPagePosts, fetchLocalPostsPageInitialState } from '~/api/modules/localPosts';
import getProperty from '~/assets/libs/getProperty';
import { isValidCategory } from '~/assets/helpers/categories';

export default {
  ...CategoryBySlug,
  async asyncData({ store: { state }, route, error, app }) {
    const data = await fetchLocalPostsPageInitialState({
      languageDomain: state.currentLanguage.domain,
      languageCode: state.currentLanguage.code,
      timeZone: state.currentLanguage.timezone,
      pathname: route.path,
      languageShort: state.currentLanguage.short,
      apolloTransport: app.$apolloTransport,
    });
    if (!isValidCategory(data)) {
      error({ statusCode: 404 });
    }
    const seoTitle = getProperty(data, 'category.title', '');
    const seoDescription = getProperty(data, 'category.description', '');
    const title = getProperty(state.i18n, 'localPostsPageTitle', seoTitle);
    const description = getProperty(state.i18n, 'localPostsPageDescription', seoDescription);
    return {
      ...data,
      category: {
        ...data.category,
        title,
        description,
      },
    };
  },
  computed: {
    ...CategoryBySlug.computed,
    isWithoutImageTheme() {
      return false;
    },
  },
  methods: {
    ...CategoryBySlug.methods,
    async handleLoadMore() {
      this.isPending = true;
      const {
        data: { posts, postsCount },
      } = await fetchLocalPagePosts({
        offset: this.postsOffset,
        languageDomain: this.currentLanguage.domain,
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
  },
};
</script>
