<template>
  <div class="markets-news">
    <h2 class="markets-news__title">
      {{ localI18n.listTitle }}
    </h2>
    <div>
      <ul
        v-if="isDesktop"
        class="market-news__list"
      >
        <li
          v-for="(item, index) in postdata.posts"
          :key="`${index}-${item.id}`"
          class="market-news__item"
        >
          <PostCardInline
            :post-data="item"
            theme="inline"
            :i18n="i18n"
            gtm-prefix="markets_markets_news"
            gtm-suffix="clickon_author"
          />
        </li>
      </ul>
      <MarketsNewsSlider
        v-else
        :posts="postdata.posts"
      />
      <MarketsMoreLink
        :i18n="localI18n"
        link="/tags/markets"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { VIEWPORT } from '~/store/types';
import PostCardInline from '~/components/PostsListing/PostCardInline';
import MarketsNewsSlider from './MarketsNewsSlider';
import MarketsMoreLink from './MarketsMoreLink';

export default {
  name: 'MarketsNews',
  components: {
    PostCardInline,
    MarketsNewsSlider,
    MarketsMoreLink,
  },
  props: {
    localI18n: {
      type: Object,
      default: () => ({}),
    },
    postdata: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      // selectedTabKey: 'tagRecent',
    };
  },
  computed: {
    ...mapState({
      i18n: ({ i18n }) => i18n,
    }),
    ...mapGetters('viewport', {
      isDesktop: VIEWPORT.IS_DESKTOP_WIDTH,
    }),
  },
  methods: {},
};
</script>

<style scoped lang="scss">
@import '~/assets/styles/_vars.scss';

.markets-news {
  padding: 4px 0;
  box-sizing: border-box;
}
.markets-news__title {
  font-size: 20px;
  font-weight: 400;
  text-transform: uppercase;
  margin: 0 0 16px;
}
.market-news__list {
  padding: 0;
  margin: 0 0 16px;
}
.market-news__item {
  display: block;
  margin-top: 20px;
}
.markets-news__tabs {
  display: flex;
  margin: 0 0 20px;
  padding: 0;
}
.markets-news__tab {
  display: block;
  flex: 1 0 0;
  padding: 0;
}
.markets-news__tab-btn {
  display: block;
  min-width: 100%;
  text-align: center;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid transparent;
  padding: 10px 0;
  box-sizing: border-box;
}
.markets-news__tab-btn_selected {
  border-bottom-color: #fabf2c;
}
@media (min-width: $sm) {
  .markets-news__tabs {
    margin: 0 -10px 20px;
  }
  .markets-news__tab {
    flex: none;
    padding: 0 10px;
  }
  .markets-news__tab-btn {
    min-width: 100px;
  }
}
</style>
