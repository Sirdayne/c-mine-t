<template>
  <AdSlot
    place="live_data_popup_promo_button"
    :config="{
      promoButtonDisclaimerHidden: true,
      promoButtonFullWidth: true,
      promoButtonContentReversed: true,
    }"
    :class="$style['xgo-ad-slot']"
  />
</template>

<script>
import { AdSlot } from '~/features/ads';

export default {
  name: 'LiveDataxGoPromoButton',
  components: { AdSlot },
};
</script>

<style lang="scss" module>
@import '~/assets/styles/_vars.scss';

//prevent from jumping after AdSlot loaded
.xgo-ad-slot {
  height: 40px;
  width: 100%;
  padding-top: 0 !important;
  padding-bottom: 9px !important;
  @media (min-width: $sm) {
    padding-bottom: 6px !important;
  }
}
</style>
