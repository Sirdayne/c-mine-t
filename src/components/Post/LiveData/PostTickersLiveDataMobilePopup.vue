<template>
  <div
    v-if="ticker"
    :class="{
      [$style['mobile-live-data']]: true,
      [$style['mobile-live-data_rtl']]: isRtl,
    }"
    @wheel.prevent
    @touchmove.prevent
    @scroll.prevent
  >
    <div :class="$style['mobile-live-data__header']">
      <p :class="$style['mobile-live-data-__header--title']">
        {{ ticker.label }}
      </p>
      <a
        href="javascript:void(0)"
        @click="hideMobilePopup"
      >
        <img
          src="/assets/img/tickers/close.svg"
          alt=""
        />
      </a>
    </div>
    <div :class="$style['mobile-live-data__price']">
      <p :class="$style['mobile-live-data__price--value']">{{ currencySign }}{{ ticker.value }}</p>
      <p
        :class="{
          [$style['mobile-live-data__price--percentage']]: true,
          [$style['up']]: tickersRatesStatus === 'up',
          [$style['down']]: tickersRatesStatus === 'down',
        }"
      >
        {{ ticker.changePercentage }}
      </p>
    </div>
    <LiveDataxGoPromoButton v-if="isEn" />
    <div
      v-if="isMarketCapNonZero"
      :class="{
        [$style['mobile-live-data__market']]: true,
        [$style['mobile-live-data__market--with-ad']]: isEn,
      }"
    >
      <p :class="$style['mobile-live-data__market--title']">MARKET CAP</p>
      <p :class="$style['mobile-live-data__market--value']">
        {{ currencySign }}{{ trimString(ticker.mktcapFormatted) }}
      </p>
    </div>
    <div :class="$style['mobile-live-data__volume']">
      <p :class="$style['mobile-live-data__volume--title']">VOL. 24H</p>
      <div :class="$style['mobile-live-data__volume--wrapper']">
        <span :class="$style['mobile-live-data__volume--value']">
          {{ currencySign }}{{ trimString(ticker.volume24hourFormatted) }}
        </span>
        <span :class="$style['mobile-live-data__volume--trade']">
          {{ ticker.name }} {{ trimString(ticker.coinTradeVolFormatted) }}
        </span>
      </div>
    </div>
    <a
      :href="tickerUrl"
      tag="button"
      target="_blank"
      :class="$style['mobile-live-data__more']"
    >
      {{ i18n.postLiveDataViewMore }}
    </a>
    <a
      ref="backdrop"
      href="javascript:void(0)"
      :class="{
        [$style['backdrop']]: true,
        [$style['backdrop--with-ad']]: isEn,
        [$style['backdrop--without-market']]: !isMarketCapNonZero,
      }"
      class="overflow-hidden"
      @click="hideMobilePopup"
    />
  </div>
</template>

<script lang="ts">
import { ROOT, TICKERS } from '~/store/types';
import { useStore } from '~/lib/framework';
import { computed, defineComponent } from 'vue';
import LiveDataxGoPromoButton from '~/components/Post/LiveData/LiveDataxGoPromoButton.vue';

export default defineComponent({
  name: 'PostTickersLiveDataMobilePopup',
  components: { LiveDataxGoPromoButton },
  setup() {
    const store = useStore();
    const currencySign = computed(() => store.getters[`tickers/${TICKERS.SIGN}`]);

    const isRtl = computed(() => store.getters[ROOT.IS_RTL]);
    const isJp = computed(() => store.getters[ROOT.IS_JP]);
    const isAsia = computed(() => store.getters[ROOT.IS_ASIA]);
    const isEn = computed(() => store.getters[ROOT.IS_EN]);

    const ticker = computed(() => store.state.tickers.selectedTickerFromPost);
    const i18n = computed(() => store.state.i18n);

    const tickersRatesStatus = computed(() => {
      if (ticker.value?.changePercentage === '0.00%') return 'base';

      if (ticker.value?.changePercentage?.includes('-')) return 'down';

      return 'up';
    });
    const tickerUrl = computed(() => ticker.value.url);
    const showLiveDataMobilePopup = (visible: boolean) => {
      store.dispatch(`tickers/${TICKERS.CHANGE_LIVE_DATA_MOBILE_POPUP_VISIBILITY}`, visible);
    };

    const hideMobilePopup = () => {
      showLiveDataMobilePopup(false);
    };
    const trimString = (value: string) => {
      if (!value) return '';

      return value.replace(' ', '');
    };

    const isMarketCapNonZero = computed(() => {
      return trimString(ticker.value.mktcapFormatted) !== '0.00';
    });

    return {
      currencySign,
      isRtl,
      isJp,
      isAsia,
      ticker,
      i18n,
      tickersRatesStatus,
      tickerUrl,
      hideMobilePopup,
      trimString,
      isEn,
      isMarketCapNonZero,
    };
  },
});
</script>

<style lang="scss" module>
@import '~/assets/styles/_vars.scss';
.mobile-live-data {
  left: 0;
  right: 0;
  box-sizing: border-box;
  list-style: none;
  background: #ffffff;
  border-top: 1px solid #c8d0d3;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  padding: 12px;
  font-weight: 600;
  &:before {
    content: ' ';
    top: 0;
    bottom: 0;
    background: red;
  }
  &.mobile-live-data > * {
    padding: 12px 0;
  }
  &__header {
    display: flex;
    justify-content: space-between;

    &--title {
      font-weight: 700;
      font-size: 16px;
      line-height: 24px;
      margin: 0;
    }
  }
  &__price {
    display: flex;
    font-size: 22px;
    line-height: 30px;
    &--percentage {
      margin: 0;
      direction: ltr;
    }
    &--value {
      margin: 0 8px 0 0;
    }
  }
  &__market {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid $color-gray-200;
    border-top: 1px solid $color-gray-200;
    &--with-ad {
      padding-top: 0 !important;
      border-top: none;
    }
    &--title {
      font-size: 12px;
      line-height: 20px;
      color: $color-gray-700;
      margin: 0;
    }
    &--value {
      font-size: 14px;
      line-height: 20px;
      text-transform: uppercase;
      color: $color-black-950;
      margin: 0;
    }
  }
  &__volume {
    display: flex;
    justify-content: space-between;
    &--wrapper {
      display: flex;
    }
    &--title {
      font-size: 12px;
      line-height: 20px;
      color: $color-gray-700;
      margin: 0;
    }
    &--value {
      line-height: 20px;
      font-size: 14px;
      color: $color-black-950;
      text-transform: uppercase;
      margin: 0 12px 0 0;
    }
    &--trade {
      font-size: 14px;
      line-height: 20px;
      text-transform: uppercase;
      color: $color-gray-700;
      margin: 0;
    }
  }
  &__more {
    display: block;
    width: 100%;
    background: $color-orange-500;
    border-radius: 8px;
    border: none;
    text-align: center;
    text-decoration: none;
    font-size: 15px;
    line-height: 24px;
    color: $color-black-950;
    font-weight: 600;
  }
}
.mobile-live-data_rtl {
  direction: rtl;

  .mobile-live-data__price--value {
    margin: 0 0 0 8px;
  }
  .mobile-live-data__volume--value {
    margin-left: 12px;
  }
}
.up {
  color: $color-green-700;
}
.down {
  color: $color-red-700;
}
.backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 263px;
  left: 0;
  background: #4e5d65;
  opacity: 0.4;
  z-index: 1;
  overflow-y: hidden;
  @media (min-width: $sm) {
    bottom: 296px;
  }
  &--with-ad {
    bottom: 290px;
  }
  &--without-market {
    bottom: 257px;
  }
}
</style>
