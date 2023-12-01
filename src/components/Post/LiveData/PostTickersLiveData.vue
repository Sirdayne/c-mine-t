<template>
  <a
    :href="linkUrl"
    :class="{
      [$style['live-data']]: true,
      [$style['live-data_rtl']]: isRtl,
    }"
    target="_blank"
    @click.stop="showMobilePopup"
    @mouseover="isPopupVisible = true"
    @mouseleave="isPopupVisible = false"
  >
    <div :class="$style['live-data__wrapper']">
      <p :class="$style['live-data__title']">
        {{ tickerData.name }}
      </p>
      <img
        v-if="tickersRatesStatus !== 'base'"
        :src="imageSrc"
        alt="tickers down"
        :class="$style['live-data__indicator']"
      />

      <p
        :class="{
          [$style['live-data__body']]: true,
          [$style['up']]: tickersRatesStatus === 'up',
          [$style['down']]: tickersRatesStatus === 'down',
        }"
      >
        {{ currencySign }}{{ tickerData.value }}
      </p>
    </div>
    <PostTickersLiveDataPopup
      v-if="isPopupVisible && !isMobileBreakpoint && tickerData"
      :ticker="tickerData"
    />
  </a>
</template>

<script lang="ts">
import { ROOT, TICKERS, VIEWPORT } from '~/store/types';
import PostTickersLiveDataPopup from '~/components/Post/LiveData/PostTickersLiveDataPopup.vue';
import { computed, ref } from 'vue';
import { useStore } from '~/lib/framework';

export default {
  name: 'PostTickersLiveData',
  components: { PostTickersLiveDataPopup },
  props: {
    coinName: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const isPopupVisible = ref(false);

    const coins = computed(() => store.getters[`tickers/${TICKERS.POST_COINS}`]);
    const currencySign = computed(() => store.getters[`tickers/${TICKERS.SIGN}`]);
    const tickerData = computed(() => {
      return coins.value?.find((coin) => coin.name === props.coinName);
    });
    const linkUrl = computed(() => {
      if (!isMobileBreakpoint.value) return tickerData.value?.url;

      return false;
    });
    const tickersRatesStatus = computed(() => {
      if (tickerData.value?.changePercentage === '0.00%') return 'base';

      if (tickerData.value?.changePercentage?.includes('-')) return 'down';

      return 'up';
    });
    const imageSrc = computed(() => {
      if (tickersRatesStatus.value === 'down') {
        return '/assets/img/tickers/tickers_down.svg';
      }

      return '/assets/img/tickers/tickers_up.svg';
    });

    const isMobileBreakpoint = computed(() => store.getters[`viewport/${VIEWPORT.IS_MOBILE_BREAKPOINT}`]);

    const isRtl = computed(() => store.getters[ROOT.IS_RTL]);
    const isJp = computed(() => store.getters[ROOT.IS_JP]);
    const isAsia = computed(() => store.getters[ROOT.IS_ASIA]);

    const showLiveDataMobilePopup = (visible: boolean) => {
      store.dispatch(`tickers/${TICKERS.CHANGE_LIVE_DATA_MOBILE_POPUP_VISIBILITY}`, visible);
    };
    const setTickerModalData = (ticker) => {
      store.dispatch(`tickers/${TICKERS.SET_TICKER_DATA_FROM_POST}`, ticker);
    };
    const setTickersDataForModal = () => {
      if (isMobileBreakpoint.value) {
        setTickerModalData(tickerData);
      }
    };

    const showMobilePopup = () => {
      if (isMobileBreakpoint.value) {
        showLiveDataMobilePopup(true);
        setTickersDataForModal();
      }
    };

    return {
      isPopupVisible,
      currencySign,
      isMobileBreakpoint,
      isRtl,
      isJp,
      isAsia,
      tickerData,
      linkUrl,
      tickersRatesStatus,
      imageSrc,
      showMobilePopup,
    };
  },
};
</script>

<style lang="scss" module>
@import '~/assets/styles/_vars.scss';

.live-data {
  display: inline-block;
  background: #fafafa;
  border: 1px solid $color-gray-400 !important;
  border-radius: 99px;
  cursor: pointer;
  position: relative;
  &__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px 8px;
  }
  &__title {
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 100%;
    color: #1f282d;
    margin: 0 4px 0 0;
  }
  &__body {
    font-weight: 600;
    font-size: 14px;
    margin: 0 !important;
    line-height: 100%;
    color: $color-gray-700;
  }

  &__indicator {
    height: 10px;
    width: 10px;
    object-fit: cover;
    margin-right: 4px;
  }
}
.live-data_rtl,
.live-data_asia {
  direction: rtl;

  .live-data {
    &__title {
      margin: 0 0 0 4px;
    }
    &__indicator {
      margin-right: 0;
      margin-left: 4px;
    }
  }
}
.up {
  color: $color-green-700;
}
.down {
  color: $color-red-700;
}
</style>
