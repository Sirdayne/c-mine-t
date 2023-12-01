<script setup lang="ts">
defineProps<{
  size?: 'md' | 'lg';
  disabled?: boolean;
}>();
</script>

<template>
  <label
    class="select-none relative inline-block w-11 h-6"
    :class="{
      'w-[30px] !h-4': size === 'md',
      'pointer-events-none': disabled,
    }"
  >
    <input
      type="checkbox"
      class="opacity-0 w-0 h-0 peer"
    />
    <span
      class="peer-checked:bg-bg-primary absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-bg-lessSubtle transition-[0.4s] rounded-full before:rounded-full before:absolute before:content-[''] before:w-5 before:h-5 before:left-0.5 before:bottom-0.5 before:bg-white before:transition-[0.4s] peer-checked:before:translate-x-5"
      :class="{
        'opacity-60 ': disabled,
        'before:!w-3 before:!h-3 peer-checked:before:!translate-x-3.5': size === 'md',
      }"
    />
  </label>
</template>
