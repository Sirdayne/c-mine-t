<script setup lang="ts">
import { computed } from 'vue';
import { useOptimizedImageUrl } from './useOptimizedImageUrl';

const parseSize = (input: string | number): number =>
  typeof input === 'number' ? Math.floor(input) : parseInt(input, 10);

const props = defineProps<{
  src: string;
  width: number | string;
  height: number | string;
  srcset?: string;
  fill?: boolean;
}>();

const imageWidth = computed(() => (props.fill ? '100%' : `${props.width}px`));
const imageHeight = computed(() => (props.fill ? '100%' : `${props.height}px`));
const optimizedImageUrl = useOptimizedImageUrl(() => ({
  src: props.src,
  width: parseSize(props.width),
  height: parseSize(props.height),
}));
</script>

<template>
  <img
    :src="optimizedImageUrl"
    :srcset="srcset"
    :style="{
      '--image-width': imageWidth,
      '--image-height': imageHeight,
    }"
    class="w-[--image-width] h-[--image-height]"
  />
</template>
