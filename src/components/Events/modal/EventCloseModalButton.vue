<template>
  <button @click="$emit('close')">
    <component
      :is="require(`~/assets/icons/close-cross.svg?inline`)"
      alt="icon"
      class="text-white"
    />
  </button>
</template>
