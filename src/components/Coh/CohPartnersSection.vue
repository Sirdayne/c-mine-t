<script setup lang="ts">
import { useStore } from '~/lib/framework';
import { computed } from 'vue';

const store = useStore();
const leadDescription = computed(() => store.state.i18n.cohLeadingDescription);
const description = computed(() => store.state.i18n.cohDescription);
const partnersTitle = computed(() => store.state.i18n.cohPartnersTitle);
</script>
<template>
  <div class="bg-[#0D121A] pt-14">
    <div class="container items-center text-center flex flex-col justify-between">
      <div class="mb-20 text-white max-w-[80ch]">
        <h3
          class="mb-5"
          :class="$style['title']"
        >
          Children of Heroes
        </h3>
        <p
          class="mb-8 sm:mb-12 text-left"
          :class="$style['description']"
        >
          {{ leadDescription }}
        </p>
        <p
          class="text-xs text-left tracking-tight whitespace-break-spaces text-[#C8D0D3]"
          v-html="description"
        />
      </div>
      <div>
        <h3
          class="text-white mb-5"
          :class="$style['title']"
        >
          {{ partnersTitle }}
        </h3>
        <div class="flex flex-wrap justify-center">
          <img
            src="/assets/img/coh/partners/capital-times.svg"
            alt="Capital Times"
            class="my-2 mr-8 sm:mx-4 sm:ml-12 md:mx-4 w-[165px] md:w-auto"
          />

          <img
            src="/assets/img/coh/partners/diligent-capital.svg"
            alt="Diligent Capital"
            class="my-2 sm:mx-4 w-[100px] md:w-auto"
          />
          <img
            src="/assets/img/coh/partners/daryl-upsall.svg"
            alt="Daryl Upsall"
            class="my-2 mr-8 sm:mx-4 sm:mr-12 w-[180px] md:w-auto"
          />
          <img
            src="/assets/img/coh/partners/epam.svg"
            alt="Epam"
            class="my-2 sm:mx-4 w-[110px] md:w-auto"
          />
          <img
            src="/assets/img/coh/partners/preply.svg"
            alt="Preply"
            class="my-2 mr-8 sm:mx-4 w-[116px] md:w-auto"
          />
          <img
            src="/assets/img/coh/partners/microsoft.svg"
            alt="Microsoft"
            class="my-2 sm:mx-4 w-[165px] md:w-auto"
          />
          <img
            src="/assets/img/coh/partners/cargill.svg"
            alt="Cargill"
            class="my-2 mr-8 sm:mx-4 w-[116px] md:w-auto"
          />
          <img
            src="/assets/img/coh/partners/unicef.svg"
            alt="Unicef"
            class="my-2 sm:mx-4 w-[162px] md:w-auto"
          />
          <img
            src="/assets/img/coh/partners/vodafone.svg"
            alt="Vodafone"
            class="my-2 sm:mx-4 w-[180px] md:w-auto"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
@import '~/assets/styles/_mixins.scss';
@import '~/assets/styles/_vars.scss';

.title {
  @include section-title(28px, 700, 40px);
  @media (min-width: $md) {
    @include section-title(32px, 700, 48px);
  }
}
.description {
  @include section-title(20px, 400, 30px);
  letter-spacing: -0.02em;
}
</style>
