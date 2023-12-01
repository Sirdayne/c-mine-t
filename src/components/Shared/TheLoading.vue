<template>
  <span class="the-loading">
    <Transition name="fade">
      <span
        v-if="loading"
        class="the-loading__wrp"
      >
        <span class="the-loading__runner" />
      </span>
    </Transition>
  </span>
</template>

<script>
export default {
  name: 'TheLoading',
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      this.loading = false;
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.the-loading {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100%;
  height: 2px;
  backface-visibility: hidden;
  pointer-events: none;
}
.the-loading__wrp {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #253137;
}
.the-loading__runner {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  backface-visibility: hidden;
  animation: pending 1.5s linear infinite forwards;
  will-change: transform;
}
.the-loading__runner::after {
  content: '';
  display: block;
  width: 25vw;
  height: 100%;
  background-color: #fabf2c;
}
</style>
