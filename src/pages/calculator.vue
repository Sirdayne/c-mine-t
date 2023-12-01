<template>
  <div
    class="container"
    :class="{ 'calculator--rtl': isRtl }"
  >
    <div class="calculator__row">
      <div class="calculator__content-col">
        <h1
          ref="title"
          data-testid="calculator-title"
          class="calculator__title"
        >
          {{ i18n.calculatorHeading }}
        </h1>

        <p
          data-testid="calculator-description"
          class="calculator__subtitle"
        >
          {{ i18n.calculatorDesc }}
        </p>
        <CryptoConverter
          ref="converter"
          :from-crypto-to-fiat="fromCryptoToFiat"
          :from-coin.sync="fromCoin"
          :to-coin.sync="toCoin"
          @updateTo="updateToValue"
          @updateFrom="updateFromValue"
          @updateFromCrypto="updateFromCrypto"
          @cryptoOnMounted="updateFromCrypto"
        />
        <div class="calculator__popular">
          <CryptoPopularConversions
            @updateTo="updateToValue"
            @updateFrom="updateFromValue"
            @updateFromCrypto="updateFromCrypto"
            @goToCalculatorSection="goToCalculatorSection"
          />
        </div>
        <h3
          class="calculator__trending-title"
          data-testid="calculator-trending-title"
        >
          {{ i18n.calculatorTrendingHeading }}
        </h3>
        <PostsListing
          data-testid="calculator-trending-posts"
          :posts="posts"
          theme="double-column"
        />
      </div>
      <div class="calculator__sidebar-col">
        <Sidebar />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, unref } from 'vue';
import { useRouteQuery, useVuex, useRoute } from '~/assets/libs/nuxtComposables';
import CryptoConverter from '~/components/CryptoConverter/CryptoConverter.vue';
import Sidebar from '~/components/Sidebar/Sidebar.vue';
import { fetchTrendingNews, fetchCalculatorPageMeta } from '~/api/modules/calculator';
import PostsListing from '~/components/PostsListing/PostsListing.vue';
import { getCalculatorPageMeta } from '~/assets/helpers/meta/converter';
import CryptoPopularConversions from '~/components/CryptoConverter/CryptoPopularConversions.vue';
import { ROOT } from '~/store/types';

const DEFAULT_FROM_COIN = 'BTC';
const DEFAULT_TO_COIN = 'USD';

export default defineComponent({
  name: 'CalculatorPage',

  components: {
    CryptoPopularConversions,
    PostsListing,
    Sidebar,
    CryptoConverter,
  },
  setup() {
    const store = useVuex();
    const route = useRoute();
    let fromCoin = useRouteQuery('from', DEFAULT_FROM_COIN);
    let toCoin = useRouteQuery('to', DEFAULT_TO_COIN);
    const i18n = computed(() => store.state.i18n);
    const isRtlGetter = () => store.getters[ROOT.IS_RTL];
    const isRtl = isRtlGetter();
    let fromCryptoToFiat = ref(true);
    const converter = ref(null);

    const updateToValue = (newVal: string) => {
      route.query.to = newVal;
      toCoin.value = newVal;
    };
    const updateFromValue = (newVal: string) => {
      route.query.from = newVal;
      fromCoin.value = newVal;
    };
    const updateFromCrypto = (newVal: boolean) => {
      fromCryptoToFiat.value = newVal;
    };
    const cryptoOnMountedUpdate = (newVal: boolean) => {
      fromCryptoToFiat.value = newVal;
    };

    const goToCalculatorSection = () => {
      const top = unref(converter).$el.offsetTop;
      window.scrollTo({
        top: top,
        left: 0,
        behavior: 'smooth',
      });
    };

    return {
      fromCoin,
      toCoin,
      updateToValue,
      updateFromValue,
      updateFromCrypto,
      cryptoOnMountedUpdate,
      isRtl,
      i18n,
      fromCryptoToFiat,
      goToCalculatorSection,
      converter,
    };
  },
  async asyncData({ store, app, route }) {
    const { state } = store;
    const initialPageData = await fetchTrendingNews({
      languages: state.languages,
      languageDomain: state.currentLanguage.domain,
      languageCode: state.currentLanguage.code,
      timeZone: state.currentLanguage.timezone,
      languageShort: state.currentLanguage.short,
      apolloTransport: app.$apolloTransport,
    });

    const meta = await fetchCalculatorPageMeta({
      pathname: route.path,
      languageShort: state.currentLanguage.short,
      apolloTransport: app.$apolloTransport,
    });

    return { ...initialPageData, ...meta };
  },

  head() {
    const { currentLanguage, languages, meta, $route } = this;
    return getCalculatorPageMeta({
      currentLanguage,
      languages,
      meta,
      routeName: $route.name,
    });
  },
});
</script>

<style scoped lang="scss">
@import '~/assets/styles/_vars.scss';

.calculator {
  &__row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 40px;
    margin-left: -$gutter;
    margin-right: -$gutter;
  }
  &__title {
    font-size: 24px;
    line-height: 1.375;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    color: inherit;
    margin: 8px 0 18px 0;
  }
  &__sidebar-col,
  &__content-col {
    box-sizing: border-box;
    padding-right: $gutter;
    padding-left: $gutter;
  }
  &__content-col {
    width: 100%;
  }
  &__sidebar-col {
    display: none;
  }
  &__popular {
    margin-top: 48px;
  }
  &__subtitle {
    margin: 16px 0;
  }
  &__trending-title {
    font-size: 22px;
    line-height: 28px;
    font-weight: 700;
    color: $color-black;
    margin: 22px 0;
  }
}
.calculator--rtl {
  direction: rtl;
}
@media (min-width: $md) {
  .calculator {
    &__title {
      font-size: 36px;
    }
    &__content-col {
      width: $col-10;
    }
    &__sidebar-col {
      display: block;
      width: $col-5;
      margin-left: $col-1;
    }
  }
}
</style>
