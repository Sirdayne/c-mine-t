<template>
  <div class="container">
    <AdSlot
      v-if="isEn && deviceInfo.mobile"
      place="billboard_mobile"
      :config="{ aspectRatio: BILLBOARD_ASPECT_RATIO, closable: true }"
      :class="$style['billboard']"
    />

    <AdSlot
      v-else-if="deviceInfo.mobile"
      place="leaderboard_mobile"
      :config="{ aspectRatio: LEADERBOARD_MOBILE_ASPECT_RATIO, closable: true }"
    />

    <AdSlot
      v-else
      place="leaderboard"
      :config="{ aspectRatio: LEADERBOARD_ASPECT_RATIO, closable: true }"
      :class="$style['leaderboard']"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '~/lib/framework';
import { ROOT } from '~/store/types';
import { useDeviceInfo } from '~/lib/device-detector';
import { AdSlot } from '~/features/ads';

const BILLBOARD_ASPECT_RATIO = 500 / 780;
const LEADERBOARD_MOBILE_ASPECT_RATIO = 300 / 1920;
const LEADERBOARD_ASPECT_RATIO = 130 / 2320;

const store = useStore();
const isEn = computed(() => store.getters[ROOT.IS_EN]);
const deviceInfo = useDeviceInfo();
</script>

<style module lang="scss">
.billboard {
  margin-top: 10px;
}

.leaderboard {
  margin-top: 16px;
}
</style>
