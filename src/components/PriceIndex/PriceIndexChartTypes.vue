<template>
  <!-- eslint-disable vue/html-self-closing -->
  <div>
    <div
      v-for="(type, index) in types"
      :key="index"
      class="chartTypeTabLinks"
      :class="{ cTypeTabActive: type.isActiveType }"
      @click="select_type(type)"
      v-html="type.name"
    ></div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'PriceIndexChartTypes',
  data() {
    return {
      types: [],
    };
  },
  created() {
    this.types = this.$children;
  },
  methods: {
    select_type(selectedType) {
      this.types.forEach((type) => {
        type.isActiveType = type.name === selectedType.name;
      });
      this.$emit('select_type', { type: selectedType });
    },
  },
};
</script>
