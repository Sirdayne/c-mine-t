import CtArrow from './CtArrow.vue';
import { StoryFn } from '@storybook/vue';

export default {
  title: 'Arrow buttons',
  component: CtArrow,
  argTypes: {
    direction: {
      control: 'radio',
      options: ['left', 'right', 'up', 'down'],
    },
    size: {
      control: 'radio',
      options: ['lg', 'md', 'sm'],
      defaultValue: 'md',
    },
    outline: {
      control: 'boolean',
    },
  },
};

export const Main: StoryFn = (arg, { argTypes }) => ({
  components: { CtArrow },
  props: Object.keys(argTypes),
  template: `<CtArrow v-bind="$props" />`,
});
