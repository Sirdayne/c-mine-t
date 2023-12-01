<template functional>
  <span
    class="pending"
    :class="[data.class, data.staticClass, `pending_${props.theme}`, props.isFinished && 'pending_finished']"
  >
    <span class="pending__runner" />
  </span>
</template>

<script>
export default {
  name: 'Pending',
  props: {
    isFinished: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: 'dark',
      validator(value) {
        return ['dark', 'light'].includes(value);
      },
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.pending {
  //default styles
  /*position: relative;
    display: block;
    width: 100%;
    height: 100%;*/
  overflow: hidden;
}
.pending__runner {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(100deg, transparent 10%, currentColor 40%, transparent 80%);
  backface-visibility: hidden;
  animation: pending 0.75s linear infinite forwards;
  will-change: transform;
  cursor: progress;
}
.pending_finished .pending__runner {
  display: none;
}
.pending_dark {
  color: rgba(0, 0, 0, 0.03);
}
.pending_light {
  color: rgba(255, 255, 255, 0.05);
}
</style>
