import CtMenuButton from './CtMenuButton.vue';
import { StoryFn } from '@storybook/vue';
import CtMenuLabel from './CtMenuLabel.vue';

export default {
  title: 'Menu items',
  component: CtMenuButton,
  argTypes: {
    icon: {
      control: {
        type: 'select',
        options: ['crescent', 'magnifier', 'sun'],
      },
      defaultValue: 'magnifier',
    },
  },
  parameters: {
    backgrounds: {
      values: [
        { name: 'default', value: '#fff' },
        { name: 'yellow', value: '#FABC2C' },
      ],
    },
  },
};

export const Icon: StoryFn = (arg, { argTypes }) => ({
  components: { CtMenuButton },
  props: Object.keys(argTypes),
  template: `<CtMenuButton v-bind="$props" />`,
});

export const Label: StoryFn = (arg, { argTypes }) => ({
  components: { CtMenuLabel },
  props: Object.keys(argTypes),
  template: `<CtMenuLabel label="Label" />`,
});
