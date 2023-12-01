<template>
  <AdSlot
    place="in_mobile_header"
    class="in-mobile-header-banner"
  >
    <span class="in-mobile-header-banner__badge">Ad</span>
  </AdSlot>
</template>

<script setup lang="ts">
import { AdSlot } from '~/features/ads';
</script>

<style scoped lang="scss">
.in-mobile-header-banner {
  max-width: 100px;
  width: 100%;
  height: 25px;
  display: flex;

  &__badge {
    margin-left: 6px;
    font-weight: 400;
    font-size: 8px;
    line-height: 100%;
    color: #c8d0d3;
  }
}
</style>
