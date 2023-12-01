<template>
  <div :class="$style['podcast-page']">
    <PodcastsHero
      v-if="podcasts && podcasts.length"
      :podcasts="podcasts"
    />
    <div :class="$style['podcasts']">
      <div :class="$style['podcasts__body']">
        <PodcastBlock
          v-for="podcast in podcasts"
          :key="podcast.id"
          :podcast="podcast"
        />
        <PodcastDisclaimer />
      </div>
      <PodcastsSidebar />
      <PodcastMobileAdSection v-if="isMobileBreakpoint" />
    </div>
  </div>
</template>

<script lang="ts">
import PodcastsHero from '~/components/Podcasts/PodcastsHero.vue';
import PodcastBlock from '~/components/Podcasts/PodcastBlock.vue';
import { computed, watch } from 'vue';
import { getPodcastsPageMeta } from '~/assets/helpers/meta/podcasts';
import PodcastDisclaimer from '~/components/Podcasts/PodcastDisclaimer.vue';
import { PodcastsQueryDocument, SeoMetaQueryDocument, useQuery } from '~/graphql';
import { defineComponent, useMeta, useRoute, useStore } from '~/lib/framework';
import PodcastsSidebar from '~/components/Podcasts/PodcastsSidebar.vue';
import PodcastMobileAdSection from '~/components/Podcasts/PodcastMobileAdSection.vue';
import { provideDeviceInfo } from '~/lib/device-detector';
import { useLayoutUiStore } from '~/lib/layout-store';

export default defineComponent({
  name: 'Podcasts',
  components: {
    PodcastMobileAdSection,
    PodcastsSidebar,
    PodcastBlock,
    PodcastsHero,
    PodcastDisclaimer,
  },
  middleware({ store, redirect }) {
    if (!store.getters.IS_EN) {
      return redirect('/');
    }
  },
  setup() {
    provideDeviceInfo();
    const store: any = useStore();
    const route = useRoute();
    const layoutUiStore = useLayoutUiStore();

    const currentLanguage = computed(() => store.state.currentLanguage);
    const languages = computed(() => store.state.languages);
    const isMobileBreakpoint = computed(() => store.getters['viewport/IS_ONLY_MOBILE_BREAKPOINT']);

    const podcastsQuery = useQuery({
      query: PodcastsQueryDocument,
      variables: {
        short: store.state.currentLanguage.short,
      },
    });

    const podcasts = computed(() => {
      return podcastsQuery?.data.value?.locale?.podcasts?.map((podcast) => {
        return {
          ...podcast,
          playerType: 'large',
        };
      });
    });

    const pageMetaQuery = useQuery({
      query: SeoMetaQueryDocument,
      variables: {
        short: store.state.currentLanguage.short,
        url: route.value?.path,
      },
    });

    const meta = computed(() => {
      const localMeta = pageMetaQuery?.data.value?.locale?.seoMeta;
      return {
        url: localMeta?.seoMetaUrl,
        title: localMeta?.seoMetaTitle,
        description: localMeta?.seoMetaDescription,
        keywords: localMeta?.seoMetaKeywords,
      };
    });
    useMeta(() => {
      return getPodcastsPageMeta({
        currentLanguage: currentLanguage.value,
        languages: languages.value,
        meta: meta.value,
        routeName: route.value?.name,
        podcasts: podcasts.value,
      });
    });

    watch(
      () => podcasts,
      () => {
        layoutUiStore.setHeaderVariant('dark');
      },
      { immediate: true }
    );
    return {
      podcasts,
      isMobileBreakpoint,
    };
  },
  head: {},
});
</script>
<style lang="scss" module>
@import '~/assets/styles/_vars.scss';

.podcast-page {
  margin-bottom: 40px;
}

.podcasts {
  padding: 0 10px;
  margin: 0 auto;

  @media (min-width: $sm) {
    max-width: 637px;
  }
  @media (min-width: $md) {
    display: grid;
    grid-template-columns: 60% calc(40% - 60px);
    gap: 24px;
    margin: 0 auto;
    justify-content: space-between;
    padding: 0 24px;
    max-width: 1160px;
  }
  @media (min-width: $lg) {
    display: grid;
    max-width: 1180px;
    grid-template-columns: 760px 360px;
    gap: 40px;
    padding: 0;
  }
}
</style>
