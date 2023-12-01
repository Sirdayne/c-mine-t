<script setup lang="ts">
import { useCohApi } from '~/components/Coh/core/CohAPI';
import { computed, onBeforeMount, ref } from 'vue';
import CohDonationsSlider from '~/components/Coh/CohDonationsSlider.vue';
import { type CohDonation } from '~/components/Coh/types';
import { useStore } from '~/lib/framework';

const cohApi = useCohApi();
const totalBtc = ref(0);
const totalUsd = ref(0);
const donations = ref<CohDonation[]>([]);

const store = useStore();
const title = computed(() => store.state.i18n.cohDonationsTitle);
const recentDonationsTitle = computed(() => store.state.i18n.cohRecentDonationsTitle);
const supportProvided = computed(() => store.state.i18n.cohSupportProvided);

onBeforeMount(async () => {
  const resp = await cohApi.getDonations();
  totalBtc.value = resp.total_btc;
  totalUsd.value = resp.total_usd;
  donations.value = resp.donations;
});
</script>

<template>
  <div class="bg-[#0D121A]">
    <div class="bg-black py-12 sm:pt-20 sm:pb-20 flex flex-col items-center text-center justify-between">
      <div class="container">
        <h3 class="text-white leading-[40px] text-[28px] md:text-[32px] md:leading-[48px] font-bold pb-4">
          {{ title }}
        </h3>
        <h4 class="text-white mb-6 font-bold leading-[34px] text-[24px] md:text-[32px] md:leading-[48px]">
          Total:

          <span
            v-if="donations.length && totalBtc"
            class="text-[#ffe205] leading-[34px] text-[24px] md:text-[56px] md:leading-[84px] ml-2"
          >
            {{ totalBtc }} BTC
          </span>
        </h4>
        <div
          class="total-fiat inline-block px-6 py-2 rounded-3xl text-base sm:text-[32px] sm:leading-[36px] text-white font-semibold"
        >
          ~ ${{ totalUsd }}
        </div>
        <p
          class="max-w-[35ch] font-normal sm:max-w-[50ch] mx-auto text-base md:text-2xl leading-[22px] md:leading-[1.2em] text-white provided mt-12 md:mt-20"
          v-html="supportProvided"
        />
      </div>
    </div>
    <div
      v-if="donations.length"
      class="container flex flex-col items-center text-center justify-between pt-12 pb-16 sm:pt-20 sm:pb-28"
    >
      <h4 class="text-white text-[24px] leading-[26px] mb-12 sm:text-[32px] sm:leading-[35px] font-bold">
        {{ recentDonationsTitle }}
      </h4>
      <CohDonationsSlider :donations="donations" />
    </div>
  </div>
</template>

<style lang="scss">
.total-fiat {
  background: linear-gradient(180deg, #252b31 0%, rgba(37, 43, 49, 0) 100%);
}

.provided a {
  color: #ffe207;
  border-bottom: 1px solid #ffe207;
}
</style>
