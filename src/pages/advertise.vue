<template>
  <div
    id="experience-63f4b09ea9512"
    :class="$style['advertise']"
  >
    <CerosEmbed
      mobile-aspect-ratio="0.09473684"
      aspect-ratio="0.26181818"
      src="https://cointelegraph.com/ceros/partner-with-us/index.html"
      data-testid="advertise-iframe-wrapper"
    />
    <div
      v-if="cerosFormVisible"
      :class="$style['advertise__modal']"
      data-testid="advertise-modal"
    >
      <AdvertiseForm
        :class="$style['advertise__form']"
        data-testid="advertise-form"
        @closeModal="toggleModalVisibility()"
      />
    </div>
  </div>
</template>

<script lang="ts">
/**
 * https://jira.cointelegraph.com/browse/CDT-2976
 * Ceros page added to Duke
 * */
import { computed, onMounted, ref, unref } from 'vue';
import CerosEmbed from '~/components/Post/CerosEmbed.vue';
import { AdvertiseForm } from '~/features/advertise-form';
import { useEventListener } from '@vueuse/core';
import { type CerosEventFunction, type CerosMessageEvent } from '~/features/advertise-form/types';
import { useMeta, useRoute, useStore, defineComponent } from '~/lib/framework';
import { SeoMetaQueryDocument, useQuery } from '~/graphql';
import { getMappedMeta } from '~/assets/helpers/seo';
import { getAdvertisePageMeta } from '~/assets/helpers/meta/advertise';

export default defineComponent({
  name: 'AdvertisePage',
  components: { AdvertiseForm, CerosEmbed },

  setup() {
    const cerosFormVisible = ref(false);
    const store = useStore();
    const route = useRoute();

    const currentLanguage = computed(() => store.state.currentLanguage);
    const languages = computed(() => store.state.languages);

    /**
     * Advertise page aspect ratios from dashboard translates
     * */
    const cerosUrl = computed(() => store.state.i18n.advertisePageCerosUrl);
    const desktopAspectRatio = computed(() => store.state.i18n.advertiseDesktopAspectRatio);
    const mobileAspectRatio = computed(() => store.state.i18n.advertiseMobileAspectRatio);

    const isContactUsClick = (globalFunctions: []) => {
      let isValidEvent = false;
      globalFunctions.forEach((func: CerosEventFunction) => {
        if (
          func.args.some((arg) => arg === 'ceros-click') &&
          func.args.some((arg) => arg.event_label === 'Contact Hotspot')
        ) {
          isValidEvent = true;
        }
      });
      return isValidEvent;
    };
    const toggleModalVisibility = () => {
      cerosFormVisible.value = !cerosFormVisible.value;
    };
    // Listen for Ceros Contact Us click to show Ceros Form Modal
    const advertiseContactUsListener = (event: CerosMessageEvent) => {
      try {
        if (!event || !event.data || typeof event.data === 'object') return;
        const parsedEventData = JSON.parse(event.data);
        if (!parsedEventData.globalFunctions) return;

        if (isContactUsClick(parsedEventData.globalFunctions)) {
          toggleModalVisibility();
        }
      } catch (e) {
        throw Error(e);
      }
    };
    onMounted(() => {
      useEventListener(window, 'message', advertiseContactUsListener);
    });

    const seoMetaQuery = useQuery({
      query: SeoMetaQueryDocument,
      variables: {
        short: computed(() => unref(currentLanguage).short),
        url: computed(() => unref(route).path),
      },
    });

    const mappedMeta = computed(() => getMappedMeta(seoMetaQuery.data.value?.locale?.seoMeta));

    useMeta(() => {
      return getAdvertisePageMeta({
        currentLanguage: currentLanguage.value,
        languages: languages.value,
        meta: mappedMeta.value,
        routeName: route.value?.name,
      });
    });

    return {
      cerosUrl,
      cerosFormVisible,
      toggleModalVisibility,
      mobileAspectRatio,
      desktopAspectRatio,
    };
  },

  head: {},
});
</script>
<style lang="scss" module>
@import '~/assets/styles/_vars.scss';

.advertise {
  position: relative;

  &__modal {
    margin: 8px;
    position: absolute;
    top: 30px;
    left: 0;
    right: 0;

    @media (min-width: $xs--tablet) {
      margin: 0;
      top: 100px;
    }
  }

  &__form {
    border-radius: 8px;
    box-sizing: border-box;
    width: 100%;
    max-width: 464px;
    max-height: 710px;
    height: 100%;
    margin: auto;
    background: white;
  }
}
</style>
