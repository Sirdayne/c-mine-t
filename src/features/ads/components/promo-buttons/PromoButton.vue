<script lang="ts">
import { defineComponent, h, computed, unref } from 'vue';
import { useStore } from '~/lib/framework';
import { ROOT } from '~/store/types';
import { useAdSlotContext, useCustomRenderingProps } from '../../adslot/useAdSlotContext';
import { CustomRenderingViews } from '../../core/CustomRenderingViews';
import { usePromoButtonPopoverPosition } from './usePromoButtonPopoverPosition';
import PromoButtonView from './PromoButtonView.vue';

/**
 * Adapter to PromoButtonView
 */
export default defineComponent({
  name: 'PromoButton',

  setup() {
    const store = useStore();
    const { adItem, config } = useAdSlotContext();
    const props = useCustomRenderingProps(CustomRenderingViews.PROMO_BUTTON);
    const popoverPosition = usePromoButtonPopoverPosition();

    const rtl = computed(() => store.getters[ROOT.IS_RTL]);
    const translatedLabelText = computed(() => store.state.i18n[props.labelText] || props.labelText);
    const translatedTooltipText = computed(() => store.state.i18n[props.tooltipText] || props.tooltipText);

    return () => {
      return h(PromoButtonView, {
        props: {
          ...props,
          fullWidth: config.promoButtonFullWidth,
          rtl: unref(rtl),
          labelText: unref(translatedLabelText),
          tooltipText: unref(translatedTooltipText),
          redirectUrl: adItem.getRedirectUrl(),
          popoverPosition: unref(popoverPosition),
          disclaimerHidden: config.promoButtonDisclaimerHidden,
          contentReversed: config.promoButtonContentReversed,
          promoButtonWithOutToolTip: config.promoButtonWithOutToolTip,
        },
      });
    };
  },
});
</script>
