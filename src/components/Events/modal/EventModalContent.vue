<script setup lang="ts">
import { computed } from 'vue';
import { type Event } from '~/graphql';
import { CtButton } from '~/lib/ui';
import { intlFormat } from 'date-fns';
import { localeFormatter, unsafeParseDate } from '~/assets/libs/dateTimeUtils';
import { useStore } from '~/lib/framework';
import { useDeviceInfo } from '~/lib/device-detector';
import { OptimizedImage } from '~/lib/image';
import EventModalContentControls from '~/components/Events/modal/EventModalContentControls.vue';
import { SliderViewModel } from '~/lib/slider-view-model';

const MOBILE_IMAGE_HEIGHT = 256;
const MOBILE_IMAGE_WIDTH = 400;

const TABLET_IMAGE_WIDTH = 560;
const TABLET_IMAGE_HEIGHT = 220;

const props = defineProps<{
  event: Event;
  modalSliderVm: SliderViewModel;
}>();

const store = useStore();
const deviceInfo = useDeviceInfo();

const visitWebsiteLabel = computed(() => store.state.i18n.eventsVisitWebsite);

const currentLanguageShort = computed(() => store.state.currentLanguage.short);

const eventCategories = computed(() => {
  return props.event.categories.map((category) => category.title).join(', ');
});

const imageSize = computed(() => {
  if (deviceInfo.mobile) {
    return {
      height: MOBILE_IMAGE_HEIGHT,
      width: TABLET_IMAGE_WIDTH,
    };
  }

  return {
    height: TABLET_IMAGE_HEIGHT,
    width: TABLET_IMAGE_WIDTH,
  };
});
const eventDateFormatter = (date: string): string => {
  return intlFormat(
    unsafeParseDate(date),
    { day: 'numeric', month: 'long' },
    {
      locale: localeFormatter(currentLanguageShort.value),
    }
  );
};

const eventStartDate = computed(() => eventDateFormatter(props.event.startDate));
const eventEndDate = computed(() => eventDateFormatter(props.event.endDate));

const eventMetaDate = computed(() => {
  if (eventEndDate.value && eventStartDate.value !== eventEndDate.value) {
    return `${eventStartDate.value} - ${eventEndDate.value}`;
  }

  return eventStartDate.value;
});

const ASPECT_RATIO_DESK = TABLET_IMAGE_WIDTH / TABLET_IMAGE_HEIGHT;
const ASPECT_RATIO_MOBILE = MOBILE_IMAGE_WIDTH / MOBILE_IMAGE_HEIGHT;

const aspectRatio = computed(() => {
  return deviceInfo.mobile ? ASPECT_RATIO_MOBILE : ASPECT_RATIO_DESK;
});
</script>

<template>
  <div class="mb-5 sm:mb-6 justify-center sm:!w-[560px] sm:mx-auto">
    <div
      :class="$style['image-wrapper']"
      class="relative before:content-[''] before:float-left after:content-[''] after:block after:clear-both -mx-[25px] sm:mx-0"
    >
      <OptimizedImage
        :src="event.imageUrl"
        :width="imageSize.width"
        :height="imageSize.height"
        :fill="deviceInfo.mobile"
        data-testid="event-modal-cover"
        class="sm:rounded-containerM absolute object-cover sm:static select-none drag-none"
      />
      <EventModalContentControls
        v-if="deviceInfo.mobile"
        :modal-slider-vm="modalSliderVm"
      />
    </div>
    <div class="md:flex md:justify-between items-baseline mt-3 sm:mt-5 md:mt-6 px-3">
      <h3
        class="text-white text-xxl leading-[34px] md:text-[34px] md:leading-[44px]"
        data-testid="event-modal-title"
      >
        {{ event.title }}
      </h3>
      <CtButton
        v-if="deviceInfo.desktop"
        link
        :href="event.website"
        round="default"
        target="_blank"
        data-testid="event-modal-desktop-visit-website-link"
        :label="visitWebsiteLabel"
        class="justify-center min-w-[130px] max-h-10 ml-4"
      />
    </div>
    <div
      class="px-3 text-bg-primary mb-4 sm:mb-5 md:mb-6"
      data-testid="event-modal-meta"
    >
      {{ event.country.title }}
      <span class="mx-2">&#x2022;</span>
      {{ eventMetaDate }}
    </div>
    <div
      class="text-bg-lessSubtle sm:h-auto px-3"
      data-testid="event-modal-description"
      v-html="event.description"
    />
    <p
      class="mt-5 text-fg-subtle px-3"
      data-testid="event-modal-categories"
    >
      {{ eventCategories }}
    </p>
  </div>
</template>

<style module>
.image-wrapper {
  &:before {
    padding-top: calc(100% / v-bind(aspectRatio));
  }
}
</style>
