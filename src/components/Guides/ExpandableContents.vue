<script setup lang="ts">
import { useStore } from '~/lib/framework';
import { computed, ref } from 'vue';
import { TableOfContents } from '~/lib/table-of-contents';
import { AdSlot } from '~/features/ads';
import { useDeviceInfo } from '~/lib/device-detector';
import ExpandablePanel from '~/components/Shared/ExpandablePanel.vue';

const store = useStore();
const contents = computed(() => store.state.i18n.guideSidebarContents);

const contentsVisible = ref(false);

const deviceInfo = useDeviceInfo();

const toggleContentVisibility = () => {
  contentsVisible.value = !contentsVisible.value;
};
</script>
<template>
  <div class="mb-8">
    <ExpandablePanel
      :title="contents"
      data-test-id-show-btn="guide-mobile-navigation-show-button"
      data-test-id-hide-btn="guide-mobile-navigation-hide-button"
      @click="toggleContentVisibility"
    />
    <div
      v-if="contentsVisible"
      class="flex flex-col h-full"
    >
      <TableOfContents
        data-test-id="guide-navigation-mobile-link"
        data-test-id-active="guide-navigation-mobile-link-active"
      />
      <AdSlot
        place="learn_sidebar_desktop_stack"
        class="w-full mb-2"
        data-testid="guide-mobile-promo-button-stack"
        :config="{
          disclaimerHidden: true,
          promoButtonFullWidth: true,
          promoButtonStackTransparentBackground: true,
          promoButtonDisclaimerHidden: true,
          promoButtonStackWithoutDisclaimer: deviceInfo.desktop,
        }"
      />
    </div>
  </div>
</template>
