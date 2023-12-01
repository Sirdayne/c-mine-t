<script setup lang="ts">
defineProps<{
  direction?: 'left' | 'right' | 'up' | 'down';
  size: 'md' | 'sm' | 'lg';
  outline?: boolean;
  disabled?: boolean;
  arrowColor?: 'muted' | 'subtle' | 'white';
  color?: string;
}>();
</script>

<template>
  <div
    class="rounded-containerPill group w-min"
    :class="{
      'outline outline-border-default outline-1': outline !== false,
      'cursor-not-allowed': disabled,
      'cursor-pointer': !disabled,
      'p-1': size === 'md' || size === 'lg',
      'p-0.5': size === 'sm',
    }"
  >
    <component
      :is="require(`~/assets/icons/arrow-${size || 'sm'}.svg?inline`)"
      alt="arrow"
      class="text-fg-subtle"
      :class="{
        'text-fg-muted': !arrowColor,
        'text-fg-subtle': arrowColor === 'subtle',
        'text-white': arrowColor === 'white',
        [`group-hover:${color || 'text-fg-primaryStrong'}`]: true,
        'rotate-0': direction === 'left',
        'rotate-90': direction === 'up',
        'rotate-180': direction === 'right',
        'rotate-270': direction === 'down',
      }"
    />
  </div>
</template>
