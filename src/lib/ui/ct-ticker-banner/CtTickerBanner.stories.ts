import CtTickerBanner from './CtTickerBanner.vue';
import CtTicker from '../ct-ticker/CtTicker.vue';
import { StoryFn } from '@storybook/vue';
import { coins } from '../coin/coins.mock';

export default {
  title: 'Ticker banner',
  component: CtTickerBanner,
};

export const Template: StoryFn = (arg, { argTypes }) => ({
  name: 'Primary',
  components: { CtTickerBanner, CtTicker },
  props: Object.keys(argTypes),
  template: `<CtTickerBanner v-bind="$props" />`,
});
Template.args = {
  coins,
  languageShort: 'en',
  sign: '$',
};
