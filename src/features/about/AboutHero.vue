<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '~/lib/framework';
import AboutBrandResources from './AboutBrandResources.vue';
import AboutGetInTouch from './AboutGetInTouch.vue';

const store = useStore();
const i18n = computed(() => store.state.i18n);
</script>

<template>
  <div>
    <h1
      data-testid="about-page-title"
      class="text-[#111619] text-[26px] sm:text-[34px] font-semibold md:leading-loose leading-[31px] mb-5"
      v-html="i18n['about.hero.title']"
    />

    <div class="flex flex-col md:flex-row gap-8 md:gap-[121px]">
      <div class="md:flex flex-col contents gap-12">
        <div
          data-testid="about-page-description"
          class="text-[#273036] leading-relaxed"
          v-html="i18n['about.hero.description']"
        />

        <div class="max-w-[46rem] order-1">
          <h2
            data-testid="about-page-team-block-title"
            class="text-fg-strong text-[26px] md:text-[34px] font-semibold md:leading-loose leading-[31px] mb-5"
            v-html="i18n['about.team.title']"
          />

          <div
            data-testid="about-page-team-block-description"
            class="text-[#273036] leading-relaxed"
            v-html="i18n['about.team.description']"
          />
        </div>
      </div>

      <div class="flex flex-col sm:flex-row md:flex-col gap-5 md:gap-6 md:w-[384px] shrink-0">
        <div class="sm:max-md:grow sm:max-md:w-2/3">
          <AboutGetInTouch />
        </div>
        <div class="sm:max-md:grow sm:max-md:w-1/3">
          <AboutBrandResources />
        </div>
      </div>
    </div>
  </div>
</template>
