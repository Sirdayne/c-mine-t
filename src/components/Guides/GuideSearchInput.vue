<script setup lang="ts">
import MagnifierIcon from '~/assets/icons/magnifier.svg';
import CloseIcon from '~/assets/icons/close-rounded.svg';
import debounce from 'lodash/debounce';

defineProps<{
  placeholder: string;
  value: string;
}>();

const emit = defineEmits<{
  (e: 'input', value: string): void;
}>();

const onInput = debounce((value: string): void => {
  emit('input', value);
}, 500);
</script>

<template>
  <label class="mt-6 md:mt-8 md:mb-2 relative block">
    <MagnifierIcon class="text-[#AFBAC0] absolute left-4 rtl:right-4 rtl:left-[auto] top-1/2 -translate-y-1/2" />
    <input
      :value="value"
      type="text"
      :placeholder="placeholder"
      data-testid="search-guides-input"
      class="w-full text-[#E3E6E7] bg-black bg-opacity-20 p-4 rounded-xl border border-solid border-[#AFBAC040] outline-0 px-[50px] rtl:pl-0 focus:shadow-[0_4px_30px_0_#f3f3f14d]"
      @input="onInput($event.target.value || '')"
    />
    <CloseIcon
      v-if="value"
      data-testid="search-guides-input-clear-icon"
      class="text-[#809098] absolute top-1/2 -translate-y-1/2 right-4 rtl:left-4 rtl:right-[auto] cursor-pointer"
      @click="$emit('input', '')"
    />
  </label>
</template>
