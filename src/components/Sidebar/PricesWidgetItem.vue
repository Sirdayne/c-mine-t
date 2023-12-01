<template>
  <LinkResolver
    class="price-widget-item"
    :class="[isRtl && 'price-widget-item_rtl']"
    :to="coin.url"
    :language-short="languageShort"
  >
    <div class="price-widget-item__cell price-widget-item__image">
      <span
        v-if="coin.logo"
        class="price-widget-item__icon"
        v-html="coin.logo"
      />
      <span
        v-else
        class="price-widget-item__icon"
        :class="iconName"
      />
    </div>
    <div class="price-widget-item__cell price-widget-item__meta">
      <span class="price-widget-item__label">
        {{ coin.label }}
      </span>
      <span class="price-widget-item__name-currency"> {{ coin.name }}/{{ currency }} </span>
    </div>
    <div class="price-widget-item__cell price-widget-item__values">
      <span class="price-widget-item__price">
        {{ coin.value }}
      </span>
      <span
        class="price-widget-item__percent"
        :class="[coin.isUp && 'price-widget-item__percent_up', coin.isDown && 'price-widget-item__percent_down']"
      >
        {{ coin.changePercentage }}
      </span>
    </div>
    <div
      v-if="coin.graph"
      class="price-widget-item__cell price-widget-item__history"
      v-html="coin.graph"
    />
  </LinkResolver>
</template>

<script>
import { mapState } from 'vuex';
import { DEFAULT_CURRENCY } from '~/app.config';
import LinkResolver from '~/components/Shared/LinkResolver';

export default {
  name: 'PricesWidgetItem',
  components: {
    LinkResolver,
  },
  props: {
    isRtl: {
      type: Boolean,
      default: false,
    },
    currency: {
      type: String,
      default: DEFAULT_CURRENCY,
    },
    coin: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState({
      languageShort: ({ currentLanguage: { short } }) => short,
    }),
    iconName() {
      return `icon-coin-${this.coin.name.toLowerCase()}`;
    },
  },
};
</script>

<style lang="scss">
@use 'sass:meta';
@use '~/assets/styles/_icons-coins.scss' as coin-icons;
@import '~/assets/styles/_vars.scss';

$top-label-height: 1rem * 1.375;
$bottom-label-height: 0.75rem * 1.375;
$min-cell-height: $top-label-height + $bottom-label-height;

.price-widget-item {
  display: table-row;
  text-decoration: none;
  font-weight: 700;
  color: #324149;
  vertical-align: middle;
}
.price-widget-item__cell {
  display: table-cell;
  height: $min-cell-height;
  padding-top: 16px;
  padding-bottom: 16px;
  vertical-align: inherit;
  border-bottom: inherit;
}
.price-widget-item__image,
.price-widget-item__meta,
.price-widget-item__values {
  padding-right: 8px;
}
.price-widget-item__icon {
  display: inline-block;
  width: 32px;
  height: 32px;
  color: #fabf2c;
  margin-top: calc(#{$min-cell-height} / 2 - 32px / 2);
  background-position: center;
  background-repeat: no-repeat;
  transition: all 0.15s;

  svg {
    width: 32px;
    height: auto;
    fill: currentColor;
  }
}
.price-widget-item__meta {
  white-space: nowrap;
}
.price-widget-item__label {
  display: block;
  font-size: 0.875rem;
  line-height: $top-label-height;
}
.price-widget-item__name-currency {
  display: block;
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 300;
  line-height: $bottom-label-height;
}
.price-widget-item__values {
  text-align: right;
}
.price-widget-item__price {
  display: block;
  font-size: 1rem;
  line-height: $top-label-height;
}
.price-widget-item__percent {
  display: block;
  font-size: 0.75rem;
  line-height: $bottom-label-height;
  direction: ltr;
}
.price-widget-item__percent_up {
  color: #219653;
}
.price-widget-item__percent_down {
  color: #eb5757;
}
.price-widget-item__history {
  max-width: 110px;
}
.price-widget-item__history svg {
  display: inline-block;
  height: auto;
  max-height: $min-cell-height;
}
.price-widget-item_rtl {
  direction: rtl;
}
.price-widget-item_rtl .price-widget-item__image,
.price-widget-item_rtl .price-widget-item__meta,
.price-widget-item_rtl .price-widget-item__values {
  padding-right: 0;
  padding-left: 8px;
}
.price-widget-item_rtl .price-widget-item__values,
.price-widget-item_rtl .price-widget-item__history {
  text-align: left;
}
.price-widget-item:hover .price-widget-item__icon {
  color: #253137;
}

.icon-coin-ada {
  @include coin-icons.coin-ada(#fabf2c);
}
.icon-coin-bch {
  @include coin-icons.coin-bch(#fabf2c);
}
.icon-coin-bnb {
  @include coin-icons.coin-bnb(#fabf2c);
}
.icon-coin-btc {
  @include coin-icons.coin-btc(#fabf2c);
}
.icon-coin-dash {
  @include coin-icons.coin-dash(#fabf2c);
}
.icon-coin-eos {
  @include coin-icons.coin-eos(#fabf2c);
}
.icon-coin-eth {
  @include coin-icons.coin-eth(#fabf2c);
}
.icon-coin-iot {
  @include coin-icons.coin-iot(#fabf2c);
}
.icon-coin-ltc {
  @include coin-icons.coin-ltc(#fabf2c);
}
.icon-coin-mkr {
  @include coin-icons.coin-mkr(#fabf2c);
}
.icon-coin-neo {
  @include coin-icons.coin-neo(#fabf2c);
}
.icon-coin-ont {
  @include coin-icons.coin-ont(#fabf2c);
}
.icon-coin-trx {
  @include coin-icons.coin-trx(#fabf2c);
}
.icon-coin-usdt {
  @include coin-icons.coin-usdt(#fabf2c);
}
.icon-coin-xlm {
  @include coin-icons.coin-xlm(#fabf2c);
}
.icon-coin-xmr {
  @include coin-icons.coin-xmr(#fabf2c);
}
.icon-coin-xrp {
  @include coin-icons.coin-xrp(#fabf2c);
}
.icon-coin-zec {
  @include coin-icons.coin-zec(#fabf2c);
}
.price-widget-item:hover .icon-coin-ada {
  @include coin-icons.coin-ada(#253137);
}
.price-widget-item:hover .icon-coin-bch {
  @include coin-icons.coin-bch(#253137);
}
.price-widget-item:hover .icon-coin-bnb {
  @include coin-icons.coin-bnb(#253137);
}
.price-widget-item:hover .icon-coin-btc {
  @include coin-icons.coin-btc(#253137);
}
.price-widget-item:hover .icon-coin-dash {
  @include coin-icons.coin-dash(#253137);
}
.price-widget-item:hover .icon-coin-eos {
  @include coin-icons.coin-eos(#253137);
}
.price-widget-item:hover .icon-coin-eth {
  @include coin-icons.coin-eth(#253137);
}
.price-widget-item:hover .icon-coin-iot {
  @include coin-icons.coin-iot(#253137);
}
.price-widget-item:hover .icon-coin-ltc {
  @include coin-icons.coin-ltc(#253137);
}
.price-widget-item:hover .icon-coin-mkr {
  @include coin-icons.coin-mkr(#253137);
}
.price-widget-item:hover .icon-coin-neo {
  @include coin-icons.coin-neo(#253137);
}
.price-widget-item:hover .icon-coin-ont {
  @include coin-icons.coin-ont(#253137);
}
.price-widget-item:hover .icon-coin-trx {
  @include coin-icons.coin-trx(#253137);
}
.price-widget-item:hover .icon-coin-usdt {
  @include coin-icons.coin-usdt(#253137);
}
.price-widget-item:hover .icon-coin-xlm {
  @include coin-icons.coin-xlm(#253137);
}
.price-widget-item:hover .icon-coin-xmr {
  @include coin-icons.coin-xmr(#253137);
}
.price-widget-item:hover .icon-coin-xrp {
  @include coin-icons.coin-xrp(#253137);
}
.price-widget-item:hover .icon-coin-zec {
  @include coin-icons.coin-zec(#253137);
}

@media (min-width: $lg) {
  .price-widget-item__image,
  .price-widget-item__meta,
  .price-widget-item__values {
    padding-right: 12px;
  }
  .price-widget-item_rtl .price-widget-item__image,
  .price-widget-item_rtl .price-widget-item__meta,
  .price-widget-item_rtl .price-widget-item__values {
    padding-right: 0;
    padding-left: 12px;
  }
}
</style>
