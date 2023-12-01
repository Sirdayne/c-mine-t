<template>
  <Story title="OptimizedImage">
    <OptimizedImage
      :src="src"
      :width="width"
      :height="height"
    />
  </Story>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import OptimizedImage from './OptimizedImage.vue';

export default defineComponent({
  components: {
    OptimizedImage,
  },
  setup() {
    const src = ref('https://s3.cointelegraph.com/storage/uploads/view/b047f51d2b432d557098db927fc5dc48.png');
    const width = ref(300);
    const height = ref(300);

    return {
      src,
      width,
      height,
    };
  },
});
</script>
