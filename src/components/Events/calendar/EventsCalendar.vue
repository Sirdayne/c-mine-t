<script setup lang="ts">
import { useStore } from '~/lib/framework';
import { computed, ref, unref, watch } from 'vue';
import { CtButton, CtSwitch } from '~/lib/ui';
import EventsCalendarGroup from '../calendar/EventsCalendarGroup.vue';
import { type MaybeRef } from '@vueuse/core';
import EventsFilterSelect from './EventsFilterSelect.vue';
import { EventsFilterDocument, useQuery } from '~/graphql';
import { intlFormat } from 'date-fns';
import { localeFormatter, unsafeParseDate } from '~/assets/libs/dateTimeUtils';
import { type SelectOption } from './EventsFilterSelect.vue';

const CALENDAR_EVENTS_LENGTH = 5;

export interface Variables {
  offset: MaybeRef<string | number | null>;
  length: MaybeRef<number>;
}

const store = useStore();

const currentLanguage = computed(() => store.state.currentLanguage);
const calendarTitle = computed(() => store.state.i18n.eventsCalendarTitle);
const filterLabel = computed(() => store.state.i18n.eventsFilter);
const promocodeTitle = computed(() => store.state.i18n.eventsCalendarOnlyPromocode);

const filterVisible = ref<boolean>(false);

const i18n = computed(() => store.state.i18n);
const toggleFilter = (): void => {
  filterVisible.value = !filterVisible.value;
};

const calendarFilterQuery = useQuery({
  query: EventsFilterDocument,
  variables: {
    short: computed(() => store.state.currentLanguage.short),
  },
});

const calendarFilterOptions = computed(() => calendarFilterQuery.data.value?.locale ?? null);

const categorySlug = ref<string | null>(null);
const monthDate = ref<string | null>(null);
const cityId = ref<string | null>(null);
const countryCode = ref<string | null>(null);
const withPromocode = ref<boolean>(false);

const queryVariables = ref<Variables[]>([
  {
    length: CALENDAR_EVENTS_LENGTH,
    offset: 0,
  },
]);

const resetVariables = (): void => {
  queryVariables.value = queryVariables.value.slice(0, 1);
};

const togglePromocode = (): void => {
  withPromocode.value = !withPromocode.value;
};

const handleLoadMore = (): void => {
  queryVariables.value.push({
    length: CALENDAR_EVENTS_LENGTH,
    offset: queryVariables.value.length * CALENDAR_EVENTS_LENGTH,
  });
};

const getMonthName = (date: string): string => {
  return intlFormat(
    unsafeParseDate(date),
    { month: 'long' },
    {
      locale: localeFormatter(currentLanguage.value.short),
    }
  );
};

const categorySelectOptions = computed(
  (): SelectOption[] =>
    unref(calendarFilterOptions)?.eventCategories?.map((category) => {
      return {
        name: category.title,
        value: category.slug,
      };
    }) ?? []
);
const citySelectOptions = computed(
  (): SelectOption[] =>
    unref(calendarFilterOptions)?.eventCities?.map((city) => {
      return {
        value: city.id,
        name: city.title,
      };
    }) ?? []
);
const countrySelectOptions = computed(
  (): SelectOption[] =>
    unref(calendarFilterOptions)?.eventCountries?.map((country) => {
      return {
        value: country.code,
        name: country.title,
      };
    }) ?? []
);
const monthSelectOptions = computed(
  (): SelectOption[] =>
    unref(calendarFilterOptions)?.eventMonths?.map((month) => {
      return {
        value: month,
        name: getMonthName(month),
      };
    }) ?? []
);

watch([categorySlug, monthDate, cityId, countryCode, withPromocode], () => {
  resetVariables();
});
</script>

<template>
  <div class="container my-8">
    <div class="flex flex-col sm:flex-row justify-between mb-5 md:mb-6">
      <h3
        class="text-headlineXxl md:leading-[1.2em] md:text-[34px] mb-5 md:mb-6 font-semibold text-fg-strong"
        data-testid="events-page-calendar-title"
      >
        {{ calendarTitle }}
      </h3>
      <div class="flex sm:flex-row items-center justify-between">
        <div class="flex sm:mr-6 sm:rtl:mr-0 sm:rtl:ml-6">
          <CtSwitch
            size="lg"
            class="mr-2 rtl:mr-0 rtl:ml-2"
            data-testid="events-page-calendar-promocode"
            @change.native="togglePromocode"
          />
          <p class="font-semibold text-fg-default">{{ promocodeTitle }}</p>
        </div>
        <CtButton
          :label="filterLabel"
          icon-name="filter"
          icon-position="left"
          type="tertiary"
          class="border-[#627F8C59] border rounded-containerS"
          data-testid="events-page-calendar-filter-button"
          @click.native="toggleFilter"
        />
      </div>
    </div>
    <div
      v-if="calendarFilterOptions && filterVisible"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:sm:flex-row mb-5 gap-5"
    >
      <EventsFilterSelect
        v-model="countryCode"
        :label="i18n.eventsFilterSelectCountriesLabel"
        :placeholder="i18n.eventsFilterSelectCountries"
        :options="countrySelectOptions"
        data-testid="events-page-calendar-filter-countries"
      />
      <EventsFilterSelect
        v-model="cityId"
        :label="i18n.eventsFilterSelectCitiesLabel"
        :placeholder="i18n.eventsFilterSelectCities"
        :options="citySelectOptions"
        data-testid="events-page-calendar-filter-cities"
      />
      <EventsFilterSelect
        v-model="monthDate"
        :label="i18n.eventsFilterSelectMonthsLabel"
        :placeholder="i18n.eventsFilterSelectMonths"
        :options="monthSelectOptions"
        data-testid="events-page-calendar-filter-months"
      />
      <EventsFilterSelect
        v-model="categorySlug"
        :label="i18n.eventsFilterSelectTypesLabel"
        :placeholder="i18n.eventsFilterSelectTypes"
        :options="categorySelectOptions"
        data-testid="events-page-calendar-filter-types"
      />
    </div>
    <template v-for="(variables, index) in queryVariables">
      <EventsCalendarGroup
        :key="index"
        :variables="variables"
        :only-with-promocode="withPromocode"
        :is-last="index === queryVariables.length - 1"
        :category-slug="categorySlug"
        :month-date="monthDate"
        :country-code="countryCode"
        :city-id="cityId"
        @load-more="handleLoadMore"
      />
    </template>
  </div>
</template>
