<script lang="ts" setup>
import FooterChinaApp from '~/components/Footer/FooterChinaApp.vue';
import { useStore } from '~/lib/framework';
import { computed } from 'vue';
import { ROOT } from '~/store/types';
import { useDeviceInfo } from '~/lib/device-detector';

const store = useStore();
const device = useDeviceInfo();
const isCn = computed(() => store.getters[ROOT.IS_CN]);
const i18n = computed(() => store.state.i18n);

const apps = computed(() => [
  {
    type: 'ios',
    url: device.mobile ? i18n.value.iosAppUrlMobile : i18n.value.iosAppUrlDesktop,
    alt: i18n.value.iosAppAlt,
    imgSrc: '/assets/img/mobile-stores/app-store-badge.svg',
  },
  {
    type: 'android',
    url: device.mobile ? i18n.value.androidAppUrlMobile : i18n.value.androidAppUrlDesktop,
    imgSrc: '/assets/img/mobile-stores/play-store-badge.svg',
    alt: i18n.value.androidAppAlt,
  },
]);
</script>

<template>
  <div v-if="isCn">
    <ClientOnly>
      <FooterChinaApp
        v-if="isCn"
        class="text-center"
      />
    </ClientOnly>
  </div>
  <div v-else>
    <div class="flex flex-row gap-x-2 justify-center">
      <a
        v-for="app in apps"
        :key="app.type"
        :href="app.url"
        target="_blank"
      >
        <img
          :alt="app.alt"
          :src="app.imgSrc"
          class="cursor-pointer"
        />
      </a>
    </div>
  </div>
</template>
