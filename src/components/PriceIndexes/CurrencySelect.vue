<template>
  <div
    ref="currencySelect"
    :class="[
      theme && `currency-select_theme_${theme}`,
      isOpen && 'currency-select_open',
      isRtl && 'currency-select_rtl',
    ]"
    class="currency-select"
  >
    <div class="currency-select__wrap">
      <div
        class="currency-select__current"
        @click.stop="toggleDropdown"
      >
        <svg
          class="currency-select__current-icon"
          xmlns="http://www.w3.org/2000/svg"
          height="100%"
          version="1.1"
          viewBox="0 0 512 512"
          width="100%"
        >
          <path
            d="M471.33 126.78A20.32 20.32 0 1 1 500 155.53L270.37 385.19a20.3 20.3 0 0 1-28.71 0L12 155.53a20.31 20.31 0 0 1 28.7-28.75L256 342.15z"
            fill="#fff"
          />
        </svg>
        <span class="currency-select__current-label">
          {{ currency }}
        </span>
      </div>
      <Transition name="vue-slide-down">
        <div
          v-if="isOpen"
          class="currency-select__list"
        >
          <template v-for="item in currencies">
            <div
              :key="item.id"
              class="currency-select__list-item"
              @click.stop="toggleCurrency(item.name)"
            >
              <span class="currency-select__currency">
                {{ item.name }}
              </span>
              <span class="currency-select__value">
                {{ item.value }}
              </span>
            </div>
          </template>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { ROOT, SETTINGS, TICKERS } from '~/store/types';

export default {
  name: 'CurrencySelect',
  props: {
    language: {
      type: String,
      default: 'en',
    },
    currency: {
      type: String,
      default: 'USD',
    },
    theme: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    isOpen: false,
  }),
  computed: {
    ...mapState('tickers', {
      currencies: ({ currencies }) => currencies,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
  },
  methods: {
    ...mapActions('tickers', {
      setCurrency: TICKERS.SET_CURRENCY,
    }),
    ...mapActions('settings', {
      setDefaultCurrency: SETTINGS.SET_CURRENCY_SELECTED,
    }),
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    toggleCurrency(currency) {
      this.setCurrency(currency);
      this.setDefaultCurrency(currency);
      this.toggleDropdown();
    },
  },
};
</script>

<style scoped lang="scss">
.currency-select__wrap {
  position: relative;
}
.currency-select__current {
  border-radius: 2px;
  background-color: #465a65;
  color: #fafafa;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  box-sizing: border-box;
  line-height: 1;
  display: flex;
  align-items: center;
  max-width: 77px;
  padding: 10px 10px 10px 12px;
  transition: background-color 0.3s;
  cursor: pointer;
  margin-left: auto;
  position: relative;
  user-select: none;
  height: 40px;
}
.currency-select__current:hover,
.currency-select_open .currency-select__current {
  background-color: #324149;
}
.currency-select__current-icon {
  margin-top: 1px;
  color: #eceff1;
  width: 13px;
  display: block;
  flex-shrink: 0;
  transition: transform 0.3s, color 0.3s;
}
.currency-select_open .currency-select__current-icon {
  transform: rotate(180deg);
}
.currency-select_open .currency-select__current-icon,
.currency-select__current:hover .currency-select__current-icon {
  color: #ffffff;
}
.currency-select__current-label {
  margin-left: 11px;
}
.currency-select_theme_jp .currency-select__current {
  padding: 10px 24px 10px 10px;
  line-height: 1;
  color: #9ea3a6;
  font-size: 16px;
  cursor: pointer;
  background-color: transparent;
}
.currency-select_theme_jp .currency-select__current-label {
  margin-left: 0;
  font-weight: 400;
}
.currency-select_theme_jp .currency-select__current::before {
  content: '';
  position: absolute;
  display: block;
  border: 4px solid transparent;
  border-top: 4px solid #9ea3a6;
  top: calc(50% - 2px);
  right: 8px;
  transition: transform 0.3s ease-out;
  transform-origin: 4px 2px;
}
.currency-select_theme_jp.currency-select_open .currency-select__current::before {
  transform: rotate(180deg);
}
.currency-select__list {
  width: 150px;
  background-color: #eceff1;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  position: absolute;
  z-index: 5;
  right: 0;
  top: 106%;
}
.currency-select__list-item {
  box-sizing: border-box;
  padding: 12px 16px;
  background-color: #eceff1;
  transition: background-color 0.3s;
  cursor: pointer;
  color: #465a65;
  overflow: hidden;
  display: flex;
  font-size: 12px;
  justify-content: space-between;
  user-select: none;
  margin: 0 !important;
}
.currency-select__list-item:hover {
  color: #465a65;
  background-color: #afbdc4;
}
.currency-select__list-item:first-child {
  border-radius: 2px 2px 0 0;
}
.currency-select__list-item:last-child {
  border-radius: 0 0 2px 2px;
}
.currency-select__currency,
.currency-select__value {
  line-height: 1;
}
.currency-select__currency {
  font-weight: 400;
  text-transform: uppercase;
}
.currency-select__value {
  font-weight: 700;
}
.currency-select_rtl .currency-select__current {
  padding-left: 10px;
  padding-right: 12px;
}
.currency-select_rtl .currency-select__current-label {
  margin-left: 0;
  margin-right: 11px;
}
.currency-select_rtl .currency-select__list {
  right: auto;
  left: 0;
}
@media (min-width: 768px) {
  .currency-select__current {
    font-size: 14px;
  }
}
</style>
