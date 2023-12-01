<script setup lang="ts">
import { computed, onMounted, ref, toRef, watchEffect } from 'vue';
import { PaginatedGuidesDocument, SortEnum } from '~/graphql';
import GuideCard from './GuideCard.vue';
import { useStore } from '~/lib/framework';
import { useAutoLoadMore } from '~/components/useAutoLoadMore';
import { useQuery } from '@urql/vue';

const props = defineProps<{
  guideCategorySlug?: string | null;
  offset: number;
  isLast: boolean;
  postsLength: number;
  searchQuery?: string;
  isFirst: boolean;
}>();

const emit = defineEmits<{
  (e: 'load-more'): void;
  (e: 'update-guides-count', value: number): void;
}>();

const store = useStore();
const currentLanguageShort = computed(() => store.state.currentLanguage.short);

const guidesListing = ref<HTMLElement | null>();

const loadMore = computed(() => store.state.i18n.postsLoadMore);

/**
 * If All category selected guides order will be from newest to oldest
 * If category selected order will be from oldest to newest
 * https://jira.cointelegraph.com/browse/CDT-3551
 * */
const sorting = computed(() => (props.guideCategorySlug ? SortEnum.Asc : SortEnum.Desc));

const { data } = useQuery({
  query: PaginatedGuidesDocument,
  variables: {
    guideCategorySlug: toRef(props, 'guideCategorySlug'),
    offset: toRef(props, 'offset'),
    short: currentLanguageShort,
    length: toRef(props, 'postsLength'),
    sorting,
    query: toRef(props, 'searchQuery'),
  },
});

const guides = computed(() => data.value?.locale?.guides?.data ?? []);
const hasMore = computed(() => data.value?.locale?.guides?.hasMoreGuides);
const guidesCount = computed(() => data.value?.locale?.guides?.guidesCount ?? 0);

const handleLoadMore = (): void => {
  if (hasMore.value && props.isLast) {
    emit('load-more');
  }
};
onMounted(() => {
  useAutoLoadMore({
    target: guidesListing.value,
    callback: handleLoadMore,
  });
});

watchEffect(() => {
  if (props.searchQuery && props.isFirst) {
    emit('update-guides-count', guidesCount.value);
  }
});
</script>

<template>
  <div
    ref="guidesListing"
    class="mb-5"
  >
    <ul
      class="mb-0 -mr-[10px] -ml-[10px] gap-5 grid grid-cols-1 sm:grid-cols-2 sm:mx-0 md:grid-cols-3 sm:items-stretch"
    >
      <template v-for="guide in guides">
        <li
          :key="guide.id"
          class="w-full mx-auto max-w-[370px] md:max-w-[374px] rounded-lg"
        >
          <GuideCard
            :guide="guide"
            data-testid="guide-card rounded-lg"
          />
        </li>
      </template>
    </ul>
    <div
      v-if="isLast && hasMore"
      class="relative"
    >
      <div class="relative flex w-full justify-center items-center">
        <button
          v-if="hasMore && loadMore"
          class="btn block"
          data-testid="guide-load-more-button"
          @click="handleLoadMore"
        >
          <span class="btn__wrp">
            <span class="btn__icon guides-listing__more-icon h-4 w-4 my-8" />
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/_icons-common.scss' as icons;
.guides-listing__more-icon {
  @include icons.arrow-clockwise;
}
</style>
