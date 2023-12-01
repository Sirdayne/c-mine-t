<script setup lang="ts">
import { useStore } from '~/lib/framework';
import { computed } from 'vue';
import EventCarouselSection from './carousel/EventCarouselSection.vue';
import Breadcrumbs from '~/components/Shared/Breadcrumbs.vue';
import { type Event } from '~/graphql';

defineProps<{
  events: Event[];
}>();
const store = useStore();

const eventsTitle = computed(() => store.state.i18n.eventsTitle);
const holdingEvents = computed(() => store.state.i18n.eventsHoldingLetUsKnow);

const breadCrumbs = computed(() => {
  return [
    {
      name: eventsTitle.value,
      path: '/events',
    },
  ];
});

const mailtoUrl = computed(() => `mailto:${store.state.i18n.eventsLetUsKnowEmail}`);
</script>

<template>
  <div
    class="pb-6"
    :class="[$style['events-top-zone']]"
  >
    <div class="container lg:!w-[1192px] lg:!max-w-[1192px] sm:!px-0">
      <Breadcrumbs
        link-color="white"
        class="mb-8 md:mb-8"
        data-test-id="events-breadcrumbs-link"
        :breadcrumbs="breadCrumbs"
      />
      <div class="flex flex-col sm:flex-row justify-between mb-5">
        <h1
          class="mb-3 sm:mb-0 text-headlineXxxl md:text-[41px] md:leading-[53px] text-white"
          data-testid="events-page-title"
        >
          {{ eventsTitle }}
        </h1>
        <a
          :href="mailtoUrl"
          class="text-base rounded border border-[#627F8C59] border-solid py-3 px-5 text-[#DEE5E8]"
          data-testid="events-let-us-know"
        >
          {{ holdingEvents }}
        </a>
      </div>
      <EventCarouselSection
        v-if="events"
        :events="events"
      />
    </div>
  </div>
</template>

<style module lang="scss">
.events-top-zone {
  background: linear-gradient(180deg, #000000 0%, #37465e 100%);
}
</style>
