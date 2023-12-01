<script setup lang="ts">
import { ref, unref } from 'vue';

defineProps<{
  title: string;
  dataTestIdShowBtn: string;
  dataTestIdHideBtn: string;
}>();

const emit = defineEmits<{
  (event: 'click', visible: boolean): void;
}>();

const contentsVisible = ref(false);

const toggleVisibility = () => {
  contentsVisible.value = !contentsVisible.value;
  emit('click', unref(contentsVisible));
};
</script>

<template>
  <button
    data-testid="guide-mobile-navigation-title"
    class="py-3 px-4 flex justify-between w-full bg-white rounded"
    :class="{ 'border-b border-[#e3e6e7] rounded-b-none': contentsVisible }"
    @click="toggleVisibility"
  >
    <span class="font-semibold text-ml leading-6 text-bg-invertedStrong">{{ title }}</span>
    <img
      src="/assets/img/dropdown-arrow.svg"
      class="w-[24px] h-[24px] self-center"
      :class="{ 'rotate-180': contentsVisible }"
      :data-testid="dataTestIdShowBtn"
    />
  </button>
</template>
