<script>
import getProperty from '~/assets/libs/getProperty';

export default {
  name: 'PostDisclaimerJp',
  functional: true,
  props: {
    i18n: {
      type: Object,
      default: null,
    },
  },
  render(h, ctx) {
    const {
      props,
      data: { staticClass },
    } = ctx;
    const componentClass = 'post-disclaimer-jp';
    const i18n = getProperty(props, 'i18n', null);
    const componentPaidText = getProperty(i18n, 'articleDisclaimerPaid', '');
    const componentDescText = getProperty(i18n, 'articleDisclaimerDesc', '');
    const classes = staticClass ? `${componentClass} ${staticClass}` : componentClass;
    const textNodes = [h('b', componentPaidText), componentDescText];
    return componentPaidText && componentDescText ? h('div', { class: classes }, textNodes) : null;
  },
};
</script>

<style>
.post-disclaimer-jp {
  font-size: 12px;
  text-align: left;
  border: 1px solid #fabf2c;
  box-sizing: border-box;
  padding: 18px 24px;
  line-height: 1.5;
}
</style>
