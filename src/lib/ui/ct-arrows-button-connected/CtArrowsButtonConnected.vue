<script setup lang="ts">
import { cva, VariantProps } from 'class-variance-authority';
import ArrowIcon from '~/assets/icons/arrow-lg.svg';
import { computed } from 'vue';

const elementClasses = cva('w-min outline outline-1 outline-border-default rounded-containerPill flex flex-row', {
  variants: {
    size: {
      sm: 'scale-50',
      md: 'scale-75 gap-x-xs',
      lg: 'scale-0, gap-x-s',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
});

const emit = defineEmits<{
  (e: 'left'): void;
  (e: 'right'): void;
}>();

const leftClass = computed(() => {
  if (props.size === 'sm') {
    return 'pt-xxs ltr:pl-xxs rtl:pr-xxs';
  }
  if (props.size === 'md') {
    return 'py-xs ltr:pl-xs rtl:pr-xs';
  }
  return 'ltr:pl-s rtl:pr-s py-xs';
});

const rightClass = computed(() => {
  if (props.size === 'sm') {
    return 'ltr:pr-xxs rtl:pl-xxs pt-xxs';
  }
  if (props.size === 'md') {
    return 'ltr:pr-xs rtl:pl-xs py-xs';
  }
  return 'ltr:pr-s rtl:pl-s py-xs';
});

type ElementProps = Required<VariantProps<typeof elementClasses>>;
const props = defineProps<{
  size?: ElementProps['size'];
  leftLocator?: string;
  rightLocator?: string;
}>();
</script>

<template>
  <div :class="elementClasses(props)">
    <div
      class="cursor-pointer group"
      :class="leftClass"
      :data-gtm-locator="leftLocator || ''"
      @click="emit('left')"
    >
      <ArrowIcon class="text-fg-muted group-hover:text-fg-primaryStrong ltr:rotate-0 rtl:rotate-180" />
    </div>
    <div
      class="cursor-pointer group"
      :class="rightClass"
      :data-gtm-locator="rightLocator || ''"
      @click="emit('right')"
    >
      <ArrowIcon class="text-fg-muted group-hover:text-fg-primaryStrong ltr:rotate-180 rtl:rotate-0" />
    </div>
  </div>
</template>
