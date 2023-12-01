<script setup lang="ts">
import { useStore } from '~/lib/framework';
import { computed } from 'vue';
import { TICKERS } from '~/store/types';
import CtTickerBanner from '~/lib/ui/ct-ticker-banner/CtTickerBanner.vue';

const store = useStore();
const languageShort = computed(() => store.state.currentLanguage.short);
const coins = computed(() => store.getters[`tickers/${TICKERS.DESKTOP_COINS_BY_CURRENCY}`]);
const currencySign = computed(() => store.getters[`tickers/${TICKERS.SIGN}`]);
</script>

<template>
  <CtTickerBanner
    :coins="coins"
    :sign="currencySign"
    :language-short="languageShort"
  />
</template>
