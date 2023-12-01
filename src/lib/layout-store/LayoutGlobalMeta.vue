<script lang="ts">
import { useMeta, defineComponent } from '~/lib/framework';
import { useLayoutUiStore } from './vue';

export default defineComponent({
  setup() {
    const layoutUiStore = useLayoutUiStore();

    useMeta(() => {
      return {
        bodyAttrs: {
          'data-layout-header-variant': layoutUiStore.getHeaderVariant(),
        },
      };
    });
  },
  head: {},
});
</script>

<template>
  <span />
</template>
