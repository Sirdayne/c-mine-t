<!-- for raw html ads -->
<template>
  <div v-html="body" />
</template>

<script setup lang="ts">
defineProps({
  body: {
    type: String,
    required: true,
  },
});
</script>
