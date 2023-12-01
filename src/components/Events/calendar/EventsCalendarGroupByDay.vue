<script setup lang="ts">
import EventsCalendarEvent from './EventsCalendarEvent.vue';
import { type Event } from '~/graphql';

defineProps<{
  events: Event[];
  day: number;
  month: string;
}>();
</script>

<template>
  <div
    class="shadow-[0_2px_32px_0_#0000000d] border border-solid mb-2 border-[#627F8C59] rounded-containerM sm:p-3 sm:pr-0 sm:rtl:pr-3 grid grid-cols-1 sm:gap-5 sm:grid-cols-[64px_1fr]"
  >
    <div
      class="flex text-center sm:flex-col sm:w-16 sm:min-h-16 sm:h-16 text-ml text-fg-strong leading-[21px] p-4 sm:p-4 sm:py-2 sm:bg-bg-subtle sm:rounded font-semibold border-b border-solid border-[#627F8C59] sm:border-0"
    >
      <span
        class="mr-2 sm:mr-0"
        data-testid="events-page-calendar-card-day"
      >
        {{ day }}
      </span>
      <span
        data-testid="events-page-calendar-card-month"
        class="sm:text-sm font-semibold sm:font-bold sm:text-bg-invertedMuted sm:uppercase"
      >
        {{ month }}
      </span>
    </div>
    <div
      v-if="events.length"
      class="grid grid-cols-1"
    >
      <template v-for="event in events">
        <EventsCalendarEvent
          v-if="event"
          :key="event.id"
          :event="event"
          data-testid="events-page-calendar-event"
          class="!py-5 md:!py-3 !border-b !border-solid !border-[#627F8C59] last:!border-0 sm:first:!pt-2"
        />
      </template>
    </div>
  </div>
</template>
