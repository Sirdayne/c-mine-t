<script setup lang="ts">
import LinkResolver from '~/components/Shared/LinkResolver.vue';
import { useRoute, useStore } from '~/lib/framework';
import { computed, ref, watch } from 'vue';
import { mainPageLinksEvent } from '~/assets/helpers/dataLayerEvents';
import { MENU, ROOT, VIEWPORT } from '~/store/types';

const store = useStore();
const route = useRoute();
const languageShort = computed(() => store.state.currentLanguage.short);
const isEn = computed(() => store.getters[ROOT.IS_EN]);
const mobileMenu = computed(() => store.state.menu.mobileMenu);
const currentLanguage = computed(() => store.state.currentLanguage);
const languages = computed(() => store.getters[ROOT.LANGUAGES_FOR_LANG_SELECTOR]);
const closeMenu = (): void => {
  store.dispatch(`menu/${MENU.CLOSE_MOBILE_MENU}`);
};
const lockScroll = (state: boolean): void => {
  store.dispatch(`viewport/${VIEWPORT.SET_LOCK_SCROLL}`, state);
};

const el = ref<HTMLElement | null>(null);

const sendDataLayerEvent = (): void => {
  if (isEn.value) {
    mainPageLinksEvent('burger');
  }
};

const closeDrawer = (): void => {
  closeMenu();
  lockScroll(false);
};

watch(
  () => route.value.fullPath,
  () => closeDrawer()
);
</script>

<template>
  <div
    ref="el"
    class="translate-y-12 overflow-y-scroll max-h-[calc(100svh_-_3rem)] min-h-full w-full h-[calc(100vh_-_3rem)] overflow-visible"
    @click.self="closeDrawer"
  >
    <div class="min-h-full bg-bg-default text-fg-strong w-60 py-4 menu-drawer__nav">
      <nav class="border-border-default border-b-default ltr:pl-4 rtl:pr-4">
        <ul>
          <li
            v-for="list in mobileMenu"
            :key="list.id"
            class="mb-4"
          >
            <LinkResolver
              v-if="list.url"
              class="block text-bodySStrong mb-2 underline uppercase"
              :to="list.url"
              :language-short="languageShort"
              :rel="list.isExternal ? 'noopener' : ''"
              :target="list.target"
              @click.capture="sendDataLayerEvent"
            >
              {{ list.title }}
            </LinkResolver>
            <span
              v-else
              class="block text-bodySStrong mb-2 uppercase"
            >
              {{ list.title }}
            </span>
            <ul
              v-if="list.children.length"
              class=""
            >
              <li
                v-for="item in list.children"
                :key="item.id"
                class="mb-2 last:mb-0"
              >
                <LinkResolver
                  class="text-bodyS underline"
                  :rel="list.isExternal ? 'noopener' : ''"
                  :to="item.url"
                  :language-short="languageShort"
                  @click.capture="sendDataLayerEvent"
                >
                  {{ item.title }}
                </LinkResolver>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <div
        v-if="languages.length"
        class="ltr:pl-4 rtl:pr-4 mt-4 pb-12"
      >
        <span class="uppercase text-bodySStrong block mb-2">
          {{ currentLanguage.name }}
        </span>
        <ul class="">
          <li
            v-for="item in languages"
            :key="item.id"
            class="text-bodyS underline mb-2 last:mb-0"
          >
            <a
              class=""
              data-testid="mobile-language-link"
              :href="item.url"
            >
              {{ item.name }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@keyframes menu-drawer-slide {
  0% {
    opacity: 0;
    transform: translateX(-50%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes menu-drawer-slide-rtl {
  0% {
    opacity: 0;
    transform: translateX(50%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.menu-drawer__nav {
  animation-duration: 0.3s;
  animation-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
  animation-fill-mode: both;
}
html[dir='ltr'] {
  .menu-drawer__nav {
    animation-name: menu-drawer-slide;
  }
}
html[dir='rtl'] {
  .menu-drawer__nav {
    animation-name: menu-drawer-slide-rtl;
  }
}
</style>
