<template>
  <div
    data-testid="converter"
    :class="{
      [$style['converter']]: !fromSidebar,
      [$style['converter--no-result']]: !doesResultExist,
      [$style['converter--price-index']]: fromPriceIndex,
      [$style['converter--rtl']]: isRtl,
      'from-sidebar': fromSidebar,
      'from-sidebar--rtl': fromSidebar && isRtl,
    }"
  >
    <h3
      v-if="fromSidebar"
      :class="{
        [$style['converter-title--sidebar']]: fromSidebar,
        [$style['converter-title--price-index']]: fromPriceIndex,
      }"
    >
      {{ sidebarCalculatorTitle }}
    </h3>
    <form
      :class="{
        [$style['converter__form']]: true,
        [$style['converter__form--sidebar']]: fromSidebar,
        [$style['converter__form--price-index']]: fromPriceIndex,
      }"
    >
      <div
        :class="{
          [$style['converter__form--first-col']]: true,
          [$style['converter__form--first-col--sidebar']]: fromSidebar,
          [$style['converter__form--first-col--price-index']]: fromSidebar,
        }"
      >
        <span
          v-if="fromSidebar || fromPriceIndex"
          :class="{
            [$style['input-coin-logo']]: true,
            [$style['input-coin-logo--price-index']]: fromPriceIndex,
          }"
        >
          <IconCoin :svg="coinIcon" />
          <span>
            {{ coinBySlug.name }}
          </span>
        </span>
        <input
          v-model="amount"
          name="amount"
          :class="{
            [$style['upper-input']]: true,
            [$style['upper-input--sidebar']]: fromSidebar,
            [$style['upper-input--price-index']]: fromSidebar,
          }"
          type="text"
          maxlength="16"
          :placeholder="calculatorPlaceholderText"
          data-testid="calculator-left-input"
          data-gtm-locator="menubar_clickon_calculator_enter_number"
          min="0"
          @keydown="isNumber($event)"
        />
        <client-only v-if="!fromSidebar">
          <CryptoConverterSelect
            v-if="dataLoaded"
            :from-crypto-to-fiat="fromCryptoToFiat"
            :options="fromCryptoToFiat ? coins : metaCurrencies"
            :value="fromCoin"
            :is-rtl="isRtl"
            :from-sidebar="fromSidebar"
            :from-price-index="fromPriceIndex"
            :class="$style['converter--select']"
            data-testid="calculator-left-select"
            @updateValue="updateFrom"
          />
        </client-only>
      </div>
      <span
        v-if="!fromSidebar"
        :class="$style['converter__flip-button']"
        data-testid="calculator-flip-button"
        data-gtm-locator="menubar_clickon_calculator_arrow"
        @click="flip"
      >
        <img
          src="https://s3.cointelegraph.com/storage/uploads/view/94d7db45dec9a739c50554e4fbe99fa0.svg"
          alt="flip-image"
          :class="$style['converter__flip-button-image']"
        />
      </span>
      <div
        :class="{
          [$style['converter__form--second-col']]: true,
          [$style['converter__form--second-col--sidebar']]: fromSidebar,
          [$style['converter__form--second-col--price-index']]: fromPriceIndex,
        }"
      >
        <input
          :value="convertedAmount"
          name="amount"
          :class="{ [$style['upper-input']]: true, [$style['upper-input--sidebar']]: fromSidebar }"
          data-testid="calculator-right-input"
          readonly
        />
        <client-only>
          <CryptoConverterSelect
            v-if="dataLoaded"
            :from-crypto-to-fiat="!fromCryptoToFiat"
            :options="fromCryptoToFiat ? metaCurrencies : coins"
            :value="toCoin"
            :is-rtl="isRtl"
            :from-sidebar="fromSidebar"
            :from-price-index="fromPriceIndex"
            data-testid="calculator-right-select"
            :class="{ [$style['converter--select']]: true, [$style['converter--select--sidebar']]: fromSidebar }"
            @updateValue="updateToValue"
          />
        </client-only>
      </div>
    </form>

    <template v-if="result && !fromSidebar">
      <div :class="$style['converter__footer']">
        <div>
          <p
            :class="$style['converter__footer-rates']"
            data-testid="calculator-crypto-rates"
          >
            1 {{ result.baseCoin }} = {{ result.baseToQuoteRate }} {{ result.quoteCoin }}
          </p>
          <p
            :class="$style['converter__footer-rates']"
            data-testid="calculator-fiat-rates"
          >
            1 {{ result.quoteCoin }} = {{ result.quoteToBaseRate }} {{ result.baseCoin }}
          </p>
        </div>
        <p
          :class="$style['converter__footer-rates--updated']"
          data-testid="calculator-last-updated"
        >
          {{ lastUpdatedAtPretty }}
        </p>
      </div>
    </template>
    <AdSlot
      v-if="fromSidebar && isDesktop"
      place="promo_button_price_index_calculator"
      :class="$style['converter__sidebar-promo-button']"
    />
    <AdSlot
      v-else-if="fromPriceIndex && !isDesktop"
      place="promo_button_price_index_calculator_mobile"
      :class="$style['converter__calculator-promo-button']"
      :config="{
        promoButtonFullWidth: true,
        promoButtonStackTransparentBackground: true,
        promoButtonWithOutToolTip: !isDesktop,
      }"
    />
  </div>
</template>

<script lang="ts">
import { useNow, useVModels } from '@vueuse/core';
import { computed, defineComponent, onMounted, ref, unref, watchPostEffect } from 'vue';
import { localeFormatter, prettyPrintDateTime } from '~/assets/libs/dateTimeUtils';
import { useRoute } from '~/assets/libs/nuxtComposables';
import { CryptoConversionHelper } from './CryptoConversionHelper';
import { ROOT } from '~/store/types';
import { captureError } from '~/lib/telemetry';
import CryptoConverterSelect from '~/components/CryptoConverter/CryptoConverterSelect.vue';
import IconCoin from '~/components/Icons/Coins/IconCoin.vue';
import { useStore } from '~/lib/framework';
import { AdSlot } from '~/features/ads';
import { useDeviceInfo } from '~/lib/device-detector';
interface Currency {
  name: string;
  sign: string;
}

const DATETIME_RECENT_THRESHOLD_IN_SECONDS = 24 * 60 * 60;
export default defineComponent({
  name: 'CryptoConverter',
  components: { AdSlot, IconCoin, CryptoConverterSelect },

  props: {
    fromCoin: {
      type: String,
      required: true,
    },

    toCoin: {
      type: String,
      required: true,
    },

    fromCryptoToFiat: {
      type: Boolean,
      required: true,
    },
    fromSidebar: {
      type: Boolean,
      default: false,
    },
    fromPriceIndex: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { emit }) {
    const deviceInfo = useDeviceInfo();
    const isDesktop = computed(() => deviceInfo.desktop);

    const { fromCoin: fromCoinModel, toCoin: toCoinModel } = useVModels(props, emit);
    const store = useStore();
    const route = useRoute();
    const now = useNow();
    const updatedDateTimeLabel = computed(() => store.state.i18n.calculatorLastUpdated);
    const calculatorSidebarTitle = computed(() => store.state.i18n.calculatorSidebarTitle);
    const calculatorPlaceholderText = computed(() => store.state.i18n.calculatorPleaseEnterPlaceholder);
    const amount = ref('1');
    const languageShort = computed(() => store.state.currentLanguage.short);
    const locale = unref(languageShort);
    const coins = computed(() => store.state.tickers.meta?.coins);
    const isRtlGetter = () => store.getters[ROOT.IS_RTL];
    const isRtl = isRtlGetter();
    const dataLoaded = computed(() => {
      if (props.fromCryptoToFiat) {
        return metaCurrencies?.value && metaCurrencies?.value.length && coins?.value && coins?.value?.length;
      }

      return coins?.value && coins?.value?.length && metaCurrencies.value && metaCurrencies?.value?.length;
    });
    const coinIcon = computed(() => {
      return coinBySlug.value?.logo;
    });
    const flip = () => {
      let temp = unref(fromCoinModel);
      fromCoinModel.value = unref(toCoinModel);
      toCoinModel.value = temp;
      updateFromCrypto(!props.fromCryptoToFiat);
    };
    const updateFromCrypto = (newVal: boolean) => {
      emit('updateFromCrypto', newVal);
    };

    const rates = computed(() => store.state.tickers.rawRates);
    const result = computed(() => {
      try {
        if (!rates.value || !amount.value || Number(amount.value) === 0) return null;

        const cryptoConversionHelper = new CryptoConversionHelper(unref(rates));
        return cryptoConversionHelper.convert(unref(fromCoinModel), unref(toCoinModel), unref(amount));
      } catch (error) {
        captureError(error);
        return null;
      }
    });

    const lastUpdatedAt = computed(() => {
      // track rates change
      unref(rates);
      return new Date();
    });

    const lastUpdatedAtPretty = computed(() => {
      const result = prettyPrintDateTime({
        source: unref(lastUpdatedAt),
        now: unref(now),
        locale,
        recentThresholdInSeconds: DATETIME_RECENT_THRESHOLD_IN_SECONDS,
      });
      return `${unref(updatedDateTimeLabel)} ${result}`;
    });

    const formatNumber = (amount: number) => {
      let minimumFractionDigits = props.fromCryptoToFiat ? 2 : 8;

      const numberFormat = new Intl.NumberFormat(localeFormatter(locale), { minimumFractionDigits });
      return numberFormat.format(amount);
    };

    const convertedAmount = computed(() => {
      if (result?.value?.convertedAmount) {
        return formatNumber(Number(result.value.convertedAmount));
      } else {
        return '';
      }
    });
    const metaCurrencies = computed(() =>
      store.state.tickers.meta?.currencies?.map((currency: Currency) => {
        return {
          ...currency,
          label: currency.name,
        };
      })
    );
    const updateToValue = (currency: Currency) => {
      emit('updateTo', currency);
    };
    const updateFrom = (currency: Currency) => {
      emit('updateFrom', currency);
    };
    const isNumber = (evt) => {
      const period = 190;
      const zero = 48;
      const nine = 57;
      const del = 46;
      //All characters below 32 are nonalphanumeric characters
      const nonalphanumeric = 31;
      const leftArrow = 37;
      const rightArrow = 39;
      const enterKeyCode = 13;
      evt = evt ? evt : window.event;
      let charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > nonalphanumeric &&
        (charCode < zero || charCode > nine) &&
        charCode !== del &&
        charCode !== period &&
        charCode !== rightArrow &&
        charCode !== leftArrow &&
        charCode !== enterKeyCode
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    };

    const coinBySlug = computed(() => {
      const slug = route.path;
      if (!slug.includes('-price') && (!route.params?.cryptocoin || !route.params?.coin)) return {};

      return coins?.value?.find((coin) => coin.url === slug);
    });
    const sidebarCalculatorTitle = computed(() => {
      return `${coinBySlug?.value?.name} ${calculatorSidebarTitle?.value}`;
    });
    const doesResultExist = computed(() => {
      return !!result.value;
    });

    onMounted(() => {
      const from = route.query.from;
      watchPostEffect(async () => {
        if (
          metaCurrencies?.value?.length &&
          metaCurrencies?.value.some((metaCurr: Currency) => metaCurr.name === from)
        ) {
          updateFromCrypto(false);
        }
      });
    });

    return {
      amount,
      fromCoinModel,
      toCoinModel,
      lastUpdatedAtPretty,
      coins,
      result,
      convertedAmount,
      flip,
      metaCurrencies,
      updateToValue,
      updateFrom,
      isRtl,
      dataLoaded,
      isNumber,
      sidebarCalculatorTitle,
      coinBySlug,
      calculatorPlaceholderText,
      doesResultExist,
      coinIcon,
      isDesktop,
    };
  },
});
</script>
<style>
@import '~/assets/styles/components/_vue-select.scss';
</style>
<style lang="scss" scoped module>
@use '~/assets/styles/_icons-common.scss' as icons;
@import '~/assets/styles/_vars.scss';

.converter {
  background: $color-white;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.14), 0 8px 40px rgba(0, 0, 0, 0.15);
  border-radius: 24px;
  flex: none;
  order: 2;
  align-self: stretch;
  flex-grow: 0;
  padding: 16px;
  min-height: 196px;
  &--no-result {
    min-height: 126px;
  }

  &--price-index {
    flex: 1;
    width: 100%;
  }

  &__form {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: space-between;
    &--first-col,
    &--second-col {
      position: relative;
      display: flex;
      justify-content: space-between;
    }

    &--sidebar {
      flex-direction: column;
    }
  }
  &--select {
    margin-top: 0;
    @media (min-width: $sm) {
      margin-top: 8px;
    }
    &--sidebar {
      margin-top: 0;
    }
  }
  &__footer {
    display: flex;
    display: -webkit-flex;
    margin-top: 24px;
    font-weight: 400;
    font-size: 14px;
    color: $color-gray-700;
    justify-content: space-between;
  }
  &__flip-button {
    width: 40px;
    border-radius: 9999px;
    height: 40px;
    align-self: center;
    cursor: pointer;
    position: relative;
    &:hover {
      background-color: #f1f3f4;
      @media screen and (max-width: $xs) {
        background: none;
        -webkit-tap-highlight-color: transparent;
      }
    }
  }
  &__flip-button-image {
    position: absolute;
    transform: translate(50%, 50%) rotate(90deg);
  }
  &__footer {
    flex-direction: column;
  }
  &__footer-rates {
    margin: 0;
    &--updated {
      margin-top: 16px;
    }
  }
  &-title {
    &--sidebar {
      font-style: normal;
      font-weight: 500;
      font-size: 13px;
      line-height: 18px;
      color: $color-black;
      text-transform: uppercase;
    }
    &--price-index {
      font-style: normal;
      font-weight: 700;
      font-size: 22px;
      line-height: 28px;
      color: $color-black;
      text-transform: capitalize;
    }
  }
  &__sidebar-promo-button {
    margin-top: 12px;
  }
  &__calculator-promo-button {
    margin-top: 24px;
  }
}
.upper-input {
  background: $color-white;
  border: 1px solid $color-gray-400;
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 24px;
  line-height: 24px;
  position: relative;
  width: 45%;
  &:focus-visible {
    outline: none;
  }
  &:focus {
    border: 1px solid $color-gray-600;
    box-shadow: 0 2px 20px rgba(128, 128, 128, 0.2);
  }
  &--sidebar {
    font-weight: 400;
    font-size: 18px;
    line-height: 24px;
    border-radius: 4px;
    font-family: 'Open Sans';
    padding: 16px 12px;
  }
  &--price-index {
    font-weight: 400;
    font-size: 18px;
    line-height: 24px;
    width: 100%;
    font-family: 'Open Sans';
    padding: 16px 12px;
    @media (min-width: $xs) {
      width: 45%;
    }
  }
}
.upper-input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.upper-input[type='number'] {
  -moz-appearance: textfield;
}

@media screen and (min-width: $xs) {
  .converter {
    &--first-col,
    &-second-col {
    }
    &__footer {
      flex-direction: row;
    }
    &__footer-rates--updated {
      margin-top: 0;
    }
  }
  .upper-input {
    width: 65%;
    margin-right: 5%;
    &--price-index {
      width: 100%;
      margin-right: 0;
    }
  }
}
@media (min-width: $md) {
  .converter {
    &--price-index {
      display: none;
    }
  }
}

@media screen and (min-width: $sm) {
  .converter {
    padding: 32px;
    &__form {
      flex-direction: row;
      &--first-col {
        flex-direction: column;
        width: 45%;
        position: relative;
        &--sidebar {
          width: 100%;
          margin-bottom: 12px;
        }
      }
      &--second-col {
        flex-direction: column;
        width: 45%;
        &--sidebar {
          display: grid;
          width: 100%;
          grid-template-columns: 55% 40%;
          grid-column-gap: 5%;
        }
      }
      &--sidebar {
        flex-direction: column;
      }
    }
    &__footer {
      margin-top: 32px;
    }
    &__flip-button-image {
      transform: translate(50%, 50%) rotate(0);
    }
  }
  .upper-input {
    width: initial;
    margin-right: 0;
  }
}
@media (max-width: $xs--tablet) {
  .converter {
    flex: 1;
    &__form {
      &--first-col {
        &--price-index {
          margin-bottom: 8px;
        }
      }
    }
  }
  .upper-input {
    width: 100%;
    margin-right: 8px;
  }
  .upper-input--sidebar {
    margin-right: 0;
  }
}
@media (min-width: $xs--tablet) and (max-width: $md) {
  .converter {
    width: 100%;
    &__form {
      &--first-col {
        &--sidebar {
          margin-bottom: 0;
        }
      }
      &--price-index {
        display: grid;
        grid-template-columns: 45% 50%;
      }
      &--second-col {
        &--price-index {
          display: grid;
          width: 95%;
          grid-template-columns: 50% 50%;
          grid-column-gap: 5%;
        }
      }
    }
  }
}
.converter--rtl {
  .converter {
    &__flip-button-image {
      transform: translate(-60%, 50%) rotate(90deg);
      @media screen and (min-width: $xs) {
        transform: translate(-60%, 50%) rotate(0);
      }
    }
    &__footer-rates {
      direction: ltr;
      text-align: right;
    }
  }
  .input-coin-logo {
    left: 16px;
    right: unset;
    &:deep(svg) {
      margin-left: 8px;
      margin-right: 0;
    }
  }
}
.upper-input-label {
  position: relative;
}
.input-coin-logo {
  display: inline-flex;
  right: 16px;
  align-items: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: $color-gray-700;
  z-index: 1;
  &:deep(svg) {
    height: 20px;
    width: 20px;
    display: flex;
    display: -webkit-flex;
    margin-right: 8px;
  }
}
</style>
