import CtSwitch from './CtSwitch.vue';
import { StoryFn } from '@storybook/vue';

export default {
  title: 'Switch',
  component: CtSwitch,
  argTypes: {
    size: {
      control: 'radio',
      options: ['lg', 'md'],
    },
  },
};

export const Events: StoryFn = (arg, { argTypes }) => ({
  components: { CtSwitch },
  props: Object.keys(argTypes),
  template: `<CtSwitch v-bind="$props" />`,
});
