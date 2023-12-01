<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>

<template>
  <div class="text-bodyS flex flex-row gap-x-s hover:gap-x-xs group cursor-pointer">
    <span
      class="text-common-white group-hover:text-fg-primaryDefault"
      v-text="label"
    />
    <img
      src="/assets/img/partner-badge.svg"
      alt="partner-badge"
    />
  </div>
</template>
