import CtButton from './CtButton.vue';
import type { Meta, StoryFn } from '@storybook/vue';

export default {
  title: 'Buttons',
  component: CtButton,
  argTypes: {
    round: {
      control: {
        type: 'select',
        options: [null, 'soft', 'pill'],
      },
    },
    size: {
      control: {
        type: 'select',
        options: ['xs', 'sm', 'md', 'lg', 'xl'],
      },
    },
    iconPosition: {
      control: {
        type: 'select',
        options: ['none', 'left', 'right', 'iconOnly'],
      },
    },
    text: {
      control: 'text',
      defaultValue: 'Awesome Button',
    },
  },
} as Meta<typeof CtButton>;

const Template: StoryFn = (arg, { argTypes }) => ({
  name: 'Primary',
  components: { CtButton },
  props: Object.keys(argTypes),
  template: `<CtButton v-bind="$props"><span v-if="$props.text">{{$props.text}}</span></CtButton>`,
});

export const Primary = Template.bind({});
Primary.args = {
  ...Template.args,
  type: 'primary',
  size: 'xl',
  iconName: 'logo',
};

export const Secondary: StoryFn = Template.bind({});
Secondary.args = {
  ...Template.args,
  icon: 'left',
  type: 'secondary',
  iconName: 'logo',
};

export const Tertiary: StoryFn = Template.bind({});
Tertiary.args = {
  ...Template.args,
  icon: 'left',
  type: 'tertiary',
  iconName: 'arrow',
};
