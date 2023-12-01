<template>
  <div class="markets-header">
    <div class="markets-header__title">
      <h1>
        {{ i18n.title }}
      </h1>
    </div>
    <div
      class="markets-header__description"
      v-html="i18n.description"
    />
    <MarketsFiat
      :currencies="currencies"
      :currency="currency"
      @select-currency="handleCurrencySelect"
    />
    <ul class="markets-header__list">
      <li
        v-for="coin in selectedCoins"
        :key="coin.id"
        class="markets-header__item"
      >
        <MarketsCard
          :i18n="i18n"
          :coin="coin"
          :currency="currency"
          :sign="sign"
        />
      </li>
    </ul>
    <MarketsMoreLink
      :i18n="i18n"
      link="/price-indexes"
    />
    <PostCardInline
      :post-data="post"
      :i18n="i18n"
      gtm-prefix="markets_markets_news"
      gtm-suffix="clickon_author"
      theme="inline"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { TICKERS } from '~/store/types';
import PostCardInline from '~/components/PostsListing/PostCardInline.vue';
import MarketsFiat from './MarketsFiat.vue';
import MarketsCard from './MarketsCard.vue';
import MarketsMoreLink from './MarketsMoreLink.vue';

export default {
  name: 'MarketsHeader',
  components: {
    MarketsFiat,
    MarketsCard,
    PostCardInline,
    MarketsMoreLink,
  },
  props: {
    i18n: {
      type: Object,
      default: () => ({}),
    },
    post: {
      type: Object,
      default: () => ({}),
    },
    currency: {
      type: String,
      default: 'USD',
    },
    selectedCoins: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState('tickers', {
      currencies: ({ currencies }) => currencies,
    }),
    ...mapGetters('tickers', {
      currencySign: TICKERS.SIGN,
    }),
    sign() {
      const item = this.currencies.find((e) => e.name === this.currency);
      return item.sign;
    },
  },
  watch: {
    currencies() {
      if (this.currencies?.length && !this.currency) {
        this.handleCurrencySelect(this.currencies[0].name);
      }
    },
  },
  methods: {
    handleCurrencySelect(payload) {
      this.$emit('select-currency', payload);
    },
  },
};
</script>

<style scoped lang="scss">
@import '~/assets/styles/_vars.scss';
.markets-header {
  position: relative;
  margin: 10px 0;
}
.markets-header__title {
  position: relative;
  display: flex;
  align-items: center;
  margin: 0 0 18px;
}
.markets-header__title h1 {
  position: relative;
  margin: 0;
  font-size: 30px;
  font-weight: 600;
  line-height: 40px;
  color: #253137;
}
.markets-header__title h1:after {
  content: '';
  display: block;
  width: 100%;
  height: 2px;
  background-color: #fabf2c;
}
.markets-header__description {
  font-size: 14px;
  font-weight: 400;
  line-height: 23px;
  color: #253137;
  margin-bottom: 19px;
}
.markets-header__list {
  display: flex;
  margin: 0 0 21px;
  padding: 0;
}
.markets-header__item {
  width: 100%;
  display: block;
  box-sizing: border-box;
}
.markets-header__item:nth-child(2),
.markets-header__item:nth-child(3) {
  display: none;
}
@media (min-width: $xs) {
  .markets-header__list {
    margin: 0 -10px 23px;
  }
  .markets-header__item {
    padding: 0 10px;
    width: 50%;
  }
  .markets-header__item:nth-child(2) {
    display: block;
  }
}
@media (min-width: $sm) {
  .markets-header {
    margin-bottom: 20px;
  }
  .markets-header__title {
    margin-bottom: 25px;
  }
  .markets-header__description {
    max-width: 570px;
    margin-bottom: 45px;
  }
}
@media (min-width: $md) {
  .markets-header {
    margin: 25px 0;
  }
}
@media (min-width: $lg) {
  .markets-header {
    margin-bottom: 45px;
  }
  .markets-header__item {
    width: 33.33%;
  }
  .markets-header__item:nth-child(3) {
    display: block;
  }
}
</style>
