<template>
  <v-select
    id="first-col"
    :value="value"
    :options="options"
    :clearable="false"
    :reduce="(coin) => coin.name"
    :class="{
      [$style['select']]: true,
      [$style['select--rtl']]: isRtl,
      [$style['select--sidebar']]: fromSidebar,
      [$style['select--price-index']]: fromPriceIndex,
    }"
    :data-testid="dataTestId"
    searchable
    :filter-by="customNameLabelFilter"
    :select-on-key-codes="[enterKeyCode]"
    @option:selected="updateValue"
  >
    <template #open-indicator="{ attributes }">
      <img
        v-bind="attributes"
        src="/assets/img/dropdown-arrow.svg"
        alt=""
      />
    </template>
    <template #no-options>
      {{ calculatorSearchNoOptions }}
    </template>
    <template #search="{ attributes, events }">
      <input
        v-if="fromCryptoToFiat"
        class="vs__search"
        :placeholder="calculatorSearchCrypto"
        v-bind="attributes"
        v-on="events"
      />
      <input
        v-else
        class="vs__search"
        :placeholder="calculatorSearchFiat"
        v-bind="attributes"
        v-on="events"
      />
    </template>
    <template #selected-option="option">
      <div
        v-if="fromCryptoToFiat"
        :class="$style['select__select-option']"
        data-testid="calculator-selected-left-option-crypto"
        :data-gtm-locator="`menubar_clickon_calculator_${option.name}`"
      >
        <IconCoin
          :svg="option.logo"
          :class="$style['select__selected-coin-icon']"
        />
        <span
          v-if="!isMobileWidth"
          :class="$style['select__select-option-body']"
        >
          {{ option.label }}&nbsp;
        </span>
        <span :class="$style['select__selected-option-body']">({{ option.name }})</span>
      </div>
      <div
        v-else
        :class="$style['select__select-option']"
        data-testid="calculator-selected-left-option-fiat"
        :data-gtm-locator="`menubar_clickon_calculator_${option.name}`"
      >
        <img
          :src="`/assets/img/currencies/${imageUrl(option.name)}-logo.svg`"
          alt="Fiat logo"
          :class="{
            [$style['select__select-option-currency']]: true,
            [$style['fiat-logo']]: true,
            [$style[`fiat-logo-${option.name}`]]: true,
          }"
        />
        <span> {{ option.name }}</span>
      </div>
    </template>
    <template #option="option">
      <div
        v-if="fromCryptoToFiat"
        :class="$style['select__select-option']"
        data-testid="calculator-options-list-crypto"
        :data-gtm-locator="`menubar_clickon_calculator_${option.name}`"
      >
        <IconCoin
          :svg="option.logo"
          :class="$style['select__selected-coin-icon']"
        />
        <span>{{ option.label }}&nbsp;</span><span>({{ option.name }})</span>
      </div>
      <div
        v-else
        :class="$style['select__select-option']"
        data-testid="calculator-options-list-fiat"
        :data-gtm-locator="`menubar_clickon_calculator_${option.name}`"
      >
        <img
          :src="`/assets/img/currencies/${imageUrl(option.name)}-logo.svg`"
          alt="Fiat logo"
          :class="{
            [$style['select__select-option-currency']]: true,
            [$style['fiat-logo']]: true,
            [$style[`fiat-logo-${option.name}`]]: true,
          }"
        />
        <span> {{ option.name }}</span>
      </div>
    </template>
  </v-select>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import vSelect from 'vue-select';
import IconCoin from '~/components/Icons/Coins/IconCoin.vue';
import { useStore } from '~/lib/framework';
interface Currency {
  name: string;
  sign: string;
}

export default defineComponent({
  name: 'CryptoConverterSelect',
  components: { IconCoin, vSelect },
  props: {
    value: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    fromCryptoToFiat: {
      type: Boolean,
      required: true,
    },
    isRtl: {
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
    dataTestId: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const calculatorSearchNoOptions = computed(() => store.state.i18n.calculatorSearchNoOptions);
    const calculatorSearchCrypto = computed(() => store.state.i18n.calculatorSearchCrypto);
    const calculatorSearchFiat = computed(() => store.state.i18n.calculatorSearchFiat);
    const enterKeyCode = 13;
    const isMobileWidth = computed(() => store.getters['viewport/IS_MOBILE_WIDTH']);

    const updateValue = (currency: Currency) => {
      emit('updateValue', currency.name);
    };

    const customNameLabelFilter = (option, label, search) => {
      let temp = search.toLowerCase();
      return option.name.toLowerCase().includes(temp) || option.label.toLowerCase().includes(temp);
    };

    const imageUrl = (coinName: string) => {
      if (!coinName) return null;

      return coinName.toLowerCase();
    };

    return {
      isMobileWidth,
      calculatorSearchNoOptions,
      calculatorSearchCrypto,
      calculatorSearchFiat,
      customNameLabelFilter,
      updateValue,
      enterKeyCode,
      imageUrl,
    };
  },
});
</script>

<style>
@import '~/assets/styles/components/_vue-select.scss';
</style>
<style module lang="scss" scoped>
@import '~/assets/styles/_vars.scss';
.select {
  max-width: 35%;
  width: 100%;
  height: auto;
  &:deep(.vs__dropdown-toggle) {
    height: 100%;
  }

  @media (min-width: $xs) {
    max-width: 25%;
    width: 100%;
  }
  @media (min-width: $xs) and (max-width: $sm) {
    max-width: 30%;
    width: 100%;
  }
  @media (min-width: $sm) {
    width: 100%;
    max-width: 100%;
  }
  &--price-index {
    max-width: 90%;
    width: 100%;
    @media (max-width: $xs--tablet) {
      max-width: 100%;
      margin-left: 16px;
    }
  }
  &__icon {
    position: absolute;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    -webkit-align-items: center;
    flex-grow: 0;
    margin-right: 5%;
  }
  &__select-option-currency {
    margin-right: 8px;
  }
  &__selected-coin-icon {
    display: grid;
    grid-template-columns: 30px;
  }
  &__selected-coin-icon:deep(svg) {
    height: 20px;
    width: 20px;
    display: flex;
    display: -webkit-flex;
    margin-right: 8px;
  }
  &__select-option {
    display: grid;
    grid-template-columns: 30px 1fr 1fr;
    align-items: center;
    -webkit-align-items: center;
    white-space: nowrap;
  }
  &__selected-option-body {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 52px;
    @media screen and (max-width: 375px) {
      width: 40px;
    }
    @media (min-width: $sm) {
      width: 100%;
    }
  }
}
.fiat-logo {
  border-radius: 50%;
}
.fiat-logo-EUR {
  background-color: $color-blue;
}
.fiat-logo-RUR {
  background-color: #1a47b8;
}
.fiat-logo-TRY {
  background-color: #f4453a;
}
.fiat-logo-BRL {
  background-color: #249f58;
}
.fiat-logo-CNY {
  background-color: #f4453a;
}

.select--rtl {
  @media (max-width: $xs--tablet) {
    margin-left: 0;
    margin-right: 16px;
  }
  &__selected-coin-icon {
    margin-left: 8px;
  }
  &__select {
    direction: rtl;
  }
  &__select-option-body {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    @media screen and (min-width: $xs) {
      white-space: nowrap;
      overflow: unset;
      text-overflow: unset;
    }
    @media screen and (max-width: $lg) {
      width: 80px;
    }
  }
  &__selected-coin-icon:deep(svg) {
    margin-left: 8px;
    margin-right: 0;
  }
}
</style>
