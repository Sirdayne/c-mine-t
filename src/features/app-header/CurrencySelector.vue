<script setup lang="ts">
import { ref, nextTick, computed } from 'vue';
import { useStore } from '~/lib/framework';
import { TICKERS } from '~/store/types';
import CtArrow from '~/lib/ui/ct-arrow/CtArrow.vue';
import CurrencySelectorDD from '~/components/Header/CurrencySelector.vue';

const isCurrencySelectorShown = ref(false);
const isCurrencySelectorInTransition = ref(false);
const currencySelectorButton = ref<HTMLButtonElement | null>(null);

const store = useStore();
const currencySign = computed(() => store.getters[`tickers/${TICKERS.SIGN}`]);
const handleCurrencySelectorShow = (): void => {
  if (isCurrencySelectorInTransition.value) {
    return;
  }
  isCurrencySelectorShown.value = true;
};
const handleCurrencySelectorHide = (): void => {
  isCurrencySelectorShown.value = false;
  nextTick(() => {
    if (currencySelectorButton.value) {
      currencySelectorButton.value.focus();
    }
  });
};
</script>

<template>
  <div class="ml-2 md:ml-0 rtl:mr-2 rtl:ml-2 relative">
    <button
      ref="currencySelectorButton"
      class="border border-[#627F8C59] md:hover:border-fg-primaryStrong rounded-full ltr:pl-2 rtl:pr-2 ltr:md:pl-0 rtl:md:pr-0"
      type="button"
      data-testid="mobile-currency-button"
      @click="handleCurrencySelectorShow()"
    >
      <span class="flex items-center">
        <span class="md:hidden">
          {{ currencySign }}
        </span>
        <CtArrow
          :direction="isCurrencySelectorShown ? 'up' : 'down'"
          size="sm"
        />
      </span>
    </button>
    <Transition
      name="drop"
      @before-enter="isCurrencySelectorInTransition = true"
      @before-leave="isCurrencySelectorInTransition = true"
      @after-enter="isCurrencySelectorInTransition = false"
      @after-leave="isCurrencySelectorInTransition = false"
    >
      <CurrencySelectorDD
        v-if="isCurrencySelectorShown"
        class="absolute ltr:left-0 rtl:right-0 top-8 w-[160px] h-full"
        @on-hide="handleCurrencySelectorHide"
      />
    </Transition>
  </div>
</template>
