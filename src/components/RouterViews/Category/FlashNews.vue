<template>
  <div class="flash-news-page">
    <div class="container">
      <div class="flash-news-page__row">
        <div class="flash-news-page__content-col">
          <div class="flash-news-page__title-wrp">
            <h1
              v-if="category.title"
              class="flash-news-page__title"
            >
              {{ category.title }}
            </h1>
          </div>
          <div class="flash-news-page__wrapper">
            <FlashNewsListing
              :posts="posts"
              :pending="isPending"
              :has-more="hasMore"
              :i18n="i18n"
              @load-more="handleLoadMore"
            />
          </div>
        </div>
        <div
          v-if="!isMounted || !isMobileBreakpoint"
          class="flash-news-page__sidebar-col"
        >
          <Sidebar />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchCategoryPageInitialState, fetchCategoryPagePosts } from '~/api/modules/category';
import CategoryBySlug from '~/components/RouterViews/Category/_slug';

export default {
  ...CategoryBySlug,
  name: 'FlashNews',
  components: {
    FlashNewsListing: () => import('~/components/FlashNews/FlashNewsListing'),
    Sidebar: () => import('~/components/Sidebar/Sidebar'),
  },
  async asyncData({ store: { state }, params, route, error, app }) {
    const data = await fetchCategoryPageInitialState({
      slug: params.slug,
      languageDomain: state.currentLanguage.domain,
      languageCode: state.currentLanguage.code,
      timeZone: state.currentLanguage.timezone,
      pathname: route.path,
      languageShort: state.currentLanguage.short,
      apolloTransport: app.$apolloTransport,
    });
    if (!data.category) {
      error({ statusCode: 404 });
    }
    return data;
  },
  methods: {
    ...CategoryBySlug.methods,
    async handleLoadMore() {
      this.isPending = true;
      const {
        data: { posts, postsCount },
      } = await fetchCategoryPagePosts({
        slug: this.$route.params.slug,
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

<style lang="scss">
@import '~/assets/styles/_vars.scss';
.flash-news-page {
  padding: 0 16px;
}
.flash-news-page__row {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  margin-left: -$gutter;
  margin-right: -$gutter;
}
.flash-news-page__content-col {
  width: 100%;
  padding-right: $gutter;
  padding-left: $gutter;
  box-sizing: border-box;
}
.flash-news-page__sidebar-col {
  display: none;
}
.flash-news-page__wrapper {
  border-left: 1px solid #465a65;
  padding-left: 10px;
  padding-bottom: 40px;
}
.flash-news-page__flex-rows {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
}
.flash-news-page__title-wrp {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}
.flash-news-page__title {
  color: #253137;
  font-weight: 800;
  font-size: 1.375rem;
  padding: 0;
  margin-top: 0;
  margin-bottom: 12px;
}
.flash-news-page__description {
  margin-top: 24px;
  color: #27282d;
}
.flash-news-page__action-wrp {
  text-align: left;
  margin-top: 8px;
}
.flash-news-page__button {
  display: inline-block;
  padding: 4px 18px;
  text-decoration: none;
  line-height: 25px;
  color: #ffcd04;
  background: #27282d;
  border: 2px solid #27282d;
  border-radius: 4px;
}
.flash-news-page__button:hover {
  color: #27282d;
  background: #ffcd04;
  border: 2px solid #ffcd04;
}
.flash-news-page__posts-col {
  padding: 40px 6px 40px 16px;
  border-left: 1px solid #465a65;
}
.flash-news-page__list {
  margin-top: 24px;
}
.flash-news-page__more-list {
  margin-top: 32px;
}
.flash-news-page .l-flash-news {
  padding-top: 55px;
}
.flash-news-page .post-preview-list-navigation {
  margin-top: 24px;
}
.flash-news-page .post-preview-list-navigation__btn_load-more {
  width: 100%;
  margin-top: 15px;
  background-image: linear-gradient(180deg, #dae2e7 0%, #afbdc4 100%);
  border: none;
  border-radius: 2px;
}
.flash-news-page .post-preview-list-navigation__btn_top {
  display: none;
}

@media (min-width: $sm) {
  .flash-news-page__flex-rows {
    padding: 32px 10px 22px 34px;
    margin-left: 20px;
    border-left: 1px solid #465a65;
  }
  .flash-news-page__action-wrp {
    margin-top: 16px;
  }
  .flash-news-page__title {
    font-size: 2.25rem;
  }
  .flash-news-page__posts-col {
    padding: 0;
    border: none;
  }
  .flash-news-page__list {
    margin-top: 32px;
  }
}
@media (min-width: $md) {
  .flash-news-page__wrapper {
    padding-left: 54px;
  }
  .flash-news-page__content-col {
    width: 66.66666667%;
  }
  .flash-news-page__sidebar-col {
    display: block;
    width: 33.33333333%;
    padding-right: $gutter;
    padding-left: $gutter;
    box-sizing: border-box;
    z-index: 1;
    padding-top: 5px;
    margin-bottom: 40px;
  }
  .flash-news-page__flex-rows {
    margin-left: -10px;
    margin-right: -10px;
  }
  .flash-news-page__posts-col {
    padding-right: 44px;
    padding-left: 20px;
  }
}
</style>
