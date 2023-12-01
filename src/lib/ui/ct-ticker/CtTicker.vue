<script setup lang="ts">
import { Coin } from '../coin/Coin';

defineProps<{
  languageShort: string;
  coin: Coin;
  sign: string;
}>();
</script>

<template>
  <NuxtLink
    class="flex flex-col cursor-pointer md:px-2 lg:px-5 group w-min"
    :to="coin.url"
    :language-short="languageShort"
    :data-gtm-locator="`header_cliсkon_tiker_${coin.name.toLowerCase()}`"
    data-testid="tickers-desktop-link"
  >
    <span
      class="text-fg-primaryDefault text-uiSWeak lg:text-uiMWeak group-hover:underline"
      data-e2e="name"
    >
      {{ coin.name }}
    </span>
    <span
      class="text-fg-inverted text-uiSDefault lg:text-uiMDefault"
      data-e2e="price"
      data-testid="tickers-price"
    >
      {{ sign }}{{ coin.valueAltDesktop }}
    </span>
    <span
      class="text-uiSWeak"
      :class="{
        'text-success-default': coin.isUp,
        'text-error-default': coin.isDown,
        'text-fg-inverted': !coin.isUp && !coin.isDown,
      }"
      data-e2e="change"
    >
      {{ coin.changePercentage }}
    </span>
  </NuxtLink>
</template>
