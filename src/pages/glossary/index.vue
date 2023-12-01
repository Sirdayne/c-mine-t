<script setup lang="ts">
import { ref, computed, unref, watch, type ComponentPublicInstance } from 'vue';
import { useStore, defineComponent } from '~/lib/framework';
import { groupBy } from 'lodash';
import { useQuery, GlossaryPageQueryDocument } from '~/graphql';
import { GlossaryResults } from '~/features/glossary';
import { onKeyStroke } from '@vueuse/core';
import { SeoMeta } from '~/features/meta/SeoMeta';

const store = useStore();
const i18n = computed(() => store.state.i18n);
const languageShort = computed(() => store.state.currentLanguage.short);

const glossaryPageQuery = useQuery({
  query: GlossaryPageQueryDocument,
  variables: {
    short: languageShort.value,
  },
});

const allGlossaryItems = computed(() => {
  return glossaryPageQuery.data?.value?.locale?.glossary;
});

const menuElementRef = ref<HTMLElement | null>(null);
const menuAnchorRef = ref<HTMLElement | null>(null);

const selected = ref('A');
const searchStr = ref('');

const isLetter = (letter: string) => {
  return /[a-zA-Z]/.test(letter);
};

const groupedGlossaryItems = computed(() => {
  const mappedGlossary = allGlossaryItems.value?.map((link) => {
    const noLetterItem = link?.title && !isLetter(link?.title.charAt(0));
    return noLetterItem ? { ...link, title: `#${link.title}` } : link;
  });

  const groups = groupBy(mappedGlossary, (item) => {
    return item?.title.charAt(0).toUpperCase();
  });

  const result = Object.keys(groups).map(function (key) {
    return { letter: key, links: groups[key] };
  });

  return result;
});

watch(searchStr, (searchStr) => {
  const firstChar = searchStr.charAt(0).toUpperCase();
  selected.value = !isLetter(firstChar) ? '#' : firstChar;
  scrollToTopMenu();
});

const filteredByInputGlossaryItems = computed(() => {
  const items = unref(groupedGlossaryItems);
  const searchString = unref(searchStr.value);
  if (!searchString) {
    return items;
  } else {
    const letterGroup = { ...items.find((item) => item.letter === selected.value) };
    letterGroup.links = letterGroup.links?.filter((link) =>
      link?.title.toLowerCase().includes(searchString.toLowerCase())
    );
    return [letterGroup];
  }
});

const noResult = computed(() => {
  return searchStr.value && !filteredByInputGlossaryItems.value[0].links?.length;
});

const resultGlossaryItems = computed(() => {
  return searchStr.value ? filteredByInputGlossaryItems.value : groupedGlossaryItems.value;
});

const scrollToGroup = (letter: string) => {
  const groupElement = document.getElementById(`glossary-${letter}`);
  const yOffset = menuElementRef.value?.offsetHeight || 0;
  if (groupElement) {
    const y = groupElement.getBoundingClientRect().top + window.scrollY - yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
    selected.value = isLetter(letter) ? letter : '#';
  } else {
    scrollToTopMenu();
  }
};

const scrollToTopMenu = () => {
  setTimeout(() => {
    if (!menuAnchorRef.value) {
      return;
    }
    const { bottom } = menuAnchorRef.value.getBoundingClientRect();
    const y = bottom + window.scrollY;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }, 0);
};

const focused = ref<boolean>(false);

onKeyStroke((e) => {
  const key = e.key.toUpperCase();
  if (focused.value || key.length > 1 || !isLetter(key)) {
    return;
  }
  scrollToGroup(key);
});
</script>

<script lang="ts">
export default defineComponent({
  head: {},
});
</script>

<template>
  <div class="px-4 pt-2 m-auto mb-[250px] md:max-w-[952px] md:pt-0 lg:max-w-[1160px] lg:p-0 lg:pt-4">
    <SeoMeta />
    <div class="glossary_TopHeader" />
    <div>
      <h1
        class="font-bold text-2xl leading-[33px] tracking-[-0.02em] text-gray-[#1f282d] mb-3 lg:text-4xl"
        data-testid="glossary-title"
      >
        {{ i18n.glossaryHeading }}
      </h1>
      <p
        class="font-normal text-ml leading-7 text-[#35434a] mb-4 max-w-[846px]"
        data-testid="glossary-description"
      >
        {{ i18n.glossaryDesc }}
      </p>

      <p
        class="font-normal text-m leading-6 text-[#809098] relative mb-6 hidden sm:flex items-center"
        data-testid="glossary-note"
      >
        <img
          class="w-5 h-[14px] mr-[10px]"
          src="/assets/img/icons/keyboard.svg"
          alt="Keyboard"
        />
        {{ i18n.glossaryKeyboard }}
      </p>
    </div>
    <div ref="menuAnchorRef" />
    <div
      ref="menuElementRef"
      class="flex flex-col items-center sticky z-[1] top-0"
    >
      <div
        class="glossary-alphabet grid rounded-xl max-w-[1160px] bg-[#f1f3f4] w-full p-1 my-1 box-border sm:grid-cols-13 md:flex sm:flex-wrap sm:justify-start lg:justify-between"
        data-testid="glossary-alphabet"
      >
        <div
          v-for="item in groupedGlossaryItems"
          :key="item.letter"
          class="w-6 h-6 cursor-pointer flex items-center justify-center self-center hover:shadow-[inset_0_-3px_0_0_#fabf2c] sm:w-[36px] sm:h-[36px] md:min-w-[42px] md:w-[42px] md:h-[42px]"
          :class="{ 'bg-[#fabf2c] rounded-[8px]': item.letter === selected }"
          @click="scrollToGroup(item.letter)"
        >
          <span
            class="font-semibold text-[13px] leading-6 text-[#35434a] tracking-[0.01em] sm:text-m"
            data-testid="glossary-letter"
            >{{ item.letter }}</span
          >
        </div>
      </div>
      <div class="glossary_search relative cursor-pointer max-w-[1160px] w-full">
        <input
          @focus="focused = true"
          @blur="focused = false"
          v-model="searchStr"
          type="text"
          class="w-full text-base h-10 pl-3 pr-10 leading-6 border-[1.5px] border-[#e3e6e7] rounded-xl box-border cursor-pointer font-normal focus:border-[#c8d0d3] outline-none focus:shadow-[0_2px_20px_0_#0000000d] paceholder:font-normal paceholder:text-[15px] paceholder:color-[#809098]"
          placeholder="Search glossary terms..."
          data-testid="glossary-input"
        />
        <img
          class="absolute w-[18px] h-[18px] right-[15px] top-[11px]"
          src="/assets/img/icons/magnifier.svg"
          alt="magnifier"
        />
      </div>
    </div>
    <GlossaryResults
      v-if="!noResult"
      :items="resultGlossaryItems"
      :search="searchStr"
    />
    <div
      v-else
      class="pt-6"
    >
      Nothing found
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '~/assets/styles/_vars.scss';

.glossary_TopHeader {
  position: fixed !important;
  z-index: 1;
  width: 100%;
  left: 0;
}

.glossary_TopHeader {
  top: 0;
  z-index: 5;

  .tickers-mobile {
    background: #fff;
    margin: 0;
    width: 100%;
  }
}

.glossary--header-zone__header {
  position: fixed !important;
  width: 100%;
}

.glossary-alphabet {
  grid-template-columns: repeat(13, 1fr);
}
</style>
