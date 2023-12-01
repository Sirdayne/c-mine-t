<template>
  <div class="ceros-embed">
    <iframe
      :key="src"
      :src="src"
      allowfullscreen
      frameborder="0"
      class="ceros-experience ceros-embed__iframe"
      scrolling="no"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useExternalScript } from '~/assets/libs/ExternalScriptManager/useExternalScript';

export default defineComponent({
  name: 'CerosEmbed',

  props: {
    /**
     * url to ceros iframe
     * @example "//view.ceros.com/bla-blah"
     */
    src: {
      type: String,
      required: true,
    },

    // ceros aspect ratio for desktop
    aspectRatio: {
      type: String,
      required: true,
    },

    // ceros aspect ratio for mobile
    mobileAspectRatio: {
      type: String,
      required: true,
    },
  },

  setup() {
    useExternalScript('https://cointelegraph.com/ceros/scroll-proxy.min.js');
  },
});
</script>

<style scoped lang="scss">
@import '~/assets/styles/_vars.scss';
@import '~/assets/styles/_mixins.scss';

.ceros-embed {
  @include aspect-ratio-box(v-bind(mobileAspectRatio));

  position: relative;
  width: auto;
  height: 0;

  &__iframe {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: 0;
    padding: 0;
    border: 0 none;
    height: 1px;
    width: 1px;
    min-height: 100%;
    min-width: 100%;
  }

  @media (min-width: $sm) {
    @include aspect-ratio-box($aspectRatio: v-bind(aspectRatio));
  }
}
</style>
