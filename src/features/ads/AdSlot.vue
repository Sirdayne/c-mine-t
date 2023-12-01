<template>
  <AdSlotView
    :place="place"
    :config="config"
    :state="adSlot"
    @close="onClose"
  >
    <slot />
  </AdSlotView>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import { type AdSlotConfig } from './adslot/AdSlotConfig';
import { useAdSlot } from './adslot/useAdSlot';
import AdSlotView from './AdSlotView.vue';
import { useRefetchAdSlotOnRouteChange } from './useRefetchAdSlotOnRouteChange';

const props = defineProps<{
  /**
   * place from dashboard
   * @example "leaderboard", "index_mobile"
   */
  place: string;
  index?: string | number;
  config?: Partial<AdSlotConfig>;
}>();

const emit = defineEmits<{
  (event: 'close'): void;
}>();

const { place, index } = toRefs(props);
const adSlot = useAdSlot(place, index);

const onClose = () => {
  adSlot.reset();
  emit('close');
};

useRefetchAdSlotOnRouteChange(adSlot, () => props.config?.refetchOnRouteChangeDisabled ?? false);
</script>
