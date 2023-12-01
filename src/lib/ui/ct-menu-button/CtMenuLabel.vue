<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>

<template>
  <div class="w-min px-4 py-2 hover:bg-fg-default group flex flex-row items-center cursor-default">
    <span
      class="mr-1 group-hover:text-fg-inverted"
      v-text="label"
    />
    <VIcon
      name="arrow"
      class="text-fg-default group-hover:text-common-white rotate-270 group-hover:rotate-90"
    />
  </div>
</template>
