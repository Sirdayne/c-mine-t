<template>
  <Affix>
    <aside
      class="sidebar"
      :class="isRtl && 'sidebar_rtl'"
      data-testid="sidebar"
    >
      <ClientOnly>
        <CryptoConverter
          v-if="isCalculatorVisible"
          from-crypto-to-fiat
          :to-coin.sync="fiatValue"
          :from-coin="cryptoSymbol"
          from-sidebar
          class="sidebar-calculator"
          @updateTo="updateToCoinValue"
        />
      </ClientOnly>
      <template v-for="(item, index) in banners">
        <template v-if="item.isWidget">
          <EditorsChoiceWidget
            v-if="item.widgetType === 'editors-choice-widget' && withEditorChoice"
            :key="item.id"
            class="sidebar__widget"
          />
          <div
            v-else-if="item.widgetType === 'subscriptions-widget'"
            :key="item.id"
            class="sidebar__widget sidebar__widget_subscriptions-widget"
          >
            <InViewportObserver>
              <template slot-scope="{ isInViewport }">
                <SubscriptionWidget
                  :widget-options="item"
                  :is-in-viewport="isInViewport"
                />
              </template>
            </InViewportObserver>
          </div>
          <div
            v-else-if="item.widgetType === 'coin-360-widget'"
            :key="item.id"
            class="sidebar__widget sidebar__widget_coin-360"
          >
            <Coin360Widget />
          </div>
          <ClientOnly
            v-else-if="item.widgetType === 'tradingview'"
            :key="item.id"
          >
            <div class="sidebar__widget sidebar__widget_coin-360">
              <TradingViewWidget />
            </div>
          </ClientOnly>
          <div
            v-else-if="item.widgetType === 'price-indexes-widget' && isPriceWidgetAllowed"
            :key="item.id"
            class="sidebar__widget"
          >
            <PricesWidget />
          </div>
          <div
            v-else-if="item.widgetType === 'yad-widget' && isYADWidgetAllowed"
            :key="item.id"
            class="sidebar__widget"
          >
            <YADWidget />
          </div>

          <AdSlot
            v-else-if="item.isSidePromoButton"
            :key="item.id"
            :class="{
              sidebar__widget: true,
              'podcast-sidebar': isPodcasts,
            }"
            :place="item.graphqlBanner.bannerPlace"
            :index="index"
          />

          <div
            v-else-if="item.widgetType === 'app-new-subscriber'"
            :key="item.id"
            class="sidebar__widget"
          >
            <SubscriptionForm />
          </div>
        </template>

        <div
          v-else-if="!item.isAdbutler"
          :key="item.id"
          class="sidebar__widget"
          data-testid="sidebar-banner"
        >
          <AdSlot
            :place="item.graphqlBanner.bannerPlace"
            :index="index"
          />
        </div>

        <div
          v-else-if="bannersListFirstPosition === index && restBanners.length"
          :key="item.id"
          class="sidebar__widget"
          data-testid="sidebar-banner"
        >
          <AdSlot
            v-for="(banner, bannerIndex) of restBanners"
            :key="bannerIndex + index"
            :class="$style['ad-slot']"
            :place="banner.graphqlBanner.bannerPlace"
            :index="bannerIndex + index"
            :config="{
              aspectRatio: sidebarSquareBannerAspectRatio,
              closable: true,
            }"
          />
          <AdvertiseWithUsLink
            key="advertise-with-us-link"
            :class="$style['advertise-with-us-link']"
            data-testid="sidebar-advertise-with-us"
          />
        </div>
      </template>
    </aside>
  </Affix>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { ROOT } from '~/store/types';
import { BANNER_PLACES } from '~/app.config';
import Affix from '~/components/Shared/Affix';
import InViewportObserver from '~/components/Shared/InViewportObserver';
import EditorsChoiceWidget from './EditorsChoiceWidget';
import SubscriptionForm from './SubscriptionForm';
import PricesWidget from './PricesWidget';
import Coin360Widget from './Coin360Widget';
import TradingViewWidget from './TradingViewWidget';
import SubscriptionWidget from './SubscriptionWidget';
import CryptoConverter from '~/components/CryptoConverter/CryptoConverter.vue';
import AdvertiseWithUsLink from './AdvertiseWithUsLink.vue';
import { AdSlot } from '~/features/ads';
import YADWidget from '~/components/Sidebar/YADWidget.vue';

const SIDEBAR_SQUARE_BANNER_ASPECT_RATIO = 291 / 349;

export default {
  name: 'Sidebar',
  components: {
    YADWidget,
    CryptoConverter,
    AdSlot,
    Affix,
    AdvertiseWithUsLink,
    InViewportObserver,
    EditorsChoiceWidget,
    SubscriptionForm,
    PricesWidget,
    Coin360Widget,
    TradingViewWidget,
    SubscriptionWidget,
  },
  props: {
    withEditorChoice: {
      type: Boolean,
      default: true,
    },
    cryptoSymbol: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      fiatValue: 'USD',
    };
  },
  computed: {
    ...mapState('viewport', {
      isMobile: ({ userDeviceType: { any } }) => any,
    }),
    ...mapState('tickers', {
      selectedCurrency: ({ currency }) => currency,
    }),
    ...mapState({
      currentLanguage: ({ currentLanguage }) => currentLanguage,
      i18n: ({ i18n }) => i18n,
      banners: ({ banners }) => banners[BANNER_PLACES.SIDEBAR],
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
    isPriceWidgetAllowed() {
      return this.$route.name !== 'price-indexes' && !this.$route.name.includes('podcasts');
    },
    isYADWidgetAllowed() {
      return this.$route.name === 'cryptocoin-price' || this.$route.name === 'coin-price';
    },
    bannersListFirstPosition() {
      return this.banners.findIndex((item) => item.isAdbutler);
    },
    isPodcasts() {
      return this.$route.name === 'podcasts' || this.$route.name === 'podcasts-slug';
    },
    restBanners() {
      return this.banners.filter((item) => item.isAdbutler);
    },
    isCalculatorVisible() {
      return this.$route.path.includes('-price') && (this.$route.params?.cryptocoin || this.$route.params?.coin);
    },
    sidebarSquareBannerAspectRatio() {
      return SIDEBAR_SQUARE_BANNER_ASPECT_RATIO;
    },
  },
  watch: {
    selectedCurrency() {
      this.fiatValue = this.selectedCurrency;
    },
  },
  mounted() {
    this.fiatValue = this.selectedCurrency;
  },
  methods: {
    updateToCoinValue(newFiatValue) {
      this.fiatValue = newFiatValue;
    },
  },
};
</script>

<style module lang="scss">
.advertise-with-us-link,
.ad-slot {
  margin-top: 10px;
}
</style>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.sidebar {
  display: block;
}
.sidebar__widget {
  margin-bottom: 20px;
}
.sidebar__widget_coin-360 {
  position: relative;
  z-index: 0;
}
.sidebar__widget:last-child {
  margin-bottom: 0;
}
.sidebar__promo-button {
  display: block;
  width: 100%;
}
.sidebar_rtl {
  direction: rtl;
}
.sidebar-calculator {
  margin-bottom: 40px;
}

.podcast-sidebar .promo-button {
  max-width: unset;
}
</style>
