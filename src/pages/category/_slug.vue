<script>
import { fetchCategoryPageInitialState, fetchCategoryPagePosts } from '~/api/modules/category';
import getProperty from '~/assets/libs/getProperty';
import CategoryBySlug from '~/components/RouterViews/Category/_slug';
import { isValidCategory } from '~/assets/helpers/categories';

const SPECIAL_CATEGORIES = ['explained', 'press-releases', 'market-releases'];
const WITHOUT_IMAGE_THEME_CATEGORIES = ['forex-trading', 'partnerships'];

export default {
  ...CategoryBySlug,
  async asyncData({ store: { state }, params, route, error, app }) {
    const slug = SPECIAL_CATEGORIES.includes(route.name) ? route.name : params.slug;
    const data = await fetchCategoryPageInitialState({
      slug,
      languageDomain: state.currentLanguage.domain,
      languageCode: state.currentLanguage.code,
      timeZone: state.currentLanguage.timezone,
      pathname: route.path,
      languageShort: state.currentLanguage.short,
      apolloTransport: app.$apolloTransport,
      hideFromMainPage: ['press-releases', 'market-releases'].includes(slug) ? false : null,
    });
    if (!isValidCategory(data)) {
      error({ statusCode: 404 });
    }
    return data;
  },
  computed: {
    ...CategoryBySlug.computed,
    isWithoutImageTheme() {
      const categorySlug = getProperty(this.$route, 'params.slug', '');
      return WITHOUT_IMAGE_THEME_CATEGORIES.includes(categorySlug);
    },
  },
  methods: {
    ...CategoryBySlug.methods,
    async handleLoadMore() {
      this.isPending = true;
      const slug = SPECIAL_CATEGORIES.includes(this.$route.name) ? this.$route.name : this.$route.params.slug;
      const {
        data: { posts, postsCount },
      } = await fetchCategoryPagePosts({
        slug,
        offset: this.postsOffset,
        languageDomain: this.currentLanguage.domain,
        languageCode: this.currentLanguage.code,
        timeZone: this.currentLanguage.timezone,
        languageShort: this.currentLanguage.short,
        apolloTransport: this.$apolloTransport,
        hideFromMainPage: ['press-releases', 'market-releases'].includes('press-releases') ? false : null,
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
