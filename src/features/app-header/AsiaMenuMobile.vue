<script setup lang="ts">
import { useRoute, useStore } from '~/lib/framework';
import { computed, ref, watch } from 'vue';
import { MENU, ROOT, VIEWPORT } from '~/store/types';
import AsiaMenuDrawerPart from './AsiaMenuDrawerPart.vue';

const SEARCH_URL = '/search';

const searchInput = ref<HTMLInputElement | null>(null);
const container = ref<HTMLElement | null>(null);
const searchQuery = ref<string>('');
const showLanguages = ref<boolean>(false);
const store = useStore();
const currentLanguage = computed(() => store.state.currentLanguage);
const languages = computed(() => store.getters[ROOT.LANGUAGES_FOR_LANG_SELECTOR]);
const route = useRoute();

const closeMenu = (): void => {
  store.dispatch(`menu/${MENU.CLOSE_MOBILE_MENU}`);
};
const lockScroll = (value: boolean): void => {
  store.dispatch(`viewport/${VIEWPORT.SET_LOCK_SCROLL}`, value);
};

const mobileMenuParts = computed(() => {
  const mobileMenu = store.state.menu.mobileMenu;

  return {
    first: mobileMenu.slice(0, 3),
    second: mobileMenu.slice(3),
  };
});

const closeDrawer = (): void => {
  closeMenu();
  lockScroll(false);
};

const handleSubmit = (): void => {
  if (searchQuery.value) {
    const query = encodeURIComponent(searchQuery.value.trim());
    if (!query.length) {
      searchInput.value?.focus();
      return;
    }
    closeMenu();
    const name = searchInput.value?.name;
    window.location.href = `${SEARCH_URL}?${name}=${query}`;
  }
};

const toggleLanguages = (): void => {
  showLanguages.value = !showLanguages.value;
  if (showLanguages.value) {
    setTimeout(() => {
      const yScrollPosition = container.value?.offsetHeight || 0;
      if (yScrollPosition > 0) {
        container.value?.scrollTo(0, yScrollPosition);
      }
    }, 300);
  }
};

watch(
  () => route.value.fullPath,
  () => closeDrawer()
);
</script>

<template>
  <div
    class="asia-menu-drawer"
    tabindex="-1"
    @click.self="closeDrawer"
  >
    <nav
      ref="container"
      class="asia-menu-drawer__nav"
    >
      <form
        class="asia-menu-drawer__search"
        role="search"
        autocomplete="off"
        @submit.prevent="handleSubmit"
      >
        <input
          ref="searchInput"
          :value="searchQuery"
          @input="searchQuery = $event.target.value"
          type="text"
          name="query"
          data-testid="search-input-asia-mobile"
          class="asia-menu-drawer__search-input"
          autocomplete="off"
        />
      </form>
      <div class="asia-menu-drawer__category-parts">
        <div class="asia-menu-drawer__category-part">
          <AsiaMenuDrawerPart :list="mobileMenuParts.first" />
        </div>
        <div class="asia-menu-drawer__category-part">
          <AsiaMenuDrawerPart :list="mobileMenuParts.second" />
        </div>
      </div>
      <div
        v-if="languages.length"
        class="asia-menu-drawer__languages"
        :class="showLanguages && 'asia-menu-drawer__languages_open'"
        data-testid="mobile-asia-language-button"
        @click="toggleLanguages"
      >
        {{ currentLanguage.name }}
      </div>
      <transition name="fade">
        <ul
          v-if="showLanguages"
          class="asia-menu-drawer__list"
        >
          <li
            v-for="item in languages"
            :key="item.id"
            class="asia-menu-drawer__item asia-menu-drawer__item_language"
          >
            <a
              class="asia-menu-drawer__item-link asia-menu-drawer__item-link_language"
              data-testid="mobile-asia-language-link"
              :href="item.url"
            >
              {{ item.name }}
            </a>
          </li>
        </ul>
      </transition>
    </nav>
  </div>
</template>

<style scoped lang="scss">
@import '~/assets/styles/_vars.scss';

.asia-menu-drawer {
  display: flex;
  flex-direction: column;
  outline: none;
}

.asia-menu-drawer__header-mobile {
  flex-shrink: 0;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  backface-visibility: hidden;
}

.asia-menu-drawer__nav {
  position: fixed;
  z-index: 1000;
  width: 100%;
  overflow: scroll;
  top: 48px;
  height: calc(100% - 48px);
  padding: 12px 16px;
  background: #253137;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  box-sizing: border-box;
  animation: asia-menu-drawer-slide 0.3s;
}

.asia-menu-drawer__search {
  margin-bottom: 26px;
}

.asia-menu-drawer__search-input {
  width: 100%;
  height: 40px;
  padding-left: 40px;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTkiIGhlaWdodD0iMTkiIHZpZXdCb3g9IjAgMCAxOSAxOSI+PGRlZnM+PHBhdGggaWQ9Im9xaWFhIiBkPSJNMjggNzAuNWE2LjUgNi41IDAgMSAxIDEzIDAgNi41IDYuNSAwIDAgMS0xMyAwem02LjUgOC41YTguNDY0IDguNDY0IDAgMCAwIDUuMjYyLTEuODI0bDMuOSAzLjkgMS40MTQtMS40MTUtMy45LTMuOUE4LjUgOC41IDAgMSAwIDM0LjUgNzl6Ii8+PC9kZWZzPjxnPjxnIG9wYWNpdHk9Ii4yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjYgLTYyKSI+PHVzZSBmaWxsPSIjZmZmIiB4bGluazpocmVmPSIjb3FpYWEiLz48L2c+PC9nPjwvc3ZnPg==);
  background-position: 10px center;
  background-repeat: no-repeat;
  background-color: #343c42;
  border: none;
  border-radius: 4px;
  color: #7e8488;
  font-size: 1rem;
  font-weight: 600;
  box-sizing: border-box;
}

.asia-menu-drawer__category-parts {
  display: flex;
  justify-content: space-between;
}

.asia-menu-drawer__category-part {
  width: calc(50% - 10px);
}

.asia-menu-drawer__list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.asia-menu-drawer__languages {
  display: flex;
  height: 52px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  line-height: 18px;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  margin-top: 23px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.asia-menu-drawer__languages::after {
  content: '';
  position: relative;
  top: 2px;
  border: 4px solid transparent;
  border-top: 4px solid #878d90;
  transform: rotate(0deg);
  transform-origin: 4px 2px;
  transition: transform 0.3s ease-in;
}

.asia-menu-drawer__languages_open::after {
  transform: rotate(-180deg);
}

.asia-menu-drawer__item_language {
  padding: 15px 0;
}

.asia-menu-drawer__item-link_language {
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  line-height: 18px;
  text-decoration: none;
  box-sizing: border-box;
}

.asia-menu-drawer__item-link_language:hover,
.asia-menu-drawer__item-link_language:focus {
  color: #fff;
}

@supports (position: -webkit-sticky) {
  .asia-menu-drawer__header-mobile {
    position: -webkit-sticky;
  }
}

@supports (position: sticky) {
  .asia-menu-drawer__header-mobile {
    position: sticky;
  }
  .asia-menu-drawer__nav {
    margin-top: 0;
  }
}
</style>
