<template>
  <AdSlot
    :place="place"
    :config="{
      closable: true,
      textBannerBordered: true,
      postSlug: postSlug,
    }"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { AdSlot } from '~/features/ads';
import { useDeviceInfo } from '~/lib/device-detector';

defineProps({
  postSlug: {
    type: String,
    required: true,
  },
});

const deviceInfo = useDeviceInfo();

const place = computed(() =>
  deviceInfo.desktop ? 'in_article_after_30_percents_desktop' : 'in_article_after_30_percents_mobile'
);
</script>

<style module lang="scss"></style>
