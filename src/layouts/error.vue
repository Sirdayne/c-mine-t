<template>
  <div class="error-page">
    <div class="container">
      <ErrorMessage :error="error" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getMainPageMeta } from '~/assets/helpers/meta';
import ErrorMessage from '~/components/Shared/ErrorMessage.vue';
import { useLayoutUiStore } from '~/lib/layout-store';

export default {
  name: 'ErrorPage',
  components: {
    ErrorMessage,
  },
  props: {
    error: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    ...mapState({
      currentLanguage: ({ currentLanguage }) => currentLanguage,
      languages: ({ languages }) => languages,
    }),
  },

  setup() {
    const layoutUiStore = useLayoutUiStore();
    layoutUiStore.setHeaderVariant('light');
  },

  head() {
    return getMainPageMeta({
      currentLanguage: this.currentLanguage,
      languages: this.languages,
      meta: {
        url: this.$route.path,
        title:
          this.error.statusCode === 404
            ? 'Page Not Found | 404 | Cointelegraph'
            : `${this.error.statusCode} | Cointelegraph`,
      },
      isError: true,
      routeName: '404',
    });
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.error-page {
  flex-grow: 1;
  display: flex;
  margin-top: 30px;
  margin-bottom: 30px;
}
@media (min-width: $sm) {
  .error-page {
    margin-top: 60px;
    margin-bottom: 60px;
  }
}
@media (min-width: $md) {
  .error-page {
    margin-top: 100px;
    margin-bottom: 100px;
  }
}
</style>
