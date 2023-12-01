<script setup lang="ts">
import { ref } from 'vue';
import CtButton from '~/lib/ui/ct-button/CtButton.vue';

const fullDescription = ref(false);

const props = defineProps<{
  description: string;
}>();
</script>

<template>
  <div class="mt-4">
    <div class="flex">
      <div>
        <div
          :style="{ 'max-height': fullDescription ? '100%' : '140px' }"
          class="text-fg-default md:text-[19px] sm:text-ml text-s leading-[160%] font-normal break-words overflow-hidden transition-all duration-200"
          v-html="props.description"
        />
      </div>
    </div>
    <div class="mt-8">
      <CtButton
        class="max-md:w-full"
        type="secondary"
        @click.native="fullDescription = !fullDescription"
      >
        {{ fullDescription ? 'Read less' : 'Read more'}}
      </CtButton>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
