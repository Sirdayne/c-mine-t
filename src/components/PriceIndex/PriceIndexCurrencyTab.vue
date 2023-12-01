<template>
  <div v-show="isVisible">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'PriceIndexCurrencyTab',
  props: {
    tabCurrency: {
      type: String,
      default: '',
    },
    selectedCurrency: {
      type: String,
      default: 'USD',
    },
  },
  computed: {
    isVisible() {
      return this.tabCurrency === this.selectedCurrency;
    },
  },
  methods: {
    selectHandler(currencyLabel) {
      this.$emit('change-currency', currencyLabel);
    },
  },
};
</script>
