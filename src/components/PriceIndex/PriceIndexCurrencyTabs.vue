<template>
  <div
    class="price-index-currency-tabs"
    :class="[isRtl && 'price-index-currency-tabs_rtl', 'price-index-currency-tabs_has-button']"
  >
    <div class="tabContainer">
      <div class="tabLinksCointainer price-index-currency-tabs__tabs">
        <a
          v-for="(currency, index) in currencies"
          :id="`tabElem${currency.name}Summary`"
          :key="index"
          class="tablinks"
          :class="{ active: isActive(currency.name) }"
          :data-gtm-locator="`markets_priceindex_currencyticker_clikon_${currency.name}`"
          @click="selectHandler(currency.name)"
        >
          <div class="tabLinksCointainer__title">
            {{ currency.name }}
          </div>
        </a>
      </div>
      <AdSlot
        v-if="withAdSlot"
        class="price-index-currency-tabs__button"
        :place="adSlotPlace"
      />
      <div
        v-else
        class="price-index-logo"
      >
        <img src="/assets/img/w-logo.svg" />
      </div>
    </div>
    <slot />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { ROOT } from '~/store/types';
import { AdSlot } from '~/features/ads';

export default {
  name: 'PriceIndexCurrencyTabs',
  components: {
    AdSlot,
  },
  props: {
    withAdSlot: {
      type: Boolean,
      required: true,
    },
    selectedCurrency: {
      type: String,
      default: 'USD',
    },
  },
  computed: {
    ...mapState('tickers', {
      currencies: ({ currencies }) => currencies,
    }),
    ...mapState({
      i18n: ({ i18n }) => i18n,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
    ...mapState('viewport', {
      isMobile: ({ userDeviceType: { phone } }) => phone,
    }),
    adSlotPlace() {
      return this.isMobile ? 'promo_button_price_index_overview_mobile' : 'promo_button_price_index_overview_desktop';
    },
  },
  methods: {
    isActive(currencyLabel) {
      return currencyLabel === this.selectedCurrency;
    },
    selectHandler(currencyLabel) {
      this.$emit('change-currency', currencyLabel);
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.price-index-logo {
  max-width: 170px;

  img {
    width: 100%;
  }

  @media (min-width: $md) {
    float: right;
  }
}

.price-index-currency-tabs__button {
  display: none !important;
  width: 230px;
}
@media (min-width: $sm) {
  .price-index-currency-tabs_rtl .price-index-currency-tabs__tabs {
    margin-left: 15px;
  }
}
@media (min-width: $md) {
  .price-index-currency-tabs .tabContainer {
    display: flex !important;
    justify-content: space-between;
    overflow: initial !important;
  }
  .price-index-currency-tabs_has-button .price-index-logo {
    display: none;
  }
  .price-index-currency-tabs__button {
    display: block !important;
  }
}
@media (min-width: $md) and (max-width: $lg) {
  .price-index-currency-tabs__button .promo-button-link {
    font-size: 0.64rem;
  }
}
@media (min-width: $lg) {
  .price-index-currency-tabs__button {
    width: 335px;
  }
  .price-index-currency-tabs__button .promo-button-link {
    font-size: 0.9rem;
  }
}
</style>
