<script setup lang="ts">
import { useRoute, useStore } from '~/lib/framework';
import { computed, ref, nextTick, watch } from 'vue';
import { MENU, ROOT } from '~/store/types';
import { useFeatureManager } from '~/lib/feature-manager';
import MenuDesktopSub from './MenuDesktopSub.vue';
import LinkResolver from '~/components/Shared/LinkResolver.vue';
import { mainPageLinksEvent } from '~/assets/helpers/dataLayerEvents';
import CtMenuButton from '~/lib/ui/ct-menu-button/CtMenuButton.vue';
import ChangeThemeButton from '~/features/app-header/ChangeThemeButton.vue';
import HeaderSearch from '~/components/Header/HeaderSearch.vue';

const root = ref<HTMLElement | null>(null);
const searchForm = ref<HTMLElement | null>(null);
const searchToggleButton = ref<HTMLElement | null>(null);
const route = useRoute();
const fullPath = computed(() => route.value.fullPath);
const featureManager = useFeatureManager();
const themeChangeEnabled = featureManager.isEnabled('change_theme_enabled');
const store = useStore();
const languageShort = computed(() => store.state.currentLanguage.short);
const isSearchOpened = computed(() => store.state.menu.isSearchOpened);
const desktopMenu = computed(() => store.state.menu.desktopMenu);
const isEn = computed(() => store.getters[ROOT.IS_EN]);
const openSearch = () => store.dispatch(`menu/${MENU.OPEN_SEARCH}`);
const closeSearch = () => store.dispatch(`menu/${MENU.CLOSE_SEARCH}`);

const handleRouteChange = (value: string, prevValue: string): void => {
  if (value !== prevValue) {
    root.value?.focus();
  }
};
const handleSearchOpened = (isSearchOpened: boolean): void => {
  nextTick(() => {
    if (isSearchOpened) {
      searchForm.value?.focus();
    }
  });
};
const handleSearchToggle = (): void => {
  if (isSearchOpened.value) {
    closeSearch();
  } else {
    openSearch();
  }
};
const getLocatorName = (name: string): string => {
  const replacedName = name.toLowerCase().replace(/\s/g, '_');
  return `menubar_clickon_${replacedName}`;
};

const sendDataLayerEvent = (): void => {
  if (isEn.value) {
    mainPageLinksEvent('burger');
  }
};
watch(fullPath, handleRouteChange);
watch(isSearchOpened, handleSearchOpened);
</script>

<template>
  <div
    tabindex="-1"
    class="bg-bg-primary"
    :class="{
      'font-semibold': featureManager.isEnabled('asia_mobile_layout'),
    }"
  >
    <div class="relative flex justify-between max-w-[972px] lg:max-w-[1192px] md:px-3 lg:px-5 m-auto">
      <nav class="flex items-center">
        <div
          v-for="item in desktopMenu"
          :key="item.id"
        >
          <MenuDesktopSub
            v-if="item.children.length"
            :cap="item.title"
            :list="item.children"
          />
          <LinkResolver
            v-else-if="item.url"
            class="block py-2 md:px-2 lg:px-4 text-uiMWeak hover:bg-fg-default hover:text-fg-inverted transition-[background-color]"
            :to="item.url"
            :target="item.target"
            :language-short="languageShort"
            :data-gtm-locator="getLocatorName(item.title)"
            data-testid="menu-link"
            @click.capture="sendDataLayerEvent"
          >
            {{ item.title }}
          </LinkResolver>
        </div>
      </nav>
      <div class="flex">
        <ChangeThemeButton v-if="themeChangeEnabled" />
        <button
          ref="searchToggleButton"
          class="hover:bg-fg-default px-2 py-1 cursor-pointer group"
          type="button"
          data-gtm-locator="menubar_search"
          data-testid="search"
          @click.stop="handleSearchToggle"
        >
          <CtMenuButton icon="magnifier" />
        </button>
        <Transition name="drop">
          <HeaderSearch
            v-if="isSearchOpened"
            ref="searchForm"
            class="absolute top-full ltr:right-5 rtl:left-5 p-4 z-10"
            @close-search="handleSearchToggle"
          />
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
