<script setup lang="ts">
type IconName = 'crescent' | 'magnifier' | 'sun' | 'menu' | 'close';

defineProps<{
  icon: IconName;
  mobile?: boolean;
}>();
</script>

<template>
  <component
    :is="require(`~/assets/icons/${icon}.svg?inline`)"
    class="text-fg-primaryDefault md:text-fg-default md:group-hover:text-common-white"
  />
</template>
