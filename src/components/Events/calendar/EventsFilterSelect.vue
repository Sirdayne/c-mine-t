<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '~/lib/framework';

export interface SelectOption {
  value: string;
  name: string;
}

defineProps<{
  options: SelectOption[];
  label: string;
  placeholder: string;
  value?: string | null;
}>();

defineEmits<{
  (e: 'input', value: string | null): void;
}>();

const store = useStore();
const clear = computed(() => store.state.i18n.eventsClearFilter);
</script>

<template>
  <label class="block dark:text-white capitalize relative w-full text-fg-default text-base font-semibold">
    {{ label }}
    <button
      v-if="value !== null && value !== placeholder"
      class="absolute outline-none text-red-600 cursor-pointer top-0 ltr:right-0 rtl:left-0 text-xs"
      data-testid="filter-clear-button"
      @click="$emit('input', null)"
    >
      {{ clear }}
    </button>
    <select
      :value="value"
      class="bg-white py-2 pl-4 pr-3 border border-solid mt-2 border-[#627F8C59] hover:bg-bg-subtle text-gray-900 rounded-containerS block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus-visible:outline-0 appearance-none bg-[url('/assets/img/dropdown-arrow.svg')] bg-[length:20px] bg-no-repeat bg-[calc(100%_-_12px)_center] rtl:bg-[12px_center]"
      @change="$emit('input', $event.target.value || null)"
    >
      <option
        selected
        :value="null"
      >
        {{ placeholder }}
      </option>
      <option
        v-for="(option, index) in options"
        :key="index"
        :value="option.value"
      >
        {{ option.name }}
      </option>
    </select>
  </label>
</template>
