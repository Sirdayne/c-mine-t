import { StoryFn } from '@storybook/vue';
import CtButtonConnected from './CtArrowsButtonConnected.vue';

export default {
  title: 'Arrow buttons',
  component: CtButtonConnected,
  argTypes: {
    size: {
      control: 'radio',
      options: ['lg', 'md', 'sm'],
    },
  },
};

export const Connected: StoryFn = (arg, { argTypes }) => ({
  components: { CtButtonConnected },
  props: Object.keys(argTypes),
  template: `<CtButtonConnected v-bind="$props" />`,
});
