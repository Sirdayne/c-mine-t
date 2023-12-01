<script lang="ts" setup>
import { useRoute, useStore } from '~/lib/framework';
import BurgerButton from '~/features/app-header/BurgerButton.vue';
import { computed } from 'vue';
import InMobileHeaderBanner from './InMobileHeaderBanner.vue';
import CtMenuButton from '~/lib/ui/ct-menu-button/CtMenuButton.vue';
import MobileTickers from '~/features/app-header/MobileTickers.vue';
import CompanyLogo from '~/features/app-header/CompanyLogo.vue';
import { AdSlot } from '~/features/ads';
import DesktopTickers from '~/features/app-header/DesktopTickers.vue';
import CurrencySelector from './CurrencySelector.vue';
import MenuDesktop from './MenuDesktop.vue';
import SideLinks from '~/features/app-header/SideLinks.vue';
import { useFeatureManager } from '~/lib/feature-manager';
import MenuMobile from '~/features/app-header/MenuMobile.vue';
import { MENU } from '~/store/types';
import AsiaMenuMobile from '~/features/app-header/AsiaMenuMobile.vue';
import HeaderZoneBannerWrapper from '~/components/Header/HeaderZoneBannerWrapper.vue';
import { PATH_SLUGS_WITHOUT_LEADERBOARD } from '~/app.config';
import { useDeviceInfo } from '~/lib/device-detector';

const store = useStore();
const featureManager = useFeatureManager();
const deviceInfo = useDeviceInfo();
const route = useRoute();

const themeChangeEnabled = featureManager.isEnabled('change_theme_enabled');
const forAsia = featureManager.isEnabled('asia_mobile_layout');

const isMobileMenuOpened = computed(() => store.state.menu.isMobileMenuOpened);
const isSearchOpened = computed(() => store.state.menu.isSearchOpened);

const asiaMobileLayoutEnabled = computed(() => featureManager.isEnabled('asia_mobile_layout') && deviceInfo.mobile);

const headerBannerVisible = computed(
  () => asiaMobileLayoutEnabled.value || !PATH_SLUGS_WITHOUT_LEADERBOARD.includes(route.value.name ?? '')
);

const toggleSearch = (): void => {
  if (isSearchOpened.value) {
    store.dispatch(`menu/${MENU.CLOSE_SEARCH}`);
  } else {
    store.dispatch(`menu/${MENU.CLOSE_MOBILE_MENU}`);
    store.dispatch(`menu/${MENU.OPEN_SEARCH}`);
  }
};
</script>

<template>
  <div
    :class="{
      'after:content-[` `] after:absolute after:left-0 after:top-[47px] after:w-full after:h-[calc(100%_-_27px)]':
        isSearchOpened && !deviceInfo.desktop,
      'after:!top-[43px]': isSearchOpened && deviceInfo.tablet,
    }"
    class="relative"
  >
    <header>
      <div class="bg-bg-inverted">
        <div class="flex flex-row justify-between px-2 sm:px-4 lg:px-5 py-2.5 lg:py-6 m-auto lg:max-w-[1192px]">
          <div class="flex flex-row gap-x-2 sm:gap-x-4 py-0.5 lg:py-0">
            <BurgerButton
              v-if="!forAsia"
              class="block md:hidden"
            />
            <CompanyLogo />
          </div>
          <div class="hidden md:flex items-center">
            <CurrencySelector />
            <DesktopTickers />
          </div>
          <AdSlot
            class="w-[130px] h-[64px] overflow-hidden hidden md:block"
            data-testid="desktop-banner"
            place="header_2"
          />
          <div class="hidden md:block">
            <SideLinks />
          </div>
          <div class="md:hidden flex gap-x-1 sm:gap-x-4 items-center">
            <InMobileHeaderBanner
              class="w-full h-full"
              data-testid="mobile-banner"
            />
            <CtMenuButton
              v-if="themeChangeEnabled"
              icon="crescent"
            />
            <CtMenuButton
              v-if="!forAsia"
              icon="magnifier"
              @click.native="toggleSearch()"
            />
            <BurgerButton
              v-if="forAsia"
              class="block md:hidden"
            />
          </div>
        </div>
      </div>
      <MenuDesktop v-if="deviceInfo.desktop" />
      <MobileTickers class="md:hidden bg-white" />

      <!--      <MenuMobile v-if="!forAsia && isMobileMenuOpened" />-->
      <AsiaMenuMobile v-if="forAsia && isMobileMenuOpened" />
    </header>
    <HeaderZoneBannerWrapper v-if="headerBannerVisible" />
  </div>
</template>
