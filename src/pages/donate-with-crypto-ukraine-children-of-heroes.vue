<template>
  <div class="bg-black">
    <CohPreviewSection />
    <CohPartnersSection />
    <CohCommunitySection />
    <CohTotalDonation />
    <CohTargetSection />
    <CohStoriesSection />
    <CohHeroSection />
  </div>
</template>

<script lang="ts">
import { computed, onBeforeMount } from 'vue';
import { defineComponent, useMeta, useRoute, useStore } from '~/lib/framework';
import { SeoMetaQueryDocument, useQuery } from '~/graphql';
import { getCohPageMeta } from '~/assets/helpers/meta/children-of-heroes';
import CohPreviewSection from '~/components/Coh/CohPreviewSection.vue';
import CohPartnersSection from '~/components/Coh/CohPartnersSection.vue';
import CohCommunitySection from '~/components/Coh/CohCommunitySection.vue';
import CohTotalDonation from '~/components/Coh/CohTotalDonation.vue';
import CohHeroSection from '~/components/Coh/CohHeroSection.vue';
import CohTargetSection from '~/components/Coh/CohTargetSection.vue';
import CohStoriesSection from '~/components/Coh/CohStoriesSection.vue';
import { useCohApi } from '~/components/Coh/core/CohAPI';

export default defineComponent({
  name: 'DonateToChildren',
  components: {
    CohStoriesSection,
    CohTargetSection,
    CohHeroSection,
    CohTotalDonation,
    CohCommunitySection,
    CohPartnersSection,
    CohPreviewSection,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const currentLanguage = computed(() => store.state.currentLanguage);
    const languages = computed(() => store.state.languages);

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
      return getCohPageMeta({
        currentLanguage: currentLanguage.value,
        languages: languages.value,
        meta: meta.value,
        routeName: route.value?.name,
      });
    });
    const cohApi = useCohApi();
    onBeforeMount(() => {
      // eslint-disable-next-line no-undef
      require('~/components/Coh/core/fundrise-up');
      window?.FundraiseUp.on('donationComplete', function (details: any) {
        cohApi.setDonation(details);
      });
    });

    return {};
  },
  head: {},
});
</script>
