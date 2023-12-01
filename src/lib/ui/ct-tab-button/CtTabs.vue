<script setup lang="ts">
import { CtTabButton } from '~/lib/ui';

interface Tab {
  label: string;
}

defineProps<{
  activeTabIndex: number;
  tabs: Tab[];
}>();

const emit = defineEmits<{
  (e: 'change', arg: number): void;
}>();

const setActiveTab = (id: number) => {
  emit('change', id);
};
</script>

<template>
  <div class="flex flex-row w-full">
    <CtTabButton
      v-for="(tab, i) in tabs"
      :key="i"
      :label="tab.label"
      :is-active="activeTabIndex === i"
      @click.native="setActiveTab(i)"
    />
  </div>
</template>
