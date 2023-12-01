import CtTicker from './CtTicker.vue';
import type { Meta, StoryFn } from '@storybook/vue';

const coin = {
  url: 'lolo',
  name: 'BTC',
  valueAltDesktop: '22,545',
  isUp: true,
  isDown: false,
  changePercentage: '+0,43',
};

export default {
  title: 'Ticker',
  component: CtTicker,
  parameters: {
    backgrounds: {
      values: [
        { name: 'white', value: '#ffffff' },
        { name: 'black', value: '#000000' },
      ],
    },
  },
} as Meta<typeof CtTicker>;

const Template: StoryFn = (arg, { argTypes }) => ({
  name: 'Primary',
  components: { CtTicker },
  props: Object.keys(argTypes),
  template: `<CtTicker languageShort="en" sign="$" :coin="$props.coin"/>`,
});

export const Positive = Template.bind({});
Positive.args = {
  coin,
};
export const Negative = Template.bind({});
Negative.args = {
  coin: {
    ...coin,
    isUp: false,
    isDown: true,
    changePercentage: '-6,23',
  },
};
