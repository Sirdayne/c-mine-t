import { computed, unref } from 'vue';
import { defineComponent, useMeta, useRoute, useStore } from '~/lib/framework';
import { SeoMetaQueryDocument, useQuery } from '~/graphql';
// TODO: rewrite to typescript and move to this module
import { getOpenGraphMeta, getTwitterMeta } from '~/assets/helpers/meta';
import { getMappedMeta } from '~/assets/helpers/seo';

export const SeoMeta = defineComponent({
  name: 'SeoMeta',

  props: {
    /**
     * cover image for
     * OpenGraph social share
     * and Twitter cards
     */
    coverImageUrl: {
      type: String,
      default: null,
    },
  },

  setup(props) {
    const route = useRoute();
    const store = useStore();

    const pageMetaQuery = useQuery({
      query: SeoMetaQueryDocument,
      variables: {
        short: computed(() => store.state.currentLanguage.short),
        url: computed(() => unref(route).path),
      },
    });

    useMeta(() => {
      const { currentLanguage } = store.state;
      const { url: hostname, short: code } = currentLanguage;
      const mappedMeta = getMappedMeta(unref(pageMetaQuery.data)?.locale?.seoMeta);
      const { coverImageUrl } = props;

      // @ts-expect-error internally prop read for OpenGraph and Twitter cards
      if (coverImageUrl) mappedMeta.image = coverImageUrl;

      return {
        htmlAttrs: {
          lang: code,
        },
        title: mappedMeta.title,
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: mappedMeta.description,
            lang: code,
          },
          ...getOpenGraphMeta({
            currentLanguage,
            meta: mappedMeta,
          }),
          ...getTwitterMeta({
            meta: mappedMeta,
          }),
        ],
        link: [
          {
            rel: 'canonical',
            href: `${hostname}${mappedMeta.url}`,
          },
          {
            rel: 'alternate',
            type: 'application/rss+xml',
            title: 'Cointelegraph RSS Feed',
            href: `${hostname}/rss`,
          },
        ],
      };
    });

    // no view, just meta injection
    return () => null;
  },
});
