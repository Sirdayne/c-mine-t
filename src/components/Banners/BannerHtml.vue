<template>
  <span
    :class="{ 'banner-html': true, 'custom-height': widgetHeight }"
    :style="widgetHeightStyle"
  >
    <Pending
      class="banner-html__pending"
      :theme="theme"
    />
    <span
      class="banner-html__wrp"
      v-html="html"
    />
  </span>
</template>

<script>
import Pending from '~/components/Shared/Pending';

export default {
  name: 'BannerHtml',
  components: {
    Pending,
  },
  props: {
    widgetHeight: {
      type: String,
      default: null,
    },
    theme: {
      type: String,
      default: 'dark',
    },
    html: {
      type: String,
      default: '',
    },
  },
  computed: {
    widgetHeightStyle() {
      return this.widgetHeight && `--widget-height: ${this.widgetHeight}px`;
    },
  },
};
</script>

<style scoped lang="scss">
@import '~/assets/styles/_vars.scss';

.banner-html__pending {
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  width: 100%;
  height: 100%;
  padding-top: 0;
}
.banner-html__wrp {
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  width: 100%;
  height: 100%;
  padding-top: 0;
}

.banner-html.custom-height {
  padding-top: 0 !important;
  padding-bottom: var(--widget-height);

  .banner-html__pending,
  .banner-html__wrp {
    height: var(--widget-height);
  }
}
</style>
