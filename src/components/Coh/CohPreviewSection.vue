<script setup lang="ts">
import { useStore } from '~/lib/framework';
import { computed } from 'vue';

const store = useStore();
const title = computed(() => store.state.i18n.cohPreviewTitle);
const description = computed(() => store.state.i18n.cohPreviewDescription);
</script>
<template>
  <div
    :class="$style['preview']"
    class="bg-[url('/assets/img/coh/coh-section-1-bg.png')] bg-cover bg-no-repeat bg-center"
  >
    <div class="container items-center text-center flex flex-col justify-between h-inherit">
      <div class="pt-11 md:pt-9">
        <h1
          class="text-white pb-3"
          :class="$style['preview__title']"
        >
          {{ title }}
        </h1>
        <h3
          class="text-white pb-5"
          :class="$style['preview__sub-title']"
        >
          {{ description }}
        </h3>
        <button>
          <a
            href="#XXJYPQUS"
            style="display: none"
          />
        </button>
      </div>
      <div>
        <h3 class="text-white text-[18px] md:text-[20px] xl:text-[24px] leading-6 mb-5 font-bold">Powered by</h3>
        <div class="flex justify-center p-2">
          <a href="https://cointelegraph.com/">
            <img
              src="/assets/img/coh/coh-ct-logo.svg"
              alt="CT logo"
              class="mr-10"
            />
          </a>
          <a
            href="https://childrenheroes.org/en/?utm_source=cointelegraph&utm_medium=web&utm_campaign=23-Cointelegraph%20CoH%20Crypto&utm_id=Cointelegraph%20Fundraiser"
            target="_blank"
          >
            <img
              src="/assets/img/coh/coh-logo.svg"
              alt="CoH logo"
            />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<style module lang="scss">
@import '~/assets/styles/_mixins.scss';
@import '~/assets/styles/_vars.scss';
.preview {
  height: 935px;
  &__title {
    font-size: 58px;
    @include section-title(36px, 700, 41px);

    @media (min-width: $sm) {
      @include section-title(56px, 700, 58px);
    }
  }
  &__sub-title {
    @include section-title(16px, 400, 19px);

    @media (min-width: $sm) {
      @include section-title(32px, 400, 40px);
    }
  }
}
</style>
