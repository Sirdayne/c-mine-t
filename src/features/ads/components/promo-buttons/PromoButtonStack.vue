<template>
  <div
    :class="{
      [$style['promo-button-stack']]: true,
      [$style['promo-button-stack--transparent']]: isBackgroundTransparent,
    }"
    data-testid="podcast-promo-button-stack"
  >
    <AdSlot
      v-for="index in STACK_SIZE"
      :key="index"
      :index="index - 1"
      :place="props.promoButtonPlace"
      :config="{
        promoButtonDisclaimerHidden: !config.promoButtonStackWithoutDisclaimer,
      }"
      :class="$style['promo-button-stack__button']"
    />
    <div
      v-if="!config.promoButtonStackWithoutDisclaimer"
      :class="$style['promo-button-stack__disclaimer']"
      data-testid="promo-button-stack-disclaimer"
    >
      {{ disclaimerText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '~/lib/framework';
import AdSlot from '../../AdSlot.vue';
import { useAdSlotContext, useCustomRenderingProps } from '~/features/ads/adslot/useAdSlotContext';
import { CustomRenderingViews } from '~/features/ads/core/CustomRenderingViews';

/**
 * button count in stack
 */
const STACK_SIZE = 3;

const props = useCustomRenderingProps(CustomRenderingViews.PROMO_BUTTON_STACK);
const { config } = useAdSlotContext();
const isBackgroundTransparent = computed(() => config.promoButtonStackTransparentBackground);
const store = useStore();
const disclaimerText = computed(() => store.state.i18n['promo-buttons-group.disclaimer']);
</script>

<style module lang="scss">
@import '~/assets/styles/_vars.scss';

.promo-button-stack {
  box-sizing: border-box;
  padding: 12px;
  background: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);

  &--transparent {
    background: transparent;
    box-shadow: none;
  }
}

.promo-button-stack__button {
  margin-top: 10px;
}

.promo-button-stack__disclaimer {
  color: #92989b;
  font-size: 10px;
  font-weight: 400;
  line-height: 1.7;
  margin-top: 15px;
  text-align: center;

  @media (min-width: $sm) {
    font-size: 12px;
  }
}
</style>
