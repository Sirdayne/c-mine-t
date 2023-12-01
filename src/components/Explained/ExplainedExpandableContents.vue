<script setup lang="ts">
import ExpandablePanel from '~/components/Shared/ExpandablePanel.vue';
import { TableOfContents } from '~/lib/table-of-contents';
import { computed, ref } from 'vue';
import { useStore } from '~/lib/framework';

const store = useStore();

const contents = computed(() => store.state.i18n.guideSidebarContents);

const contentsVisible = ref(false);
const toggleContentVisibility = () => {
  contentsVisible.value = !contentsVisible.value;
};
</script>

<template>
  <div class="mb-8 border border-[#e3e6e7] rounded-containerS">
    <ExpandablePanel
      :title="contents"
      data-test-id-show-btn="explained-mobile-navigation-show-button"
      data-test-id-hide-btn="explained-mobile-navigation-hide-button"
      @click="toggleContentVisibility"
    />
    <div
      v-if="contentsVisible"
      class="flex flex-col h-full"
    >
      <TableOfContents
        with-link-index
        data-test-id="explained-navigation-mobile-link"
        data-test-id-active="explained-navigation-mobile-link-active"
      />
    </div>
  </div>
</template>
