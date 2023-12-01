<template>
  <div
    id="_popIn_recommend"
    :data-url="canonical"
    class="_popIn_recommend"
  />
</template>

<script>
import { appendScript } from '~/assets/helpers/utils';

const POPIN_RECOMMEND_JS = 'https://api.popin.cc/searchbox/cointelegraph.js';

export default {
  name: 'PopInRecommend',
  props: {
    canonical: {
      type: String,
      default: '',
    },
  },
  mounted() {
    this.appendScript();
  },
  methods: {
    appendScript() {
      if (this.isScriptExist()) {
        return;
      }
      appendScript({
        src: POPIN_RECOMMEND_JS,
        defer: true,
      });
    },
    isScriptExist() {
      const reducer = (acc, { src }) => src === POPIN_RECOMMEND_JS || acc;
      const allScripts = document.querySelectorAll('script');
      return Array.from(allScripts).reduce(reducer, false);
    },
  },
};
</script>
