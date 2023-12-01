<script lang="ts" setup>
import { SpecialCategorySection } from './index';
import { useQuery } from '~/graphql';
import mainPageReleasesQuery from '~/graphql/queries/mainPageReleases.graphql';
import { MAIN_PAGE_RELEASES_LENGTH } from '~/app.config';
import { computed } from 'vue';
import getProperty from '~/assets/libs/getProperty';
import { getMappedCategory } from '~/assets/helpers/posts';
import { useStore } from '~/lib/framework';
import { CategorySectionLike, type ReleasesQueryPayload } from './types';

defineProps<{
  asiaMobileVariant: boolean;
}>();

const store = useStore();
const languageShort = computed(() => store.state.currentLanguage.short);

const pageReleasesQuery = useQuery({
  query: mainPageReleasesQuery,
  variables: {
    short: languageShort,
    length: MAIN_PAGE_RELEASES_LENGTH,
  },
});
const currentLanguage = computed(() => store.state.currentLanguage);
const mapReceivedData = (
  payload: ReleasesQueryPayload,
  category: 'pressReleases' | 'marketReleases'
): CategorySectionLike => {
  const data = payload?.locale || {};
  const info = getProperty(data, category, {
    category: {
      slug: '',
      title: '',
    },
    posts: [],
    postsCount: 0,
  });
  return getMappedCategory(info, {
    languageDomain: currentLanguage.value.languageDomain,
    languageCode: currentLanguage.value.code,
    timeZone: currentLanguage.value.timezone,
    languageShort: currentLanguage.value.short,
  });
};

const pressReleases = computed(() => {
  return mapReceivedData(pageReleasesQuery.data.value, 'pressReleases');
});
const marketReleases = computed(() => {
  return mapReceivedData(pageReleasesQuery.data.value, 'marketReleases');
});

const arePressReleasesShown = computed(() => pressReleases.value.posts.length);
const areMarketReleasesShown = computed(() => marketReleases.value.posts.length);
</script>

<template>
  <div
    v-if="arePressReleasesShown || areMarketReleasesShown"
    :class="{
      'w-full mt-8 md:flex': !asiaMobileVariant,
    }"
  >
    <SpecialCategorySection
      v-if="arePressReleasesShown"
      :asia-mobile-variant="asiaMobileVariant"
      :category="pressReleases.category"
      :chunk-size="areMarketReleasesShown ? 2 : 3"
      :posts="pressReleases.posts"
      gtm-locator-variant="pressreleases"
      :class="{
        'md:basis-[67%]': !asiaMobileVariant && areMarketReleasesShown,
        'md:basis-full': !asiaMobileVariant && !areMarketReleasesShown,
        'flex-grow': !asiaMobileVariant,
      }"
    />

    <SpecialCategorySection
      v-if="areMarketReleasesShown"
      :asia-mobile-variant="asiaMobileVariant"
      :category="marketReleases.category"
      :chunk-size="arePressReleasesShown ? 1 : 3"
      :posts="marketReleases.posts"
      gtm-locator-variant="marketreleases"
      :class="{
        'md:basis-[33%] md:pl-6 md:rtl:pr-6': !asiaMobileVariant && arePressReleasesShown,
        'md:basis-full': !asiaMobileVariant && !arePressReleasesShown,
        'flex-grow mt-8 md:mt-0': !asiaMobileVariant,
        'mt-1': asiaMobileVariant,
      }"
    />
  </div>
</template>
