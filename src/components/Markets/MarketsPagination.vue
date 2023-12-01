<template>
  <div class="markets-pagination__row">
    <button
      v-for="(item, index) in list"
      :key="index"
      type="button"
      class="btn markets-pagination__dot"
      :class="index === active && 'markets-pagination__dot_active'"
      @click.prevent="$emit('set-active', index)"
    />
  </div>
</template>

<script>
export default {
  name: 'MarketsPagination',
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    active: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style>
.markets-pagination__row {
  display: flex;
  justify-content: center;
}
.markets-pagination__dot {
  padding: 6px;
  width: 6px;
  height: 6px;
  background-color: rgb(239, 239, 239);
  background-clip: content-box;
  box-sizing: content-box;
  border-radius: 100%;
  transition: 0.25s ease-out background-color;
}
.markets-pagination__dot_active {
  background-color: rgb(0, 0, 0);
}
</style>
