<template>
  <LinkResolver
    class="markets-card"
    :class="isRtl && 'markets-card_rtl'"
    :data-gtm-locator="`markets_markets_news_clickon_${coin.label.toLowerCase()}`"
    :to="coin.url"
  >
    <div class="markets-card__top">
      <span
        v-if="coin.logo"
        class="markets-card__icon"
        v-html="coin.logo"
      />
      <span
        v-else
        class="markets-card__icon"
        :class="iconName"
      />
      <span
        class="markets-card__name"
        :class="isJP && 'markets-card__name_full'"
      >
        {{ coin.label }}
      </span>
      <span class="markets-card__price"> {{ sign }}{{ coin.tickers.value }} </span>
      <span class="markets-card__currency"> {{ coin.name }} / {{ currency }} </span>
      <span
        class="markets-card__percentage"
        :class="parseFloat(coin.tickers.changePercentage) < 0 && 'markets-card__percentage_down'"
      >
        {{ coin.tickers.changePercentage }}
      </span>
    </div>

    <MarketsCardChart
      :symbol="coin.name"
      :charts="coin.charts"
    />

    <div class="markets-card__row">
      <div
        v-if="coin.tickers.mktcap"
        class="markets-card__block"
      >
        <span class="markets-card__label">
          {{ i18n.marketCap }}
        </span>
        <span class="markets-card__value"> {{ sign }}{{ coin.tickers.mktcapFormatted }} </span>
      </div>
      <div class="markets-card__block">
        <span class="markets-card__label">
          {{ i18n.volume24h }}
        </span>
        <span class="markets-card__value"> {{ sign }}{{ coin.tickers.volume24hourFormatted }} </span>
      </div>
    </div>
  </LinkResolver>
</template>

<script>
import { mapGetters } from 'vuex';
import { ROOT } from '~/store/types';
import LinkResolver from '~/components/Shared/LinkResolver';
import MarketsCardChart from './MarketsCardChart.vue';

export default {
  name: 'MarketsCard',
  components: {
    LinkResolver,
    MarketsCardChart,
  },
  props: {
    i18n: {
      type: Object,
      default: () => ({}),
    },
    coin: {
      type: Object,
      default: () => ({}),
    },
    currency: {
      type: String,
      default: 'USD',
    },
    sign: {
      type: String,
      default: '',
    },
  },
  computed: {
    iconName() {
      return `icon-coin-${this.coin.name.toLowerCase()}`;
    },
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
      isJP: ROOT.IS_JP,
    }),
  },
};
</script>

<style scoped lang="scss">
@use '~/assets/styles/_icons-coins.scss' as coin-icons;
@import '~/assets/styles/_vars.scss';

.markets-card {
  display: block;
  color: #253137;
  height: 100%;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.16);
  border-radius: 2px;
  background-color: #fff;
  text-decoration: none;
  transition: box-shadow 0.15s linear;
}
.markets-card__top {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  position: relative;
  padding: 8px 8px 8px 32px;
  box-sizing: border-box;
}
.markets-card_rtl .markets-card__top {
  padding: 8px 32px 8px 8px;
}
.markets-card__icon {
  display: inline-block;
  position: absolute;
  left: 8px;
  top: 12px;
  width: 16px;
  height: 16px;
  background-position: center;
  background-repeat: no-repeat;
  color: #fabf2c;

  svg {
    width: 16px;
    height: auto;
    fill: currentColor;
  }
}
.markets-card_rtl .markets-card__icon {
  left: auto;
  right: 8px;
}
.markets-card__name {
  font-size: 14px;
  font-weight: 700;
}
.markets-card__price {
  text-align: right;
  font-size: 16px;
  font-weight: 700;
}
.markets-card__currency {
  min-width: 75%;
  font-size: 10px;
  font-weight: 400;
  text-transform: uppercase;
}
.markets-card__percentage {
  text-align: right;
  font-size: 10px;
  font-weight: 400;
  color: #3abc98;
}
.markets-card__percentage_down {
  color: #ff4a68;
}
.markets-card_rtl .markets-card__percentage {
  direction: ltr;
}
.markets-card__row {
  display: flex;
  padding: 8px 8px;
  box-sizing: border-box;
  font-weight: 400;
  margin: 0 -8px;
  text-transform: uppercase;
}
.markets-card__block {
  padding: 0 8px;
  box-sizing: border-box;
}
.markets-card__label {
  font-size: 8px;
  display: block;
}
.markets-card__value {
  display: block;
  font-size: 14px;
  line-height: 1.5;
}

.icon-coin-btc {
  @include coin-icons.coin-btc(#fabf2c);
}
.icon-coin-eth {
  @include coin-icons.coin-eth(#fabf2c);
}
.icon-coin-ltc {
  @include coin-icons.coin-ltc(#fabf2c);
}
@media (min-width: $lg) {
  .markets-card__name_full {
    width: 100%;
  }
}
</style>

<style>
.markets-card__icon svg {
  width: 16px;
  height: auto;
  fill: currentColor;
}
</style>
