<script setup lang="ts">
import { useStore } from '~/lib/framework';
import { computed, onMounted, ref } from 'vue';
import chunk from 'lodash/chunk';
import { isOutOfViewport } from '~/assets/helpers/isOutOfViewport';
import { mainPageLinksEvent } from '~/assets/helpers/dataLayerEvents';
import { ROOT } from '~/store/types';
import LinkResolver from '~/components/Shared/LinkResolver.vue';
import { ListItem } from '~/features/app-header/ListItem';

const MAX_PER_COLUMN = 3;

const props = defineProps<{
  cap: string;
  list: ListItem[];
}>();

const root = ref<HTMLElement | null>(null);

const store = useStore();
const languageShort = computed(() => store.state.currentLanguage.short);
const isEn = computed(() => store.getters[ROOT.IS_EN]);
const columns = computed(() => chunk(props.list, MAX_PER_COLUMN));

const checkIfSubMenuIsOutViewport = (): void => {
  const submenu = root.value?.querySelector('.columns-container');
  if (submenu && isOutOfViewport(submenu).any) {
    submenu?.classList.add('flex-wrap');
  }
};
const getLocatorName = (name: string): string => {
  const replacedName = name.toLowerCase().replace(/\s/g, '_');
  return `${props.cap.toLowerCase()}_clickon_${replacedName}`;
};
const sendDataLayerEvent = (): void => {
  if (isEn.value) {
    mainPageLinksEvent('burger');
  }
};
const clickHandler = ({ target }: { target: HTMLElement }): void => {
  sendDataLayerEvent();
  target.blur();
};
onMounted(() => {
  checkIfSubMenuIsOutViewport();
});
</script>

<template>
  <div
    ref="root"
    class="desktop-sub relative group cursor-default bg-inherit hover:bg-fg-default transition"
  >
    <span
      class="px-4 py-2 flex items-center group-hover:text-fg-inverted gap-x-1 transition text-uiMWeak"
      :data-gtm-locator="`menubar_clickon_${cap.toLowerCase()}`"
    >
      {{ cap }}
      <component
        :is="require(`~/assets/icons/arrow-md.svg?inline`)"
        alt="arrow"
        class="text-fg-default rotate-270 group-hover:rotate-90 group-hover:text-fg-inverted transition text-uiMWeak"
      />
    </span>
    <div
      class="columns-container absolute ltr:left-0 rtl:right-0 top-full w-auto min-w-full flex overflow-hidden bg-bg-subtle invisible matrix group-hover:z-10 group-hover:opacity-100 group-hover:visible"
    >
      <div
        v-for="(column, index) in columns"
        :key="index"
        class="w-full"
      >
        <div
          v-for="item in column"
          :key="item.id"
          :title="item.title"
          class="hover:bg-fg-muted hover:text-fg-inverted transition-[background-color]"
        >
          <LinkResolver
            class="flex items-center text-fg-default hover:text-white whitespace-nowrap transition-colors h-10 min-w-[150px] pl-4 pr-2 text-uiMWeak"
            :rel="item.isExternal ? 'noopener' : ''"
            :to="item.url"
            :target="item.target"
            :language-short="languageShort"
            :data-gtm-locator="getLocatorName(item.title)"
            data-testid="menu-link"
            @click.capture="clickHandler"
          >
            {{ item.title }}
          </LinkResolver>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.matrix {
  transform: matrix(1, 0, 0, 0.1, 0, 0);
  transform-origin: center 0 0;
  transition: opacity 0.15s, transform 0.15s;
}
.desktop-sub:hover .matrix {
  transform: matrix(1, 0, 0, 1, 0, 0);
  transition-duration: 0.3s;
}
</style>
