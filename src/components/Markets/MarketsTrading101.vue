<template>
  <div class="markets-trading101">
    <h2 class="markets-trading101__title">
      {{ i18n.guidesTitle }}
    </h2>
    <div class="market-trading101__slider">
      <button
        v-show="isDesktop"
        type="button"
        class="btn market-trading101__prev"
        data-gtm-locator="markets_markets_news_trading101_clickon_arrowback"
        @click="setPrevSlide"
      >
        <span class="btn__icon market-trading101__icon" />
      </button>
      <ul
        v-touch:swipe.right="prevClickHandler"
        v-touch:swipe.left="nextClickHandler"
        class="market-trading101__list"
      >
        <li
          v-for="(item, index) in pages[currentPage]"
          :key="`${index}-${item.id}`"
          ref="pages"
          class="market-trading101__item"
        >
          <LinkResolver
            :to="item.url"
            :language-short="languageShort"
            class="market-trading101__link"
          >
            <figure class="market-trading101__figure">
              <LazyImage
                class="market-trading101__cover"
                :src="item.cover"
                :srcset="item.coverRetina"
                :alt="item.title"
              />
            </figure>
            <p>{{ item.title }}</p>
          </LinkResolver>
        </li>
      </ul>
      <button
        v-show="isDesktop"
        type="button"
        class="btn market-trading101__next"
        data-gtm-locator="markets_markets_news_trading101_clickon_ arrowforward"
        @click="setNextSlide"
      >
        <span class="btn__icon market-trading101__icon" />
      </button>
      <MarketsPagination
        v-if="!isDesktop"
        :list="posts"
        :active="currentPage"
        @set-active="setActive"
      />
    </div>
  </div>
</template>

<script>
import chunk from 'lodash/chunk';
import { mapGetters, mapState } from 'vuex';
import { VIEWPORT } from '~/store/types';
import LazyImage from '~/components/Shared/LazyImage';
import LinkResolver from '~/components/Shared/LinkResolver';
import MarketsPagination from './MarketsPagination';

export default {
  name: 'MarketsNews',
  components: {
    LazyImage,
    LinkResolver,
    MarketsPagination,
  },
  props: {
    i18n: {
      type: Object,
      default: () => ({}),
    },
    posts: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentPage: 0,
    };
  },
  computed: {
    ...mapState({
      languageShort: ({ currentLanguage: { short } }) => short,
    }),
    ...mapGetters('viewport', {
      isDesktop: VIEWPORT.IS_DESKTOP_WIDTH,
    }),
    perPage() {
      return this.isDesktop ? 3 : 1;
    },
    pages() {
      const { posts, perPage } = this;
      return chunk(posts, perPage);
    },
  },
  methods: {
    setPrevSlide() {
      const { currentPage, pages } = this;
      this.currentPage = currentPage > 0 ? currentPage - 1 : pages.length - 1;
    },
    setNextSlide() {
      const { currentPage, pages } = this;
      this.currentPage = currentPage === pages.length - 1 ? 0 : currentPage + 1;
    },
    prevClickHandler() {
      this.setPrevSlide();
    },
    nextClickHandler() {
      this.setNextSlide();
    },
    setActive(n) {
      this.currentPage = n;
    },
  },
};
</script>

<style scoped lang="scss">
@use '~/assets/styles/_icons-markets.scss' as icons;
@import '~/assets/styles/_vars.scss';
@import '~/assets/styles/_mixins.scss';

.markets-trading101 {
  padding: 25px 0;
  border-top: 1px solid #e5e5e5;
}
.markets-trading101__title {
  font-size: 20px;
  font-weight: 400;
  text-transform: uppercase;
  margin: 0 0 25px;
}
.market-trading101__slider {
  position: relative;
}
.market-trading101__prev,
.market-trading101__next {
  position: absolute;
  top: 56px;
}
.market-trading101__next {
  right: -3px;
}
.market-trading101__prev {
  left: -3px;
}
.market-trading101__list {
  padding: 0;
  margin: 0 0 16px;
  display: flex;
  flex-wrap: wrap;
}
.market-trading101__item {
  display: block;
  width: 100%;
  box-sizing: border-box;
}
.market-trading101__link {
  display: block;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
  color: #253137;
  text-decoration: none;
}
.market-trading101__link:hover {
  text-decoration: underline;
}
.market-trading101__figure {
  position: relative;
  display: block;
  margin: 0;
}
.market-trading101__cover {
  position: relative;
  display: block;
  width: 100%;
  height: 0;
  padding-top: 65.5%;
  overflow: hidden;
}
.market-trading101__icon {
  @include icon-basic(24px);
  margin: auto;
  transition: 0.25s ease-out;
  @include icons.arrow(#9c9c9c);
}
.market-trading101__prev .market-trading101__icon {
  transform: scale(-1, -1);
}
.market-trading101__icon:hover {
  @include icons.arrow(#253137);
}
@media (min-width: $sm) {
  .market-trading101__list {
    margin: 0 -16px 16px;
  }
  .market-trading101__slider {
    padding: 0 32px;
  }
  .market-trading101__item {
    width: 33.33%;
    padding: 0 16px;
    min-height: 255px;
  }
}
</style>
