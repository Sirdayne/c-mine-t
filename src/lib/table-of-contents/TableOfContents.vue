<script setup lang="ts">
import { useDeviceInfo } from '~/lib/device-detector';
import { ref } from 'vue';
import { useTOCViewModel } from '~/lib/table-of-contents';

const props = defineProps<{
  dataTestId: string;
  dataTestIdActive: string;
  /**
   * Show link index before ToC link content
   * */
  withLinkIndex?: boolean;
}>();
const tableOfContentsVM = useTOCViewModel();

const deviceInfo = useDeviceInfo();

const activeLinkId = ref<string | null>(null);

const handleClick = (id: string): void => {
  tableOfContentsVM.scrollTo(id);
  activeLinkId.value = id;
};

const getDataTestId = (id: string): string => {
  if (activeLinkId.value === id) return `${props.dataTestId} ${props.dataTestIdActive}`;

  return props.dataTestId;
};
</script>

<template>
  <div>
    <button
      v-for="(item, index) in tableOfContentsVM.getTableOfContents()"
      :key="item.id"
      :data-gtm-locator="`cryptopedia_learn_clickon_${item.id}`"
      :class="{ 'border-b border-[#e3e6e7] last:border-b-0': !deviceInfo.desktop }"
      class="contents-button relative w-full block mt-1/2 mb-1/2 text-base py-sm px-m text-[#273036] hover:bg-[#F0F3F4] hover:rounded focus:rounded font-semibold outline-none text-left focus:bg-[#FABC2C]"
      :data-testid="getDataTestId(item.id)"
      @click="handleClick(item.id)"
    >
      <span v-if="withLinkIndex">{{ index + 1 }}.</span>
      {{ item.title }}
    </button>
  </div>
</template>
