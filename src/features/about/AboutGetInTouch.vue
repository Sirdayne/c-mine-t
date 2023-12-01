<script setup lang="ts">
import { computed, unref } from 'vue';
import { useStore } from '~/lib/framework';
import { translatePropsOrExclude } from './translatePropsOrExclude';

const store = useStore();
const i18n = computed(() => store.state.i18n);

interface Email {
  address: string;
  label: string;
}

const emails = computed(() =>
  translatePropsOrExclude(unref(i18n), ['address', 'label'], [
    {
      address: 'about.get-in-touch.email.editorial.address',
      label: 'about.get-in-touch.email.editorial.label',
    },
    {
      address: 'about.get-in-touch.email.opinion.address',
      label: 'about.get-in-touch.email.opinion.label',
    },
    {
      address: 'about.get-in-touch.email.advertising.address',
      label: 'about.get-in-touch.email.advertising.label',
    },
    {
      address: 'about.get-in-touch.email.partnership.address',
      label: 'about.get-in-touch.email.partnership.label',
    },
    {
      address: 'about.get-in-touch.email.franchise.address',
      label: 'about.get-in-touch.email.franchise.label',
    },
  ] satisfies Email[])
);
</script>

<template>
  <div
    data-testid="about-page-get-in-touch"
    class="p-4 rounded-lg border border-slate-500 border-opacity-30 overflow-x-hidden"
  >
    <h2
      data-testid="about-page-get-in-touch-title"
      class="mb-4 text-[#111619] text-lg font-semibold leading-snug"
      v-html="i18n['about.get-in-touch.title']"
    />

    <a
      data-testid="about-page-get-in-touch-adversite-link"
      :href="i18n['advertiseUrl']"
      class="mb-4 block text-[#273036] underline leading-7"
      v-html="i18n['about.get-in-touch.advertise.label']"
    />

    <div
      v-for="(email, index) of emails"
      :key="index"
      class="whitespace-normal flex flex-nowrap gap-2"
    >
      <span class="text-[#5E6D74] leading-7 basis-24 shrink-0">
        {{ email.label }}
      </span>

      <a
        data-testid="about-page-get-in-touch-contact-link"
        :href="`mailto:${email.address}`"
        class="text-[#273036] leading-7 underline break-all"
      >
        {{ email.address }}
      </a>
    </div>
  </div>
</template>
