<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '~/lib/framework';
import { MENU, VIEWPORT } from '~/store/types';
import CtMenuButton from '~/lib/ui/ct-menu-button/CtMenuButton.vue';

const store = useStore();

const isMobileMenuOpened = computed<boolean>(() => store.state.menu.isMobileMenuOpened);

const handleMenuToggle = (): void => {
  if (isMobileMenuOpened.value) {
    store.dispatch(`menu/${MENU.CLOSE_MOBILE_MENU}`);
    store.dispatch(`viewport/${VIEWPORT.SET_LOCK_SCROLL}`, false);
  } else {
    store.dispatch(`menu/${MENU.SET_SCROLL_BEFORE_OPENED}`, store.state.viewport.scrollTop);
    store.dispatch(`menu/${MENU.OPEN_MOBILE_MENU}`);
    store.dispatch(`viewport/${VIEWPORT.SET_LOCK_SCROLL}`, true);
  }
};
</script>

<template>
  <button
    ref="menuToggleButton"
    type="button"
    data-e2e="burger_menu"
    data-testid="mobile-burger"
    class="h-full w-full align-middle"
    @click="handleMenuToggle()"
  >
    <span class="btn__wrp w-4 h-4 block">
      <Transition class="fade">
        <CtMenuButton :icon="isMobileMenuOpened ? 'close' : 'menu'" />
      </Transition>
    </span>
  </button>
</template>
