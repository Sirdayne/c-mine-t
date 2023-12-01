<script setup lang="ts">
defineProps<{
  isActive: boolean;
  label: string;
}>();
</script>

<template>
  <div
    class="w-full select-none py-3 text-fg-strong text-uiMDefault border-b-2 border-fg-primaryDefault cursor-pointer text-center rounded-t"
    :class="{
      'bg-bg-primary': isActive,
      'bg-bg-default hover:bg-bg-subtle': !isActive,
    }"
  >
    {{ label }}
  </div>
</template>
