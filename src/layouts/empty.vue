<template>
  <main>
    <Nuxt :name="namedView" />
  </main>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRoute } from '~/lib/framework';
import { NAMED_VIEWS } from '~/app.config';
import { useFeatureManager } from '~/lib/feature-manager';

export default defineComponent({
  name: 'EmptyLayout',
  setup() {
    const route = useRoute();
    const featureManager = useFeatureManager();
    const isAsia = featureManager.isEnabled('asia_mobile_layout');
    const namedView = computed(() => {
      const currentPath = route.value.path;
      const paths = ['/category/flash-news', '/category/politics'];

      if (isAsia && paths.includes(currentPath)) {
        return NAMED_VIEWS.flashNews;
      }
      return NAMED_VIEWS.default;
    });

    return {
      namedView,
    };
  },
});
</script>

<style scoped></style>
