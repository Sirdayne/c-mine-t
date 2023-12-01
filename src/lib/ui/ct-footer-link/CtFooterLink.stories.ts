import CtFooterBadge from './CtFooterBadge.vue';
import { StoryFn } from '@storybook/vue';
import { boolean } from 'typed';

export default {
  title: 'Footer link',
  component: CtFooterBadge,
  argTypes: {
    label: {
      control: 'text',
      defaultValue: 'Label',
    },
    showBadge: {
      control: 'boolean',
      defaultValue: true,
    },
  },
};

export const Main: StoryFn = (arg, { argTypes }) => ({
  components: {
    CtFooterBadge,
  },
  props: Object.keys(argTypes),
  template: `<CtFooterBadge v-bind="$props" > <span>shalom</span></CtFooterBadge>`,
});
