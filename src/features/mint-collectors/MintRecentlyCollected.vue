<template>
  <div ref="mintCollectedWidgetWrapper" />
</template>
<script lang="ts" setup>
import { onMounted, ref, watchEffect } from 'vue';

/**
 * https://jira.cointelegraph.com/browse/CDT-2933
 * Need to implement mint collectors widget
 * https://gitlab.com/damlab/mintmade-widgets repo of mint-widget
 *
 * We decided not to use npm package but just add external script to head
 * */
const mintCollectedWidgetWrapper = ref<HTMLElement>();
const createWidgetDOMElement = () => {
  const widget = document.createElement('mm-recently-collected');

  if (mintCollectedWidgetWrapper?.value && typeof mintCollectedWidgetWrapper.value !== 'undefined') {
    mintCollectedWidgetWrapper.value.appendChild(widget);
  }
};
onMounted(() => {
  watchEffect(() => {
    createWidgetDOMElement();
  });
});
</script>
