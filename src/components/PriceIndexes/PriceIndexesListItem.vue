<template>
  <NuxtLink
    :class="[
      symbol && `price-index-item_coin_${symbol}`,
      currency && `price-index-item_currency_${currency}`,
      language && `price-index-item_language_${language}`,
    ]"
    :to="url"
    class="price-index-item price-indexes-list__item"
  >
    <div class="price-index-item__col price-index-item__col_icon">
      <client-only>
        <IconCoin :svg="symbolSvg" />
      </client-only>
    </div>
    <div class="price-index-item__col price-index-item__col_title">
      <h2 class="price-index-item__name">
        {{ symbolName }}
      </h2>
      <span class="price-index-item__currency"> {{ symbol }}/{{ currency }} </span>
    </div>
    <div class="price-index-item__col price-index-item__col_digits">
      <h3 class="price-index-item__price">
        <span>{{ currencySign }}</span
        >{{ price }}
      </h3>
      <span
        :class="[
          changePercent.includes('-') && 'price-index-item__percent_red',
          changePercent.includes('+') && 'price-index-item__percent_green',
        ]"
        class="price-index-item__percent"
      >
        {{ changePercent }}
      </span>
    </div>
    <div
      :class="{
        'price-index-item__col_loading': !chartReady,
        'price-index-item__col_chart': chartReady,
      }"
      class="price-index-item__col"
    >
      <span
        :class="{ 'price-index-item__spinner_hidden': chartReady }"
        class="price-index-item__spinner ct-icon ct-icon_loading-spinner-circle"
      />
      <span
        ref="chart"
        :class="{ 'price-index-item__chart_visible': chartReady }"
        class="price-index-item__chart"
        v-html="ssrChartsGraphic"
      />
    </div>
  </NuxtLink>
</template>

<script>
import IconCoin from '../Icons/Coins/IconCoin';

export default {
  name: 'PriceIndexesListItem',
  components: {
    IconCoin,
  },
  props: {
    currency: {
      type: String,
      required: true,
    },
    currencySign: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
    },
    symbolName: {
      type: String,
      required: true,
    },
    symbolSvg: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    changePercent: {
      type: String,
      required: true,
    },
    ssrChartsGraphic: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      chartReady: !!this.ssrChartsGraphic.length,
    };
  },
  computed: {
    iconName() {
      const { symbol } = this;
      return symbol ? `IconCoin${symbol.charAt(0).toUpperCase() + symbol.toLowerCase().slice(1)}` : '';
    },
    isComponentExist() {
      const { iconName } = this;
      return Object.keys(this.$options.components).includes(iconName);
    },
  },
  watch: {
    ssrChartsGraphic(ssrChartsGraphic) {
      this.chartReady = !!ssrChartsGraphic.length;
    },
  },
};
</script>

<style scoped lang="scss">
@import '~/assets/styles/_vars.scss';

.price-index-item {
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  border-radius: 2px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 10px;
  position: relative;
  justify-content: space-between;
}
.price-index-item:link,
.price-index-item:visited,
.price-index-item:focus {
  text-decoration: none;
}
.price-index-item:active {
  text-decoration: none;
}
.price-index-item:hover {
  text-decoration: none;
}
.price-index-item__col {
  flex-grow: 2;
}
.price-index-item__col_icon {
  display: flex;
  align-items: center;
  flex-grow: 0;
  margin-right: 5%;
}
.price-index-item__col_title {
  width: 20%;
  line-height: 1;
}
.price-index-item__col_digits {
  margin-right: 5%;
  text-align: right;
  line-height: 1;
}
.price-index-item__col_loading {
  position: relative;
  display: flex;
  max-width: 153px;
  width: 28%;
  flex-grow: 0;
  margin-top: -10px;
  margin-bottom: -10px;
  margin-right: -10px;
}
.price-index-item__col_chart {
  margin-top: -10px;
  margin-bottom: -10px;
  margin-right: -10px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  flex-grow: 0;
  align-self: center;
  justify-self: flex-end;
  width: 28%;
  max-width: 153px;
}
.price-index-item__icon {
  //color: #ffc200;
  font-size: 24px;
  width: 24px;
  display: block;
  object-fit: contain;
}
.price-index-item__name {
  color: #324149;
  font-weight: 700;
  font-size: 14px;
  line-height: 1;
  margin-top: 0;
  padding-bottom: 3px;
  margin-bottom: 0;
  text-overflow: ellipsis;
  overflow: hidden;
}
.price-index-item__currency {
  color: #324149;
  font-size: 12px;
  font-weight: 300;
  text-transform: uppercase;
}
.price-index-item__price {
  color: #324149;
  font-size: 16px;
  font-weight: 700;
  text-align: right;
  line-height: 1;
  margin-top: 0;
  margin-bottom: 0;
}
.price-index-item__price span {
  font-size: 12px;
}
.price-index-item__percent {
  font-size: 12px;
  font-weight: 700;
  text-align: right;
  line-height: 1;
  direction: ltr;
  display: inline-block;
  color: #000;
}
.price-index-item__percent_red {
  color: #ff4a68;
}
.price-index-item__percent_green {
  color: #3abc98;
}
.price-index-item__chart {
  height: 41px;
  width: 100%;
  opacity: 0;
  transition: opacity 0.6s;
}
.price-index-item__chart svg g[aria-labelledby*='-title'] {
  display: none;
}
.price-index-item__chart a[href*='amcharts'] {
  display: none !important;
}
.price-index-item__chart_visible {
  opacity: 1;
}
.price-index-item__spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: opacity 0.6s;
}
.price-index-item__spinner::before {
  font-size: 16px;
  color: #ffc200;
  display: inline-block;
  animation: chart-loader-spin 1s linear infinite;
}
.price-index-item__spinner_hidden {
  opacity: 0;
}
.price-index-item__spinner_hidden::before {
  content: none;
}
.price-index-item_language_ar .price-index-item__col_digits {
  text-align: left;
  margin-right: auto;
  margin-left: 10%;
}
.price-index-item_language_ar .price-index-item__col_chart,
.price-index-item_language_ar .price-index-item__col_loading {
  margin-right: auto;
  margin-left: -10px;
}
.price-index-item_language_ar .price-index-item__col_icon {
  margin-right: auto;
  margin-left: 5%;
}
.price-index-item_language_ar .price-index-item__price {
  text-align: left;
}
.price-index-item_currency_jpy .price-index-item__price,
.price-index-item_currency_rur .price-index-item__price {
  font-size: 15px;
}

@media (min-width: 480px) {
  .price-index-item {
    padding: 16px;
  }
  .price-index-item__col_digits {
    margin-right: 15%;
  }
  .price-index-item__col_loading {
    margin-bottom: -15px;
    margin-right: -15px;
    margin-top: -15px;
  }
  .price-index-item__col_chart {
    margin-top: -15px;
    margin-bottom: -15px;
    margin-right: -15px;
  }
  .price-index-item_language_ar {
    padding: 15px 30px 15px 15px;
  }
  .price-index-item_language_ar .price-index-item__col_digits {
    margin-left: 16%;
    margin-right: auto;
  }
  .price-index-item_language_ar .price-index-item__col_chart,
  .price-index-item_language_ar .price-index-item__col_loading {
    margin-right: auto;
    margin-left: -15px;
  }
}
@media (min-width: $sm) {
  .price-index-item__col_icon {
    margin-right: 28px;
  }
  .price-index-item__col_digits {
    display: flex;
    align-items: center;
    width: 30%;
    margin-right: 0;
  }
  .price-index-item__col_loading {
    width: 100%;
  }
  .price-index-item__col_chart {
    width: 100%;
  }
  .price-index-item__icon {
    font-size: 42px;
    width: 42px;
  }
  .price-index-item__name {
    font-size: 26px;
  }
  .price-index-item__currency {
    font-size: 16px;
  }
  .price-index-item__price {
    font-size: 26px;
    width: 65%;
  }
  .price-index-item__price span {
    font-size: 18px;
  }
  .price-index-item__percent {
    font-size: 16px;
    margin-left: 5%;
    margin-right: 5%;
    text-align: left;
    box-sizing: border-box;
    direction: ltr;
  }
  .price-index-item__chart {
    height: 60px;
  }
  .price-index-item__spinner::before {
    font-size: 22px;
  }
  .price-index-item_language_ar .price-index-item__col_digits {
    margin-left: auto;
  }
  .price-index-item_language_ar .price-index-item__col_icon {
    margin-right: auto;
    margin-left: 30px;
  }
  .price-index-item_currency_jpy .price-index-item__price,
  .price-index-item_currency_rur .price-index-item__price {
    font-size: 26px;
  }
}
@media (min-width: $md) {
  .price-index-item__col_title {
    width: 24%;
  }
  .price-index-item__col_digits {
    width: 40%;
  }
  .price-index-item__price {
    font-size: 22px;
  }
  .price-index-item_currency_jpy .price-index-item__price,
  .price-index-item_currency_rur .price-index-item__price {
    font-size: 22px;
  }
}
@media (min-width: $lg) {
  .price-index-item__col_title {
    width: 30%;
    line-height: 1.2;
  }
  .price-index-item__col_digits {
    width: 60%;
    line-height: 1.2;
  }
  .price-index-item__price {
    font-weight: 800;
    font-size: 32px;
  }
  .price-index-item__price span {
    font-size: 24px;
  }
  .price-index-item_currency_jpy .price-index-item__price,
  .price-index-item_currency_rur .price-index-item__price {
    font-size: 28px;
  }
}
</style>
