<template>
  <div v-show="isActiveType">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'PriceIndexChartTypeItem',
  props: {
    name: {
      type: String,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isActiveType: false,
    };
  },
  computed: {
    href() {
      return `#${this.name.toLowerCase().replace(/ /g, '-')}`;
    },
  },
  mounted() {
    this.isActiveType = this.selected;
  },
};
</script>
