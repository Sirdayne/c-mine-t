<script setup lang="ts">
import { type GlossaryItem } from '~/graphql';

defineProps<{
  items: {
    letter: string;
    links: GlossaryItem[];
  }[];
}>();

const formattedLinkTitle = (title: string) => {
  if (!title) return;
  return title.replace('#', '');
};
</script>

<template>
  <div
    class="px-[14px] pt-6 sm:px-[34px]"
    data-testid="glossary-results"
  >
    <div
      v-for="item in items"
      :id="`glossary-${item.letter}`"
      :key="item.letter"
      class="relative pb-[30px] mb-6 after:content-[''] after:absolute after:w-full after:h-[1px] after:bg-[#e3e6e7] after:bottom-0"
    >
      <div
        class="mb-[30px] leading-10 text-2xl text-[#b38105]"
        data-testid="glossary-ghead"
      >
        {{ item.letter }}
      </div>
      <ul class="p-0 m-0 list-none sm:grid sm:grid-cols-2 md:grid-cols-3 gap-x-[10px]">
        <li
          v-for="link in item.links"
          :key="link.id"
          class="glossary_listItem text-lg leading-[26px] text-black mb-4"
        >
          <a
            :href="link.link"
            :class="$style['glossary_link']"
            data-testid="glossary-link"
          >
            {{ formattedLinkTitle(link.title) }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '~/assets/styles/_mixins.scss';

.glossary_link {
  @include link-color-accent($color: inherit, $hover-border-color: #ffbb00);
  border-bottom: none;
  transition: none;
}
</style>
