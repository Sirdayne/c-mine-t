<template>
  <!-- eslint-disable vue/html-self-closing -->
  <div
    v-if="validValue"
    class="price-index-about"
  >
    <h2 class="price-index-about__title">
      {{ localI18n.aboutBlockTitle }}
    </h2>
    <div
      class="price-index-about__text"
      v-html="localI18n.aboutBlockText"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'PriceIndexAbout',
  props: {
    localI18n: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    validValue() {
      return (
        this.localI18n.aboutBlockTitle.indexOf('price.index') === -1 &&
        this.localI18n.aboutBlockText.indexOf('price.index') === -1
      );
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.price-index-about__title {
  margin: 0;
  color: #253137;
  font-size: 16px;
  font-weight: 700;
  @media (min-width: $sm) {
    font-size: 22px;
  }
}
.price-index-about__text {
  margin-top: 11px;
  font-size: 18px;
  font-weight: 400;
  line-height: 30px;
}
</style>
