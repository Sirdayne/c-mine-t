<template>
  <span />
</template>

<script lang="ts">
import { computed, onMounted, ref, unref } from 'vue';
import { defineComponent } from '~/lib/framework';
import { useMeta, useRuntimeConfig, useStore } from '~/lib/framework';
import {
  type MetaInfo,
  type NoScriptProperty,
  type ScriptPropertyJson,
  type ScriptPropertySrc,
  type ScriptPropertySrcCallback,
  type ScriptPropertyText,
} from 'vue-meta';
import { ROOT } from '~/store/types';

const GTM_SCRIPT_SRC = 'https://www.googletagmanager.com/gtm.js?id=GTM-N5X5C39';
// only initializes data-layer. GTM itself loaded later
const GTM_DATALAYER_SCRIPT_SNIPPET = `(function(a,c,b){a[b]=a[b]||[];a[b].push({"gtm.start":(new Date).getTime(),event:"gtm.js"})})(window,document,"dataLayer");`;
const GTM_NOSCRIPT_SNIPPET = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N5X5C39" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;

const CHARTBEAT_SCRIPT_SRC = 'https://static.chartbeat.com/js/chartbeat.js';
const CHARTBEAT_MAB_SCRIPT_SRC = 'https://static.chartbeat.com/js/chartbeat_mab.js';

export const useGlobalMeta = (): void => {
  const store = useStore();
  const { trackingScriptsDisabled } = useRuntimeConfig();

  const idleCallbackFired = ref(false);

  const chartbeatEnabled = computed(() => store.getters[ROOT.IS_EN]);
  const googleSyndicationEnabled = computed(() => store.getters[ROOT.IS_JP]);
  const htmlDir = computed(() => (store.getters[ROOT.IS_RTL] ? 'rtl' : 'ltr'));

  onMounted(() => {
    requestIdleCallback(() => {
      idleCallbackFired.value = true;
    });
  });

  useMeta(() => {
    const result = {
      htmlAttrs: {
        dir: unref(htmlDir),
      },
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          name: 'apple-mobile-web-app-title',
          content: 'Cointelegraph',
        },
        {
          name: 'application-name',
          content: 'Cointelegraph',
        },
        {
          name: 'msapplication-TileColor',
          content: '#1a1b1d',
        },
        {
          name: 'msapplication-config',
          content: '/browserconfig.xml',
        },
        {
          name: 'msapplication-TileImage',
          content: '/favicon/mstitle-144x144.png',
        },
        {
          name: 'theme-color',
          content: '#1a1b1d',
        },
        {
          name: 'telegram:channel',
          content: '@cointelegraph',
        },
        {
          name: 'p:domain_verify',
          content: '2c1fd1cbe8d119280a2b90569511a1d0',
        },
      ],
      link: [
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/favicons/apple-touch-icon.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicons/favicon-16x16.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicons/favicon-32x32.png',
        },
        {
          rel: 'manifest',
          href: '/site.webmanifest',
        },
        {
          rel: 'mask-icon',
          href: '/favicons/safari-pinned-tab.svg',
          color: '#1a1b1d',
        },
        {
          rel: 'shortcut icon',
          href: 'favicon.ico',
        },
      ],
      script: [
        {
          hid: 'gtm-datalayer-script',
          once: true,
          innerHTML: GTM_DATALAYER_SCRIPT_SNIPPET,
        },
      ] as (ScriptPropertyText | ScriptPropertySrc | ScriptPropertySrcCallback | ScriptPropertyJson)[],
      noscript: [] as NoScriptProperty[],
      __dangerouslyDisableSanitizersByTagID: {
        'ldjson-schema': ['innerHTML'],
        'ios-app-ldjson-schema': ['innerHTML'],
        'android-app-ldjson-schema': ['innerHTML'],
        'gtm-datalayer-script': ['innerHTML'],
        'gtm-noscript': ['innerHTML'],
        'chartbeat-async-config': ['innerHTML'],
      },
    } satisfies MetaInfo;

    if (!trackingScriptsDisabled) {
      result.noscript.push({
        hid: 'gtm-noscript',
        innerHTML: GTM_NOSCRIPT_SNIPPET,
      });
    }

    if (!trackingScriptsDisabled && unref(idleCallbackFired)) {
      result.script.push({
        hid: 'gtm-script',
        src: GTM_SCRIPT_SRC,
        async: true,
      });

      if (unref(chartbeatEnabled)) {
        result.script.push(
          {
            hid: 'chartbeat-script',
            src: CHARTBEAT_SCRIPT_SRC,
            async: true,
          },
          {
            hid: 'chartbeat-mab-script',
            src: CHARTBEAT_MAB_SCRIPT_SRC,
            async: true,
          }
        );
      }

      if (unref(googleSyndicationEnabled)) {
        result.script.push({
          id: 'google-syndication',
          src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
          async: true,
          'data-ad-client': 'ca-pub-1551153479378974',
        });
      }
    }

    return result;
  });
};
//#endregion

export default defineComponent({
  name: 'GlobalMeta',

  setup() {
    useGlobalMeta();
  },
});
</script>
