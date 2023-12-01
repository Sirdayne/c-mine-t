<template>
  <div
    :class="$style['guides-top-zone']"
    class="pb-6 min-h-full"
  >
    <div class="container my-0 mx-auto sm:max-w-[637px] md:grid md:py-0 md:px-6 md:max-w-[1160px] lg:max-w-[1180px]">
      <Breadcrumbs
        :breadcrumbs="guidesCategoriesCrumbs"
        data-test-id="guide-categories-link"
        link-color="white"
      />
      <div class="flex flex-col sm:mt-8 mb-6 md:flex-row md:justify-between">
        <div class="flex flex-col md:mr-5 lg:mr-[90px] rtl:lg:ml-[90px] rtl:lg:mr-auto">
          <h1
            data-testid="learn-title"
            class="text-[30px] font-semibold leading-[1.2em] mb-4 text-white md:text-[44px]"
          >
            {{ allCategoryTitle }}
          </h1>
          <p
            data-testid="learn-leading-description"
            class="mb-4 text-[#e3e6e7] text-ml leading-[30px] font-normal tracking-[-0.02em]"
          >
            {{ leadingDescription }}
          </p>
          <p
            v-if="deviceInfo.desktop"
            :class="$style['guides-top-zone__description']"
            class="text-[#e3e6e7] text-ml leading-[30px] font-normal tracking-[-0.02em]"
            data-testid="learn-description"
            v-html="descriptionWithLinks"
          />
          <GuideSearchInput
            v-if="deviceInfo.desktop"
            :value="searchQuery"
            :placeholder="searchbarPlaceholder"
            @input="onSearchUpdate"
          />
        </div>
        <div>
          <OptimizedImage
            src="https://s3.cointelegraph.com/storage/uploads/view/82765cb380f69644ec8d11f3cfc3ca33.png"
            width="305"
            height="294"
            :srcset="coverRetina"
            :class="{ 'my-0 mx-auto': !deviceInfo.desktop }"
            class="min-w-[305px] min-h-[294px]"
          />

          <p
            v-if="!deviceInfo.desktop"
            class="text-[#e3e6e7] text-ml font-normal my-4"
            data-testid="learn-description"
            :class="{
              [$style['guides-top-zone__description']]: true,
            }"
            v-html="descriptionWithLinks"
          />
          <GuideSearchInput
            v-if="!deviceInfo.desktop"
            type="text"
            :value="searchQuery"
            :placeholder="searchbarPlaceholder"
            @input="onSearchUpdate"
          />
        </div>
      </div>

      <div class="flex flex-wrap">
        <GuideCategoryChip
          :guides-count="totalGuidesPosts"
          :category-title="allCategoryChipTitle"
          :selected="isSelected()"
        />
        <template v-if="allGuidesCategories">
          <GuideCategoryChip
            v-for="category in allGuidesCategories"
            :key="category.slug"
            :category-slug="category.slug"
            :guides-count="category.guidesCount"
            :category-title="category.translate.title"
            :selected="isSelected(category)"
          />
        </template>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import GuideCategoryChip from './GuideCategoryChip.vue';
import { computed } from 'vue';
import { useStore } from '~/lib/framework';
import { useDeviceInfo } from '~/lib/device-detector';
import { AllGuideCategoriesDocument, type GuideCategory, useQuery } from '~/graphql';
import { OptimizedImage } from '~/lib/image';
import { getThumbnail } from '~/assets/libs/getThumbnail';
import GuideSearchInput from '~/components/Guides/GuideSearchInput.vue';
import Breadcrumbs, { type Breadcrumb } from '~/components/Shared/Breadcrumbs.vue';

const props = defineProps<{
  selectedCategory: GuideCategory | null | undefined;
  searchQuery: string;
}>();

const emit = defineEmits<{
  (event: 'search-input', val: string): void;
}>();

const store = useStore();
const deviceInfo = useDeviceInfo();

const allCategoryChipTitle = computed(() => store.state.i18n.learnAllCategoryTitle);

const allCategoryTitle = computed(() => store.state.i18n.learnHeadingTitle);

const leadingDescription = computed(() => store.state.i18n.learnHeadingDescription);

const descriptionWithLinks = computed(() => store.state.i18n.learnHeadingDescriptionWithLinks);

const searchbarPlaceholder = computed(() => store.state.i18n.guideSearchbarPlaceholder);

const onSearchUpdate = (val: string): void => {
  emit('search-input', val);
};

const categoriesQuery = useQuery({
  query: AllGuideCategoriesDocument,
  variables: {
    short: computed(() => store.state.currentLanguage.short),
  },
});

const allGuidesCategories = computed(() => categoriesQuery?.data.value?.locale?.allGuideCategories ?? []);

const totalGuidesPosts = computed(() => {
  let counter = 0;
  allGuidesCategories.value?.forEach((guide) => {
    if (guide?.guidesCount) counter += guide.guidesCount;
  });
  return counter;
});

const isSelected = (category?: GuideCategory): boolean => {
  if (!category && !props.selectedCategory) return true;

  return props.selectedCategory?.slug === category?.slug;
};

const cover = computed(() => {
  return getThumbnail({
    imageUrl: 'https://s3.cointelegraph.com/storage/uploads/view/82765cb380f69644ec8d11f3cfc3ca33.png',
    width: 305,
  });
});

const coverRetina = computed(() => {
  const x2 = getThumbnail({
    imageUrl: 'https://s3.cointelegraph.com/storage/uploads/view/82765cb380f69644ec8d11f3cfc3ca33.png',
    width: 710,
  });
  return `${cover.value} 1x, ${x2} 2x`;
});

const guidesCategoriesCrumbs = computed(() => {
  const { selectedCategory } = props;
  const categoryTitle = selectedCategory?.translate?.title;

  const result: Breadcrumb[] = [
    {
      name: 'learn',
      path: '/learn',
    },
  ];

  if (categoryTitle) result.push({ name: categoryTitle, path: null });

  return result;
});
</script>
<style module lang="scss">
@import '~/assets/styles/_vars.scss';
@import '~/assets/styles/_mixins.scss';

.guides-top-zone {
  background: linear-gradient(180deg, #000000 0%, #37465e 100%);
  &__description a {
    @include link-color-accent($color-gray-150);
  }
}
</style>
