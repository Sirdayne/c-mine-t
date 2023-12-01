<script setup lang="ts">
import { PropType } from 'vue';
import { CohTarget } from '~/components/Coh/index';

defineProps({
  target: {
    type: Object as PropType<CohTarget>,
    required: true,
  },
});
</script>

<template>
  <div
    class="bg-white relative p-4 pb-8 font-semibold rounded-[20px] md:basis-[32%] w-full flex flex-col items-center text-center sm:min-h-[320px]"
  >
    <img
      :src="target.image"
      alt=""
      class="-translate-y-[64px] w-[124px] absolute"
    />
    <h3 class="text-l mr-5 ml-5 mb-3 mt-20">{{ target.title }}</h3>
    <p class="text-base font-normal pl-2 pr-2">{{ target.desc }}</p>
  </div>
</template>

<style scoped lang="scss"></style>
