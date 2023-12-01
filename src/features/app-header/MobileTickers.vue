<script setup lang="ts">
import { useStore } from '~/lib/framework';
import { computed, ref, unref } from 'vue';
import { ROOT, TICKERS } from '~/store/types';
import { mainPageLinksEvent } from '~/assets/helpers/dataLayerEvents.js';
import CurrencySelector from './CurrencySelector.vue';
import LinkResolver from '~/components/Shared/LinkResolver.vue';
import { CtArrow } from '~/lib/ui';
import { SliderViewModel } from '~/lib/slider-view-model';
import { chunkItemsToSlides } from '~/assets/libs/chunkItemsToSlides';
import { useDeviceInfo } from '~/lib/device-detector';

const store = useStore();
const deviceInfo = useDeviceInfo();

const isEn = computed(() => store.getters[ROOT.IS_EN]);
const languageShort = computed(() => store.state.currentLanguage.short);
const currencySign = computed(() => store.getters[`tickers/${TICKERS.SIGN}`]);
const coins = computed(() => store.getters[`tickers/${TICKERS.MOBILE_COINS_BY_CURRENCY}`]);

const sendDataLayerEvent = (): void => {
  if (isEn.value) {
    mainPageLinksEvent('currency');
  }
};

const coinsContainer = ref<HTMLElement | null>(null);
const slides = computed(() => chunkItemsToSlides(coins.value, deviceInfo.mobile ? 3 : 5));

const tickersSliderVM = new SliderViewModel(
  coinsContainer,
  computed(() => unref(slides).length)
);

const onSlideToPrev = (): void => {
  if (!tickersSliderVM.isOnFirstSlide()) tickersSliderVM.slideToPrev();
};

const onSlideToNext = (): void => {
  if (tickersSliderVM.isOnLastSlide()) tickersSliderVM.slideTo(-1);
  if (!tickersSliderVM.isOnLastSlide()) tickersSliderVM.slideToNext();
};
</script>

<template>
  <div class="flex items-center py-1.5">
    <CurrencySelector />
    <div class="flex overflow-x-hidden items-center px-2 w-full justify-between">
      <CtArrow
        v-if="!tickersSliderVM.isOnFirstSlide()"
        size="md"
        arrow-color="muted"
        outline
        :disabled="tickersSliderVM.isOnFirstSlide()"
        class="rtl:mr-auto rtl:rotate-180 rtl:ml-2 outline-[#627F8C59]"
        data-testid="mobile-tickers-arrow-prev"
        @click.native="onSlideToPrev"
      />
      <div
        ref="coinsContainer"
        class="flex-grow flex flex-nowrap overflow-x-auto snap-x scrollbar-hidden"
        data-testid="mobile-tickers-coins-container"
        @touchmove.prevent
      >
        <div
          v-for="item in coins"
          :key="item.id"
          class="py-0.5 px-3 border-r border-border-default last:border-0"
          data-testid="mobile-tickers-coin"
        >
          <LinkResolver
            class="flex gap-x-2"
            :to="item.url"
            :language-short="languageShort"
            data-testid="tickers-mobile-link"
            @click.capture="sendDataLayerEvent"
          >
            <span class="text-uiMWeak">
              {{ item.name }}
            </span>
            <span
              class="text-uiMDefault"
              data-testid="mobile-tickers-price"
              :class="{
                'text-success-default': item.isUp,
                'text-error-default': item.isDown,
              }"
            >
              {{ currencySign }}{{ item.valueAltMobile }}
            </span>
          </LinkResolver>
        </div>
      </div>
      <CtArrow
        size="md"
        arrow-color="muted"
        outline
        class="rotate-180 rtl:rotate-0 outline-[#627F8C59]"
        data-testid="mobile-tickers-arrow-next"
        @click.native="onSlideToNext"
      />
    </div>
  </div>
</template>
