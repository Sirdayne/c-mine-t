<script setup lang="ts">
import { GuideCategory } from '~/graphql';
import { useStore } from '~/lib/framework';
import { computed } from 'vue';

const props = defineProps<{
  selectedCategory: GuideCategory | null | undefined;
  searchQuery: string;
  guidesCount: number;
}>();

const store = useStore();

const allCategoryTitle = computed(() => store.state.i18n.learnAllCategoryGuides);

const selectedCategoryTitle = computed(() => {
  if (!props.selectedCategory?.translate?.title) return `${allCategoryTitle.value}`;

  return `${props.selectedCategory.translate.title}`;
});

const guideSearchFoundTitle = computed(() => store.state.i18n.guideSearchFoundTitle);

const descriptionExists = computed(() => Boolean(props.selectedCategory?.translate?.description));

const title = computed(() => {
  if (!props.searchQuery) return selectedCategoryTitle.value;

  return `${props.guidesCount} ${guideSearchFoundTitle.value} "${props.searchQuery}"`;
});

const dataTestId = computed(() => (props.searchQuery ? 'search-guide-result-title' : 'guide-category-title'));
</script>

<template>
  <div>
    <h3
      :data-testid="dataTestId"
      class="text-[24px] leading-[48px] font-semibold md:text-[36px] mb-3 capitalize"
      :class="{
        'mb-8': !descriptionExists || searchQuery,
        'break-all': searchQuery,
      }"
    >
      {{ title }}
    </h3>
    <p
      v-if="descriptionExists && !searchQuery"
      class="font-normal text-ml leading-8 mb-8"
      data-testid="guide-category-description"
    >
      {{ selectedCategory.translate.description }}
    </p>
  </div>
</template>
