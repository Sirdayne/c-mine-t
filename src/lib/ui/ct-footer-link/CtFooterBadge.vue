<script setup lang="ts">
defineProps<{
  label?: string;
}>();
</script>

<template>
  <div
    v-if="label"
    class="badge absolute top-1/2 left-full bg-bg-primary text-bg-inverted uppercase text-uiXxsStrong px-1 rounded-r-sm"
  >
    {{ label }}
  </div>
</template>

<style scoped>
.badge {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  transform: translate(17px, -50%) translateZ(0);
  transition: transform 0.25s, color 0.15s;
}

.badge:before {
  content: '';
  position: absolute;
  top: 0;
  left: -7.9px;
  width: 0;
  height: 0;
  border: solid 8px transparent;
  border-left-width: 0;
  border-right-color: #fabc2c;
}
</style>
