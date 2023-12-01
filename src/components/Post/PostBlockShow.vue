<template>
  <div
    v-if="hasText"
    ref="component"
    class="post-block-show"
    v-html="i18n.blockshowPromoText"
  />
</template>

<script>
import { mapState } from 'vuex';
import { postBlockShowEvents, pushDataLayerEvent } from '~/assets/helpers/dataLayerEvents';

const DATA_LAYER_EVENT_NAME = 'Blockshow';
const I18N_KEY = 'blockshow.promo.text';

export default {
  name: 'PostBlockShow',
  computed: {
    ...mapState({
      i18n: ({ i18n }) => i18n,
    }),
    ...mapState('viewport', {
      scrollTop: ({ scrollTop }) => scrollTop,
      viewportHeight: ({ viewportHeight }) => viewportHeight,
    }),
    dataLayerEventData() {
      return postBlockShowEvents(DATA_LAYER_EVENT_NAME);
    },
    hasText() {
      const text = this.i18n.blockshowPromoText;
      return text && text !== I18N_KEY;
    },
  },
  created() {
    if (this.hasText) {
      this.isInViewportDataLayerWatcher = this.$watch('scrollTop', this.tryToDataLayerPush);
    }
  },
  mounted() {
    if (this.hasText) {
      this.tryToDataLayerPush();
    }
  },
  beforeDestroy() {
    if (typeof this.isInViewportDataLayerWatcher === 'function') {
      this.isInViewportDataLayerWatcher();
    }
  },
  methods: {
    componentInViewport() {
      const component = this.$refs.component;
      const { top, height } = component.getBoundingClientRect();
      return top <= this.viewportHeight && top + height >= 0;
    },
    tryToDataLayerPush() {
      this.$nextTick(() => {
        if (!this.componentInViewport()) {
          return;
        }
        this.dataLayerPush();
      });
    },
    dataLayerPush() {
      pushDataLayerEvent({
        type: 'impression',
        dataLayerEventData: this.dataLayerEventData,
      });
      this.isInViewportDataLayerWatcher();
    },
  },
};
</script>

<style>
.post-block-show {
  font-size: 14px;
  text-align: center;
  border: 1px solid #fabf2c;
  box-sizing: border-box;
  padding: 18px 24px;
}
.post-block-show a {
  color: #08a0ff;
  border-bottom: 1px solid #08a0ff;
  text-decoration: none;
  transition: color 0.3s, border-color 0.3s;
}
.post-block-show a:hover {
  text-decoration: none;
  border-color: #0666a1;
  color: #0666a1;
}
@media (min-width: 768px) {
  .post-block-show {
    font-size: 16px;
  }
}
</style>
