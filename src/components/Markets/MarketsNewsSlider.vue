<template>
  <div class="market-news-slider">
    <ul
      v-if="posts"
      v-touch:swipe.right="prevClickHandler"
      v-touch:swipe.left="nextClickHandler"
      class="market-news-slider__list"
    >
      <li
        v-for="(item, index) in posts"
        :key="`${index}-${item.id}`"
        ref="pages"
        class="market-news-slider__item"
        :class="index === active && 'market-news-slider__item_active'"
      >
        <LinkResolver
          :to="item.url"
          :language-short="languageShort"
          class="market-news-slider__link"
        >
          <figure class="market-news-slider__figure">
            <LazyImage
              class="market-news-slider__cover"
              :src="item.cover"
              :srcset="item.coverRetina"
              :alt="item.title"
            />
          </figure>
          <p>{{ item.title }}</p>
        </LinkResolver>
      </li>
    </ul>
    <MarketsPagination
      :list="posts"
      :active="active"
      @set-active="setActive"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LazyImage from '~/components/Shared/LazyImage';
import LinkResolver from '~/components/Shared/LinkResolver';
import MarketsPagination from './MarketsPagination';

export default {
  name: 'MarketsNewsSlider',
  components: {
    LazyImage,
    LinkResolver,
    MarketsPagination,
  },
  props: {
    posts: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      active: 0,
    };
  },
  computed: {
    ...mapState({
      languageShort: ({ currentLanguage: { short } }) => short,
    }),
  },
  methods: {
    setPrevSlide() {
      const { active, posts } = this;
      this.active = active > 0 ? active - 1 : posts.length - 1;
    },
    setNextSlide() {
      const { active, posts } = this;
      this.active = active === posts.length - 1 ? 0 : active + 1;
    },
    prevClickHandler() {
      this.setPrevSlide();
    },
    nextClickHandler() {
      this.setNextSlide();
    },
    setActive(n) {
      this.active = n;
    },
  },
};
</script>

<style scoped lang="scss">
.market-news-slider {
  width: 100%;
  overflow: hidden;
}
.market-news-slider__list {
  padding: 0;
  margin: 0;
}
.market-news-slider__item {
  display: none;
  width: 100%;
}
.market-news-slider__item_active {
  display: block;
}
.market-news-slider__link {
  display: block;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
  color: #253137;
  text-decoration: none;
}
.market-news-slider__link:hover {
  text-decoration: underline;
}
.market-news-slider__figure {
  position: relative;
  display: block;
  margin: 0;
}
.market-news-slider__cover {
  position: relative;
  display: block;
  width: 100%;
  height: 0;
  padding-top: 65.5%;
  overflow: hidden;
}
</style>
