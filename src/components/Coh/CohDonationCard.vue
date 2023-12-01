<script setup lang="ts">
import { computed, PropType, unref } from 'vue';
import { type CohDonation } from '~/components/Coh/types';
import { intlFormat } from 'date-fns';
import { localeFormatter, unsafeParseDate } from '~/assets/libs/dateTimeUtils';
import { useStore } from '~/lib/framework';

const props = defineProps({
  donation: {
    type: Object as PropType<CohDonation>,
    required: true,
  },
});
const store = useStore();

const currentLanguageShort = computed(() => store.state.currentLanguage.short);

const fullName = computed(() => {
  if (props.donation?.firstName && props.donation.lastName) {
    return `${props.donation?.firstName} ${props.donation.lastName}`;
  }
  return props.donation?.firstName;
});
const donationDate = computed(() => props.donation?.donatedAt);
const transactionFullDate = computed(() => {
  const offset = new Date().getTimezoneOffset();

  const date = new Date(
    donationDate.value.year,
    donationDate.value.month - 1,
    donationDate.value.day,
    donationDate.value.hour,
    donationDate.value.minute,
    donationDate.value.second
  );

  date.setMinutes(
    Math.sign(offset) === -1 ? date.getMinutes() + Math.abs(offset) : date.getMinutes() - Math.abs(offset)
  );

  return unsafeParseDate(date);
});

const humanDate = computed(() =>
  intlFormat(
    transactionFullDate.value,
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    },
    { locale: localeFormatter(unref(currentLanguageShort)) }
  )
);
const getDonationPublished = () => {
  const difference =
    unsafeParseDate(new Date()).getTime() - unsafeParseDate(new Date(transactionFullDate.value)).getTime();
  const resultInMinutes = Math.round(difference / 60000);
  const resultInHours = Math.round(resultInMinutes / 60);
  if (resultInHours >= 24) {
    return humanDate.value;
  }
  if (resultInMinutes < 60) {
    if (resultInMinutes < 1) return `Less than a minute ago`;

    return resultInMinutes <= 1 ? `${resultInMinutes} minute ago` : `${resultInMinutes} minutes ago`;
  }

  return resultInHours <= 1 ? `${resultInHours} hour ago` : `${resultInHours} hours ago`;
};
</script>

<template>
  <div class="border border-[#50575F] text-center sm:text-left rounded-[20px] flex flex-col w-full">
    <div class="py-2 px-4 sm:py-4 sm:px-5 bg-black rounded-t-[20px]">
      <p class="text-[#ffe205] text-l sm:text-xl font-semibold mb-2">{{ donation.btcAmount }} BTC</p>
      <p class="text-[#9AA2AB] text-m leading-4">~ ${{ donation.usdAmount }} donated</p>
    </div>
    <div class="py-2 px-4 sm:py-4 sm:px-5 bg-[#171A1C] rounded-b-[20px]">
      <p class="text-base text-white mb-2 font-semibold">by {{ fullName }}</p>
      <time :datetime="humanDate">
        <p class="text-[#9AA2AB] text-s sm:text-m">{{ getDonationPublished() }}</p>
      </time>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
