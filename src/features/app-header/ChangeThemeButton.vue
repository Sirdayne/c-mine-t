<script setup lang="ts">
import CtMenuButton from '~/lib/ui/ct-menu-button/CtMenuButton.vue';
import { ref } from 'vue';

const isDark = ref<boolean>(false);

const emit = defineEmits<{
  (e: 'change', a: boolean): void;
}>();
const toggleTheme = (): void => {
  isDark.value = !isDark.value;
  emit('change', isDark.value);
};
</script>

<template>
  <button
    type="button"
    @click.stop="toggleTheme"
  >
    <CtMenuButton
      v-if="isDark"
      icon="sun"
    />
    <CtMenuButton
      v-else
      icon="crescent"
    />
  </button>
</template>

<style scoped lang="scss"></style>
