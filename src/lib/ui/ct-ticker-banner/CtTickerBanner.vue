<script setup lang="ts">
import CtTicker from '../ct-ticker/CtTicker.vue';
import { Coin } from '../coin/Coin';

defineProps<{
  coins: Coin[];
  languageShort: string;
  sign: string;
}>();
</script>

<template>
  <div>
    <div class="flex flex-row">
      <CtTicker
        v-for="coin in coins"
        :key="coin.id"
        :coin="coin"
        language-short="languageShort"
        :sign="sign"
        class="border-r-default ltr:last:border-r-0 rtl:first:border-r-0 border-border-onDarkForced"
      />
    </div>
  </div>
</template>
