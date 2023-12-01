<script setup lang="ts">
defineProps<{
  label: string;
  iconClass: string;
}>();
</script>

<template>
  <button class="inline-flex items-center pt-2 text-fg-secondaryDefault leading-none font-uiMDefault">
    {{ label }}
    <span
      class="ltr:ml-1 rtl:mr-1 w-6 h-6 block bg-contain bg-no-repeat bg-center text-fg-secondaryDefault"
      :class="iconClass"
      >&nbsp;</span
    >
  </button>
</template>
