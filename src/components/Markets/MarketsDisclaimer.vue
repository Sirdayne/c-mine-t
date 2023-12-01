<template>
  <div class="markets-disclaimer">
    <div class="markets-disclaimer__title">
      {{ i18n.disclaimerTitle }}
      <span class="markets-disclaimer__icon" />
    </div>
    <div
      class="markets-disclaimer__description"
      v-html="i18n.disclaimerText"
    />
  </div>
</template>

<script>
export default {
  name: 'MarketsDisclaimer',
  components: {},
  props: {
    i18n: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style scoped lang="scss">
@use '~/assets/styles/_icons-markets.scss' as icons;
@import '~/assets/styles/_vars.scss';
@import '~/assets/styles/_mixins.scss';

.markets-disclaimer {
  padding: 16px;
  box-shadow: 0 2px 4px #9c9c9c;
  border-radius: 4px;
  background-color: #ebebeb;
}
.markets-disclaimer__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.markets-disclaimer__title p {
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
  text-transform: uppercase;
  margin: 0;
}
.markets-disclaimer__description {
  font-size: 13px;
  font-weight: 400;
  line-height: 23px;
}
.markets-disclaimer__icon {
  @include icon-basic(24px);
  @include icons.danger(#9c9c9c);
}
</style>
