<template>
  <component
    :is="iconName"
    v-if="isComponentExist"
  />
</template>

<script>
export default {
  name: 'CoinIcon',
  props: {
    symbol: {
      type: String,
      default: 'BTC',
    },
  },
  computed: {
    iconName() {
      const { symbol } = this;
      // example: BNB => IconCoinBnb
      return symbol ? `IconCoin${symbol.charAt(0).toUpperCase() + symbol.toLowerCase().slice(1)}` : '';
    },
    isComponentExist() {
      const { iconName } = this;
      return Object.keys(this.$options.components).includes(iconName);
    },
  },
};
</script>

<style></style>
