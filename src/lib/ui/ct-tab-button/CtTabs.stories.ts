import { StoryFn } from '@storybook/vue';
import CtTabs from './CtTabs.vue';

export default {
  title: 'Tabs',
  component: CtTabs,
  args: {
    tabs: [
      {
        id: 1,
        label: 'Label 1',
      },
      {
        id: 2,
        label: 'Label 2',
      },
      {
        id: 3,
        label: 'sdfsdfsfsd',
      },
    ],
  },
};

export const Main: StoryFn = (arg, { argTypes }) => ({
  components: { CtTabs },
  props: Object.keys(argTypes),
  template: `<CtTabs v-bind="$props" />`,
});
