<script setup lang="ts">
import { useDeviceInfo } from '~/lib/device-detector';
import { CtButton } from '~/lib/ui';
import { computed } from 'vue';
import { useStore } from '~/lib/framework';
import { type Event } from '~/graphql';
import { useBodyScrollLock } from '~/lib/lock-body-scroll';
import EventCloseModalButton from '~/components/Events/modal/EventCloseModalButton.vue';
import EventModalContent from '~/components/Events/modal/EventModalContent.vue';
import { SliderViewModel } from '~/lib/slider-view-model';
import EventModalContentControls from '~/components/Events/modal/EventModalContentControls.vue';

defineProps<{
  event: Event;
  modalSliderVm: SliderViewModel;
}>();

const store = useStore();
const deviceInfo = useDeviceInfo();
useBodyScrollLock();

const visitWebsiteLabel = computed(() => store.state.i18n.eventsVisitWebsite);
</script>

<template>
  <div
    class="bg-[#192024F2] sm:p-3 pt-0 fixed top-0 bottom-0 right-0 left-0 z-[3] overflow-y-hidden pb-[70px] sm:pb-0"
    :class="{ '!bg-[#192024] items-baseline': deviceInfo.mobile }"
  >
    <div
      class="h-full sm:container sm:mt-10 md:mt-12 sm:mb-[80px] md:mb-6 overflow-y-auto overflow-x-hidden mx-auto scrollbar-hidden"
    >
      <EventModalContent
        :event="event"
        :modal-slider-vm="modalSliderVm"
      />
    </div>
    <div
      v-if="!deviceInfo.desktop"
      class="fixed bottom-0 right-3 left-3 py-3 mx-auto sm:max-w-[560px]"
    >
      <CtButton
        link
        :href="event.website"
        target="_blank"
        round="default"
        :label="visitWebsiteLabel"
        class="w-full justify-center"
        data-testid="event-modal-mobile-visit-website-link"
      />
    </div>
    <EventModalContentControls
      v-if="!deviceInfo.mobile"
      :modal-slider-vm="modalSliderVm"
    />
    <EventCloseModalButton
      class="top-1 right-1 p-3 rounded-full bg-black bg-opacity-70 sm:top-4 md:top-5 md:right-5 absolute outline-0"
      data-testid="event-modal-close-btn"
      @close="$emit('close')"
    />
  </div>
</template>
