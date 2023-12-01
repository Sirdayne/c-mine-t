import CtHeaderDropdown from './CtHeaderDropdown.vue';
import { StoryFn } from '@storybook/vue';

export default {
  title: 'Header dropdown',
  component: CtHeaderDropdown,
  parameters: {
    backgrounds: {
      values: [
        { name: 'white', value: '#ffffff' },
        { name: 'black', value: '#000000' },
      ],
    },
  },
  argTypes: {
    label: {
      control: 'text',
      defaultValue: 'Label',
    },
    shevron: {
      control: 'boolean',
      defaultValue: true,
    },
  },
};

export const Main: StoryFn = (arg, { argTypes }) => ({
  name: 'Main',
  components: { CtHeaderDropdown },
  props: Object.keys(argTypes),
  template: `<CtHeaderDropdown v-bind="$props" />`,
});
