<template>
  <div
    class="currency-selector"
    :class="[isRtl && 'currency-selector_rtl']"
    tabindex="-1"
    data-e2e="currency-selector"
  >
    <ul class="currency-selector__list">
      <li
        v-for="item in currencies"
        :key="item.id"
        class="currency-selector__item"
      >
        <button
          class="btn currency-selector__btn"
          :disabled="item.name === currencySign"
          :data-gtm-locator="`header_cliсkon_currency_arrow_${item.name.toLowerCase()}`"
          @click="handleCurrencySelect(item.name)"
        >
          <span class="btn__wrp currency-selector__btn-wrp">
            <span class="btn__cap">
              {{ item.name }}
            </span>
            <span class="currency-selector__btn-value">
              {{ item.value }}
            </span>
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import createFocusTrap from 'focus-trap';
import { mapState, mapGetters, mapActions } from 'vuex';
import { ROOT, SETTINGS, TICKERS } from '~/store/types';

export default {
  name: 'CurrencySelector',
  computed: {
    ...mapState('tickers', {
      currencies: ({ currencies }) => currencies,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
    ...mapGetters('tickers', {
      currencySign: TICKERS.SIGN,
    }),
  },
  mounted() {
    this.focusTrap = null;
    this.initTrap();
  },
  beforeDestroy() {
    if (this.focusTrap) {
      this.focusTrap.deactivate();
    }
    this.focusTrap = null;
  },
  methods: {
    ...mapActions('tickers', {
      setCurrency: TICKERS.SET_CURRENCY,
    }),
    ...mapActions('settings', {
      setDefaultCurrency: SETTINGS.SET_CURRENCY_SELECTED,
    }),
    handleCurrencySelect(name) {
      this.setCurrency(name);
      this.setDefaultCurrency(name);
      this.handleHide();
    },
    handleHide() {
      this.$emit('on-hide');
    },
    initTrap() {
      this.focusTrap = createFocusTrap(this.$el, {
        initialFocus: this.$el,
        returnFocusOnDeactivate: false,
        clickOutsideDeactivates: true,
        onDeactivate: this.handleHide,
      });
      this.focusTrap.activate();
    },
  },
};
</script>

<style scoped lang="scss">
@import '~/assets/styles/_vars.scss';

.currency-selector {
  outline: none;
  z-index: 99;
}
.currency-selector__list {
  margin: 0;
  padding: 0;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
  list-style: none;
  backface-visibility: hidden;
}
.currency-selector__item {
  padding: 0;
  margin: 0;
}
.currency-selector__btn {
  display: block;
  width: 100%;
  padding: 12px 15px;
  text-align: inherit;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
  letter-spacing: 0;
  color: #273036;
  background-color: #f0f3f4;
  transition: background-color 0.15s, color 0.15s;
}
.currency-selector__btn:hover {
  color: #ffffff;
  background-color: #5e6d74;
}
.currency-selector__btn:disabled {
  color: #ffffff;
  background-color: #465a65;
  opacity: 1;
  cursor: default;
}
.currency-selector__item:first-child .currency-selector__btn {
  border-radius: 2px 2px 0 0;
}
.currency-selector__item:last-child .currency-selector__btn {
  border-radius: 0 0 2px 2px;
}
.currency-selector__btn-wrp {
  justify-content: flex-start;
}
.currency-selector__btn-value {
  margin-left: auto;
  font-weight: 600;
  letter-spacing: -0.02em;
}
.currency-selector_rtl {
  direction: rtl;
}
.currency-selector_rtl .currency-selector__btn-value {
  margin-left: 0;
  margin-right: auto;
}
</style>
