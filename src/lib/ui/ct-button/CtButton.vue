<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';
import { computed } from 'vue';

const buttonClasses = cva('', {
  variants: {
    type: {
      primary: 'bg-fg-primaryDefault hover:bg-fg-primaryStrong',
      secondary: 'border-default border-bg-lessSubtle hover:bg-bg-lessSubtle hover:outline-0',
      tertiary: 'bg-transparent hover:bg-bg-subtle',
    },
    round: {
      default: 'rounded-containerS',
      soft: 'rounded-containerM',
      pill: 'rounded-containerPill',
    },
    size: {
      xs: 'px-2 py-1 text-uiXsDefault gap-0.5',
      sm: 'px-3 py-1 text-uiSDefault gap-1',
      md: 'px-4 py-2 text-uiMDefault gap-2',
      lg: 'px-5 py-3 text-uiMDefault gap-2',
      xl: 'px-6 py-4 text-uiLDefault gap-2',
    },
    iconPosition: {
      left: 'flex-row',
      right: 'flex-row-reverse',
      none: 'gap-none',
      iconOnly: '',
    },
  },
  compoundVariants: [
    {
      iconPosition: 'iconOnly',
      size: 'xl',
      class: '!p-4',
    },
    {
      iconPosition: 'iconOnly',
      size: 'lg',
      class: '!p-3',
    },
    {
      iconPosition: 'iconOnly',
      size: 'md',
      class: '!p-2',
    },
    {
      iconPosition: 'iconOnly',
      size: ['sm', 'xs'],
      class: '!p-1',
    },
  ],
  defaultVariants: {
    type: 'primary',
    size: 'md',
    round: null,
    iconPosition: 'none',
  },
});

type ButtonProps = Required<VariantProps<typeof buttonClasses>>;

type IconPosition = 'left' | 'right' | 'none' | 'iconOnly';

const props = defineProps<{
  type?: ButtonProps['type'];
  size?: ButtonProps['size'];
  round?: ButtonProps['round'];
  iconPosition?: IconPosition;
  iconName?: string;
  label?: string;
  // change default button to <a> tag with href attr in case you need button like link
  link?: boolean;
}>();

const iconClass = computed(() => {
  return {
    hidden: props.iconPosition === 'none',
    'w-6 h-6': ['xl', 'lg', 'md'].includes(props.size as string),
    'w-4 h-4': props.size === 'sm',
    'w-3 h-3': props.size === 'xs',
  };
});
</script>

<template>
  <component
    :is="link ? 'a' : 'button'"
    class="flex items-center justify-center"
    :class="buttonClasses(props)"
  >
    <component
      :is="require(`~/assets/icons/${iconName}.svg?inline`)"
      v-if="iconName"
      alt="icon"
      :class="iconClass"
    />
    <slot v-if="iconPosition !== 'iconOnly'">
      {{ label }}
    </slot>
  </component>
</template>
