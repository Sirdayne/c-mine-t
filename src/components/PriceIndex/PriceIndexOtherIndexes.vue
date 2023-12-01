<template>
  <!-- eslint-disable vue/html-self-closing -->
  <div
    v-if="indexes.length"
    :class="['price-index-other', isRtl && 'price-index-other_rtl']"
  >
    <h2
      v-if="hasValue(localI18n.otherBlockTitle)"
      class="price-index-other__title"
    >
      {{ localI18n.otherBlockTitle }}
    </h2>
    <div class="price-index-other__wrap">
      <template v-for="(item, index) in indexes">
        <NuxtLink
          v-if="item.price"
          :key="index"
          :to="item.url"
          class="price-index-other__item"
        >
          <div
            v-if="item.logo"
            class="price-index-other__item__icon"
            v-html="item.logo"
          />
          <div
            v-else
            class="price-index-other__item__icon"
          >
            <CoinIcon
              :symbol="item.name.toLowerCase()"
              class="price-index-title__icon"
            />
          </div>
          <div class="price-index-other__item__title">
            <div class="price-index-other__item__title__label">
              {{ item.label }}
            </div>
            <div class="price-index-other__item__title__currency">{{ item.name }} / {{ currency }}</div>
          </div>
          <div class="price-index-other__item__price">
            <template v-if="item.price">
              <div class="price-index-other__item__price__price">
                {{ item.price }}
              </div>
            </template>
            <template v-if="item.changePercent">
              <div
                :class="[item.changePercent.includes('+') && 'up']"
                class="price-index-other__item__price__change-percent"
              >
                {{ item.changePercent }}
              </div>
            </template>
          </div>
        </NuxtLink>
      </template>
    </div>
    <div class="price-index-other__all">
      <LinkResolver to="/price-indexes">
        {{ localI18n.otherBlockViewAll }}
      </LinkResolver>
      &LongRightArrow;
    </div>
  </div>
</template>

<script>
import sampleSize from 'lodash/sampleSize';
import { mapGetters, mapState } from 'vuex';
import { ROOT, TICKERS } from '~/store/types';
import CoinIcon from '~/components/Shared/CoinIcon';
import LinkResolver from '~/components/Shared/LinkResolver';

export default {
  name: 'PriceIndexOtherIndexes',
  components: {
    CoinIcon,
    LinkResolver,
  },
  props: {
    cryptoSymbol: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    localI18n: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    indexes: [],
  }),
  computed: {
    ...mapState('tickers', {
      tickerCoins: ({ coins }) => coins,
      currencies: ({ currencies }) => currencies,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
    ...mapGetters('tickers', {
      metaCoins: TICKERS.META_COINS,
    }),
  },
  mounted() {
    const symbol = this.cryptoSymbol.toUpperCase();
    const filteredCoins = this.metaCoins.filter((c) => c.name !== symbol);

    this.indexes = sampleSize(
      this.getMappedCoins(filteredCoins).filter((coin) => coin.price),
      3
    );
  },
  methods: {
    extractVal(coin, prop) {
      const { tickerCoins } = this;
      const currencyCoins = tickerCoins[this.currency];
      const currencyCoin = currencyCoins.find((c) => c.id === coin.id);
      return currencyCoin ? currencyCoin[prop] : '';
    },
    getMappedCoins(metaCoins) {
      return metaCoins
        .map((coin) => {
          return {
            ...coin,
            price: this.extractVal(coin, 'value'),
            changePercent: this.extractVal(coin, 'changePercentage'),
            marketCap: this.extractVal(coin, 'mktcapFormatted'),
            vol24Hour: this.extractVal(coin, 'volume24hourFormatted'),
          };
        })
        .sort((a, b) => a.priority - b.priority);
    },
    hasValue(value) {
      return value.indexOf('price_index') === -1 && value.indexOf('price.index') === -1 && !!value.trim();
    },
  },
};
</script>

<style scaped lang="scss">
@use '~/assets/styles/_icons-coins.scss' as coin-icons;
@import '~/assets/styles/_vars.scss';

.price-index-other {
  width: 100%;

  &__title {
    margin: 0;
    color: #253137;
    font-size: 15px;
    font-weight: 700;
    @media (min-width: $sm) {
      font-size: 22px;
    }
  }
  &__wrap {
    display: block;
    width: 100%;
    margin-top: 16px;

    @media (min-width: $sm) {
      display: flex;
    }

    a {
      text-decoration: none;
    }
  }
  &__item {
    display: flex;
    align-items: center;
    width: 100%;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    padding: 15px 0;

    &:first-child {
      border: none;
      padding-top: 0;
    }
    &:last-child {
      padding-bottom: 0;
    }

    @media (min-width: $sm) {
      width: 33%;
      border-top: none;
      border-left: 1px solid rgba(0, 0, 0, 0.1);
      padding: 0 15px 0 20px;

      .price-index-other_rtl & {
        padding: 0 20px 0 15px;
        border-right: 1px solid rgba(0, 0, 0, 0.1);
        border-left: none;
      }

      &:first-child {
        padding-left: 0;
        .price-index-other_rtl & {
          border-right: none;
          padding-right: 0;
          padding-left: 20px;
        }
      }
      &:last-child {
        padding-right: 0;
        .price-index-other_rtl & {
          padding-left: 0;
          padding-right: 20px;
        }
      }
    }

    &__icon {
      width: 32px;
      height: 32px;
      color: #fabf2c;
      border-radius: 50%;
      transition: color 0.1s linear;

      > svg {
        width: 32px;
        height: auto;
        display: block;
        fill: currentColor;
      }
    }

    &__title {
      padding-left: 12px;
      .price-index-other_rtl & {
        padding-right: 12px;
      }
      &__label {
        color: #324149;
        font-size: 14px;
        font-weight: 700;
      }
      &__currency {
        color: #324149;
        font-size: 12px;
        font-weight: 300;
        text-transform: uppercase;
      }
    }

    &__price {
      margin-left: auto;
      text-align: right;
      &__price {
        color: #324149;
        font-size: 16px;
        font-weight: 700;
      }
      &__change-percent {
        font-size: 12px;
        font-weight: 700;
        color: #eb5757;
        &.up {
          color: #219653;
        }

        .price-index-other_rtl & {
          direction: ltr;
        }
      }
    }

    &:hover {
      text-decoration: none;
    }

    &:hover > &__icon {
      color: #253137;
    }
  }
  &__all {
    display: block;
    margin-top: 16px;
    font-weight: bold;
    a {
      color: #000;
      font-weight: 600;
      font-size: 16px;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
        color: #000;
      }
    }
  }
}
</style>
