<!-- image with redirect -->
<template>
  <AdblockSafeLink
    :class="$style['link']"
    :url="redirectUrl"
  >
    <img
      :src="imageUrl"
      :class="{
        [$style['image']]: true,
        'rounded-containerM': isHeaderBanner,
      }"
    />
  </AdblockSafeLink>
</template>

<script setup lang="ts">
import AdblockSafeLink from './AdblockSafeLink.vue';
import { computed } from 'vue';

const props = defineProps({
  imageUrl: {
    type: String,
    required: true,
  },

  redirectUrl: {
    type: String,
    required: true,
  },

  place: {
    type: String,
    default: '',
  },
});

const isHeaderBanner = computed(() => {
  return (
    props.place === 'billboard' ||
    props.place === 'billboard_mobile' ||
    props.place === 'leaderboard' ||
    props.place === 'leaderboard_mobile'
  );
});
</script>

<style module lang="scss">
// images are blocks that fills parent
.image {
  max-width: 100%;
  max-height: 100%;
  display: block;
  vertical-align: middle;
  width: 100%;
}
</style>
