<script setup lang="ts">
import { COH_TARGETS } from '~/components/Coh/index';
import TargetCard from '~/components/Coh/TargetCard.vue';
import { useStore } from '~/lib/framework';
import { computed } from 'vue';

const targets = COH_TARGETS;
const store = useStore();

const title = computed(() => store.state.i18n.cohTargetSectionTitle);
</script>

<template>
  <div class="pb-24 bg-[url('/assets/img/coh/target-bg.png')] bg-cover bg-no-repeat bg-center">
    <div class="container flex flex-col text-center">
      <h3 class="text-white text-[32px] leading-[48px] mt-8 font-bold">{{ title }}</h3>
      <div class="flex flex-wrap justify-between">
        <template v-for="target in targets">
          <TargetCard
            :key="target.title"
            :target="target"
            class="mt-24 md:[&:nth-child(n+4)]:mt-24"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
