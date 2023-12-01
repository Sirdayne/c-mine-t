<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useRoute } from '~/lib/framework';
import { useStorage } from '@vueuse/core';
import { Timer } from '~/assets/libs/Timer';
import { MarketsProLeadForm } from '.';
import CtButton from '~/lib/ui/ct-button/CtButton.vue';

const VISIBILITY_DELAY = 3000;

const route = useRoute();

const closed = useStorage('marketsProLeadFormModalClosed', false);
const visible = ref(false);

const showDelayTimer = new Timer(VISIBILITY_DELAY, () => {
  visible.value = true;
});

const hideDelayTimer = new Timer(VISIBILITY_DELAY, () => {
  visible.value = false;
});

const closeModal = (): void => {
  closed.value = true;
  visible.value = false;
};

const onSuccess = (): void => {
  closed.value = true;
  hideDelayTimer.schedule();
};

watchEffect((onInvalidate) => {
  if (!closed.value && route.value.name === 'index') {
    showDelayTimer.schedule();
  }
  onInvalidate(() => {
    showDelayTimer.cancel();
  });
});
</script>

<template>
  <MarketsProLeadForm
    v-if="visible"
    :dense="false"
    :row-form="false"
    :small-form-gap="false"
    :small-text="false"
    :wrap-title="false"
    :small-wrapper="false"
    campaign="main"
    class="z-10 fixed sm:right-[15px] sm:bottom-[50px] sm:w-[420px] sm:left-auto bottom-0 right-0 left-0 w-auto"
    @success="onSuccess"
  >
    <template #logos>
      <img
        class="h-12 mb-[30px] mr-auto hidden sm:block"
        alt="logo"
        src="/assets/img/markets-pro-modal/logo.svg"
      />
      <img
        class="mb-[30px] sm:hidden"
        alt="logo"
        src="/assets/img/markets-pro-modal/logo-m.svg"
      />
    </template>
    <template #close>
      <button
        :class="$style.close"
        class="w-[18px] h-[18px] absolute top-3 right-3"
        @click="closeModal"
      />
    </template>
    <template #bottomLink>
      <CtButton
        round="default"
        link
        target="_blank"
        href="https://cointelegraph.com/marketspro/top-guide-a/"
        class="sm:hidden text-bg-inverted justify-center"
        @click.native="closeModal"
      >
        Get Instant Access
      </CtButton>
    </template>
  </MarketsProLeadForm>
</template>

<style module lang="scss">
@use '~/assets/styles/_icons-common.scss' as icons;
.close {
  @include icons.cross(#ffffff);
}
</style>
