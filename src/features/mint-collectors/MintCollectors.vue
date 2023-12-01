<template>
  <div ref="mintWidgetWrapper" />
</template>
<script lang="ts">
import { defineComponent } from '~/lib/framework';
import { computed, ref, onMounted, watchEffect } from 'vue';

/**
 * https://jira.cointelegraph.com/browse/CDT-2932
 * Need to implement mint collectors widget
 * https://gitlab.com/damlab/mintmade-widgets repo of mint-widget
 *
 * We decided not to use npm package but just add external script to head
 * */

const MINT_BASE_URL = 'https://mint.cointelegraph.com/';
export default defineComponent({
  name: 'MintCollectors',
  props: {
    postUrl: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const postMintUrl = computed(() => `https://cointelegraph.com${props.postUrl}`);

    const mintWidgetWrapper = ref<HTMLElement>();
    /**
     * We use vanilla JS instead of Vue render because of custom element registration error
     * */

    /**
     * @param {string} baseURL * — Your minting page URL
     * @param {string} articleURI * — Current article URI without utm tags.
     * */
    const createWidgetDOMElement = (baseURL: string, articleURI: string) => {
      const widget = document.createElement('mm-collectors');
      widget.setAttribute('baseURL', baseURL);
      widget.setAttribute('articleURI', articleURI);
      widget.setAttribute('attached', '');

      if (mintWidgetWrapper?.value && typeof mintWidgetWrapper.value !== 'undefined') {
        mintWidgetWrapper.value.appendChild(widget);
      }
    };

    onMounted(() => {
      watchEffect(() => {
        createWidgetDOMElement(MINT_BASE_URL, postMintUrl.value);
      });
    });
    return {
      mintWidgetWrapper,
    };
  },
  head: {},
});
</script>
