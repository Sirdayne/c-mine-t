<script setup lang="ts">
import CtArrow from '~/lib/ui/ct-arrow/CtArrow.vue';

defineProps<{
  label: string;
  arrowSize?: 'md' | 'sm' | 'lg';
}>();
</script>

<template>
  <div
    class="w-fit flex flex-row align-middle items-center cursor-pointer group"
    :class="{
      'gap-x-2': label && label.length,
    }"
  >
    <CtArrow
      :size="arrowSize || 'sm'"
      direction="down"
      class="border-default rounded-containerPill border-[#273036] group-hover:border-fg-primaryDefault group-hover:text-fg-primaryDefault"
    />
    <span
      class="text-uiXsWeak text-fg-primaryDefault group-hover:underline uppercase"
      v-text="label"
    />
  </div>
</template>
