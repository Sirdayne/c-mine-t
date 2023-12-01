<!-- avoids case when adblock removes anchors with double-click urls (like servedbyadbutler.com/redirect.aspx...) -->
<template>
  <a
    href="javascript:void(0);"
    rel="noopener"
    @click="onClick"
  >
    <slot />
  </a>
</template>

<script setup lang="ts">
const props = defineProps({
  url: {
    type: String,
    required: true,
  },

  newTab: {
    type: Boolean,
    default: true,
  },
});

const openUrlInNewTab = (url: string): void => {
  window.open(url, '_blank');
};

const openUrlInSameTab = (url: string): void => {
  setTimeout(() => {
    window.location.href = url;
  });
};

const onClick = () => {
  const { newTab, url } = props;

  if (newTab) {
    openUrlInNewTab(url);
  } else {
    openUrlInSameTab(url);
  }
};
</script>
