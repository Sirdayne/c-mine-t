<template>
  <div
    class="podcast--blurred"
    :class="{
      [$style['podcast']]: true,
      [$style['podcast--blurred-background']]: true,
    }"
  >
    <div :class="$style['podcast--header']">
      <PodcastsBreadcrumbs :title="podcast.title" />
      <div :class="$style['podcast--header-wrapper']">
        <div :class="$style['podcast--header-title']">
          <h1
            v-if="podcast"
            :class="$style['podcast--title']"
            data-testid="podcast-page-title"
          >
            {{ podcast.title }}
          </h1>
          <PodcastTitleAuthors
            v-if="podcast && podcast.authorsWithDesc"
            :authors="podcast.authorsWithDesc"
          />
        </div>
        <img
          :class="$style['podcast--header-wrapper-image']"
          :src="podcastMobileImage"
          height="100"
          width="100"
        />
      </div>
    </div>
    <div
      v-if="podcast"
      :class="$style['podcast--row']"
    >
      <div>
        <h3
          v-if="podcast"
          :class="$style['podcast--description']"
          data-testid="podcast-description"
        >
          {{ podcast.description }}
        </h3>
        <PodcastPlatforms
          :podcast="podcast"
          :class="$style['section-margin-bottom']"
        />
        <PodcastPlayer
          v-if="podcast && podcast.buzzsproutPodcast"
          :class="{
            [$style['podcast--player']]: true,
            [$style['section-margin-bottom']]: true,
          }"
          :podcast-id="podcast.buzzsproutPodcast.id"
          :player-type="podcast.playerType"
        />
        <PodcastAuthorsSection
          :podcast="podcast"
          :class="$style['section-margin-bottom']"
        />
        <PodcastsCarousel
          v-if="podcastsWithoutCurrent && podcastsWithoutCurrent.length"
          :class="$style['section-margin-bottom']"
          :other-podcasts="podcastsWithoutCurrent"
        />
        <PodcastDisclaimer
          :podcast="podcast"
          :class="$style['section-margin-bottom']"
        />
        <PodcastRelatedArticles
          v-if="posts && posts.length"
          :posts="posts"
          :class="$style['section-margin-bottom']"
        />
      </div>
      <PodcastsSidebar />
      <PodcastMobileAdSection v-if="isMobileBreakpoint" />
    </div>
  </div>
</template>

<script lang="ts">
import { PODCAST } from '~/store/types';
import { computed, onBeforeUnmount, onMounted, watch, watchEffect } from 'vue';
import PodcastsBreadcrumbs from '~/components/Podcast/PodcastsBreadcrumbs.vue';
import PodcastAuthorsSection from '~/components/Podcast/PodcastAuthorsSection.vue';
import PodcastPlatforms from '~/components/Podcast/PodcastPlatforms.vue';
import PodcastsCarousel from '~/components/Podcast/PodcastsCarousel.vue';
import PodcastDisclaimer from '~/components/Podcasts/PodcastDisclaimer.vue';
import {
  SeoMetaQueryDocument,
  PodcastsQueryDocument,
  PodcastQueryDocument,
  useQuery,
  TagPagePostsQueryDocument,
} from '~/graphql';
import { getMappedPostPreview } from '~/assets/helpers/posts';
import PodcastRelatedArticles from '~/components/Podcast/PodcastRelatedArticles.vue';
import { useRoute, useStore, defineComponent, useMeta, useContext } from '~/lib/framework';
import { getPodcastsPageMeta } from '~/assets/helpers/meta/podcasts';
import PodcastPlayer from '~/components/Podcasts/PodcastPlayer.vue';
import PodcastTitleAuthors from '~/components/Podcast/PodcastTitleAuthors.vue';
import { provideDeviceInfo } from '~/lib/device-detector';
import PodcastsSidebar from '~/components/Podcasts/PodcastsSidebar.vue';
import PodcastMobileAdSection from '~/components/Podcasts/PodcastMobileAdSection.vue';
import { useLayoutUiStore } from '~/lib/layout-store';

export default defineComponent({
  name: 'PodcastPage',
  components: {
    PodcastMobileAdSection,
    PodcastsSidebar,
    PodcastTitleAuthors,
    PodcastPlayer,
    PodcastDisclaimer,
    PodcastsCarousel,
    PodcastPlatforms,
    PodcastAuthorsSection,
    PodcastsBreadcrumbs,
    PodcastRelatedArticles,
  },
  middleware({ store, redirect }) {
    if (!store.getters.IS_EN) {
      return redirect('/');
    }
  },
  setup() {
    provideDeviceInfo();
    const store = useStore();
    const route = useRoute();
    const context = useContext();
    const layoutUiStore = useLayoutUiStore();

    const slug = computed(() => route.value?.params?.slug ?? '');
    const currentLanguage = computed(() => store.state.currentLanguage);
    const languages = computed(() => store.state.languages);
    const isMobileBreakpoint = computed(() => store.getters['viewport/IS_ONLY_MOBILE_BREAKPOINT']);

    const allPodcastsQuery = useQuery({
      query: PodcastsQueryDocument,
      variables: {
        short: store.state.currentLanguage.short,
      },
    });
    const podcastQuery = useQuery({
      query: PodcastQueryDocument,
      variables: {
        short: computed(() => store.state.currentLanguage.short),
        slug,
      },
    });
    const podcast = computed(() => {
      return {
        ...podcastQuery?.data.value?.locale?.podcast,
        playerType: 'large',
      };
    });

    const podcasts = computed(() => {
      return allPodcastsQuery?.data.value?.locale?.podcasts?.map((podcast) => {
        return {
          ...podcast,
          playerType: 'large',
        };
      });
    });

    const postsQuery = useQuery({
      query: TagPagePostsQueryDocument,
      variables: {
        short: store.state.currentLanguage.short,
        offset: 0,
        length: 6,
        slug: podcast.value?.tag?.slug ?? '',
      },
    });

    const posts = computed(() => {
      const localPosts = postsQuery?.data?.value?.locale?.tag?.posts?.data;
      return localPosts?.map((item) =>
        getMappedPostPreview(item, {
          languageDomain: currentLanguage.value?.languageDomain,
          languageCode: currentLanguage.value?.languageCode,
          timeZone: currentLanguage.value?.timeZone,
          languageShort: currentLanguage.value?.short,
        })
      );
    });

    const podcastsWithoutCurrent = computed(() => {
      return podcasts.value?.filter((localPodcast) => localPodcast.slug !== podcast.value?.slug);
    });

    const podcastMobileImage = computed(() => {
      return podcast.value?.buzzsproutPodcast?.artworkUrl;
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

    const setLayoutImage = (imgUrl: string) => {
      store.dispatch(`podcast/${PODCAST.SET_IMAGE_URL}`, imgUrl);
    };
    onMounted(() => {
      if (podcast.value) {
        setLayoutImage(podcast.value?.buzzsproutPodcast?.artworkUrl);
      }
    });
    onBeforeUnmount(() => {
      setLayoutImage('');
    });

    watchEffect(() => {
      if (podcastQuery.data.value?.locale?.podcast === null && slug.value) {
        context.error({ statusCode: 404 });
      }
    });
    watch(
      () => podcast,
      () => {
        layoutUiStore.setHeaderVariant('dark');
      },
      { immediate: true }
    );
    return {
      podcast,
      isMobileBreakpoint,
      podcastsWithoutCurrent,
      podcastMobileImage,
      posts,
    };
  },
  head: {},
});
</script>

<style module lang="scss">
@import '~/assets/styles/_vars.scss';
@import '~/assets/styles/_mixins.scss';

.podcast {
  color: $color-white;
  position: relative;
  padding-bottom: 64px;
  background: $color-black-950;
  &--blurred-background::before {
    position: absolute;
    content: ' ';
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: -1;
    backdrop-filter: blur(100px);
    -webkit-backdrop-filter: blur(100px);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  &--header {
    padding: 0 10px;
    margin: 0 auto;
    @media (min-width: $sm) {
      max-width: 637px;
    }
    @media (min-width: $md) {
      padding: 0 24px;
      max-width: 1160px;
    }
    @media (min-width: $lg) {
      max-width: 1180px;
      padding: 0;
    }
  }
  &--header-title {
    align-self: end;
  }
  &--header-wrapper {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
  }
  &--header-wrapper-image {
    border-radius: 16px;
    @media (min-width: $xs) {
      display: none;
    }
  }
  &--description {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    @include section-title(16px, 400);
    color: $color-gray-150;
    margin: 0 0 24px 0;
    @media (min-width: $xs--tablet) {
      @include section-title(18px, 400);
      line-height: 27px;
    }
  }
  &--title {
    font-style: normal;
    font-weight: 600;
    font-size: 30px;
    line-height: 40px;
    margin: 0;
    @media (min-width: $xs--tablet) {
      font-size: 44px;
      line-height: 58px;
    }
  }
  &--with {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    margin: 0 0 24px 0;
  }
  &--player {
    padding: 0;
  }
  &--row {
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
}
.section-margin-bottom {
  margin-bottom: 48px;
  @media screen and (min-width: $md) {
    margin-bottom: 64px;
  }
}
</style>
