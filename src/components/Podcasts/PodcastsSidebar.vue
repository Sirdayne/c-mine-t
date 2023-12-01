<template>
  <ClientOnly v-if="showSidebar">
    <div :class="$style['podcast-sidebar']">
      <Sidebar
        :with-editor-choice="false"
        data-testid="podcast-sidebar"
      />
    </div>
  </ClientOnly>
</template>

<script lang="ts">
import { defineComponent } from '~/lib/framework';
import { computed } from 'vue';
import { useDeviceInfo } from '~/lib/device-detector';

export default defineComponent({
  name: 'PodcastsSidebar',
  components: {
    Sidebar: () => import('~/components/Sidebar/Sidebar.vue'),
  },
  setup() {
    const deviceInfo = useDeviceInfo();
    const showSidebar = computed(() => deviceInfo.desktop);

    return {
      showSidebar,
    };
  },
});
</script>
<style module lang="scss">
@import '~/assets/styles/_vars.scss';
.podcast-sidebar {
  padding: 0;
  box-sizing: border-box;
  scroll-behavior: smooth;
  height: 100%;
  position: relative;
  @media (min-width: $sm) {
    display: none;
  }

  @media (min-width: $md) {
    display: block;
    padding: 0;
  }
}
.podcast-sidebar .promo-button {
  max-width: unset;
}
</style>
