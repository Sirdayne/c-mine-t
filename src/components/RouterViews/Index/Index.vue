<template>
  <div
    class="main-page"
    :class="isRtl && 'main-page_rtl'"
  >
    <div class="container">
      <UniBlock
        class="main-page__uni-block"
        theme="inline"
        :type="UNI_BLOCK_TYPES.TOP"
      />
      <div class="lg:border-default lg:border-border-default rounded-lg lg:shadow-default lg:p-5">
        <CarouselMain />
        <SpecialCategorySectionContainer :asia-mobile-variant="false" />
      </div>
      <div class="mt-5">
        <h2
          v-if="hasTitle"
          class="pt-5 mb-5 text-[28px] leading-8 font-semibold"
        >
          {{ i18n.mainPageCryptoNewsTitle }}
        </h2>
        <template v-for="(variables, index) in variablesSet">
          <PostsListingMain
            :key="index"
            :index="index"
            :posts-offset="variables.offset"
            :ads-enabled="index === 0"
            :after-load-more-banner-visible="showMobileBannerAfterLoad(index)"
            :has-more-active="index === variablesSet.length - 1"
            @load-more="handleLoadMore"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { ROOT } from '~/store/types';
import { UNI_BLOCK_TYPES } from '~/app.config';
import { pushVirtualPageView } from '~/assets/helpers/dataLayerEvents';
import getProperty from '~/assets/libs/getProperty';
import { getMainPageMeta } from '~/assets/helpers/meta';
import UniBlock from '~/components/Shared/UniBlock.vue';
import { useExternalScript } from '~/assets/libs/ExternalScriptManager/useExternalScript';
import { SpecialCategorySectionContainer } from '~/features/special-category-section';
import { SeoMetaQueryDocument, useQuery } from '~/graphql';
import { computed, ref } from 'vue';
import { useStore } from '~/lib/framework';
import { PostsListingMain } from '~/components/PostsListing';
import { useDeviceInfo } from '~/lib/device-detector';
import { getMappedMeta } from '~/assets/helpers/seo';
import CarouselMain from '~/components/CarouselMain/CarouselMain.vue';

/**
 * Recently collected mint widget script url
 * */
const MINT_RECENTLY_COLLECTED_WIDGET = 'https://www.unpkg.com/@mintmade/widgets/dist/recentlyCollected.min.js';

export default {
  name: 'MainPage',
  components: {
    PostsListingMain,
    SpecialCategorySectionContainer,
    CarouselMain,
    UniBlock,
  },
  props: {
    basicData: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    useExternalScript(MINT_RECENTLY_COLLECTED_WIDGET);

    const store = useStore();
    const deviceInfo = useDeviceInfo();
    const short = computed(() => store.state.currentLanguage.short);

    const pageMetaQuery = useQuery({
      query: SeoMetaQueryDocument,
      variables: {
        short,
        url: '/',
      },
    });

    const meta = computed(() => {
      const rawMeta = pageMetaQuery?.data.value?.locale?.seoMeta;
      return getMappedMeta(rawMeta);
    });

    const variablesSet = ref([
      {
        offset: 0,
      },
    ]);

    const handleLoadMore = (offset) => {
      if (offset !== variablesSet.value.at(-1)?.offset) {
        variablesSet.value.push({
          offset: offset,
        });
      }
    };

    const showMobileBannerAfterLoad = (index) => {
      return deviceInfo.mobile && index === 1;
    };
    return {
      meta,
      variablesSet,
      handleLoadMore,
      showMobileBannerAfterLoad,
      UNI_BLOCK_TYPES,
    };
  },
  computed: {
    ...mapState({
      currentLanguage: ({ currentLanguage }) => currentLanguage,
      languages: ({ languages }) => languages,
      i18n: ({ i18n }) => i18n,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
    hasTitle() {
      const titleWithoutSpaces = this.i18n.mainPageCryptoNewsTitle?.trim();
      return !!titleWithoutSpaces.length;
    },
  },
  mounted() {
    this.pushVirtualPageView();
    this.sendChartBeatPageView();
    this.setAlternates({
      alternates: [],
      url: '',
    });
  },
  methods: {
    ...mapActions({
      setAlternates: ROOT.SET_ALTERNATES,
    }),
    pushVirtualPageView() {
      const { url: domain } = this.currentLanguage;
      const title = getProperty(this, 'meta.title', '');
      return pushVirtualPageView({
        url: `${domain}/`,
        title,
        category: '',
        tags: [],
      });
    },
    sendChartBeatPageView() {
      this.$chartBeat.sendPageView();
      this.$meta().refresh();
    },
  },
  head() {
    const { currentLanguage, languages, meta, i18n } = this;
    return getMainPageMeta({
      currentLanguage,
      languages,
      meta,
      i18n,
      routeName: this.$route.name,
    });
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.main-page {
  margin-bottom: 40px;
}
.main-page__uni-block {
  margin-bottom: 20px;
}
.main-page__carousel-col {
  display: none;
}

.main-page_rtl {
  direction: rtl;
}

@media (min-width: $md) {
  .main-page__press-releases-col {
    display: flex;
  }
}
</style>
