<template>
  <div class="popular-conversions">
    <h3
      class="popular-conversions__title"
      data-testid="calculator-crypto-to-fiat-title"
    >
      {{ i18n.calculatorPopularConversions }}
    </h3>
    <div class="popular-conversions__link-wrapper">
      <a
        v-for="conversion in conversionsToShow"
        :key="conversion.id + conversion.fiat"
        href="#"
        data-testid="calculator-crypto-to-fiat-link"
        class="popular-conversions__link"
        @click.prevent.stop="moveToConversionUrl(conversion)"
      >
        {{ conversion.name }} to {{ conversion.fiat }}
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { useVuex, useRouter } from '~/assets/libs/nuxtComposables';
import { computed, defineComponent, unref } from 'vue';
import { TICKERS } from '~/store/types';
import { sortBy } from 'lodash';
interface ConversationObject {
  url: string;
  fiat: string;
  name: string;
}
export default defineComponent({
  name: 'CryptoPopularConversions',
  props: {
    fromCryptoToFiat: {
      type: Boolean,
      default: true,
    },
  },
  setup(_, { emit }) {
    const store = useVuex();
    const router = useRouter();
    const popularConversions = computed(() => store.getters[`tickers/${TICKERS.POPULAR_CRYPTO_TO_FIAT}`]);
    const isMobileWidth = computed(() => store.getters['viewport/IS_MOBILE_WIDTH']);
    const sortedPopularConversions = computed(() => {
      return sortBy(unref(popularConversions), 'name');
    });
    const conversionsToShow = computed(() =>
      unref(isMobileWidth) ? sortedPopularConversions?.value : popularConversions?.value
    );
    const i18n = computed(() => store.state.i18n);
    const moveToConversionUrl = (val: ConversationObject) => {
      if (val.fiat !== 'USD') {
        emit('updateFrom', val.name);
        emit('updateTo', val.fiat);
        emit('updateFromCrypto', true);
        if (unref(isMobileWidth)) emit('goToCalculatorSection', true);
      } else {
        let routerData = router.resolve({ path: val.url });
        window.open(routerData.href, '_blank');
      }
    };
    return {
      popularConversions,
      moveToConversionUrl,
      i18n,
      isMobileWidth,
      conversionsToShow,
      sortedPopularConversions,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '~/assets/styles/_vars.scss';
.popular-conversions {
  margin-top: 48px;

  &__title {
    font-weight: 700;
    font-size: 22px;
    line-height: 28px;
    margin: 22px 0;
  }

  &__link-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  &__link {
    font-size: 16px;
    line-height: 24px;
    letter-spacing: -0.02em;
    text-decoration-line: underline;
    color: $color-darkgold;
    display: block;
    width: 50%;
    cursor: pointer;
    padding: 4px 0;
  }
}
@media screen and (min-width: $sm) {
  .popular-conversions {
    &__link {
      width: 15%;
    }
  }
}
</style>
