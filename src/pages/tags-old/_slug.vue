<template>
  <div
    class="tag-page"
    :class="[isAsia && isMobile && 'tag-page_asia', isRtl && 'tag-page_rtl']"
  >
    <div class="container">
      <div class="tag-page__title-wrap">
        <h1
          v-if="title && tag.about"
          class="tag-page__title"
          v-html="title"
        />
        <AdSlot
          v-if="!isMobileBreakpoint"
          class="tag-page__promo-button"
          place="promo_button_tag_desktop"
        />
      </div>
      <TagAbout
        v-if="tag.about"
        class="tag-page__about"
        :tag="tag"
        :i18n="i18n"
      />

      <AdSlot
        v-if="isMobileBreakpoint"
        class="tag-page__promo-button"
        place="promo_button_stack_tag_mobile"
      />

      <div class="tag-page__rows">
        <div class="tag-page__posts-col">
          <h1
            v-if="title && !tag.about"
            class="tag-page__title"
            v-html="title"
          />
          <PostsListing
            theme="inline"
            :pending="postData.isPending"
            :has-more="postData.hasMore"
            :posts="postData.posts"
            :i18n="i18n"
            gtm-prefix="news"
            gtm-suffix="clickon_author"
            gtm-locator-type="category"
            @load-more="handleLoadMore()"
          />
        </div>
        <div
          v-if="!isMounted || !isMobileBreakpoint"
          :class="!tag.about && 'tag-page__sidebar-col_with-top-padding'"
          class="tag-page__sidebar-col"
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
import { fetchTagPageInitialState, fetchTagPage } from '~/api/modules/tags';
import { getTagsPageMeta } from '~/assets/helpers/meta';
import { pushVirtualPageView } from '~/assets/helpers/dataLayerEvents';
import { pathValidator } from '~/assets/helpers/utils';
import getProperty from '~/assets/libs/getProperty';
import { AdSlot } from '~/features/ads';

const CRYPTOPEDIA_TAGS = ['how-to-crypto'];

export default {
  name: 'TagPage',
  components: {
    AdSlot,
    TagAbout: () => import('~/components/Tags/TagAbout'),
    PostsListing: () => import('~/components/PostsListing/PostsListing'),
    Sidebar: () => import('~/components/Sidebar/Sidebar'),
  },
  validate: pathValidator,
  async asyncData({ store: { state }, params, route, error, app, redirect }) {
    const data = await fetchTagPageInitialState({
      slug: params.slug,
      languageDomain: state.currentLanguage.domain,
      languageCode: state.currentLanguage.code,
      timeZone: state.currentLanguage.timezone,
      pathname: route.path,
      languageShort: state.currentLanguage.short,
      apolloTransport: app.$apolloTransport,
    });
    const posts = getProperty(data, 'postData.posts', []);
    const isPostsExist = Array.isArray(posts) && posts.length;
    if (!data.tag || !isPostsExist) {
      error({ statusCode: 404 });
      return {};
    }
    if (data.tag.redirectRelativeUrl && data.tag.redirectRelativeUrl !== route.path) {
      redirect(301, data.tag.redirectRelativeUrl);
    }
    return data;
  },
  data() {
    return {
      tag: null,
      meta: null,
      alternates: [],
      isMounted: false,
    };
  },
  computed: {
    ...mapState({
      currentLanguage: ({ currentLanguage }) => currentLanguage,
      languages: ({ languages }) => languages,
      i18n: ({ i18n }) => i18n,
    }),
    ...mapState('viewport', {
      isMobile: ({ userDeviceType: { any } }) => any,
    }),
    ...mapGetters({
      isAsia: ROOT.IS_ASIA,
      isRtl: ROOT.IS_RTL,
    }),
    ...mapGetters('viewport', {
      isMobileBreakpoint: VIEWPORT.IS_MOBILE_BREAKPOINT,
    }),
    title() {
      const title = getProperty(this.tag, 'title', null);
      const titleAlt = getProperty(this.tag, 'titleAlt', null);
      if (title) {
        return title;
      }
      if (titleAlt && this.i18n.tagTitleAltPostfix) {
        return `${titleAlt} ${this.i18n.tagTitleAltPostfix}`;
      }
      return '';
    },
    hasMore() {
      return this.postData && this.postData.postsAmount > 0 && this.postData.postsOffset < this.postData.postsAmount;
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
      if (!this.postData) {
        return;
      }
      this.postData.isPending = true;
      const {
        data: { posts, postsCount },
      } = await fetchTagPage({
        slug: this.$route.params.slug,
        order: this.postData.order,
        offset: this.postData.postsOffset,
        languageDomain: this.currentLanguage.domain,
        languageCode: this.currentLanguage.code,
        timeZone: this.currentLanguage.timezone,
        languageShort: this.currentLanguage.short,
        apolloTransport: this.$apolloTransport,
      });
      this.postData.isPending = false;
      this.postData.posts = this.postData.posts.concat(posts);
      this.postData.postsOffset += posts.length;
      if (postsCount > 0) {
        this.postData.postsAmount = postsCount;
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
      if (CRYPTOPEDIA_TAGS.includes(this.$route.params.slug)) {
        this.$chartBeat.sendPageView({
          title: document.title,
          path: this.$route.path,
          sections: this.$route.params.slug,
        });
      } else {
        this.$chartBeat.sendPageView();
      }

      this.$meta().refresh();
    },
  },
  head() {
    const { currentLanguage, languages, meta, alternates } = this;
    return getTagsPageMeta({
      currentLanguage,
      languages,
      meta,
      alternates,
      routeName: this.$route.name,
    });
  },
};
</script>

<style scoped lang="scss">
@import '~/assets/styles/_vars.scss';

.tag-page {
  margin-bottom: 40px;
}
.tag-page__title {
  position: relative;
  margin: 0 0 24px;
  padding-bottom: 12px;
  font-size: 1.875rem;
  line-height: 1.1;
  color: #010101;
  font-weight: 600;
  margin-right: 16px;
}
.tag-page__title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 15%;
  height: 2px;
  max-width: 50px;
  min-width: 30px;
  background-color: #ffcd04;
}
.tag-page__about {
  margin-bottom: 24px;
}
.tag-page__rows {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
}
.tag-page__sidebar-col {
  display: none;
}
.tag-page__tabs {
  display: flex;
  width: 100%;
  height: 40px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.tag-page__tab {
  width: 100%;
  padding: 0;
}
.tag-page__tab-btn {
  display: block;
  width: 100%;
  min-width: 0;
  height: 40px;
  font-size: 0.875rem;
  color: #555555;
  border-bottom: 1px solid transparent;
  transition: border-color 0.15s;
}
.tag-page__tab-btn:hover,
.tag-page__tab-btn_selected,
.tag-page__tab-btn.tag-page__tab-btn_selected:hover {
  border-color: #ffcd04;
  cursor: default;
}
.tag-page__tab-btn:hover {
  cursor: pointer;
}
.tag-page__promo-button {
  width: 100%;
  margin-bottom: 10px;
}

.tag-page_asia {
  margin-top: 20px;
}
.tag-page_rtl {
  direction: rtl;
}
.tag-page_rtl .tag-page__title {
  margin-right: 0;
  margin-left: 16px;
}
.tag-page_rtl .tag-page__title::after {
  right: 0;
}
.tag-page__title-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
}

@media (min-width: $sm) {
  .tag-page__tabs {
    width: auto;
  }
  .tag-page__tab {
    width: auto;
    margin-right: 8px;
  }
  .tag-page__tab-btn {
    width: auto;
    padding-left: 6px;
    padding-right: 6px;
  }
  .tag-page__promo-button {
    display: inline-block;
    width: auto;
    // margin-bottom: 0;
  }
  .tag-page_rtl .tag-page__promo-button {
    margin-left: 0;
    // margin-right: auto;
  }
}
@media (min-width: $md) {
  .tag-page__sidebar-col {
    display: block;
    width: 33.33333333%;
    padding-right: $gutter;
    padding-left: $gutter;
    box-sizing: border-box;
    z-index: 1;
  }
  .tag-page__posts-col {
    width: 66.66666667%;
  }
  .tag-page__sidebar-col_with-top-padding {
    padding-top: 5px;
  }
}
</style>
