<template>
  <div
    id="TreeMapWidgetMount"
    :style="componentHeight"
    class="coin-360-widget"
  />
</template>

<script>
const WIDGET_URL = 'https://coin360.com/scripts/widgets/TreeMapWidget.min.js?dark=false&top=10';

export default {
  name: 'Coin360Widget',
  props: {
    widgetHeight: {
      type: Number,
      default: 200,
    },
  },
  computed: {
    componentHeight() {
      return {
        height: `${this.widgetHeight}px`,
      };
    },
  },
  beforeDestroy() {
    this.deleteScript();
  },
  mounted() {
    this.$nextTick(() => {
      this.addScript();
    });
  },
  methods: {
    deleteScript() {
      const script = document.getElementById('coin360widgetScript');

      if (script) {
        script.remove();
      }
    },
    addScript() {
      const script = document.getElementById('coin360widgetScript');

      if (!script) {
        const widget = document.createElement('script');
        widget.src = WIDGET_URL;
        widget.id = 'coin360widgetScript';

        document.body.appendChild(widget);
      }
    },
  },
};
</script>

<style lang="scss">
.coin-360-widget {
  position: relative;
  z-index: 1;
}
.coin-360-widget:not(:first-child)::before {
  content: '';
  display: block;
  height: 2px;
  background-color: #eceff1;
}
</style>
