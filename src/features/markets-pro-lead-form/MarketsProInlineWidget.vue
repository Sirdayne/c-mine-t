<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from '~/lib/framework';
import { MarketsProLeadForm } from '.';
import { useDeviceInfo } from '~/lib/device-detector';
const deviceInfo = useDeviceInfo();

const store = useStore();
const i18n = computed(() => store.state.i18n);
const focused = ref(false);

const handleBlur = () => {
  setTimeout(() => {
    focused.value = false;
  }, 0);
};
</script>

<template>
  <MarketsProLeadForm
    campaign="inner"
    :dense="true"
    :row-form="true"
    :small-form-gap="true"
    :small-text="true"
    :wrap-title="true"
    :small-wrapper="true"
    class="MarketsProInlineWidget"
    @focus="focused = true"
    @blur="handleBlur"
  >
    <template #subtitle>
      <img
        class="h-12 lg:h-14 lg:order-1"
        alt="logo"
        src="/assets/img/markets-pro-modal/logo.svg"
      />
    </template>
    <template #policy>
      <div
        v-if="deviceInfo.desktop || focused"
        class="mt-3 text-white text-uiXsWeak text-center lg:text-left"
        :class="$style.policy"
        v-html="i18n.inArticleSubscriptionFormTos"
      />
    </template>
  </MarketsProLeadForm>
</template>

<style lang="scss" module>
@import '~/assets/styles/_vars.scss';
.policy {
  a {
    color: white !important;
    @media (max-width: $sm) {
      display: block;
      width: fit-content;
      margin: 0 auto;
    }
  }
}
</style>
