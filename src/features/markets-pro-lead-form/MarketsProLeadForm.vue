<script setup lang="ts">
import { ref, computed } from 'vue';
import { useConpletusApi, type MarketsProLeadCampaign } from '~/lib/conpletus-api';

const emit = defineEmits<{
  (e: 'success'): void;
  (e: 'focus'): void;
  (e: 'blur'): void;
}>();

const props = defineProps<{
  campaign: MarketsProLeadCampaign;
  dense: boolean;
  rowForm: boolean;
  smallText: boolean;
  wrapTitle: boolean;
  smallFormGap: boolean;
  smallWrapper: boolean;
}>();

const conpletusApi = useConpletusApi();

const success = ref(false);
const dirty = ref(false);
const email = ref('');
const submitFailed = ref(false);
const loading = ref(false);

const onSubmit = async (): Promise<void> => {
  if (loading.value || success.value) {
    return;
  }
  if (submitFailed.value) {
    submitFailed.value = false;
    dirty.value = false;
    return;
  }
  dirty.value = true;
  try {
    loading.value = true;
    await conpletusApi.submitMarketsProLead({ email: email.value, campaign: props.campaign });
    success.value = true;
    emit('success');
  } catch (error) {
    submitFailed.value = true;
    throw error;
  } finally {
    loading.value = false;
  }
};

const buttonText = computed(() => {
  if (!dirty.value) {
    return 'Click Here For Instant Access';
  }
  if (loading.value) {
    return 'Processing...';
  }
  if (submitFailed.value) {
    return 'Something went wrong. Please try again';
  }
  if (success.value) {
    return 'Done! Check your inbox';
  }
  return null;
});
</script>

<template>
  <div
    class="bg-[url('/assets/img/markets-pro-modal/bg.jpg')] bg-cover bg-right-top flex gap-3 sm:gap-0 bg-black text-white font-bold"
    :class="{
      'sm:flex-col p-6 rounded-t-lg sm:rounded-lg': !smallWrapper,
      'flex-col rounded-[8px] p-4 lg:p-6': smallWrapper,
    }"
  >
    <slot name="logos" />
    <form
      class="flex flex-col w-full"
      :class="{
        'gap-3 sm:gap-10': !smallFormGap,
        'gap-6 lg:gap-5': smallFormGap,
      }"
      @submit.prevent="onSubmit"
    >
      <div class="flex items-start lg:items-center flex-col lg:flex-row justify-between">
        <slot name="subtitle" />
        <p
          class="first-letter:font-semibold"
          :class="{
            'sm:text-[28px] sm:leading-[33px] text-lg leading-6': !smallText,
            'text-[18px] leading-[21px] lg:text-[23px] lg:leading-[27px]': smallText,
          }"
        >
          Get Access to
          <span class="text-bg-primary whitespace-nowrap">Real-Time</span>
          <br :class="[wrapTitle ? 'inline' : 'hidden']" />
          Trade Alerts Now
        </p>
      </div>

      <div
        class="flex-col gap-[9px] mb-[9px]"
        :class="{
          'hidden sm:flex': !rowForm,
          'flex lg:flex-wrap lg:flex-row': rowForm,
        }"
      >
        <input
          v-model="email"
          required
          class="font-normal text-base h-12 rounded text-fg-strong w-full p-3 border-none outline-none placeholder-muted"
          :class="{ '!h-10 lg:grow lg:w-max': dense }"
          type="email"
          name="email"
          placeholder="Enter email address"
          @focus="$emit('focus')"
          @blur="$emit('blur')"
        />
        <button
          class="font-semibold text-base h-12 rounded text-bg-inverted w-full flex items-center justify-center gap-2"
          :class="[
            submitFailed ? 'bg-border-default' : 'bg-bg-primary',
            { '!h-10 lg:grow lg:w-max': dense },
            { 'pointer-events-none': success },
          ]"
          type="submit"
        >
          <img
            v-if="success"
            src="/assets/img/markets-pro-modal/ok.svg"
            alt="ok"
          />
          {{ buttonText }}
        </button>
        <slot name="policy" />
      </div>
      <slot name="bottomLink" />
    </form>
    <slot name="close" />
  </div>
</template>
