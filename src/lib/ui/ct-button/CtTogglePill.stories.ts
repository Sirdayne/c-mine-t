import CtTogglePill from './CtTogglePill.vue';
import { StoryFn } from '@storybook/vue';

export default {
  title: 'Buttons',
  component: CtTogglePill,
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: ['xs', 'sm', 'md', 'lg', 'xl'],
      },
      defaultValue: 'lg',
    },
    iconPosition: {
      control: {
        type: 'select',
        options: ['none', 'left', 'right', 'iconOnly'],
      },
      defaultValue: 'none',
    },
    text: {
      control: 'text',
      defaultValue: 'Awesome Button',
    },
    active: {
      control: 'checkbox',
      defaultValue: false,
    },
  },
};

export const TogglePill: StoryFn = (arg, { argTypes }) => ({
  components: { CtTogglePill },
  props: Object.keys(argTypes),
  template: `<CtTogglePill v-bind="$props" ><span>{{$props.text}}</span></CtTogglePill>`,
});
TogglePill.args = {
  iconName: 'logo',
};
