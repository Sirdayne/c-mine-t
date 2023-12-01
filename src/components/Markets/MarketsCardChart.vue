<template>
  <div
    class="markets-card__plot"
    :class="{
      hidden: !chartHTML,
    }"
  >
    <div
      ref="chart"
      class="markets-card-chart"
      v-html="chartHTML"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import * as d3 from 'd3';

export default {
  name: 'MarketsCardChart',
  props: {
    symbol: {
      type: String,
      default: 'BTC',
    },
    charts: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      chartW: undefined,
      chartH: undefined,
      highlightPercent: false,
    };
  },
  computed: {
    ...mapState('viewport', {
      viewportWidth: ({ viewportWidth }) => viewportWidth,
    }),
    chartHTML() {
      const { charts, chartW, chartH } = this;
      if (!charts || !charts.length) {
        return '';
      }
      const greenLineColor = '#3abc98';
      const greenAreaColor = '#d8f2ea';
      const redLineColor = '#cf1c38';
      const redAreaColor = '#f1bbc3';
      const el = document.createElement('div');
      const w = chartW;
      const h = chartH;
      const data = charts.map((d) => ({
        date: new Date(d.t * 1000),
        value: parseFloat(d.p),
      }));
      const lineWidth = 1;
      const graphPadding = Math.ceil(lineWidth / 2);

      const minMaxValue = d3.extent(data, (d) => d.value);

      const openValue = data[0].value;

      const svg = d3.select(el).append('svg').attr('width', w).attr('height', h);

      const x = d3.scaleTime().rangeRound([0, w]);
      const y = d3.scaleLinear().rangeRound([h - graphPadding, graphPadding]);

      x.domain(d3.extent(data, (d) => d.date));
      y.domain(minMaxValue);

      const gradientRelativePos = (openValue - minMaxValue[0]) / (minMaxValue[1] - minMaxValue[0]).toPrecision(4) || 0;
      const gradientPercent = 100 * gradientRelativePos;

      svg
        .append('linearGradient')
        .attr('id', `line-gradient-${this.symbol}`)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', 0)
        .attr('y1', !Number.isNaN(y(minMaxValue[0])) ? y(minMaxValue[0]) : 0)
        .attr('x2', 0)
        .attr('y2', !Number.isNaN(y(minMaxValue[1])) ? y(minMaxValue[1]) : 0)
        .selectAll('stop')
        .data([
          { offset: '0%', color: redLineColor },
          { offset: `${gradientPercent}%`, color: redLineColor },
          { offset: `${gradientPercent}%`, color: greenLineColor },
          { offset: '100%', color: greenLineColor },
        ])
        .enter()
        .append('stop')
        .attr('offset', (d) => d.offset)
        .attr('stop-color', (d) => d.color);

      svg
        .append('linearGradient')
        .attr('id', `area-gradient-${this.symbol}`)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', 0)
        .attr('y1', !Number.isNaN(y(minMaxValue[0])) ? y(minMaxValue[0]) : 0)
        .attr('x2', 0)
        .attr('y2', !Number.isNaN(y(minMaxValue[1])) ? y(minMaxValue[1]) : 0)
        .selectAll('stop')
        .data([
          { offset: '0%', color: redAreaColor },
          { offset: `${gradientPercent}%`, color: redAreaColor },
          { offset: `${gradientPercent}%`, color: greenAreaColor },
          { offset: '100%', color: greenAreaColor },
        ])
        .enter()
        .append('stop')
        .attr('offset', (d) => d.offset)
        .attr('stop-color', (d) => d.color);

      const area = d3
        .area()
        .x((d) => x(d.date))
        .y(y(openValue))
        .y1((d) => y(d.value));

      svg.append('path').datum(data).attr('fill', `url(#area-gradient-${this.symbol})`).attr('d', area);

      const line = d3
        .line()
        .x((d) => x(d.date))
        .y((d) => y(d.value));

      svg
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', `url(#line-gradient-${this.symbol})`)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', lineWidth)
        .attr('d', line);

      const closeValue = data[data.length - 1].value;

      svg
        .append('circle')
        .style('stroke', '#fff')
        .style('stroke-width', '1px')
        .style('fill', closeValue >= openValue ? greenLineColor : redLineColor)
        .attr('r', 2.5)
        .attr('cx', w)
        .attr('cy', !Number.isNaN(y(closeValue)) ? y(closeValue) : 0);

      return el.innerHTML;
    },
  },
  watch: {
    viewportWidth: 'onResize',
  },
  mounted() {
    this.onResize();
  },
  methods: {
    onResize() {
      const { chart } = this.$refs;
      this.chartH = chart.offsetHeight;
      this.chartW = chart.offsetWidth;
    },
  },
};
</script>

<style>
.markets-card__plot svg {
  display: block;
  width: 100%;
  height: 43px;
}

.markets-card-chart {
  position: relative;
  min-height: 43px;
  margin: 8px 0;
  width: 100%;
  height: 43px;
  overflow: hidden;
}
</style>
