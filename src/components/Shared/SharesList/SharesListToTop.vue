<template>
  <button
    class="btn group"
    type="button"
    @click="handleToTop"
  >
    <ArrowIcon class="text-fg-primaryDefault group-hover:!text-fg-primaryStrong to-top-icon" />
  </button>
</template>

<script>
import scrollTo from '~/assets/libs/scrollTo';
import ArrowIcon from '~/assets/icons/socials/totop.svg';

export default {
  name: 'SharesListToTop',
  components: {
    ArrowIcon,
  },
  methods: {
    handleToTop() {
      scrollTo();
    },
  },
};
</script>
<style scoped>
.to-top-icon * {
  @media (max-width: 370px) {
    scale: 0.8;
  }
}
</style>
