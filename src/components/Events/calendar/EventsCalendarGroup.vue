<script setup lang="ts">
import EventsCalendarGroupByDay from '~/components/Events/calendar/EventsCalendarGroupByDay.vue';
import { computed, toRef } from 'vue';
import { CalendarEventDocument, useQuery, type Event } from '~/graphql';
import { useStore } from '~/lib/framework';
import { CtButton } from '~/lib/ui';
import { Variables } from './EventsCalendar.vue';
import { format } from 'date-fns';
import { localeFormatter, unsafeParseDate } from '~/assets/libs/dateTimeUtils';
import { useDeviceInfo } from '~/lib/device-detector';

interface DayMonth {
  day: number;
  month: string;
}
interface GroupedEvents {
  date: DayMonth;
  events: Event[];
}
const props = defineProps<{
  variables: Variables;
  categorySlug?: string | null;
  monthDate?: string | null;
  countryCode?: string | null;
  cityId?: string | null;
  isLast: boolean;
  onlyWithPromocode: boolean;
}>();

defineEmits<{
  (e: 'load-more'): void;
  (e: 'on-events-loaded', status: boolean): void;
}>();

const store = useStore();
const currentLanguage = computed(() => store.state.currentLanguage);
const loadMoreLabel = computed(() => store.state.i18n.eventsCalendarLoadMore);
const currentLanguageShort = computed(() => store.state.currentLanguage.short);
const deviceInfo = useDeviceInfo();

const calendarEventsQuery = useQuery({
  query: CalendarEventDocument,
  variables: {
    short: toRef(currentLanguage.value, 'short'),
    length: toRef(props.variables, 'length'),
    categorySlug: toRef(props, 'categorySlug'),
    monthDate: toRef(props, 'monthDate'),
    cityId: toRef(props, 'cityId'),
    countryCode: toRef(props, 'countryCode'),
    onlyWithPromocode: toRef(props, 'onlyWithPromocode'),
    offset: toRef(props.variables, 'offset'),
  },
});

const hasMore = computed(() => calendarEventsQuery.data.value?.locale?.calendarEvents.hasMore);

const calendarEvents = computed(() => calendarEventsQuery.data.value?.locale?.calendarEvents?.data ?? []);

const getShortDate = (startDate: string) => {
  return format(unsafeParseDate(startDate), 'yyyy-MM-dd');
};

const getDayMonth = (groupDate: string): DayMonth => {
  const currentDate = unsafeParseDate(groupDate);
  const day = currentDate.getDate();
  const month = currentDate.toLocaleString(localeFormatter(currentLanguageShort.value), {
    month: computed(() => (deviceInfo.mobile ? 'long' : 'short')).value,
  });
  return {
    day,
    month,
  };
};

const groupedEvents = computed(() => {
  if (!calendarEvents.value?.length) return;

  const map: Record<string, GroupedEvents> = {};

  calendarEvents.value?.forEach((event) => {
    const dateKey = getShortDate(event.startDate);
    if (!map[dateKey]) {
      map[dateKey] = { date: getDayMonth(dateKey), events: [event] };
      return;
    }

    map[dateKey].events.push(event);
  });
  return Object.values(map);
});
</script>

<template>
  <div
    v-if="groupedEvents && groupedEvents.length"
    :class="{
      'mb-9': isLast,
    }"
  >
    <div
      v-for="(group, index) in groupedEvents"
      :key="index"
      data-testid="events-page-calendar-events-block"
      class="mb-2"
    >
      <EventsCalendarGroupByDay
        v-if="group.events"
        data-testid="events-page-calendar-events-card"
        :events="group.events"
        :month="group.date.month"
        :day="group.date.day"
      />
    </div>
    <CtButton
      v-if="hasMore && isLast"
      round="default"
      :label="loadMoreLabel"
      class="mx-auto mt-7 sm:mt-8"
      data-testid="events-page-calendar-load-more-button"
      @click.native="$emit('load-more')"
    />
  </div>
  <div
    v-else
    class="h-[68px]"
  />
</template>
