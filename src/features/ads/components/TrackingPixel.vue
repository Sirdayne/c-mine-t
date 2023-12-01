<template>
  <img
    :src="trackingPixelUrl"
    :class="$style['tracking-pixel']"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TrackingPixel',

  props: {
    trackingPixelUrl: {
      type: String,
      required: true,
    },
  },
});
</script>

<style module lang="scss">
.tracking-pixel {
  position: absolute;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
}
</style>
