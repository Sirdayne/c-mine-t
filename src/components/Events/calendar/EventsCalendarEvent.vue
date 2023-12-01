<script setup lang="ts">
import { CtButton, CtArrow } from '~/lib/ui';
import { useDeviceInfo } from '~/lib/device-detector';
import { computed, ref } from 'vue';
import { useStore } from '~/lib/framework';
import { type Event } from '~/graphql';
import { format } from 'date-fns';
import { unsafeParseDate } from '~/assets/libs/dateTimeUtils';

const props = defineProps<{
  event: Event;
}>();

const deviceInfo = useDeviceInfo();
const store = useStore();

const visitWebsiteLabel = computed(() => store.state.i18n.eventsVisitWebsite);
const hideDetails = computed(() => store.state.i18n.eventsCalendarHideDetails);
const duration = computed(() => store.state.i18n.eventsCalendarPlateDuration);

const descriptionVisible = ref<boolean>(false);

const eventCategories = computed(() => {
  return props.event.categories.map((category) => category.title).join(', ');
});

const formatDate = (date: Date, options: string): string => {
  const formattedDate = unsafeParseDate(date);
  return format(formattedDate, options);
};

const formattedStartDate = computed(() => formatDate(props.event.startDate, 'd MMM'));
const formattedEndDate = computed(() => formatDate(props.event.endDate, 'd MMM'));
const formattedYear = computed(() => formatDate(props.event.endDate, 'yyyy'));

const countryAndCityCode = computed(() => {
  const { city, country } = props.event;
  if (city?.title && country?.code2) {
    return `${city.title}, ${country.code2}`;
  } else if (!city?.title && country?.code2) {
    return `${country.code2}`;
  }

  return '';
});
</script>

<template>
  <div
    class="grid grid-cols-[6fr,_1fr] sm:grid-cols-[8fr,_2fr,_1fr] md:grid-cols-[8fr,_7fr,_3fr,_1fr] lg:grid-cols-[8fr,_7fr,_2fr,_1fr] gap-4 px-4 sm:px-1 items-center"
    :class="$style['event']"
  >
    <div
      class="mb-1"
      :class="$style['event__title']"
    >
      <p
        class="text-[19px] leading-interfaceS font-semibold text-fg-strong"
        data-testid="events-page-calendar-event-title"
      >
        {{ event.title }}
      </p>
      <p
        v-if="event.promocode && deviceInfo.desktop"
        class="text-base leading-interfaceS font-semibold text-fg-secondaryDefault md:my-0"
        :class="{ 'mb-4': descriptionVisible }"
        data-testid="events-page-calendar-event-promocode"
      >
        {{ event.promocode }}
      </p>
    </div>
    <div
      class="md:grid md:grid-cols-2 md:gap-12 md:items-center md:justify-around md:text-sm"
      :class="{
        ['text-center']: !eventCategories.length && deviceInfo.desktop,
        [$style['event__meta']]: true,
      }"
    >
      <span data-testid="events-page-calendar-event-categories">
        {{ eventCategories }}
      </span>
      <span
        v-if="!deviceInfo.desktop && eventCategories.length"
        class="mx-2"
      >
        &#x2022;
      </span>
      <span
        class="text-left"
        data-testid="events-page-calendar-event-place"
      >
        {{ countryAndCityCode }}
      </span>
    </div>
    <p
      v-if="event.promocode && !deviceInfo.desktop"
      class="text-base leading-interfaceS font-semibold text-fg-secondaryDefault mt-4 sm:mt-2 md:my-0"
      :class="{ [$style['event_promocode']]: true, 'mb-4': descriptionVisible }"
      data-testid="events-page-calendar-event-promocode"
    >
      {{ event.promocode }}
    </p>
    <CtArrow
      class="-rotate-90 mx-auto"
      :class="{
        'rotate-90': descriptionVisible,
        [$style['event__arrow']]: true,
      }"
      data-testid="events-page-calendar-event-show-more-mobile-arrow"
      @click.native="descriptionVisible = !descriptionVisible"
    />
    <CtButton
      round="default"
      type="tertiary"
      link
      :href="event.website"
      target="_blank"
      data-testid="events-page-calendar-event-visit-website"
      :label="visitWebsiteLabel"
      class="w-full mt-4 sm:mt-0 md:my-3 sm:w-auto col-start-1 col-end-4 mx-0 h-10 justify-center border-[#627F8C59] border rounded-containerS"
      :class="{
        [$style['event__visit-website']]: true,
        'px-4 py-2 !w-max': !deviceInfo.mobile,
      }"
    />
    <div
      v-if="descriptionVisible"
      class="flex flex-col mt-4 col-start-1 col-end-4 md:flex-row text-fg-default sm:col-start-1 sm:col-end-4"
      :class="$style['event__description']"
    >
      <div
        class="flex text-base mb-2 flex-wrap md:flex-col md:basis-[256px] md:shrink-0 md:grow md:order-2 md:w-1/2 md:h-max md:pl-5 md:rtl:pr-5 md:rtl:pl-0 md:ml-16 md:rtl:mr-16 md:rtl:ml-0 md:border-l md:border-l-[#627F8C59] md:border-l-solid md:rtl:border-l-0 md:rtl:border-r md:rtl:border-r-[#627F8C59] md:rtl:border-r-solid"
      >
        <span class="font-bold mr-3 uppercase">{{ duration }}</span>
        <span
          class="font-normal"
          data-testid="events-page-calendar-event-duration"
        >
          {{ formattedStartDate }} — {{ formattedEndDate }} {{ formattedYear }}
        </span>
      </div>
      <div
        class="text-base w-full"
        :class="$style['event__description-html']"
        data-testid="events-page-calendar-event-description"
        v-html="event.description"
      />
      <CtButton
        v-if="deviceInfo.mobile"
        type="tertiary"
        :label="hideDetails"
        class="justify-center my-4"
        data-testid="events-page-calendar-event-show-less-button"
        @click.native="descriptionVisible = !descriptionVisible"
      />
    </div>
  </div>
</template>

<style module lang="scss">
@import '~/assets/styles/_vars.scss';

.event {
  &__description-html {
    & ul {
      list-style-position: inside;
      list-style-type: disc;
    }
    & ol {
      list-style-type: decimal;
      list-style-position: inside;
    }
  }
  &__title {
    grid-area: title;
  }
  &__meta {
    grid-area: meta;
  }
  &__promocode {
    grid-area: promocode;
  }
  &__arrow {
    grid-area: arrow;
  }
  &__visit-website {
    grid-area: visit-website;
  }
  &__description {
    grid-area: description;
  }
  &__desktop-arrow {
    grid-area: desktop-arrow;
  }

  grid-template-areas:
    'title arrow'
    'meta meta'
    'promocode promocode'
    'description description'
    'visit-website visit-website';
  grid-row-gap: 0;

  @media (min-width: $sm) {
    grid-template-areas:
      'title visit-website arrow'
      'meta meta meta'
      'promocode promocode promocode'
      'description description description';
  }
  @media (min-width: $md) {
    grid-template-areas:
      'title meta visit-website arrow'
      'promocode promocode promocode promocode'
      'description description description description';
  }
}
</style>
