<template>
  <div v-html="svg" />
</template>

<script>
export default {
  name: 'IconCoin',
  props: {
    svg: {
      type: String,
      default: '',
    },
  },
};
</script>
