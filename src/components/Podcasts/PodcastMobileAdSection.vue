<template>
  <div>
    <AdSlot
      :class="$style['banner-margin']"
      place="mobile_podcasts_youtube"
      data-testid="podcast-mobile-banner-youtube"
    />

    <AdSlot
      v-for="index in STACK_SIZE"
      :key="index"
      :class="$style['banner-margin']"
      :index="index - 1"
      :config="{ closable: true }"
      place="mobile_podcasts_square_banner"
      data-testid="podcast-mobile-banner"
    />

    <AdSlot
      place="mobile_podcasts_promo_button_stack"
      :class="$style['promo-buttons-stack']"
      :config="{
        promoButtonFullWidth: true,
        promoButtonStackTransparentBackground: true,
      }"
      data-testid="podcast-mobile-promo-buttons-stack"
    />
  </div>
</template>

<script setup lang="ts">
import { AdSlot } from '~/features/ads';

/**
 * Square banner count in stack
 */
const STACK_SIZE = 3;
</script>

<style module lang="scss">
.banner-margin {
  margin-bottom: 32px;
}

.promo-buttons-stack {
  background: transparent;
  box-shadow: none;
  padding: 12px 0;
}
</style>
