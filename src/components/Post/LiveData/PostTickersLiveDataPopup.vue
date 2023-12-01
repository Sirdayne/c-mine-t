<template>
  <div
    class=""
    :class="{
      [$style['live-data-popup']]: true,
      [$style['live-data-popup_rtl']]: isRtl,
    }"
  >
    <div :class="$style['live-data-popup__head']">
      <p :class="$style['live-data-popup__head--title']">
        {{ ticker.label }}
      </p>
      <p
        :class="{
          [$style['live-data-popup__head--percentage']]: true,
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
        [$style['live-data-popup__body']]: true,
        [$style['live-data-popup__body--with-ad']]: isEn,
      }"
    >
      <p :class="$style['live-data-popup__body--title']">MARKET CAP</p>
      <p :class="$style['live-data-popup__body--cap']">{{ currencySign }}{{ trimString(ticker.mktcapFormatted) }}</p>
    </div>
    <div
      :class="{
        [$style['live-data-popup__footer']]: true,
        '!pt-0': !isMarketCapNonZero,
      }"
    >
      <p :class="$style['live-data-popup__footer--title']">VOL. 24H</p>
      <div :class="$style['live-data-popup__footer--wrapper']">
        <p :class="$style['live-data-popup__footer--vol']">
          {{ currencySign }}{{ trimString(ticker.volume24hourFormatted) }}
        </p>
        <p :class="$style['live-data-popup__footer--trade']">
          {{ ticker.name }} {{ trimString(ticker.coinTradeVolFormatted) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ROOT, TICKERS } from '~/store/types';
import { computed } from 'vue';
import { useStore, defineComponent } from '~/lib/framework';
import LiveDataxGoPromoButton from '~/components/Post/LiveData/LiveDataxGoPromoButton.vue';

export default defineComponent({
  name: 'PostTickersLiveDataPopup',
  components: { LiveDataxGoPromoButton },
  props: {
    ticker: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const currencySign = computed(() => store.getters[`tickers/${TICKERS.SIGN}`]);

    const isRtl = computed(() => store.getters[ROOT.IS_RTL]);
    const isJp = computed(() => store.getters[ROOT.IS_JP]);
    const isAsia = computed(() => store.getters[ROOT.IS_ASIA]);
    const isEn = computed(() => store.getters[ROOT.IS_EN]);

    const isMarketCapNonZero = computed(() => {
      return trimString(props.ticker.mktcapFormatted) !== '0.00';
    });
    const tickersRatesStatus = computed(() => {
      if (props.ticker?.changePercentage === '0.00%') return 'base';

      if (props.ticker?.changePercentage?.includes('-')) return 'down';

      return 'up';
    });

    const trimString = (value: string): string => {
      if (!value) return '';

      return value.replace(' ', '');
    };

    return {
      currencySign,
      isRtl,
      isJp,
      isAsia,
      trimString,
      tickersRatesStatus,
      isEn,
      isMarketCapNonZero,
    };
  },
});
</script>

<style lang="scss" module>
@import '~/assets/styles/_vars.scss';
p {
  margin: 0;
}
.live-data-popup {
  background: #ffffff;
  border: 1px solid #c8d0d3;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  position: absolute;
  min-width: 250px;
  display: flex;
  padding: 12px;
  flex-direction: column;
  z-index: 200;
  font-size: 16px;
  line-height: 20px;
  &.live-data-popup > * {
    display: flex;
    justify-content: space-between;
    font-weight: 600;
    padding: 12px 0;
  }
  &:last-child {
    padding-bottom: 0;
  }
  &__head {
    &--title {
      color: $color-black-950;
    }
    &--percentage {
      margin-top: 0 !important;
      color: $color-gray-700;
      direction: ltr;
    }
  }
  &__body {
    border-bottom: 1px solid $color-gray-200;
    border-top: 1px solid $color-gray-200;
    color: $color-gray-700;
    &--with-ad {
      border-top: none;
      padding-top: 0 !important;
    }
    &--title {
      font-size: 12px;
      line-height: 20px;
    }
    &--cap {
      color: $color-black-950;
      font-size: 14px;
      line-height: 20px;
      margin-top: 0 !important;
      text-transform: uppercase;
    }
  }
  &__footer {
    &--title {
      font-size: 12px;
      line-height: 20px;
      color: $color-gray-700;
    }
    &--wrapper {
      text-align: right;
    }
    &--vol {
      font-size: 14px;
      line-height: 20px;
      text-transform: uppercase;
    }
    &--trade {
      font-size: 12px;
      line-height: 20px;
      color: $color-gray-700;
      margin-top: 0 !important;
      text-transform: uppercase;
    }
  }
}
.live-data-popup_rtl {
  direction: rtl;
  .live-data-popup__footer--wrapper {
    text-align: left;
  }
}
.up {
  color: $color-green-700;
}
.down {
  color: $color-red-700;
}
</style>
