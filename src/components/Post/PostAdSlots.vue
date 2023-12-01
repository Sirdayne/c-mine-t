<!-- ad slots to be inserted after article -->
<template>
  <div>
    <AdSlot
      v-if="youtubeVisible"
      place="article_mobile_youtube"
      class="post-page__youtube-block"
    />

    <AdSlot
      v-if="squareVisible"
      :config="{ closable: true }"
      place="article_mobile"
      data-e2e="article_mobile_adbutler"
      :class="$style['ad-slot']"
    />

    <AdSlot
      v-if="promoButtonStackVisible"
      place="promo_button_stack_article_mobile"
      data-e2e="article_mobile_adbutler"
      class="post-page__banner-promo-button"
    />

    <AdSlot
      v-if="deviceInfo.desktop"
      :config="{ closable: true }"
      place="article"
      date-e2e="article_desktop_adbutler"
      :class="$style['ad-slot']"
    />
  </div>
</template>

<script setup lang="ts">
import { AdSlot } from '~/features/ads';
import { useDeviceInfo } from '~/lib/device-detector';
import { computed, unref } from 'vue';

const props = defineProps({
  /**
   * needed to detect which ad slot should be enabled
   */
  postIndex: {
    type: Number,
    required: true,
  },
});

const deviceInfo = useDeviceInfo();
const mobileOrTablet = computed(() => deviceInfo.mobile || deviceInfo.tablet);
const youtubeVisible = computed(() => unref(mobileOrTablet) && props.postIndex === 0);
const squareVisible = computed(() => unref(mobileOrTablet) && props.postIndex % 2 === 0);
const promoButtonStackVisible = computed(() => unref(mobileOrTablet) && props.postIndex % 2 === 1);
</script>

<style module lang="scss">
.ad-slot {
  margin-top: 16px;
}
</style>
