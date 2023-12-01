<script setup lang="ts">
import CtButton from './CtButton.vue';

defineProps<{
  label?: string;
  size: string;
  iconPosition?: 'left' | 'right' | 'none' | 'iconOnly';
  iconName?: string;
  active?: boolean;
  link?: boolean;
}>();
</script>

<template>
  <CtButton
    type="secondary"
    :link="link"
    :size="size"
    :icon-position="iconPosition"
    :icon-name="iconName"
    round="pill"
    :class="{
      '!bg-bg-primary border-bg-primary': active,
    }"
  >
    <slot>
      {{ label || '' }}
    </slot>
  </CtButton>
</template>
