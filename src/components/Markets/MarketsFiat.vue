<template>
  <div
    class="markets-fiat"
    :class="[listIsVisible && 'markets-fiat_active', isRtl && 'markets-fiat_rtl']"
  >
    <div
      class="markets-fiat__current"
      data-gtm-locator="markets_markets_news_clickon_currencieslist"
      @click.capture.stop="toggleList"
    >
      {{ currency }}
    </div>
    <div class="markets-fiat__list">
      <div
        v-for="item in currencies"
        :key="item.id"
        class="markets-fiat__item"
        :class="currency === item.name && 'markets-fiat__item_selected'"
        :data-gtm-locator="`markets_markets_news_clickon_currencieslist_${item.name}`"
        @click="() => selectCurrency(item.name)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ROOT } from '~/store/types';

export default {
  name: 'MarketsFiat',
  props: {
    currencies: {
      type: Array,
      default: () => [],
    },
    currency: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      listIsVisible: false,
    };
  },
  computed: {
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
  },
  mounted() {
    this.bindOutsideClick();
  },
  beforeDestroy() {
    this.unbindOutsideClick();
  },
  methods: {
    selectCurrency(payload) {
      this.hideList();
      this.$emit('select-currency', payload);
    },
    hideList() {
      this.listIsVisible = false;
    },
    toggleList() {
      this.listIsVisible = !this.listIsVisible;
    },
    bindOutsideClick() {
      document.addEventListener('click', this.handleOutsideClick);
    },
    unbindOutsideClick() {
      document.removeEventListener('click', this.handleOutsideClick);
    },
    handleOutsideClick() {
      this.hideList();
    },
  },
};
</script>

<style scoped lang="scss">
.markets-fiat {
  display: block;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.16);
  border-radius: 2px;
  border: 1px solid #fabf2c;
  background-color: #ffffff;
  transition: box-shadow 0.15s linear;
}
.markets-fiat_active {
  box-shadow: 0 2px 4px 2px rgba(0, 0, 0, 0.1);
}
.markets-fiat_rtl {
  right: auto;
  left: 0;
}
.markets-fiat__current {
  display: flex;
  position: relative;
  align-items: center;
  min-width: 80px;
  height: 40px;
  font-weight: 600;
  color: #253137;
  padding: 0 16px;
  box-sizing: border-box;
  cursor: pointer;
}
.markets-fiat__current:after {
  content: '';
  position: absolute;
  right: 16px;
  top: 16px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 9px 4px 0 4px;
  border-color: #253137 transparent transparent transparent;
}
.markets-fiat_active .markets-fiat__current:after {
  transform: scale(-1, -1);
}
.markets-fiat_rtl .markets-fiat__current {
  padding: 0 10px;
}
.markets-fiat_rtl .markets-fiat__current:after {
  right: auto;
  left: 16px;
}
.markets-fiat__list {
  display: none;
  min-width: 100%;
}
.markets-fiat_active .markets-fiat__list {
  display: block;
}
.markets-fiat__item {
  background-color: #fff;
  padding: 5px 10px 5px 15px;
  font-size: 16px;
  line-height: 25px;
  transition: background-color 0.15s linear;
  cursor: pointer;
}
.markets-fiat__item_selected {
  font-weight: 600;
}
.markets-fiat__item:hover {
  background-color: #eee;
}
</style>
