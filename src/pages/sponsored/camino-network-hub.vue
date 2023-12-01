<script lang="ts">
import { useEventListener } from '@vueuse/core';
import { computed, onMounted, ref } from 'vue';
import { defineComponent, useMeta, useRoute, useStore } from '~/lib/framework';
import { SeoMetaQueryDocument, useQuery } from '~/graphql';
import { getSpecialProjectPageMeta } from '~/assets/helpers/meta/special-project';

const CAMINO_URL = 'https://cointelegraph.com/sponsored/camino-network-hub-demo/';
const CT_ORIGIN = 'https://cointelegraph.com';
const CAMINO_OG_META_IMAGE = 'https://s3.cointelegraph.com/storage/uploads/view/c47cc07b5ab8fd8b30c19a6ff2ea90df.jpeg';

export default defineComponent({
  name: 'Camino',
  setup() {
    const iframeHeight = ref(0);
    const store = useStore();
    const route = useRoute();

    const currentLanguage = computed(() => store.state.currentLanguage);
    const languages = computed(() => store.state.languages);

    const iframeUrl = CAMINO_URL;
    const ctOrigin = CT_ORIGIN;

    const windowMessageListener = (event: MessageEvent) => {
      if (event && event.origin === ctOrigin) {
        iframeHeight.value = JSON.parse(event.data);
      }
    };

    const pageMetaQuery = useQuery({
      query: SeoMetaQueryDocument,
      variables: {
        short: computed(() => store.state.currentLanguage.short),
        url: computed(() => route.value.path),
      },
    });

    const meta = computed(() => {
      const localMeta = pageMetaQuery?.data.value?.locale?.seoMeta;
      return {
        url: localMeta?.seoMetaUrl,
        title: localMeta?.seoMetaTitle,
        description: localMeta?.seoMetaDescription,
        keywords: localMeta?.seoMetaKeywords,
        image: CAMINO_OG_META_IMAGE,
      };
    });

    useMeta(() => {
      return getSpecialProjectPageMeta({
        currentLanguage: currentLanguage.value,
        languages: languages.value,
        meta: meta.value,
        routeName: route.value?.name,
      });
    });

    onMounted(() => {
      useEventListener(window, 'message', windowMessageListener);
    });

    return {
      iframeUrl,
      iframeHeight,
    };
  },
});
</script>

<template>
  <iframe
    :src="iframeUrl"
    frameborder="0"
    scrolling="no"
    allowfullscreen
    :height="iframeHeight"
    class="w-full min-h-screen"
  />
</template>
