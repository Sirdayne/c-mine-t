<template>
  <div class="asia-main-page-mobile">
    <div class="asia-main-page-mobile__container">
      <AsiaEditorsChoiceMobile />
      <template v-for="(variable, index) in variables">
        <AsiaPostsListingMobile
          :key="index"
          :offset="variable.offset"
          :ads-visible="index === 0"
          :after-load-more-banner-visible="index === 1"
          :has-more-active="index === variables.length - 1"
          @load-more="handleLoadMore"
        >
          <template
            v-if="index === 0"
            #pressReleases
          >
            <SpecialCategorySectionContainer :asia-mobile-variant="true" />
          </template>
        </AsiaPostsListingMobile>
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { ROOT } from '~/store/types';
import { pushVirtualPageView } from '~/assets/helpers/dataLayerEvents';
import getProperty from '~/assets/libs/getProperty';
import { getMainPageMeta } from '~/assets/helpers/meta';
import scrollTo from '~/assets/libs/scrollTo';
import AsiaEditorsChoiceMobile from '~/components/AsiaEditorsChoice/AsiaEditorsChoiceMobile';
import { AsiaPostsListingMobile } from '~/components/PostsListing';
import { SpecialCategorySectionContainer } from '~/features/special-category-section';
import { useMeta, useRoute, useStore, defineComponent } from '~/lib/framework';
import { computed, ref } from 'vue';
import { SeoMetaQueryDocument, useQuery } from '~/graphql';
import { getMappedMeta } from '~/assets/helpers/seo';

export default defineComponent({
  name: 'AsiaIndexMobile',
  components: {
    SpecialCategorySectionContainer,
    AsiaEditorsChoiceMobile,
    AsiaPostsListingMobile,
  },
  props: {
    basicData: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    const currentLanguage = computed(() => store.state.currentLanguage);
    const languages = computed(() => store.state.languages);
    const short = computed(() => store.state.currentLanguage.short);
    const i18n = computed(() => store.state.i18n);

    const variables = ref([
      {
        offset: 0,
      },
    ]);
    const handleLoadMore = (offset) => {
      if (offset !== variables.value.at(-1)?.offset) {
        variables.value.push({
          offset: offset,
        });
      }
    };

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

    useMeta(() => {
      return getMainPageMeta({
        currentLanguage: currentLanguage.value,
        languages: languages.value,
        meta: meta.value,
        routeName: route.value.name,
        i18n: i18n.value,
      });
    });
    return {
      handleLoadMore,
      variables,
      currentLanguage,
    };
  },
  computed: {
    ...mapState('viewport', {
      scrollTop: ({ scrollTop }) => scrollTop,
      isIosDevice: ({
        userDeviceType: {
          apple: { device },
        },
      }) => device,
    }),
  },
  mounted() {
    this.pushVirtualPageView();
    this.setAlternates({
      alternates: [],
      url: '',
    });
    if (this.isIosDevice) {
      this.setAbnormalScrollWatcher();
      this.addAbnormalScrollOnTouchEvent();
    }
  },
  beforeDestroy() {
    this.cleanUp();
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
    resetAbnormalScroll(newPosition, oldPosition) {
      const scrollTopDiff = newPosition - oldPosition;
      const isAbnormalScrollPosition = scrollTopDiff > 0;
      if (!isAbnormalScrollPosition) {
        return;
      }
      scrollTo({
        duration: 0,
      });
      this.removeAbnormalScrollOnTouchEvent();
      this.tryToUnwatchScrollTop();
    },
    setAbnormalScrollWatcher() {
      this.unwatchScrollTop = this.$watch('scrollTop', this.resetAbnormalScroll);
    },
    cleanUp() {
      this.removeAbnormalScrollOnTouchEvent();
      this.tryToUnwatchScrollTop();
    },
    tryToUnwatchScrollTop() {
      if (typeof this.unwatchScrollTop === 'function') {
        this.unwatchScrollTop();
      }
    },
    addAbnormalScrollOnTouchEvent() {
      document.addEventListener('touchstart', this.tryToUnwatchScrollTop, { passive: true });
    },
    removeAbnormalScrollOnTouchEvent() {
      document.removeEventListener('touchstart', this.tryToUnwatchScrollTop, { passive: true });
    },
  },
  head: {},
});
</script>
