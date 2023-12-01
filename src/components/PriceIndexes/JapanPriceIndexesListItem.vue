<template>
  <a
    class="jp-price-index-item"
    :href="url"
  >
    <div class="jp-price-index-item__header">
      <span
        class="jp-price-index-item__icon"
        :class="`jp-price-index-item__icon--${symbol.toLowerCase()}`"
      />
      <span
        class="jp-price-index-item__name"
        v-text="symbolName"
      />
    </div>
    <div class="jp-price-index-item__prices">
      <span class="jp-price-index-item__price">{{ currencySign }} {{ price }}</span>
      <span
        class="jp-price-index-item__percent"
        :class="[changePercent.includes('-') && 'down', changePercent.includes('+') && 'up']"
        v-text="Math.abs(parseFloat(changePercent)).toFixed(2) + '%'"
      />
    </div>
    <div
      v-if="data"
      ref="chart"
      class="jp-price-index-item__chart"
      v-html="chartHTML"
    />
    <div
      v-else
      ref="chart"
      class="jp-price-index-item__chart"
    >
      <span class="ct-icon ct-icon_loading-spinner-circle jp-price-index-item__spinner" />
    </div>
    <div class="jp-price-index-item__volumes">
      <div class="jp-price-index-item__column">
        <div class="jp-price-index-item__title">時価総額</div>
        <div
          class="jp-price-index-item__volume"
          v-text="marketCap"
        />
      </div>
      <div class="jp-price-index-item__column">
        <div class="jp-price-index-item__title">24時間取引高</div>
        <div
          class="jp-price-index-item__volume"
          v-text="vol24Hour"
        />
      </div>
    </div>
  </a>
</template>

<script>
import * as d3 from 'd3';
import _hasIn from 'lodash/hasIn';

export default {
  name: 'JapanPriceIndexesListItem',
  props: {
    currency: {
      type: String,
      required: true,
    },
    currencySign: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
    },
    symbolName: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    changePercent: {
      type: String,
      required: true,
    },
    marketCap: {
      type: String,
      required: true,
    },
    vol24Hour: {
      type: String,
      required: true,
    },
    history: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    chartW: undefined,
    chartH: undefined,
    data: undefined,
    highlightPercent: false,
  }),
  computed: {
    chartHTML() {
      if (!this.data || !this.data.length) return '';

      const greenLineColor = '#03c24a';
      const greenAreaColor = '#c5f2d8';
      const redLineColor = '#e90025';
      const redAreaColor = '#fac6ce';
      const fontSize = 12;
      const textCorrectionSize = 2;

      const el = document.createElement('div');
      const w = this.chartW;
      const h = this.chartH;
      const data = this.data.map((d) => ({
        date: new Date(d.t * 1000),
        value: parseFloat(d.p),
      }));
      const lineWidth = 3;
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
        .attr('y1', y(minMaxValue[0]))
        .attr('x2', 0)
        .attr('y2', y(minMaxValue[1]))
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
        .attr('y1', y(minMaxValue[0]))
        .attr('x2', 0)
        .attr('y2', y(minMaxValue[1]))
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

      const maxValueH = h - textCorrectionSize;
      const minValueH = fontSize - textCorrectionSize;
      const openValueH = h + fontSize / 2 - gradientRelativePos * h;
      const textPositionX = w - fontSize / 2;

      svg
        .append('text')
        .attr('x', textPositionX)
        .attr('y', maxValueH)
        .attr('text-anchor', 'end')
        .attr('class', 'range')
        .text(this.formatNumber(minMaxValue[0]));

      svg
        .append('text')
        .attr('x', textPositionX)
        .attr('y', minValueH)
        .attr('text-anchor', 'end')
        .attr('class', 'range')
        .text(this.formatNumber(minMaxValue[1]));

      if (minValueH - fontSize < openValueH && openValueH > maxValueH + fontSize) {
        svg
          .append('text')
          .attr('x', textPositionX)
          .attr('y', openValueH)
          .attr('text-anchor', 'end')
          .text(this.formatNumber(openValue));
      }

      const closeValue = data[data.length - 1].value;
      svg
        .append('circle')
        .style('stroke', '#fff')
        .style('stroke-width', '2px')
        .style('fill', closeValue >= openValue ? greenLineColor : redLineColor)
        .attr('r', 6)
        .attr('cx', w)
        .attr('cy', y(closeValue));

      return el.innerHTML;
    },
  },
  watch: {
    history: {
      immidiate: true,
      handler(history) {
        const key = this.symbol;

        if (!_hasIn(history, key)) return;

        this.data = history[key];
      },
    },
  },
  mounted() {
    this.onResize();

    window.addEventListener('resize', this.onResize, { passive: true });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize, { passive: true });
  },
  methods: {
    onResize() {
      this.chartH = this.$refs.chart.offsetHeight;
      this.chartW = this.$refs.chart.offsetWidth;
    },
    formatNumber(amount) {
      const options = { style: 'currency', currency: this.currency };
      const numberFormat = new Intl.NumberFormat('en-US', options);

      return numberFormat.format(amount);
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';
// @import '~bootstrap/less/mixins.less';

$grid-gutter-width: 20px;
$hor-padding: 8px;
$hor-mobile-padding: 12px;
$ver-padding: 8px;

.jp-price-index-item__spinner {
  display: inline-block;
  color: #ffcd06;
  position: absolute;
  top: 45%;
  left: 45%;
  width: 1rem;
  height: 1rem;
  vertical-align: text-bottom;
  border: 0.35em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  -webkit-animation: spin 0.75s linear infinite;
  animation: spin 0.75s linear infinite;
}

.jp-price-index-item svg text {
  fill: #61686c;
  font-size: 12px;
  font-weight: 600;
}

.jp-price-index-item svg text.range {
  fill: #9ea3a6;
}

.jp-price-index-item {
  display: flex;
  width: calc(33.33% - 16px);
  margin: $ver-padding;
  flex-direction: column;
  background: #fff;
  box-shadow: 0 4px 20px rgba(230, 230, 230, 0.75);
  text-decoration: none;

  @media (max-width: $md) {
    width: calc(50% - 16px);
  }

  @media (max-width: $xs) {
    width: 100%;
    margin: 4px 0px;
  }

  &:hover,
  &:focus {
    text-decoration: none;
  }

  &__header {
    display: flex;
    padding: $ver-padding $hor-padding;
    align-items: center;
    // border-bottom: 1px solid #e6e6e6;
    box-shadow: inset 0 -1px 0 #e6e6e6;

    @media (max-width: $xs) {
      padding: $ver-padding $hor-mobile-padding;
    }
  }

  &__prices {
    padding: 6px $hor-padding 4px;

    @media (max-width: $xs) {
      padding: 8px $hor-mobile-padding 4px;
    }
  }

  &__volumes {
    display: flex;
    padding: 6px 6px $ver-padding;
    flex-direction: row;

    @media (max-width: $xs) {
      padding: $ver-padding $hor-mobile-padding 12px;
    }
  }

  &__column + &__column {
    margin-left: 16px;
  }

  &__icon {
    height: 24px;
    width: 24px;
    display: inline-block;
    border-radius: 12px;
    flex-shrink: 0;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;

    &--ada {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIgZmlsbD0iIzNDQzhDOCIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTE1LjcyNSA2LjA2Yy40NzktLjI0NyAxLjA2NC4zMjQuODEuNzk1LS4xNDkuMzg0LS43MS40ODYtLjk5Ni4xOTMtLjMwMy0uMjgtLjIwNC0uODM2LjE4Ni0uOTg5em0tNS4xNTUuNTQ2Yy4yOTEtLjExOC42Ni4xNDQuNjMuNDU3LjAzLjMzOC0uMzkuNTg4LS42ODcuNDI3LS4zOTMtLjE1LS4zNDgtLjc3OC4wNTctLjg4NHptMTAuNTU4Ljg5M2MtLjQ1NS0uMDU0LS41MjctLjc1OC0uMDktLjkuMzQtLjE2Mi42NTIuMTQzLjcwMi40Ni0uMDcyLjI3LS4zMDIuNTE4LS42MTIuNDR6bS05LjM4NSAxLjI2NWMuNDg3LS4zMDMgMS4xODEuMTQ4IDEuMTA2LjcwNS0uMDI1LjU2MS0uNzgzLjg4Ny0xLjIxMS41MDctLjQxNC0uMjk4LS4zNTEtLjk4Mi4xMDUtMS4yMTJ6bTcuNDMuMzIyYy4yMTctLjU1IDEuMDk3LS41NjggMS4zNDQtLjAzMi4yNDUuNDE3LS4wNTYuOTM0LS40OTEgMS4wNzYtLjU3Ny4xMDYtMS4xMjQtLjUwOC0uODUzLTEuMDQ0em0tNC4wNjkgMS4wMTNjLS4wMDUtLjQ3NC40MzMtLjgyNi44OS0uODU5LjMwNC4wNi42MzQuMTg3Ljc2NC40ODguMjQzLjQxNi4wMjcuOTg3LS40MSAxLjE3OC0uMi4xMS0uNDM4LjA2OS0uNjU2LjA1Ni0uMzMzLS4xNi0uNjE0LS40NzctLjU4OC0uODYzem0tNy42NjYuNjljLjQ0NS0uMjcgMS4wNDUuMjIuODc2LjY5Ni0uMDkyLjQxMS0uNjU0LjU3OC0uOTc1LjMxNi0uMzQzLS4yNDYtLjI4OS0uODM3LjEtMS4wMTN6bTE2LjQ2Mi0uMDAyYy4zNzctLjI4OCAxIC4wNDMuOTU0LjUxMS4wMjYuNDI3LS41MTMuNzUtLjg4Ny41My0uNDEyLS4xODMtLjQ1NS0uODA3LS4wNjctMS4wNHptLTYuNjQuODUxYy42MjItLjIyIDEuMzYyLjA0MyAxLjcxNi41OS40NjguNjY3LjIyIDEuNjgzLS41MDcgMi4wNjYtLjc1Mi40NTMtMS44NTEuMDctMi4xMy0uNzU4LS4zMTUtLjc0LjE0NS0xLjY2Ni45Mi0xLjg5OHptLTMuNjUzLjA3M2MuNjktLjMyIDEuNjE5LS4wNTIgMS45NTIuNjQyLjM5Mi42NzYuMDg5IDEuNjE3LS42MTIgMS45NjYtLjcwMi4zOTMtMS42OTMuMDk1LTIuMDMyLS42My0uMzgxLS43MDItLjA0My0xLjY1NS42OTItMS45Nzh6TTkuOTUgMTIuOTRjLjA1My0uNDM3LjQ3Mi0uNzIyLjg5NS0uNzUyLjQ1Ni4wNTUuODIuNDAzLjg3Ljg1Ny0uMDMuNDUtLjM4My44ODgtLjg2Ny44ODYtLjUzMy4wNDUtMS0uNDc3LS44OTgtLjk5MXptMTAuODAyLS42NTZjLjU0Ny0uMzEzIDEuMzA2LjE0MiAxLjI4Mi43Ni4wMzcuNjU1LS44MDMgMS4xMTYtMS4zNDcuNzMyLS41NjYtLjMyLS41MjItMS4yMi4wNjUtMS40OTJ6bS04LjYzIDIuMzA3Yy42MzgtLjE3MyAxLjM3LjEyMyAxLjY4My43MDEuMzQzLjU4Mi4yMDMgMS4zOS0uMzMgMS44MTgtLjY4NS42MjYtMS45NDYuMzc0LTIuMzEtLjQ4LS40MTktLjc4My4wOS0xLjgzMy45NTYtMi4wNHptNi45MjctLjAwM2MuNjIxLS4xNzUgMS4zNTEuMDYgMS42ODUuNjE3LjQ0Mi42MzcuMjMxIDEuNTg4LS40MjYgMS45OTgtLjY5LjQ3Ny0xLjc1Ni4yMjctMi4xMzYtLjUxOS0uNDYtLjc3MS4wMDMtMS44NjEuODc3LTIuMDk2em0tMTEuMDQuNzI2Yy41NTItLjIwNSAxLjE2NC4zOTQuOTQuOTMzLS4xMzYuNDktLjgzOS42NzItMS4yMDIuMzEtLjQyNS0uMzQtLjI2OC0xLjA5NS4yNjItMS4yNDN6bTE0Ljk2OS43ODJhLjgzNi44MzYgMCAwIDEgLjc4OC0uODc0Yy4zNzguMDYuNzQ2LjM2LjcxNi43NjUuMDM1LjUzNS0uNjIuODk4LTEuMDg0LjY0Ny0uMjE3LS4xMDktLjMyOC0uMzI4LS40Mi0uNTM4ek01LjI5NCAxNS41OGMuMzMyLS4xNDMuNzQzLjE0LjY2Ny41MDMtLjAxOC40MTEtLjYzNS41Ny0uODYxLjIyNi0uMi0uMjM5LS4wOC0uNjA2LjE5NC0uNzN6bTIwLjk0OS0uMDA5Yy4yMzQtLjE2My42MS0uMDQ2LjcwMi4yMjMuMTU3LjI5NC0uMTMxLjY5Ni0uNDY3LjY0Ny0uNDcyLjA0Mi0uNjI0LS42NjUtLjIzNS0uODd6bS0xMi4zMTcgMS45NzNjLjg3NC0uMjIzIDEuODE0LjQ5NCAxLjgyIDEuMzguMDU2Ljg5NS0uODcgMS42ODgtMS43NjQgMS40ODItLjY5Mi0uMTEtMS4yMzUtLjc2Ni0xLjIxMi0xLjQ1My0uMDAyLS42NTguNTAyLTEuMjcgMS4xNTYtMS40MDl6bTMuNDYyLS4wMDFjLjg4Ny0uMjQ0IDEuODU1LjQ4NiAxLjg0MSAxLjM5Mi4wNDcuODc4LS44NSAxLjY0NS0xLjcyNiAxLjQ3LS44MjUtLjEwNC0xLjQzMy0uOTk1LTEuMjAzLTEuNzgzLjExNi0uNTI0LjU2Mi0uOTUgMS4wODgtMS4wOHptLTYuNjc2LjU0NWMuNjE0LS4xMDMgMS4xOS41Ny45NDEgMS4xNDQtLjE4Mi42MTItMS4wODYuNzc3LTEuNDg2LjI3OC0uNDY4LS40OC0uMTE4LTEuMzU2LjU0NS0xLjQyMnptMTAuMTU0LjAyN2MuNTQ4LS4yMjYgMS4yMi4yNCAxLjE3OC44MjUuMDIyLjY0My0uODA4IDEuMDg3LTEuMzQzLjcxMS0uNjA3LS4zMzctLjQ5Ni0xLjMzLjE2NS0xLjUzNnptMi44MzggMi44Yy0uMjE0LS4zOTMuMTc1LS45MTQuNjItLjg0MS4yMi0uMDA0LjM3NS4xNjcuNTE2LjMxMS4wMjkuMjMzLjA3OC41MTEtLjExOS42OS0uMjY3LjMzMy0uODcyLjIzOC0xLjAxNy0uMTZ6bS0xNi4yNjgtLjczMmMuNDE1LS4yNzEgMS4wMTIuMTM0LjkxOC42MS0uMDUuNDIzLS41OS42NjQtLjk0NS40MjQtLjM4Mi0uMjE3LS4zNjgtLjgzNi4wMjctMS4wMzR6bTguMTkzLjg4M2MuNTQzLS4yMzUgMS4yMzUuMjMgMS4xODMuODE4LjA0LjY1LS44MTUgMS4xLTEuMzQ2LjcxLS41OS0uMzM1LS40OTEtMS4zMjEuMTYzLTEuNTI4em0tMy43OTQuODcxYy40NjItLjIzOSAxLjA4Mi4xNzQgMS4wNC42ODQuMDE0LjQxOC0uNC43NzQtLjgyLjcxMi0uMzQ3LS4wMDctLjU3My0uMzE0LS42ODUtLjYwNS4wMDYtLjMxNy4xMzktLjY3LjQ2NS0uNzl6bTcuNjg2LjAwOGMuNDc2LS4yOSAxLjE1Mi4xMjYgMS4xMDcuNjcuMDEyLjU3LS43NTIuOTM0LTEuMTk1LjU2LS40MjgtLjI5My0uMzc2LS45OTcuMDg4LTEuMjN6bTEuMzM3IDMuMjVjLS4yMTItLjMxNC4wMzctLjY5My4zOC0uNzY1LjI3Ny4wNTUuNTcuMjYuNTExLjU3NC0uMDQuNDI3LS42NzQuNTU3LS44OTEuMTkyem0tMTAuNjExLS4yNzNjLjA4NC0uMjUuMjg4LS40OTcuNTg3LS40MzIuNDM1LjAzLjU2NC42NzYuMTgzLjg3NS0uMzQyLjIyNy0uNzQtLjA4NC0uNzctLjQ0M3ptNS4xMi4yODdjLjA4My0uMzcuNTY4LS41NDkuODg4LS4zNTMuMjEyLjA5LjI3NC4zMjIuMzI4LjUyLS4wMjkuMTAzLS4wNTUuMjA3LS4wOC4zMS0uMTMxLjE1Mi0uMy4zMDUtLjUxOC4zLS40MDUuMDQ3LS43NzEtLjQwNC0uNjE5LS43Nzd6Ii8+PC9nPjwvc3ZnPg==');
    }
    &--bch {
      background-image: url('data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjMyIiB3aWR0aD0iMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiBmaWxsPSIjOGRjMzUxIiByPSIxNiIvPjxwYXRoIGQ9Ik0yMS4yMDcgMTAuNTM0Yy0uNzc2LTEuOTcyLTIuNzIyLTIuMTUtNC45ODgtMS43MWwtLjgwNy0yLjgxMy0xLjcxMi40OTEuNzg2IDIuNzRjLS40NS4xMjgtLjkwOC4yNy0xLjM2My40MWwtLjc5LTIuNzU4LTEuNzExLjQ5LjgwNSAyLjgxM2MtLjM2OC4xMTQtLjczLjIyNi0xLjA4NS4zMjhsLS4wMDMtLjAxLTIuMzYyLjY3Ny41MjUgMS44M3MxLjI1OC0uMzg4IDEuMjQzLS4zNThjLjY5NC0uMTk5IDEuMDM1LjEzOSAxLjIuNDY4bC45MiAzLjIwNGMuMDQ3LS4wMTMuMTEtLjAyOS4xODQtLjA0bC0uMTgxLjA1MiAxLjI4NyA0LjQ5Yy4wMzIuMjI3LjAwNC42MTItLjQ4Ljc1Mi4wMjcuMDEzLTEuMjQ2LjM1Ni0xLjI0Ni4zNTZsLjI0NyAyLjE0MyAyLjIyOC0uNjRjLjQxNS0uMTE3LjgyNS0uMjI3IDEuMjI2LS4zNGwuODE3IDIuODQ1IDEuNzEtLjQ5LS44MDctMi44MTVhNjUuNzQgNjUuNzQgMCAwIDAgMS4zNzItLjM4bC44MDIgMi44MDMgMS43MTMtLjQ5MS0uODE0LTIuODRjMi44MzEtLjk5MSA0LjYzOC0yLjI5NCA0LjExMy01LjA3LS40MjItMi4yMzQtMS43MjQtMi45MTItMy40NzEtMi44MzYuODQ4LS43OSAxLjIxMy0xLjg1OC42NDItMy4zem0tLjY1IDYuNzdjLjYxIDIuMTI3LTMuMSAyLjkyOS00LjI2IDMuMjYzbC0xLjA4MS0zLjc3YzEuMTYtLjMzMyA0LjcwNC0xLjcxIDUuMzQuNTA4em0tMi4zMjItNS4wOWMuNTU0IDEuOTM1LTIuNTQ3IDIuNTgtMy41MTQgMi44NTdsLS45OC0zLjQxOWMuOTY2LS4yNzcgMy45MTUtMS40NTUgNC40OTQuNTYzeiIgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJub256ZXJvIi8+PC9nPjwvc3ZnPg==');
    }
    &--btc {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIgZmlsbD0iI0Y3OTMxQSIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTIzLjE4OSAxNC4wMmMuMzE0LTIuMDk2LTEuMjgzLTMuMjIzLTMuNDY1LTMuOTc1bC43MDgtMi44NC0xLjcyOC0uNDMtLjY5IDIuNzY1Yy0uNDU0LS4xMTQtLjkyLS4yMi0xLjM4NS0uMzI2bC42OTUtMi43ODNMMTUuNTk2IDZsLS43MDggMi44MzljLS4zNzYtLjA4Ni0uNzQ2LS4xNy0xLjEwNC0uMjZsLjAwMi0uMDA5LTIuMzg0LS41OTUtLjQ2IDEuODQ2czEuMjgzLjI5NCAxLjI1Ni4zMTJjLjcuMTc1LjgyNi42MzguODA1IDEuMDA2bC0uODA2IDMuMjM1Yy4wNDguMDEyLjExLjAzLjE4LjA1N2wtLjE4My0uMDQ1LTEuMTMgNC41MzJjLS4wODYuMjEyLS4zMDMuNTMxLS43OTMuNDEuMDE4LjAyNS0xLjI1Ni0uMzEzLTEuMjU2LS4zMTNsLS44NTggMS45NzggMi4yNS41NjFjLjQxOC4xMDUuODI4LjIxNSAxLjIzMS4zMThsLS43MTUgMi44NzIgMS43MjcuNDMuNzA4LTIuODRjLjQ3Mi4xMjcuOTMuMjQ1IDEuMzc4LjM1N2wtLjcwNiAyLjgyOCAxLjcyOC40My43MTUtMi44NjZjMi45NDguNTU4IDUuMTY0LjMzMyA2LjA5Ny0yLjMzMy43NTItMi4xNDYtLjAzNy0zLjM4NS0xLjU4OC00LjE5MiAxLjEzLS4yNiAxLjk4LTEuMDAzIDIuMjA3LTIuNTM4em0tMy45NSA1LjUzOGMtLjUzMyAyLjE0Ny00LjE0OC45ODYtNS4zMi42OTVsLjk1LTMuODA1YzEuMTcyLjI5MyA0LjkyOS44NzIgNC4zNyAzLjExem0uNTM1LTUuNTY5Yy0uNDg3IDEuOTUzLTMuNDk1Ljk2LTQuNDcuNzE3bC44Ni0zLjQ1Yy45NzUuMjQzIDQuMTE4LjY5NiAzLjYxIDIuNzMzeiIvPjwvZz48L3N2Zz4=');
    }
    &--dash {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48dGl0bGU+Y29sb3IvZGFzaDwvdGl0bGU+PGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+PGcgaWQ9ImNvbG9yL2Rhc2giIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGlkPSJHcm91cCIgZmlsbD0iIzAwOENFNyIgZmlsbC1ydWxlPSJub256ZXJvIj48Y2lyY2xlIGlkPSJPdmFsIiBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiLz48L2c+PGcgaWQ9IkRhc2gtKERBU0gpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2LjAwMDAwMCwgOC4wMDAwMDApIiBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjxwYXRoIGQ9Ik0xMy4wODU3MTQzLDAuMDA0Mzk1NjA0NCBMNS44MTA5ODkwMSwwLjAwNDM5NTYwNDQgTDUuMjA4NzkxMjEsMy4zNzE0Mjg1NyBMMTEuNzcxNDI4NiwzLjM4MDIxOTc4IEMxNS4wMDIxOTc4LDMuMzgwMjE5NzggMTUuOTYwNDM5Niw0LjU1Mzg0NjE1IDE1LjkyOTY3MDMsNi41MDEwOTg5IEMxNS45MTY0ODM1LDcuNDk4OTAxMSAxNS40ODEzMTg3LDkuMTg2ODEzMTkgMTUuMjk2NzAzMyw5LjczMTg2ODEzIEMxNC44LDExLjE5MTIwODggMTMuNzc1ODI0MiwxMi44NTI3NDczIDkuOTM4NDYxNTQsMTIuODQ4MzUxNiBMMy41NjA0Mzk1NiwxMi44NDM5NTYgTDIuOTU4MjQxNzYsMTYuMjE1Mzg0NiBMMTAuMjE1Mzg0NiwxNi4yMTUzODQ2IEMxMi43NzM2MjY0LDE2LjIxNTM4NDYgMTMuODYzNzM2MywxNS45MTY0ODM1IDE1LjAxNTM4NDYsMTUuMzg0NjE1NCBDMTcuNTY5MjMwOCwxNC4yMDY1OTM0IDE5LjA5MDEwOTksMTEuNjgzNTE2NSAxOS43MDEwOTg5LDguMzkxMjA4NzkgQzIwLjYwNjU5MzQsMy40OTAxMDk4OSAxOS40NzY5MjMxLDAuMDA0Mzk1NjA0NCAxMy4wODU3MTQzLDAuMDA0Mzk1NjA0NCBaIiBpZD0iU2hhcGUiLz48cGF0aCBkPSJNOS44MDY1OTM0MSw3Ljc5NzgwMjIgQzEwLjA0Mzk1Niw2LjgxMzE4NjgxIDEwLjExODY4MTMsNi40MTc1ODI0MiAxMC4xMTg2ODEzLDYuNDE3NTgyNDIgTDIuNjcyNTI3NDcsNi40MTc1ODI0MiBDMC43NjkyMzA3NjksNi40MTc1ODI0MiAwLjQ5NjcwMzI5Nyw3LjY1NzE0Mjg2IDAuMzE2NDgzNTE2LDguNDA4NzkxMjEgQzAuMDc5MTIwODc5MSw5LjM4OTAxMDk5IDAuMDA0Mzk1NjA0NCw5Ljc4OTAxMDk5IDAuMDA0Mzk1NjA0NCw5Ljc4OTAxMDk5IEw3LjQ1MDU0OTQ1LDkuNzg5MDEwOTkgQzkuMzUzODQ2MTUsOS43ODkwMTA5OSA5LjYyNjM3MzYzLDguNTQ5NDUwNTUgOS44MDY1OTM0MSw3Ljc5NzgwMjIgWiIgaWQ9IlNoYXBlIi8+PC9nPjwvZz48L3N2Zz4=');
    }
    &--eos {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIgZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggc3Ryb2tlPSIjRkZGIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iLjY0IiBkPSJNMTAuODg2IDExLjYxTDE2IDI3LjY2N2wtNy41ODgtNC43NTQgMi40NzQtMTEuMzAzTDE2IDQuNjI0djQuOUw4LjQxMiAyMi45MTNoMTUuMTgzTDE2LjAwNyA5LjUyNHYtNC45bDUuMTEzIDYuOTg2IDIuNDc1IDExLjMwMy03LjU4OCA0Ljc1NEwyMS4xMiAxMS42MSIvPjwvZz48L3N2Zz4=');
    }
    &--eth {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIgZmlsbD0iIzYyN0VFQSIvPjxnIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+PHBhdGggZmlsbC1vcGFjaXR5PSIuNjAyIiBkPSJNMTYuNDk4IDR2OC44N2w3LjQ5NyAzLjM1eiIvPjxwYXRoIGQ9Ik0xNi40OTggNEw5IDE2LjIybDcuNDk4LTMuMzV6Ii8+PHBhdGggZmlsbC1vcGFjaXR5PSIuNjAyIiBkPSJNMTYuNDk4IDIxLjk2OHY2LjAyN0wyNCAxNy42MTZ6Ii8+PHBhdGggZD0iTTE2LjQ5OCAyNy45OTV2LTYuMDI4TDkgMTcuNjE2eiIvPjxwYXRoIGZpbGwtb3BhY2l0eT0iLjIiIGQ9Ik0xNi40OTggMjAuNTczbDcuNDk3LTQuMzUzLTcuNDk3LTMuMzQ4eiIvPjxwYXRoIGZpbGwtb3BhY2l0eT0iLjYwMiIgZD0iTTkgMTYuMjJsNy40OTggNC4zNTN2LTcuNzAxeiIvPjwvZz48L2c+PC9zdmc+');
    }
    &--ltc {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjE2IiBjeT0iMTYiIHI9IjE2IiBmaWxsPSIjQkZCQkJCIi8+PHBvbHlnb24gZmlsbD0iI0ZGRiIgcG9pbnRzPSIxMC40MjcgMTkuMjE0IDkgMTkuNzY4IDkuNjg4IDE3LjAwOSAxMS4xMzIgMTYuNDI5IDEzLjIxMyA4IDE4LjM0MiA4IDE2LjgyMyAxNC4xOTYgMTguMjMzIDEzLjYyNSAxNy41NTMgMTYuMzc1IDE2LjEyNiAxNi45NDYgMTUuMjc4IDIwLjQyOSAyMyAyMC40MjkgMjIuMTI3IDI0IDkuMjUyIDI0Ii8+PC9nPjwvc3ZnPg==');
    }
    &--neo {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjE2IiBjeT0iMTYiIHI9IjE2IiBmaWxsPSIjNThCRjAwIi8+PHBhdGggZmlsbD0iI0ZGRiIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMjUsMjIuNTc5MjA5NSBMMTguMDA5MzY1MywxOS4zMjIyMjk1IEwxOC4wMDkzNjUzLDEyLjEwMjU0NDcgTDI1LDkuNjIyMDMzNzIgTDI1LDIyLjU3OTIwOTUgWiBNMTQuODIzMDgyLDI2IEw4LDIyLjgyMDk3NiBMOCw5Ljk1Nzg5NjkxIEwxNC44MjMwODIsMTMuMTM4NjM4IEwxNC44MjMwODIsMjYgWiBNMjQuODMyNDQ3Miw5LjE1NzM4ODY1IEwyNC43MjAxNjYsOS4xOTcyMjUxOCBMMTguMDA5MzY1MywxMS41NzgxNDQ5IEwxNy44NDE4MTI1LDExLjYzNzg5OTcgTDE0Ljk5ODk3NzYsMTIuNjQ2MTc2IEw4LjI2OTc1Mjk5LDkuNTEwMDc5MzMgTDE3Ljg0MTgxMjUsNi4xMTQwMTQ5IEwxNy45MjU1ODg5LDYuMDg0MTM3NSBMMTguMTAzMjIyNiw2LjAyMTI5MTk0IEwxOC4xNjUwOTksNiBMMjQuODk0MzIzNiw5LjEzNTc1MzI5IEwyNC44MzI0NDcyLDkuMTU3Mzg4NjUgWiIvPjwvZz48L3N2Zz4=');
    }
    &--xrp {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48dGl0bGU+Y29sb3IveHJwPC90aXRsZT48ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz48ZyBpZD0iY29sb3IveHJwIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBpZD0iR3JvdXAiIGZpbGw9IiMyMzI5MkYiIGZpbGwtcnVsZT0ibm9uemVybyI+PGNpcmNsZSBpZD0iT3ZhbCIgY3g9IjE2IiBjeT0iMTYiIHI9IjE2Ii8+PC9nPjxnIGlkPSJYUlAtKFhSUCkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYuMDAwMDAwLCA4LjAwMDAwMCkiIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+PHBhdGggZD0iTTE3LjA3MDMxMjUsMCBMMTkuOTYwOTM3NSwwIEwxMy45NDUzMTI1LDUuOTU3MDMxMjUgQzExLjc2NTYyNSw4LjExMzI4MTI1IDguMjM0Mzc1LDguMTEzMjgxMjUgNi4wNTQ2ODc1LDUuOTU3MDMxMjUgTDAuMDM1MTU2MjUsMCBMMi45Mjk2ODc1LDAgTDcuNSw0LjUyMzQzNzUgQzguODc4OTA2MjUsNS44OTA2MjUgMTEuMTE3MTg3NSw1Ljg5MDYyNSAxMi40OTYwOTM3LDQuNTIzNDM3NSBMMTcuMDcwMzEyNSwwIFoiIGlkPSJWZWN0b3IiLz48cGF0aCBkPSJNMi44OTQ1MzEyNSwxNi41NjI1IEwwLDE2LjU2MjUgTDYuMDU0Njg3NSwxMC41NzAzMTI1IEM4LjIzNDM3NSw4LjQxNDA2MjUgMTEuNzY1NjI1LDguNDE0MDYyNSAxMy45NDUzMTI1LDEwLjU3MDMxMjUgTDIwLDE2LjU2MjUgTDE3LjEwNTQ2ODgsMTYuNTYyNSBMMTIuNSwxMiBDMTEuMTIxMDkzOCwxMC42MzI4MTI1IDguODgyODEyNSwxMC42MzI4MTI1IDcuNTAzOTA2MjUsMTIgTDIuODk0NTMxMjUsMTYuNTYyNSBaIiBpZD0iVmVjdG9yXzIiLz48L2c+PC9nPjwvc3ZnPg==');
    }
    &--xmr {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIgZmlsbD0iI0Y2MCIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTE1Ljk3IDUuMjM1YzUuOTg1IDAgMTAuODI1IDQuODQgMTAuODI1IDEwLjgyNGExMS4wNyAxMS4wNyAwIDAgMS0uNTU4IDMuNDMyaC0zLjIyNnYtOS4wOTRsLTcuMDQgNy4wNC03LjA0LTcuMDR2OS4wOTRINS43MDRhMTEuMDcgMTEuMDcgMCAwIDEtLjU1Ny0zLjQzMmMwLTUuOTg0IDQuODQtMTAuODI0IDEwLjgyNC0xMC44MjR6TTE0LjM1OCAxOS4wMkwxNiAyMC42MzVsMS42MTMtMS42MTQgMy4wNTEtMy4wOHY1LjcySDI1LjIxMWExMC44MDYgMTAuODA2IDAgMCAxLTkuMjQgNS4xOTJjLTMuOTAyIDAtNy4zMzQtMi4wODItOS4yNC01LjE5Mmg0LjU0NnYtNS43MmwzLjA4IDMuMDh6Ii8+PC9nPjwvc3ZnPg==');
    }
    &--zec {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIgZmlsbD0iI0VDQjI0NCIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTE1LjA5NiAxOS44NDZoNi4yOTd2My4zNWgtMy44NzVjLjA2NC45NTguMDk3IDEuODQ3LjE2MSAyLjgwNGgtMy4yNjF2LTIuNzdoLTMuODc2YzAtMS4wOTMtLjEyOS0yLjE4Ny4wNjUtMy4yMTMuMDk3LS41NDcuNjc4LTEuMDI2IDEuMDMzLTEuNTA0YTQ2Mi4xMzcgNDYyLjEzNyAwIDAgMSAzLjcxNC00LjU4MWMuNDg1LS41ODIuOTY5LTEuMTI5IDEuNTE4LTEuNzc4aC02LjA0di0zLjM1aDMuNTg2VjZoMy4xMzJ2Mi43MzVoMy45MDhjMCAxLjEyOC4xMjkgMi4yMjItLjA2NSAzLjI0OC0uMDk3LjU0Ny0uNjc4IDEuMDI2LTEuMDY1IDEuNTA0YTQ2Mi4xMzggNDYyLjEzOCAwIDAgMS0zLjcxNCA0LjU4MSAzNy4wODMgMzcuMDgzIDAgMCAxLTEuNTE4IDEuNzc4eiIvPjwvZz48L3N2Zz4=');
    }
    &--bnb {
      background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSI0MnB4IiBoZWlnaHQ9IjQycHgiIHZpZXdCb3g9IjAgMCA0MiA0MiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4gICAgICAgIDx0aXRsZT5BcnRib2FyZCA1PC90aXRsZT4gICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaCBCZXRhLjwvZGVzYz4gICAgPGRlZnM+PC9kZWZzPiAgICA8ZyBpZD0iQXJ0Ym9hcmQtNSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+ICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsLTIiIGZpbGw9IiNlY2I1NDEiIGN4PSIyMSIgY3k9IjIxIiByPSIyMSI+PC9jaXJjbGU+ICAgICAgICA8ZyBpZD0iYmluYW5jZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOS4wMDAwMDAsIDkuMDAwMDAwKSIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJub256ZXJvIj4gICAgICAgICAgICA8cGF0aCBkPSJNNi45MTk3OTgxMSw5LjM5ODYzNzIyIEwxMS4yNjM0MTk2LDUuMDU1MTkyNDMgTDE1LjYwOTMzNzUsOS40MDA5MzM3NSBMMTguMTM2NzU3MSw2Ljg3MzUxNDIgTDExLjI2MzQxOTYsMCBMNC4zOTIzNzg1NSw2Ljg3MTIxNzY3IEw2LjkxOTc5ODExLDkuMzk4NjM3MjIgWiBNMi42MDc0NDQ3OSw4LjY1NTYyMTQ1IEw1LjEzNDg2NDM1LDExLjE4Mjg2NDQgTDIuNjA3NDQ0NzksMTMuNzEwNDYwNiBMMC4wODAwMjUyMzY2LDExLjE4MzA0MSBMMi42MDc0NDQ3OSw4LjY1NTYyMTQ1IFogTTYuOTE5Nzk4MTEsMTIuOTY3OTc0OCBMMTEuMjYzNDE5NiwxNy4zMTE0MTk2IEwxNS42MDkxNjA5LDEyLjk2NTg1NDkgTDE4LjEzNzk5MzcsMTUuNDkxODYxMiBMMTguMTM2NzU3MSwxNS40OTMyNzQ0IEwxMS4yNjM0MTk2LDIyLjM2NjYxMiBMNC4zOTIyMDE4OSwxNS40OTU1NzEgTDQuMzg4NjY4NzcsMTUuNDkyMDM3OSBMNi45MTk3OTgxMSwxMi45Njc5NzQ4IFogTTIyLjQ0Njk5MDUsMTEuMTg0MTAwOSBMMTkuOTE5NzQ3NiwxMy43MTE1MjA1IEwxNy4zOTIxNTE0LDExLjE4NDI3NzYgTDE5LjkxOTU3MSw4LjY1NjY4MTM5IEwyMi40NDY5OTA1LDExLjE4NDEwMDkgWiIgaWQ9IlNoYXBlIj48L3BhdGg+ICAgICAgICA8L2c+ICAgIDwvZz48L3N2Zz4=');
    }
    &--xlm {
      background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSI0MnB4IiBoZWlnaHQ9IjQycHgiIHZpZXdCb3g9IjAgMCA0MiA0MiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4gICAgICAgIDx0aXRsZT5BcnRib2FyZCA1PC90aXRsZT4gICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaCBCZXRhLjwvZGVzYz4gICAgPGRlZnM+PC9kZWZzPiAgICA8ZyBpZD0iQXJ0Ym9hcmQtNSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+ICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsLTIiIGZpbGw9IiM0NWI0ZjEiIGN4PSIyMSIgY3k9IjIxIiByPSIyMSI+PC9jaXJjbGU+ICAgICAgICA8ZyBpZD0iU3RlbGxhciIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOS4wMDAwMDAsIDExLjAwMDAwMCkiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+ICAgICAgICAgICAgPHBhdGggZD0iTTEuOTE4ODU2NiwxMC41OTY1NjYxIEMxLjkwNzYxODcsMTAuMzk5MTk1MSAxLjkwMTkyMDU3LDEwLjIwMDI4NTEgMS45MDE5MjA1NywxMCBDMS45MDE5MjA1Nyw0LjQ3NzE1MjUgNi4yMzQ2NDg3OSwwIDExLjU3OTMzOTksMCBDMTMuNjYwOTIyMywwIDE1LjU4OTAwNTMsMC42NzkxMTU4NTggMTcuMTY3NDEwNiwxLjgzNDYyOTkxIEMxNi43Mzk1ODYxLDIuMDYzNTcyODggMTYuMTYzODU5MSwyLjM3MTY2MzI2IDE1LjQ0MDIyOTgsMi43NTg5MDEwNSBMMTUuNDQwMjI3MSwyLjc1ODg5OTU4IEMxNC4yOTU1MjUyLDIuMTA1Nzk2OTggMTIuOTc5NDM5MSwxLjczNDEwNDA1IDExLjU3OTMzOTksMS43MzQxMDQwNSBDNy4xNjE0NzM4NSwxLjczNDEwNDA1IDMuNTgwMDg1NzcsNS40MzQ4NzE3MiAzLjU4MDA4NTc3LDEwIEMzLjU4MDA4NTc3LDEwLjQzNjY1NTcgMy42MTI4NTE4LDEwLjg2NTQwMzUgMy42NzU5ODE3NywxMS4yODM3NjEgTDIzLjMyMzQzNzIsMS4wNjIxMzg3MyBMMjMuMzIzNDM3MiwzLjIyMDczNjk5IEwwLjA4MzAzNDIxNTksMTUuMjU1MzczOSBMMC4wODMwMzQyMTU5LDEzLjE1Mjk5ODYgQzEuNDYwODkyMzQsMTIuNjM1NjI3NCAyLjA2NzE4Nzc5LDExLjc4NjIyNSAxLjkwMTkyMDU3LDEwLjYwNDc5MTQgQzEuOTA3NTQ1NTMsMTAuNjAxODY1IDEuOTEzMTkwODgsMTAuNTk5MTIzMiAxLjkxODg1NjYsMTAuNTk2NTY2MSBaIE0yMS4yNDE1MTg3LDkuNDM0MDAyMTUgQzIxLjI1MTYzNCw5LjYyMTMzODA3IDIxLjI1Njc1OTMsOS44MTAwNTA1NSAyMS4yNTY3NTkzLDEwIEMyMS4yNTY3NTkzLDE1LjUyMjg0NzUgMTYuOTI0MDMxMSwyMCAxMS41NzkzMzk5LDIwIEM5LjUzOTk0MTYsMjAgNy42NDc4ODQyMywxOS4zNDgxMzAzIDYuMDg3NjU5MzgsMTguMjM1MDMyMyBMNy44NjI3ODc4NywxNy4zMjE0NjIyIEM4Ljk3MzI0ODU2LDE3LjkyNDYwNjEgMTAuMjM3NzIzNywxOC4yNjU4OTYgMTEuNTc5MzM5OSwxOC4yNjU4OTYgQzE1Ljk5NzIwNiwxOC4yNjU4OTYgMTkuNTc4NTk0MSwxNC41NjUxMjgzIDE5LjU3ODU5NDEsMTAgQzE5LjU3ODU5NDEsOS43MDA3MTQxMiAxOS41NjMyMDEzLDkuNDA1MTQzMjYgMTkuNTMzMTg5MSw5LjExNDA4NjY1IEwwLjA4MzAzNDIxNTksMTkuMTg2MDA5NyBMMC4wODMwMzQyMTU5LDE3LjA4MzYzNDUgTDIzLjMyMzQzNzIsNC45OTI3NzQ1NyBMMjMuMzIzNDM3Miw3LjE1MTM3MjgzIEMyMS45NDU2NTE5LDcuNzA1NjIzNzkgMjEuMjU2NzU5Myw4LjQ2Mzk5MzI2IDIxLjI1Njc1OTMsOS40MjY0ODEyMSBDMjEuMjUxNzE0Niw5LjQyOTEyMTE3IDIxLjI0NjYzNDUsOS40MzE2MjgxNSAyMS4yNDE1MTg3LDkuNDM0MDAyMTUgWiIgaWQ9IkNvbWJpbmVkLVNoYXBlIj48L3BhdGg+ICAgICAgICA8L2c+ICAgIDwvZz48L3N2Zz4=');
    }
    &--usdt {
      background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSI0MnB4IiBoZWlnaHQ9IjQycHgiIHZpZXdCb3g9IjAgMCA0MiA0MiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4gICAgICAgIDx0aXRsZT5BcnRib2FyZCA1PC90aXRsZT4gICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaCBCZXRhLjwvZGVzYz4gICAgPGRlZnM+PC9kZWZzPiAgICA8ZyBpZD0iQXJ0Ym9hcmQtNSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+ICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsLTIiIGZpbGw9IiM0OWE0NzgiIGN4PSIyMSIgY3k9IjIxIiByPSIyMSI+PC9jaXJjbGU+ICAgICAgICA8ZyBpZD0iVGV0aGVyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5LjAwMDAwMCwgMTAuMDAwMDAwKSIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJub256ZXJvIj4gICAgICAgICAgICA8cGF0aCBkPSJNMTQuNDM5Mzg0NSw3LjQwOTY1OTUyIEwxNC40MzkzODQ1LDQuNDczNTg1MzkgTDIxLjE2NTE4OTMsNC40NzM1ODUzOSBMMjEuMTY1MTg5MywwIEwyLjg1MDYyNzc0LDAgTDIuODUwNjI3NzQsNC40NzM1ODUzOSBMOS41NzcyMjM0NSw0LjQ3MzU4NTM5IEw5LjU3NzIyMzQ1LDcuNDA3MjkxMDggQzQuMTEwNDU1NzMsNy42NTc5NTA4MSAwLDguNzM4NzQ4MiAwLDEwLjAzMzQ5NDUgQzAsMTEuMzI4MjQwOCA0LjExMjQzMjg2LDEyLjQwOTAzODIgOS41NzcyMjM0NSwxMi42NjEyNzY5IEw5LjU3NzIyMzQ1LDIyLjA2NTk1MTEgTDE0LjQ0MDk2NjIsMjIuMDY1OTUxMSBMMTQuNDQwOTY2MiwxMi42NjA0ODc0IEMxOS44OTc4NDgyLDEyLjQwOTAzODIgMjQsMTEuMzI5MDMwMyAyNCwxMC4wMzU0NjgyIEMyNCw4Ljc0MTkwNjEyIDE5Ljg5Nzg0ODIsNy42NjE4OTgyMSAxNC40NDA5NjYyLDcuNDEwNDQ5IE0xNC40NDA5NjYyLDExLjg2MzkwMjcgTDE0LjQ0MDk2NjIsMTEuODYxNTM0MiBDMTQuMzAzNzUzMywxMS44NzAyMTg1IDEzLjU5ODcwODMsMTEuOTEyNDU1NyAxMi4wMjg4NjYxLDExLjkxMjQ1NTcgQzEwLjc3Mzc4MzIsMTEuOTEyNDU1NyA5Ljg5MDc5NjQ1LDExLjg3NjkyOTEgOS41Nzk1OTYwMSwxMS44NjA3NDQ3IEw5LjU3OTU5NjAxLDExLjg2NDY5MjEgQzQuNzQ5ODU5OTUsMTEuNjUxMTM3OSAxLjE0NDc1ODk1LDEwLjgxMTUyNjUgMS4xNDQ3NTg5NSw5LjgwNjkxMzkyIEMxLjE0NDc1ODk1LDguODAyMzAxMyA0Ljc1MDI1NTM4LDcuOTYzODc0MTEgOS41Nzk1OTYwMSw3Ljc0OTkyNTE3IEw5LjU3OTU5NjAxLDExLjAyODIzODcgQzkuODk1OTM3LDExLjA0OTk0OTMgMTAuODAwNjcyMiwxMS4xMDMyMzkyIDEyLjA0OTQyODMsMTEuMTAzMjM5MiBDMTMuNTQ5MjgsMTEuMTAzMjM5MiAxNC4zMDMzNTc4LDExLjA0MDg3MDMgMTQuNDQxNzU3LDExLjAyODIzODcgTDE0LjQ0MTc1Nyw3Ljc0OTkyNTE3IEMxOS4yNjIwMDI4LDcuOTY0MjY4ODUgMjIuODU4Nzk5OSw4LjgwNDY2OTc0IDIyLjg1ODc5OTksOS44MDU3Mjk3IEMyMi44NTg3OTk5LDEwLjgwNjc4OTcgMTkuMjYwNDIxMSwxMS42NDc1ODUzIDE0LjQ0MTc1NywxMS44NjE5MjkiIGlkPSJTaGFwZSI+PC9wYXRoPiAgICAgICAgPC9nPiAgICA8L2c+PC9zdmc+');
    }
    &--trx {
      background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSI0MnB4IiBoZWlnaHQ9IjQycHgiIHZpZXdCb3g9IjAgMCA0MiA0MiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4gICAgICAgIDx0aXRsZT5BcnRib2FyZCA1PC90aXRsZT4gICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaCBCZXRhLjwvZGVzYz4gICAgPGRlZnM+PC9kZWZzPiAgICA8ZyBpZD0iQXJ0Ym9hcmQtNSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+ICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsLTIiIGZpbGw9IiNjNzJlMzQiIGN4PSIyMSIgY3k9IjIxIiByPSIyMSI+PC9jaXJjbGU+ICAgICAgICA8ZyBpZD0iVHJvbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTAuMDAwMDAwLCA5LjAwMDAwMCkiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIxLjUiPiAgICAgICAgICAgIDxwYXRoIGQ9Ik0wLjMyOTc4NTA1NCwxLjUxOTgxODEzIEw4LjcwMjkzMTY1LDIyLjk3NzM4MDUgQzguOTAzNjk5NDYsMjMuNDkxODgxIDkuNDgzNTM4OTcsMjMuNzQ2MjExNSA5Ljk5ODAzOTQ0LDIzLjU0NTQ0MzcgQzEwLjE3OTkwMywyMy40NzQ0NzcxIDEwLjMzNzAxNzYsMjMuMzUxODMxIDEwLjQ1MDAwNTQsMjMuMTkyNjMxOCBMMjEuNjIxMTg1NSw3LjQ1MjUxMTg3IEMyMS45NDA4MzM0LDcuMDAyMTMwMTUgMjEuODM0ODUyNiw2LjM3Nzg5Nzg0IDIxLjM4NDQ3MDksNi4wNTgyNSBDMjEuMzY5NjY5OCw2LjA0Nzc0NTI2IDIxLjM1NDU4NTQsNi4wMzc2NDU0MyAyMS4zMzkyMzQ2LDYuMDI3OTYxNzMgTDE4LjM0MTQ2MzUsNC4xMzY4OTE1OCBDMTguMjQ2NjQ4NSw0LjA3NzA3OTg1IDE4LjE0MjQ1MTEsNC4wMzM2MzY4MSAxOC4wMzMyMjk0LDQuMDA4Mzc5NCBMMS40ODY2NzM3MiwwLjE4MjAwNzE0MSBDMC45NDg1ODg5MjQsMC4wNTc1NzU2NDEzIDAuNDExNTEzMzUsMC4zOTI5MDc4OTMgMC4yODcwODE4NTEsMC45MzA5OTI2ODggQzAuMjQxNzMzOTQ1LDEuMTI3MDkyNyAwLjI1NjYxNzA4NywxLjMzMjMxMzIxIDAuMzI5Nzg1MDU0LDEuNTE5ODE4MTMgWiIgaWQ9IlBhdGgtMiI+PC9wYXRoPiAgICAgICAgICAgIDxwYXRoIGQ9Ik05Ljc3Nzc3Nzc4LDI0IEwxMC43NzIyMjcxLDEzLjAxMjI4ODUgQzEwLjgwMzQyODgsMTIuNjY3NTQwMiAxMS4wMTA3MDMzLDEyLjM2MzQ0NjkgMTEuMzIwMTg0NSwxMi4yMDgzNzgxIEwyMiw2Ljg1NzE0Mjg2IiBpZD0iUGF0aC0zIj48L3BhdGg+ICAgICAgICAgICAgPHBvbHlsaW5lIGlkPSJQYXRoLTQiIHBvaW50cz0iMS4yMjIyMjIyMiAwIDExLjA1MjAwOTUgMTIuNTcxNDI4NiAxOC4zMzMzMzMzIDQuMTU2MjY4MjIiPjwvcG9seWxpbmU+ICAgICAgICA8L2c+ICAgIDwvZz48L3N2Zz4=');
    }
    &--iot,
    &--miota {
      background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSI0MnB4IiBoZWlnaHQ9IjQycHgiIHZpZXdCb3g9IjAgMCA0MiA0MiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4gICAgICAgIDx0aXRsZT5BcnRib2FyZCA1PC90aXRsZT4gICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaCBCZXRhLjwvZGVzYz4gICAgPGRlZnM+PC9kZWZzPiAgICA8ZyBpZD0iQXJ0Ym9hcmQtNSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+ICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsLTIiIGZpbGw9IiMwMDAwMDAiIGN4PSIyMSIgY3k9IjIxIiByPSIyMSI+PC9jaXJjbGU+ICAgICAgICA8ZyBpZD0iSU9UQSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOS4wMDAwMDAsIDkuMDAwMDAwKSI+ICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAyMTE1OCwgMC4wMDAwMDApIj48L2c+ICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAyMTE1OCwgMC4wMDAwMDApIj48L2c+ICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAyMTE1OCwgMC4wMDAwMDApIj48L2c+ICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAyMTE1OCwgMC4wMDAwMDApIj48L2c+ICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAyMTE1OCwgMC4wMDAwMDApIj48L2c+ICAgICAgICAgICAgPHBhdGggZD0iTTE0LjQxMzg5NDcsNS43MzgyMTA1MyBDMTQuNTMwMDEzNSw1LjkwMDk3NTk4IDE0LjczNjQxMzIsNS45NzI0MzY2NyAxNC45MjgzMTU4LDUuOTE2MzE1NzkgQzE0Ljk3NjE4MzksNS45MDI2ODY1OSAxNS4wMjE1MTM3LDUuODgxMzU0OTIgMTUuMDYyNTI2Myw1Ljg1MzE1Nzg5IEMxNS4yMjk0OTQsNS43MzYwOTI3OSAxNS4zMDA3NDgzLDUuNTIzOTI3MzIgMTUuMjM4Mjg5LDUuMzI5ODEwNjkgQzE1LjE3NTgyOTcsNS4xMzU2OTQwNyAxNC45OTQyMjA5LDUuMDA0ODkwMzEgMTQuNzkwMzE1OCw1LjAwNzE1Nzg5IEMxNC42OTY3OTE4LDUuMDA2NzA0NTcgMTQuNjA1MzkzMyw1LjAzNTAzOTIgMTQuNTI4NTI2Myw1LjA4ODMxNTc5IEMxNC4zMTgwNTE0LDUuMjM3MjQ1OSAxNC4yNjY4OTgyLDUuNTI3OTU5NjMgMTQuNDEzODk0Nyw1LjczOTc4OTQ3IiBpZD0iU2hhcGUiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMy4yMjQzMTU4LDQuNTcyMzE1NzkgQzEzLjIzMDk4Myw0LjcxNDY5OTg1IDEzLjI5NTAwMjgsNC44NDgzMjEzNSAxMy40MDE3ODk1LDQuOTQyNzM2ODQgQzEzLjU0NTE0OTIsNS4wNzYxMzE4MSAxMy43NDkzMjQ1LDUuMTIxODA1NjkgMTMuOTM1ODU2Nyw1LjA2MjIwNzMyIEMxNC4xMjIzODg5LDUuMDAyNjA4OTQgMTQuMjYyMjU2NCw0Ljg0NzAxMDkxIDE0LjMwMTcxMjIsNC42NTUyMDUxIEMxNC4zNDExNjc5LDQuNDYzMzk5MjggMTQuMjc0MDczMiw0LjI2NTIyNzczIDE0LjEyNjIxMDUsNC4xMzY4NDIxMSBDMTQuMDI3MjQ4Nyw0LjA1MDYwNTE0IDEzLjg5OTk5MDgsNC4wMDM4Mzg5OSAxMy43Njg3MzY4LDQuMDA1NDczNjggQzEzLjYxNDcxOTcsNC4wMDM2MDU1MiAxMy40NjcxNzY2LDQuMDY3MzMwMzggMTMuMzYyOTQ3NCw0LjE4MDczNjg0IEMxMy4yNjU3MTkzLDQuMjg3MTY1OTIgMTMuMjE1NzExMyw0LjQyODQxODU2IDEzLjIyNDMxNTgsNC41NzIzMTU3OSIgaWQ9IlNoYXBlIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgICAgICA8cGF0aCBkPSJNMTIuMDM1MzY4NCw0LjMwMzg5NDc0IEMxMi4xMjg3MTY2LDQuMzU1NzE2OTYgMTIuMjMzNjUzNyw0LjM4MzA5MTg0IDEyLjM0MDQyMTEsNC4zODM0NzM2OCBDMTIuNDAxMTA5Niw0LjM4MzgyNTU3IDEyLjQ2MTQ5MzksNC4zNzQ4Nzk3NCAxMi41MTk0NzM3LDQuMzU2OTQ3MzcgQzEyLjY3ODQyMTksNC4zMTEwMzg0NCAxMi44MTIyNDM0LDQuMjAzMTYxOSAxMi44OTA4NDIxLDQuMDU3NTc4OTUgQzEzLjA1OTU3MTIsMy43NTMwOTI3MSAxMi45NTAxMTExLDMuMzY5NDg3OSAxMi42NDYxMDUzLDMuMTk5ODk0NzQgQzEyLjU1NjY1ODIsMy4xNTE3NzUxNCAxMi40NTY1MTI2LDMuMTI3MDEwMyAxMi4zNTQ5NDc0LDMuMTI3ODk0NzQgQzEyLjEyMjk1MzQsMy4xMjYwNzM5NyAxMS45MDc0NjE1LDMuMjQ3NjQ4OTMgMTEuNzg5MDUyNiwzLjQ0NzE1Nzg5IEMxMS42MjM5Nzc0LDMuNzUyMTQ0MTUgMTEuNzMzNTE4OCw0LjEzMzE1MTUyIDEyLjAzNTM2ODQsNC4zMDM4OTQ3NCIgaWQ9IlNoYXBlIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgICAgICA8cGF0aCBkPSJNMTAuMzAyLDMuOTM1Njg0MjEgQzEwLjQzNDIwODYsMy45NzE1NTQ1OSAxMC41NzM3NTIsMy45NzAyNDMzIDEwLjcwNTI2MzIsMy45MzE4OTQ3NCBDMTEuMDE5NDQwNiwzLjgzOTM1MjYgMTEuMjM0ODYyNCwzLjU1MDU4ODM5IDExLjIzNDA1ODQsMy4yMjMwNjYwNyBDMTEuMjMzMjU0NCwyLjg5NTU0Mzc0IDExLjAxNjQxNzUsMi42MDc4NDA2NCAxMC43MDE3ODk1LDIuNTE2ODQyMTEgQzEwLjY0MDk5OSwyLjQ5OTUwNzY5IDEwLjU3ODA1NDYsMi40OTA4OTUzNyAxMC41MTQ4NDIxLDIuNDkxMjYzMTYgQzEwLjE4NDEyNTIsMi40OTM0NDc0NSA5Ljg5MjU0MDk5LDIuNzA4NjI3OTUgOS43OTI5NDczNywzLjAyNCBDOS42ODY1MjUyNCwzLjQxNTc1NTA1IDkuOTEyNjU4MjYsMy44MjA3NDYzOSAxMC4zMDIsMy45MzU2ODQyMSIgaWQ9IlNoYXBlIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgICAgICA8cGF0aCBkPSJNOC4yMDU0NzM2OCwzLjk2NiBDOC41NTI3Njk4MywzLjk4MjkzNDMxIDguODc2MDM5ODcsMy43ODg4OTQwOSA5LjAyNDQxOTQ3LDMuNDc0NDM0NDMgQzkuMTcyNzk5MDcsMy4xNTk5NzQ3NyA5LjExNzAzNzU5LDIuNzg3MDg2MzMgOC44ODMxNTc4OSwyLjUyOTc4OTQ3IEM4LjczMjc4NDYsMi4zNjExMjQ0NyA4LjUyMDU5Mzc5LDIuMjYwNDM5MTkgOC4yOTQ4NDIxMSwyLjI1MDYzMTU4IEw4LjI1Mjg0MjExLDIuMjUwNjMxNTggQzcuNzk3NDkyNjcsMi4yNTY4ODA3OCA3LjQyMzM0OTI3LDIuNjExOTE4NCA3LjM5MzI2MzE2LDMuMDY2MzE1NzkgQzcuMzcwMTY0MzEsMy41Mzg2NjYxOSA3LjczMzIyOSwzLjk0MDgzMjMyIDguMjA1NDczNjgsMy45NjYiIGlkPSJTaGFwZSIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+ICAgICAgICAgICAgPHBhdGggZD0iTTQuNjU0NDIxMDUsMy43NDcxNTc4OSBDNC43NTI1ODc4Nyw0LjI4ODMzMjE5IDUuMjcwMTMyNjEsNC42NDgwNDM5OCA1LjgxMTU4NTk2LDQuNTUxNDI4MTkgQzYuMzUzMDM5MzEsNC40NTQ4MTI0IDYuNzE0MjMyNTQsMy45MzgzMDA0NiA2LjYxOTE2ODU3LDMuMzk2NTcyNSBDNi41MjQxMDQ2LDIuODU0ODQ0NTQgNi4wMDg2Mjk3LDIuNDkyMTcyODQgNS40NjY2MzE1OCwyLjU4NTY4NDIxIEM1LjIwNDMyMTUsMi42MzA4NTQ1MyA0Ljk3MDk0MDQ2LDIuNzc4OTc5MTkgNC44MTg0MDQ5OSwyLjk5NzEwNzI4IEM0LjY2NTg2OTUyLDMuMjE1MjM1MzcgNC42MDY4MzAzOCwzLjQ4NTI3NjEzIDQuNjU0NDIxMDUsMy43NDcxNTc4OSIgaWQ9IlNoYXBlIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgICAgICA8cGF0aCBkPSJNMTQuNTg1MzY4NCw3LjUxOTU3ODk1IEMxNC43ODQ1MzkxLDcuMjk2NjgzNzIgMTQuNzY1NjA1NCw2Ljk1NDYwNTg3IDE0LjU0MzA1MjYsNi43NTUwNTI2MyBDMTQuMzIwNDAwNSw2LjU2MjUxNDUgMTMuOTg1NjA0Myw2LjU3OTQ5NzkzIDEzLjc4MzU3ODksNi43OTM1Nzg5NSBDMTMuNjM5MTE3NCw2Ljk1MTg4NjA1IDEzLjYwMTgwNTYsNy4xODA1ODExMSAxMy42ODg0NTkzLDcuMzc2NTk0OSBDMTMuNzc1MTEzLDcuNTcyNjA4NjkgMTMuOTY5MzcwOSw3LjY5ODkzMTQ4IDE0LjE4MzY4NDIsNy42OTg2MzE1OCBDMTQuMjM2MTQ3OSw3LjY5ODU1MTYgMTQuMjg4MzQwOSw3LjY5MTExMDY0IDE0LjMzODczNjgsNy42NzY1MjYzMiBDMTQuNDM0MTYzNSw3LjY0Nzc1MTczIDE0LjUxOTc1MDksNy41OTMwOTgyNCAxNC41ODYsNy41MTg2MzE1OCIgaWQ9IlNoYXBlIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgICAgICA8cGF0aCBkPSJNMTMuMzY0MjEwNSw2LjE5MzI2MzE2IEMxMy4zMTc4ODE3LDYuMDMxNzgxNDYgMTMuMjA5MTI2NSw1Ljg5NTQxMTM0IDEzLjA2Miw1LjgxNDMxNTc5IEMxMi45NzI0NzEzLDUuNzY1MzE3MjMgMTIuODcxOTUzNCw1LjczOTg4ODkxIDEyLjc2OTg5NDcsNS43NDA0MjEwNSBDMTIuNTM3MjE4MSw1LjczODQ4MDQ5IDEyLjMyMTQ1MjIsNS44NjE3NDA4NCAxMi4yMDQ5NDc0LDYuMDYzMTU3ODkgQzEyLjA4MDk2OTIsNi4yODcyMTgyOSAxMi4xMDQ5NDc0LDYuNTY0MDI5NDIgMTIuMjY1NjA3NCw2Ljc2MzQzMzU3IEMxMi40MjYyNjc0LDYuOTYyODM3NzMgMTIuNjkxNjQwNiw3LjA0NTE1Njg3IDEyLjkzNjk0NzQsNi45NzE2ODQyMSBDMTMuMDk1NjkwNyw2LjkyNTkyMzM2IDEzLjIyOTAzOTYsNi44MTc2NDg2NiAxMy4zMDY0MjExLDYuNjcxNjg0MjEgQzEzLjM4OTQ4ODgsNi41MjYzMjM5NCAxMy40MTAzMjc5LDYuMzUzNTc1ODIgMTMuMzY0MjEwNSw2LjE5MjYzMTU4IiBpZD0iU2hhcGUiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMS42MjQyMTA1LDYuMDQwNDIxMDUgQzExLjY3Njg4MzUsNS44NTIyNDg1NSAxMS42NTMwNDY3LDUuNjUwODg0MDMgMTEuNTU3ODk0Nyw1LjQ4MDIxMDUzIEMxMS40NjM3NzY0LDUuMzEwNjI5NTQgMTEuMzA1ODk4MSw1LjE4NTU5OTkgMTEuMTE5MjYzMiw1LjEzMjg0MjExIEMxMS4wNTc2NTI5LDUuMTE1MTk5NzcgMTAuOTkzODc1OSw1LjEwNjI3MDk4IDEwLjkyOTc4OTUsNS4xMDYzMTU3OSBDMTAuNjAxNjg0Miw1LjEwNjMxNTc5IDEwLjI5ODIxMDUsNS4zMjk4OTQ3NCAxMC4yMTA3MzY4LDUuNjM4NDIxMDUgQzEwLjA5OTY0MDQsNi4wMjg0Nzk0MiAxMC4zMjU3ODM3LDYuNDM0NzQ1NjcgMTAuNzE1ODQyMSw2LjU0NTg0MjExIEMxMS4xMDU5MDA1LDYuNjU2OTM4NTQgMTEuNTEyMTY2Nyw2LjQzMDc5NTIxIDExLjYyMzI2MzIsNi4wNDA3MzY4NCIgaWQ9IlNoYXBlIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgICAgICA8cGF0aCBkPSJNOS41MjI2MzE1OCw1Ljc2NzU3ODk1IEM5LjUzNTQ3MzIzLDUuNTM5MjI1MTUgOS40NTU3OTMyMiw1LjMxNTMyNDM0IDkuMzAxNTc4OTUsNS4xNDY0MjEwNSBDOS4xNTA4NDc0OSw0Ljk3NzcwMjExIDguOTM4MzQ4MTIsNC44NzcwMzI1MiA4LjcxMjMxNTc5LDQuODY3MjYzMTYgQzguNjk3NTI4OTYsNC44NjU2ODY4OCA4LjY4MjY1Njc1LDQuODY1MDU0MDIgOC42Njc3ODk0Nyw0Ljg2NTM2ODQyIEM4LjIyNzU3ODk1LDQuODY1MzY4NDIgNy44MzU2ODQyMSw1LjIzNzY4NDIxIDcuODExMzY4NDIsNS42NzkxNTc4OSBDNy43ODc4OTY1NCw2LjE1MTk3OTM0IDguMTUwODgwNjcsNi41NTQ5MDMwMiA4LjYyMzU3ODk1LDYuNTgwNzM2ODQgTDguNjcxODk0NzQsNi41ODA3MzY4NCBDOS4xMjcxNjgzNCw2LjU3OTg1Mjg1IDkuNTAxNDI5Miw2LjIyMTQ0MTA4IDkuNTIyLDUuNzY2NjMxNTgiIGlkPSJTaGFwZSIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+ICAgICAgICAgICAgPHBhdGggZD0iTTYuMDU1ODk0NzQsNS4xODQgQzUuNTAxOTgyMiw1LjE4MTIwOTUxIDUuMDUwNjg1MjMsNS42Mjc5ODIyIDUuMDQ3ODk0NzQsNi4xODE4OTQ3NCBDNS4wNDUxMDQyNSw2LjczNTgwNzI3IDUuNDkxODc2OTQsNy4xODcxMDQyNSA2LjA0NTc4OTQ3LDcuMTg5ODk0NzQgQzYuMTQ2ODAyODEsNy4xODk4OTExOCA2LjI0NzI5NTU5LDcuMTc1NDI4NzMgNi4zNDQyMTA1Myw3LjE0Njk0NzM3IEM2LjgyMTAyODYyLDcuMDAzODkzOTEgNy4xMjA4MzM3Miw2LjUzMjgzNDk4IDcuMDQ4NTM2ODUsNi4wNDAyOTc3MiBDNi45NzYyMzk5OCw1LjU0Nzc2MDQ2IDYuNTUzNzA5NzUsNS4xODI3MjkyIDYuMDU1ODk0NzQsNS4xODI3MzY4NCIgaWQ9IlNoYXBlIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgICAgICA8cGF0aCBkPSJNMi4xMTE2ODQyMSw3Ljg3MDEwNTI2IEMyLjI5MzI5MjIsOC4zMDI3ODE3OCAyLjcxNjEyNjIyLDguNTg0ODM2OTUgMy4xODUzNjg0Miw4LjU4NjMxNTc5IEMzLjI5NjUwMzk4LDguNTg2MjQ1MDMgMy40MDcwMzUyOSw4LjU2OTk2ODUyIDMuNTEzNDczNjgsOC41MzggQzMuNTU4ODY1MzMsOC41MjQ3NjYgMy42MDM0NjQyNCw4LjUwODk1MDc4IDMuNjQ3MDUyNjMsOC40OTA2MzE1OCBDNC4yNDM0ODEzNiw4LjIzODQzMzE4IDQuNTIyNTQyMDcsNy41NTA0OTA1OSA0LjI3MDM1NzMyLDYuOTU0MDU2MDkgQzQuMDE4MTcyNTgsNi4zNTc2MjE1OSAzLjMzMDIzNjM5LDYuMDc4NTQ1MTMgMi43MzM3OTYxMSw2LjMzMDcxNjIyIEMyLjEzNzM1NTg0LDYuNTgyODg3MyAxLjg1ODI2MzYyLDcuMjcwODE3MTEgMi4xMTA0MjEwNSw3Ljg2NzI2MzE2IEwyLjExMDQyMTA1LDcuODcwMTA1MjYiIGlkPSJTaGFwZSIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+ICAgICAgICAgICAgPHBhdGggZD0iTTE0LjIzMTY4NDIsOC43MDIyMTA1MyBDMTQuMTQxNTI2NSw4LjY1MjM4NTIyIDE0LjA0MDA1OTQsOC42MjY2MTA2MSAxMy45MzcwNTI2LDguNjI3MzY4NDIgQzEzLjcwNjE2MzcsOC42MjUwMDA3OCAxMy40OTE4NzY3LDguNzQ3MTA1NzYgMTMuMzc2MjEwNSw4Ljk0Njk0NzM3IEMxMy4yMDgxMjI5LDkuMjUxMjE1MTUgMTMuMzE3NTAyOCw5LjYzNDExNTA5IDEzLjYyMDk0NzQsOS44MDM2ODQyMSBDMTMuNzY3Nzk3Nyw5Ljg4Njk2ODk0IDEzLjk0MjE3OTksOS45MDcwMjg2IDE0LjEwNDEwNTMsOS44NTkyNjMxNiBDMTQuMzQ3NDc2NCw5Ljc4NjU2MzkgMTQuNTIzNjE3OSw5LjU3NTE0Njc3IDE0LjU1MTE4MzEsOS4zMjI2NDk1IEMxNC41Nzg3NDgzLDkuMDcwMTUyMjMgMTQuNDUyMzczMiw4LjgyNTcwOTI4IDE0LjIzMDQyMTEsOC43MDIyMTA1MyIgaWQ9IlNoYXBlIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgICAgICA8cGF0aCBkPSJNMTEuNDQzODk0Nyw5LjA4NjIxMDUzIEMxMS42MDU4OTM3LDkuMzc2NzU4MyAxMS45NDI3NDg1LDkuNTIyMzkzNzcgMTIuMjY1MzkwMSw5LjQ0MTM3NSBDMTIuNTg4MDMxOCw5LjM2MDM1NjIzIDEyLjgxNjEyMTksOS4wNzI4NTcwMyAxMi44MjE2Mzg1LDguNzQwMjQ0MyBDMTIuODI3MTU1Miw4LjQwNzYzMTU2IDEyLjYwODcyNDgsOC4xMTI3MjY0NSAxMi4yODg5NDc0LDguMDIxMDUyNjMgQzEyLjIyNzQwMzcsOC4wMDMwOTg1NyAxMi4xNjM1ODE3LDcuOTk0MTYzNSAxMi4wOTk0NzM3LDcuOTk0NTI2MzIgQzExLjc3MDMzNTIsNy45OTU4MzgwMiAxMS40Nzk2Njc4LDguMjA5NDM2NDMgMTEuMzgwMTA1Myw4LjUyMzE1Nzg5IEMxMS4zMjU0NzU0LDguNzExNzc1NzYgMTEuMzQ4MjAyLDguOTE0MzgzNTkgMTEuNDQzMjYzMiw5LjA4NjIxMDUzIiBpZD0iU2hhcGUiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMC42OTQ4NDIxLDguNjUyNjMxNTggQzEwLjcxNzU5MTEsOC4xNzk0Nzc4NyAxMC4zNTQwNTY3LDcuNzc2NzI2MjggOS44ODEwNTI2Myw3Ljc1MTA1MjYzIEw5Ljg0MDMxNTc5LDcuNzUxMDUyNjMgQzkuMzk4MjEwNTMsNy43NTEwNTI2MyA5LjAwNTA1MjYzLDguMTIzMzY4NDIgOC45ODMyNjMxNiw4LjU2NDg0MjExIEM4Ljk1ODMzOTY0LDkuMDM3OTI3NDMgOS4zMjA4ODUwNyw5LjQ0MTk5NTQgOS43OTM4OTQ3NCw5LjQ2ODMxNTc5IEw5LjgzNjIxMDUzLDkuNDY4MzE1NzkgQzkuOTE4Nzc1NzEsOS40NjgzMjc0NSAxMC4wMDA5MDE5LDkuNDU2MzA2NCAxMC4wOCw5LjQzMjYzMTU4IEMxMC40Mjg3Mjk2LDkuMzI4MDE0MjIgMTAuNjc0NTU5Myw5LjAxNjE1MDEzIDEwLjY5NDg0MjEsOC42NTI2MzE1OCIgaWQ9IlNoYXBlIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgICAgICA8cGF0aCBkPSJNNy4yMjc3ODk0NywxMC4wNzgxMDUzIEM3LjI4NTgxNDk1LDEwLjA3ODAxMjYgNy4zNDM3MjA2OCwxMC4wNzI4MzQ5IDcuNDAwODQyMTEsMTAuMDYyNjMxNiBDNy40Mzc4MTI0NywxMC4wNTY2NTA0IDcuNDc0MzIxNzMsMTAuMDQ4MTAzNSA3LjUxMDEwNTI2LDEwLjAzNzA1MjYgQzguMDEzMTY4NTIsOS44ODgyOTEzMSA4LjMxNTc5MDQzLDkuMzc2MTA1MyA4LjIwMzM3NzE4LDguODYzNjkzNTIgQzguMDkwOTYzOTMsOC4zNTEyODE3NCA3LjYwMTcyNTE2LDguMDEyODE0NjggNy4wODI1ODc1NSw4LjA4ODMwNDQ5IEM2LjU2MzQ0OTk0LDguMTYzNzk0MyA2LjE5MDg3MDEsOC42Mjc1ODE3NCA2LjIyOTA1MDA5LDkuMTUwNzg4MDYgQzYuMjY3MjMwMDcsOS42NzM5OTQzOSA2LjcwMzE5MjM4LDEwLjA3ODc4IDcuMjI3Nzg5NDcsMTAuMDc4MTA1MyIgaWQ9IlNoYXBlIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgICAgICA8cGF0aCBkPSJNNS40NDQ4NDIxMSwxMC43MzY4NDIxIEM1LjU2MTg4MjE0LDEwLjQ0ODQ3MDMgNS41NTkwNDA1MiwxMC4xMjUzMjE2IDUuNDM2OTQ3MzcsOS44MzkwNTI2MyBDNS4yNDY5NTQxNyw5LjQwNzg1NjcyIDQuODIxMTkxODYsOS4xMjg2NzQ0IDQuMzUsOS4xMjYzMTU3OSBDNC4xOTU2Nzg0Niw5LjEyNTkzNjI5IDQuMDQyOTMwMzgsOS4xNTczMjQzNSAzLjkwMTI2MzE2LDkuMjE4NTI2MzIgQzMuNjE0MTI3ODcsOS4zMzc2NjU3NSAzLjM4NzEzMTcxLDkuNTY3NTA3OSAzLjI3MTU3ODk1LDkuODU2MTA1MjYgQzMuMTI1MzU3ODMsMTAuMjE3Nzk0MSAzLjE2ODEyOTMxLDEwLjYyODQ2NjEgMy4zODU3NDM2MiwxMC45NTIyNjE1IEMzLjYwMzM1Nzk0LDExLjI3NjA1NjkgMy45Njc0NTMzNywxMS40NzA3NzU1IDQuMzU3NTc4OTUsMTEuNDcyIEM0LjQ2OTY2OTUsMTEuNDcyMjQzNSA0LjU4MTE4Mzc5LDExLjQ1NTk2MzIgNC42ODg1MjYzMiwxMS40MjM2ODQyIEM1LjAzMzEyMzI0LDExLjMyMzczMTIgNS4zMTIyNTAyMywxMS4wNzAyNDQzIDUuNDQ0ODQyMTEsMTAuNzM2ODQyMSIgaWQ9IlNoYXBlIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgICAgICA8cGF0aCBkPSJNMi41MDA3MzY4NCwxMS42NTQ4NDIxIEMyLjI0MTgzMjg1LDExLjI5OTU3NzggMS44MjkwNjc3NCwxMS4wODkwMzEyIDEuMzg5NDczNjgsMTEuMDg4IEMxLjI1ODc4ODAzLDExLjA4ODExNzUgMS4xMjg4MDc5NCwxMS4xMDcxNTcxIDEuMDAzNTc4OTUsMTEuMTQ0NTI2MyBDMC4yODMxOTc0MzIsMTEuMzY1ODA5OSAtMC4xMjUwMjQ2OTYsMTIuMTI1NTMyMyAwLjA4ODA0MjU3MTQsMTIuODQ4Mzg2NiBDMC4zMDExMDk4MzksMTMuNTcxMjQwOSAxLjA1NjEzNTA5LDEzLjk4ODA4NjUgMS43ODEzNjg0MiwxMy43ODMyNjMyIEMyLjIwOTU3OTk4LDEzLjY1NTk1NDggMi41NDkyNzQwNCwxMy4zMjg1ODU2IDIuNjkyMzEzNjksMTIuOTA1MzY5MSBDMi44MzUzNTMzNCwxMi40ODIxNTI1IDIuNzYzOTEzNzksMTIuMDE1ODI3NSAyLjUwMDczNjg0LDExLjY1NDg0MjEiIGlkPSJTaGFwZSIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+ICAgICAgICAgICAgPHBhdGggZD0iTTE3LjI0NzE1NzksMTYuNDY5MDUyNiBDMTcuMjI0OTE5MiwxNi4yMjgzMTggMTcuMDIzNzU0NSwxNi4wNDM2NzgxIDE2Ljc4MiwxNi4wNDIxMDUzIEMxNi43Njg0OTg1LDE2LjA0MTc4MzEgMTYuNzU0OTkxMSwxNi4wNDI0MTYyIDE2Ljc0MTU3ODksMTYuMDQ0IEMxNi41NDE5NzEzLDE2LjA2MjQyNSAxNi4zNzY1NzgzLDE2LjIwNjU3MTQgMTYuMzMxMDUyNiwxNi40MDE3ODk1IEMxNi4zMTk3MDA0LDE2LjQ1MDcxMjggMTYuMzE1ODY2OSwxNi41MDEwOCAxNi4zMTk2ODQyLDE2LjU1MTE1NzkgQzE2LjM0MjcxNTEsMTYuNzg5NzIyNyAxNi41NDE3MTIzLDE2Ljk3MjY1ODYgMTYuNzgxMzY4NCwxNi45NzU1Nzg5IEMxNi43OTQ4Njk5LDE2Ljk3NTkwMTEgMTYuODA4Mzc3MywxNi45NzUyNjggMTYuODIxNzg5NSwxNi45NzM2ODQyIEMxNi45NDQ4OTc1LDE2Ljk2MjMyNDggMTcuMDU4NDY5NSwxNi45MDI1ODU5IDE3LjEzNzU3ODksMTYuODA3NTc4OSBDMTcuMjE4MTg5OCwxNi43MTQwNjE2IDE3LjI1Nzg5NDUsMTYuNTkyMTAzNCAxNy4yNDc3ODk1LDE2LjQ2OTA1MjYiIGlkPSJTaGFwZSIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+ICAgICAgICAgICAgPHBhdGggZD0iTTE3LjU3NCwxNS45NTAyMTA1IEMxNy41MjIxNTE0LDE2LjE3MTQ5NzkgMTcuNjE0NzU0MSwxNi40MDE1MjEyIDE3LjgwNTQ2MzEsMTYuNTI1MTU5OCBDMTcuOTk2MTcyMSwxNi42NDg3OTgzIDE4LjI0Mzk1OTYsMTYuNjM5NDUzNSAxOC40MjQ4MTQ2LDE2LjUwMTgwMjIgQzE4LjYwNTY2OTUsMTYuMzY0MTUwOSAxOC42ODA2ODQyLDE2LjEyNzgwNjMgMTguNjEyMzE1OCwxNS45MTEwNTI2IEMxOC41Njk4Njc5LDE1Ljc3MzY2NjcgMTguNDczMTMsMTUuNjU5NTg5IDE4LjM0NDUyNjMsMTUuNTk1MjYzMiBDMTguMjY5NTY4OSwxNS41NTY3MzU2IDE4LjE4NjU5MzUsMTUuNTM2Mzk3NSAxOC4xMDIzMTU4LDE1LjUzNTg5NDcgQzE4LjA0NTQ1MzcsMTUuNTM1ODc5MSAxNy45ODg5ODk4LDE1LjU0NTM3ODcgMTcuOTM1MjYzMiwxNS41NjQgQzE3Ljc1NDY4MTEsMTUuNjE5NTI5MyAxNy42MTcyMjA2LDE1Ljc2Njg1MTUgMTcuNTc0MzE1OCwxNS45NTA4NDIxIiBpZD0iU2hhcGUiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xOC44ODIsMTUuMDg5MzY4NCBDMTguODAyNjYxNiwxNS40MjU0NzY5IDE5LjAwNjczNDksMTUuNzYzMzA2NiAxOS4zNDExNTc5LDE1Ljg0OTQ3MzcgQzE5LjM5MTgzNTIsMTUuODYyMzQyNyAxOS40NDM5MjQ4LDE1Ljg2ODgxNDEgMTkuNDk2MjEwNSwxNS44Njg3MzY4IEMxOS42MDk1MzE5LDE1Ljg2ODc0MDEgMTkuNzIwNjU5LDE1LjgzNzQ4OSAxOS44MTczNjg0LDE1Ljc3ODQyMTEgQzIwLjEwNDQyMTEsMTUuNjA0MTA1MyAyMC4yMDUxNTc5LDE1LjE5OCAyMC4wMzI3MzY4LDE0LjkxMDYzMTYgQzE5LjkxNzA1MjEsMTQuNzIyMzU5NyAxOS43MTIxMzA2LDE0LjYwNzQxMjQgMTkuNDkxMTU3OSwxNC42MDY4NDIxIEMxOS4yMDA5NTMsMTQuNjA3NDY0MiAxOC45NDkwMzcyLDE0LjgwNzAxMTggMTguODgyLDE1LjA4OTM2ODQiIGlkPSJTaGFwZSIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+ICAgICAgICAgICAgPHBhdGggZD0iTTIwLjg3MTQ3MzcsMTQuNjM4MTA1MyBDMjEuMDYxNjE5OCwxNC42MzgzOTUgMjEuMjQ0MzMwNiwxNC41NjQyNjc5IDIxLjM4MDUyNjMsMTQuNDMxNTc4OSBDMjEuNjU5Njg0MiwxNC4xNTk2ODQyIDIxLjY2NzI2MzIsMTMuNjcxNDczNyAyMS4zOTYsMTMuMzg3ODk0NyBDMjEuMjU3ODY3NywxMy4yNDYwOTkyIDIxLjA2Nzg0NDEsMTMuMTY2ODI3NyAyMC44Njk4OTQ3LDEzLjE2ODQyMTEgQzIwLjQ2OTUwNTcsMTMuMTcyNjU3MSAyMC4xNDYyMDg0LDEzLjQ5NjY2NTYgMjAuMTQyODUyNCwxMy44OTcwNjMgQzIwLjEzOTQ5NjQsMTQuMjk3NDYwNCAyMC40NTczMTcyLDE0LjYyNjg0MjcgMjAuODU3NTc4OSwxNC42Mzc3ODk1IEwyMC44NzE0NzM3LDE0LjYzODEwNTMgWiIgaWQ9IlNoYXBlIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgICAgICA8cGF0aCBkPSJNMjIuODEzNTc4OSwxMi40NzM2ODQyIEMyMy4wNjYyMTA1LDEyLjA4MzM2ODQgMjIuOTQ5Njg0MiwxMS41Mzg2MzE2IDIyLjU2MDk0NzQsMTEuMjgzMTU3OSBDMjIuMzcxMjUyOCwxMS4xNjAwMjQxIDIyLjE0MDQwOTYsMTEuMTE3Mjk3OSAyMS45MTkyMTAyLDExLjE2NDM4MDYgQzIxLjY5ODAxMDcsMTEuMjExNDYzMiAyMS41MDQ1NzgyLDExLjM0NDQ5NyAyMS4zODE0NzM3LDExLjUzNDIxMDUgTDIxLjM3ODYzMTYsMTEuNTM4NjMxNiBDMjEuMzI2MDAyNCwxMS42MjA0NCAyMS4yODcyNjksMTEuNzEwMzkxMSAyMS4yNjQsMTEuODA0ODQyMSBDMjEuMjAxOTY0NCwxMi4wNjAyMzQ1IDIxLjI2MDI2NjEsMTIuMzI5OTcyNyAyMS40MjIyMzg0LDEyLjUzNjk0NzYgQzIxLjU4NDIxMDgsMTIuNzQzOTIyNSAyMS44MzIwMjYsMTIuODY1MzUzMSAyMi4wOTQ4NDIxLDEyLjg2NjUyNjMgQzIyLjM4NTYyOTgsMTIuODY2Mjk1NCAyMi42NTYzNzMzLDEyLjcxODMxNDMgMjIuODEzNTc4OSwxMi40NzM2ODQyIiBpZD0iU2hhcGUiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPiAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMy4zNDE1Nzg5LDguNTY1NDczNjggQzIzLjIzMjUwNzYsOC41MjU2MDgxMiAyMy4xMTcyODYzLDguNTA1MTkzMjEgMjMuMDAxMTU3OSw4LjUwNTE1Nzg5IEMyMi41Nzg2OTI1LDguNTA2NzE5NzEgMjIuMjAxOTYyOSw4Ljc3MTQwMDk0IDIyLjA1NzI2MzIsOS4xNjgzMTU3OSBDMjIuMDQ0NTI2MSw5LjIwMzIwMjk3IDIyLjAzMzk3OTMsOS4yMzg4NTEyNCAyMi4wMjU2ODQyLDkuMjc1MDUyNjMgQzIxLjkwNjMzNjYsOS43NzEzNjYgMjIuMTc3OTQ1MywxMC4yNzgzMjM3IDIyLjY1NzI2MzIsMTAuNDUzODk0NyBDMjIuNzY1MjkzMiwxMC40OTMwMTI4IDIyLjg3OTMxNjIsMTAuNTEyOTk2MiAyMi45OTQyMTA1LDEwLjUxMjk0NzQgQzIzLjQxNjA5NDEsMTAuNTEyMDQ3OCAyMy43OTI4MTcsMTAuMjQ4NTkzNyAyMy45Mzg0MjExLDkuODUyNjMxNTggQzI0LjEyMTg5NDcsOS4zMjk2ODQyMSAyMy44NTQxMDUzLDguNzUzMDUyNjMgMjMuMzQxNTc4OSw4LjU2NzA1MjYzIiBpZD0iU2hhcGUiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNS4xMDYxMDUzLDE1LjAwOTc4OTUgQzE1LjAzNjY2NzIsMTUuMjk5ODAyNCAxNS4yMTUzMTU2LDE1LjU5MTIzNjggMTUuNTA1MjYzMiwxNS42NjA5NDc0IEMxNS41NDYwMDc1LDE1LjY3MDc3NzcgMTUuNTg3NzcwNywxNS42NzU3NTk2IDE1LjYyOTY4NDIsMTUuNjc1Nzg5NSBDMTUuNjg3NDEzNCwxNS42NzU2ODY2IDE1Ljc0NDc1OTcsMTUuNjY2NDEzMSAxNS43OTk1Nzg5LDE1LjY0ODMxNTggQzE2LjAwMzcyODEsMTUuNTc3ODY4OSAxNi4xNDY5MzY2LDE1LjM5MzQxMTcgMTYuMTY0NTg4MiwxNS4xNzgxNzIyIEMxNi4xODIyMzk3LDE0Ljk2MjkzMjYgMTYuMDcwOTk2OCwxNC43NTc2MDgyIDE1Ljg4MTA1MjYsMTQuNjU0ODQyMSBMMTUuODc2OTQ3NCwxNC42NTI2MzE2IEMxNS44MDEzMTMsMTQuNjEyNzg0NSAxNS43MTcwNjc1LDE0LjU5MjA3NTUgMTUuNjMxNTc4OSwxNC41OTIzMTU4IEMxNS4zODA1NjYzLDE0LjU5MjcwNTkgMTUuMTYyODgsMTQuNzY1OTEzMSAxNS4xMDYxMDUzLDE1LjAxMDQyMTEiIGlkPSJTaGFwZSIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+ICAgICAgICAgICAgPHBhdGggZD0iTTE2Ljg3Mzg5NDcsMTQuOTA1MjYzMiBDMTcuMDM2NTM5NywxNC45NDUwNDc4IDE3LjIwODMyMDcsMTQuOTE4ODIwOCAxNy4zNTE2ODQyLDE0LjgzMjMxNTggQzE3LjY0MDMxNTgsMTQuNjU2NDIxMSAxNy43Mzg1MjYzLDE0LjI1ODUyNjMgMTcuNTY1NDczNywxMy45NjI5NDc0IEMxNy40NDkzMjQzLDEzLjc3NTQ1MzEgMTcuMjQ0MTMyNywxMy42NjE3MzY5IDE3LjAyMzU3ODksMTMuNjYyNjMxNiBDMTYuNzMzNDM3MSwxMy42NjI2Mzc0IDE2LjQ4MTM3NzIsMTMuODYyMTQxMiAxNi40MTQ3MzY4LDE0LjE0NDUyNjMgQzE2LjM3NDQyNzgsMTQuMzA1MzA1OCAxNi40MDEwOTQyLDE0LjQ3NTU2MDUgMTYuNDg4NjMxNiwxNC42MTYzMTU4IEMxNi41NzMxNjE2LDE0Ljc2MDM1MTEgMTYuNzExOTUyNSwxNC44NjQ0NDQyIDE2Ljg3Mzg5NDcsMTQuOTA1MjYzMiIgaWQ9IlNoYXBlIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgICAgICA8cGF0aCBkPSJNMTguNDAwMTA1MywxMy42OTMyNjMyIEMxOC41OTEyNTgyLDEzLjY5Mzc5MDYgMTguNzc1MDE0MiwxMy42MTk0MjY3IDE4LjkxMiwxMy40ODYxMDUzIEMxOS4xOTM1MzExLDEzLjE5ODM4NyAxOS4yMDEwMTkzLDEyLjc0MDc3NTUgMTguOTI5MDUyNiwxMi40NDQgQzE4LjY5NzIzLDEyLjIwNTc5MTUgMTguMzM0MzMwNywxMi4xNTI5NTA4IDE4LjA0NDIwNDUsMTIuMzE1MTU5OCBDMTcuNzU0MDc4MiwxMi40NzczNjg5IDE3LjYwOTA0MTMsMTIuODE0MTk1NyAxNy42OTA1NjQ3LDEzLjEzNjQzNjIgQzE3Ljc3MjA4OCwxMy40NTg2NzY4IDE4LjA1OTg1MTMsMTMuNjg2MDA5OSAxOC4zOTIyMTA1LDEzLjY5MDczNjggTDE4LjQwMDEwNTMsMTMuNjkzMjYzMiBaIiBpZD0iU2hhcGUiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPiAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMC4zNDUzNjg0LDExLjUzMDEwNTMgQzIwLjQ2NzE1NTMsMTEuMzM5Mjc4MyAyMC41MDgwNTUzLDExLjEwNzg1MjcgMjAuNDU5MDUyNiwxMC44ODY4NDIxIEMyMC4zOTIzODI0LDEwLjU0NTA0NzIgMjAuMTIzNTc2NiwxMC4yNzg3Mjg3IDE5Ljc4MTE3NjcsMTAuMjE1MjM4NyBDMTkuNDM4Nzc2OCwxMC4xNTE3NDg3IDE5LjA5MjM1OTEsMTAuMzAzOTg4NiAxOC45MDc1Nzg5LDEwLjU5OTE1NzkgQzE4LjczNzk4MTksMTAuODYyNzk2OCAxOC43MjU1Mzk1LDExLjE5NzkwODMgMTguODc1MTE5MiwxMS40NzMzOTc5IEMxOS4wMjQ2OTg5LDExLjc0ODg4NzYgMTkuMzEyNTI0NiwxMS45MjA5NjU2IDE5LjYyNiwxMS45MjIzMTU4IEMxOS42ODczNTI5LDExLjkyMjM4MTcgMTkuNzQ4NTM4OCwxMS45MTU5MjQzIDE5LjgwODUyNjMsMTEuOTAzMDUyNiBDMjAuMDI5NzU2MiwxMS44NTUyMjM0IDIwLjIyMjg5MDMsMTEuNzIxMzkyOSAyMC4zNDUzNjg0LDExLjUzMTA1MjYiIGlkPSJTaGFwZSIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+ICAgICAgICAgICAgPHBhdGggZD0iTTIwLjE5MDMxNTgsOS41MDg0MjEwNSBDMjAuNzA4ODY2OSw5LjY4NjU0NDAxIDIxLjI3NDQ1NzYsOS40MTU5NTQ4NCAyMS40NjExNTM5LDguOTAwNDI4MzcgQzIxLjY0Nzg1MDEsOC4zODQ5MDE5IDIxLjM4NjY3NTksNy44MTQ5MDI0NSAyMC44NzQzMTU4LDcuNjE5Njg0MjEgQzIwLjYyNDY5Nyw3LjUyOTA3NDkzIDIwLjM0OTI5OTYsNy41NDEzOTQ4MSAyMC4xMDg3Njg2LDcuNjUzOTMwODkgQzE5Ljg2ODIzNzUsNy43NjY0NjY5OCAxOS42ODIyOTc3LDcuOTY5OTkwNjUgMTkuNTkxODk0Nyw4LjIxOTY4NDIxIEMxOS41NzkzNTIsOC4yNTYyNDExMSAxOS41Njg4MTAxLDguMjkzNDU0MTQgMTkuNTYwMzE1OCw4LjMzMTE1Nzg5IEMxOS40NDI0NDAxLDguODI2NTYzNzkgMTkuNzEzNzk0Miw5LjMzMTgyNTE0IDIwLjE5MTg5NDcsOS41MDcxNTc4OSIgaWQ9IlNoYXBlIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgICAgICA8cGF0aCBkPSJNMjAuNzY4NTI2Myw2LjYyNTg5NDc0IEMyMC44MTU5NDA5LDYuNjMyMjU2MzIgMjAuODYzNzQwMiw2LjYzNTMxNjMyIDIwLjkxMTU3ODksNi42MzUwNTI2MyBDMjEuNTMyNjk0MSw2LjYzNDk5ODg3IDIyLjA0NjM3MjgsNi4xNTEzMjc1NSAyMi4wODM3Njc5LDUuNTMxMzM5MTcgQzIyLjEyMTE2MjksNC45MTEzNTA3OCAyMS42NjkzNDI3LDQuMzY5NDQ0NjcgMjEuMDUyNzM2OCw0LjI5NDczNjg0IEMyMS4wMDUwNTA3LDQuMjg5MDAzMjIgMjAuOTU3MDgwOCw0LjI4NTk0NTggMjAuOTA5MDUyNiw0LjI4NTU3ODk1IEMyMC4zNjg1NTQ2LDQuMjgzMDI5ODkgMTkuODk3NTM0NSw0LjY1MzE3MzEzIDE5Ljc3MjIxMDUsNS4xNzg5NDczNyBDMTkuNzYxNTI0Nyw1LjIyNTAxODc5IDE5Ljc1MzE5ODEsNS4yNzE2MDU3NSAxOS43NDcyNjMyLDUuMzE4NTI2MzIgQzE5LjcwODA1LDUuNjI5NjY3MzggMTkuNzk1NTU3NSw1Ljk0MzUxMTA2IDE5Ljk5MDEwNTMsNi4xODk0NzM2OCBDMjAuMTgwNDUyNSw2LjQzMzU2ODMgMjAuNDYwOTc4Myw2LjU5MDg0NDgyIDIwLjc2ODUyNjMsNi42MjU4OTQ3NCIgaWQ9IlNoYXBlIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgICAgICA8cGF0aCBkPSJNMTQuNTU0NDIxMSwxNC4wMTA2MzE2IEMxNC41OTU3MTIxLDEzLjg1MTIxMjkgMTQuNTcyMjEwMSwxMy42ODE5MzA2IDE0LjQ4OTA1MjYsMTMuNTM5Nzg5NSBDMTQuMzU3NDEzNSwxMy4zMjA3MTA3IDE0LjEwNjQ1ODUsMTMuMjAyODczOSAxMy44NTM4MDkxLDEzLjI0MTUwODcgQzEzLjYwMTE1OTcsMTMuMjgwMTQzNSAxMy4zOTY4ODg3LDEzLjQ2NzU5MjggMTMuMzM2NzM2OCwxMy43MTYgQzEzLjI5ODIxODUsMTMuODc4OTEyNCAxMy4zMjQ3MjY4LDE0LjA1MDQyMzQgMTMuNDEwNjMxNiwxNC4xOTQxMDUzIEMxMy41NDE5NDg1LDE0LjQxMjg1NDQgMTMuNzkzMTA1LDE0LjUyOTc1MDYgMTQuMDQ1MDI3NiwxNC40ODkzNzM1IEMxNC4yOTY5NTAyLDE0LjQ0ODk5NjQgMTQuNDk4OTkzNCwxNC4yNTk0NjMyIDE0LjU1NTM2ODQsMTQuMDEwNjMxNiIgaWQ9IlNoYXBlIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgICAgICA8cGF0aCBkPSJNMTUuMzI2MjEwNSwxMy4yNjMxNTc5IEMxNS41MTU5NDg2LDEzLjI2NDA0NCAxNS42OTg0MzQxLDEzLjE5MDMyMzkgMTUuODM0MzE1OCwxMy4wNTc4OTQ3IEMxNi4xMTUwNTI2LDEyLjc4NiAxNi4xMjQ1MjYzLDEyLjMgMTUuODUzMjYzMiwxMi4wMTU3ODk1IEMxNS43MTg5Mzc1LDExLjg3NTIyODYgMTUuNTM0MjY4LDExLjc5Mzc5NjkgMTUuMzM5ODkzMywxMS43ODk0MTQzIEMxNS4xNDU1MTg2LDExLjc4NTAzMTcgMTQuOTU3MzY2NiwxMS44NTgwNTczIDE0LjgxNjg0MjEsMTEuOTkyNDIxMSBMMTQuODEzNjg0MiwxMS45OTU1Nzg5IEMxNC43MTM4MTAyLDEyLjA5NDQ2NDkgMTQuNjQzNDkyMSwxMi4yMTkyNDQgMTQuNjEwNjMxNiwxMi4zNTU4OTQ3IEMxNC41NTY2ODIsMTIuNTc1MTY2NSAxNC42MDY5MDc0LDEyLjgwNzA2NDkgMTQuNzQ2NzQ3OSwxMi45ODQzNjQ5IEMxNC44ODY1ODg0LDEzLjE2MTY2NSAxNS4xMDA0MDM2LDEzLjI2NDUzNjQgMTUuMzI2MjEwNSwxMy4yNjMxNTc5IiBpZD0iU2hhcGUiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNi4wODQ0MjExLDExLjM1NjEwNTMgQzE2LjQ4MjA2OTksMTEuNjEyODA5NSAxNy4wMTI1MjU5LDExLjQ5ODU3NDkgMTcuMjY5MjYzMiwxMS4xMDA5NDc0IEMxNy41MTcxNTc5LDEwLjcxNjk0NzQgMTcuMzk4NDIxMSwxMC4xNjIxMDUzIDE3LjAxNjYzMTYsOS45MTM4OTQ3NCBDMTYuNjE4Mzc2MSw5LjY1NjEyMzEyIDE2LjA4NjU2MTEsOS43NzAwMDc3NSAxNS44Mjg3ODk1LDEwLjE2ODI2MzIgQzE1LjU3MTAxNzksMTAuNTY2NTE4NiAxNS42ODQ5MDI1LDExLjA5ODMzMzYgMTYuMDgzMTU3OSwxMS4zNTYxMDUzIiBpZD0iU2hhcGUiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNy43OTM3ODk1LDcuMTkxNDczNjggQzE3LjI3Mjc1MjQsNy4wMDM0NjQzMyAxNi42OTc5NTY3LDcuMjczNDM2NjIgMTYuNTA5OTQ3NCw3Ljc5NDQ3MzY4IEMxNi4zMjE5MzgsOC4zMTU1MTA3NCAxNi41OTE5MTAzLDguODkwMzA2NDMgMTcuMTEyOTQ3NCw5LjA3ODMxNTc5IEMxNy4yMjE3MjU3LDkuMTE4NDU1NTEgMTcuMzM2Nzg5Miw5LjEzODg4MDM0IDE3LjQ1MjczNjgsOS4xMzg2MzE1OCBDMTcuOTQwNDQzLDkuMTM5MTQ0MjUgMTguMzU3ODY3Niw4Ljc4ODg1MjY0IDE4LjQ0MjAxMDQsOC4zMDg0NTk1NCBDMTguNTI2MTUzMiw3LjgyODA2NjQ0IDE4LjI1MjYzNiw3LjM1Njc1MzU2IDE3Ljc5Mzc4OTUsNy4xOTE0NzM2OCIgaWQ9IlNoYXBlIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgICAgICA8cGF0aCBkPSJNMTcuOTcyNTI2MywzLjg2Njg0MjExIEMxNy45MjUzNTEsMy44NjE0MjI5OCAxNy44Nzc5MDY1LDMuODU4NjgxNzQgMTcuODMwNDIxMSwzLjg1ODYzMTU4IEMxNy4yODg4OTY5LDMuODU3MzgwOCAxNi44MTc4Nzg5LDQuMjI5MzU0MjEgMTYuNjkzNTc4OSw0Ljc1NjQyMTA1IEMxNi42ODI0OTU2LDQuODAwMjQ2ODEgMTYuNjc0MzcyLDQuODQ0NzY4MzEgMTYuNjY5MjYzMiw0Ljg4OTY4NDIxIEMxNi42MzA4NzYsNS4xOTg1Njg3MSAxNi43MTY3Nzk1LDUuNTEwMDUwMDggMTYuOTA4MDcxOCw1Ljc1NTU5MTIzIEMxNy4wOTkzNjQxLDYuMDAxMTMyMzkgMTcuMzgwMzcxOCw2LjE2MDYxNTA3IDE3LjY4OTI2MzIsNi4xOTg5NDczNyBDMTcuNzM0MTEyNiw2LjIwNDM2NzIzIDE3Ljc3OTI0NTMsNi4yMDcxMDg5MyAxNy44MjQ0MjExLDYuMjA3MTU3ODkgQzE4LjQxMTc4OTUsNi4yMDcxNTc4OSAxOC45MjQzMTU4LDUuNzUzNjg0MjEgMTguOTkyODQyMSw1LjE3NTE1Nzg5IEMxOS4wNzQ4MDc5LDQuNTM1MDkwMjggMTguNjIyMzgyMiwzLjk0OTc2NDU5IDE3Ljk4MjMxNTgsMy44Njc3ODk0NyBMMTcuOTczNzg5NSwzLjg2Nzc4OTQ3IiBpZD0iU2hhcGUiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNy40NDIsMi43NDg5NDczNyBDMTcuNDkwODU1LDIuNzQ5MDU0NTUgMTcuNTM5Njc0NywyLjc0NjMxMzA2IDE3LjU4ODIxMDUsMi43NDA3MzY4NCBDMTguMzEzNDg1OCwyLjY2MjcwNDAxIDE4Ljg1MTQzOSwyLjAzMTYyNzc4IDE4LjgxMzY2NzcsMS4zMDMxNDUzMSBDMTguNzc1ODk2NCwwLjU3NDY2Mjg0MSAxOC4xNzU1NjE2LDAuMDAyNjA2MDI4ODEgMTcuNDQ2MTA1MywwIEMxNy4zOTgxMDUzLDAgMTcuMzQ4ODQyMSwwLjAwMjg0MjEwNTI2IDE3LjMwMDUyNjMsMC4wMDcyNjMxNTc4OSBDMTYuNzIyNjg1LDAuMDY5NjY3Mjg5NyAxNi4yNDYxNDY5LDAuNDg3OTY0Njc4IDE2LjEwOTM2ODQsMS4wNTI4NDIxMSBDMTYuMDczMzkwNSwxLjIwNTU0OTM2IDE2LjA2MzI1MDEsMS4zNjMyMDUxIDE2LjA3OTM2ODQsMS41MTkyNjMxNiBDMTYuMTUyMDgwOCwyLjIxNzQwOTM2IDE2Ljc0MDA3ODEsMi43NDgwMzc3MyAxNy40NDIsMi43NDg5NDczNyIgaWQ9IlNoYXBlIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgICAgICA8cGF0aCBkPSJNNi41NzMxNTc4OSwxMi4zNzg5NDc0IEM2LjQ2NDgxMzU2LDEyLjI3NjY3NDcgNi4zMTQwMzQ3NCwxMi4yMzI0OTAyIDYuMTY3NjI2NTcsMTIuMjYwMTA5NyBDNi4wMjEyMTg0LDEyLjI4NzcyOTEgNS44OTY5MDAyMSwxMi4zODM4MDk5IDUuODMzMjYzMTYsMTIuNTE4NTI2MyBDNS43ODI0NDI1NSwxMi42MzEwNTY1IDUuNzc3NTcwMjQsMTIuNzU4OTgyOSA1LjgxOTY4NDIxLDEyLjg3NTA1MjYgQzUuODU5NjkyMzMsMTIuOTkxODM0MSA1Ljk0NTA2ODE3LDEzLjA4NzU2ODkgNi4wNTY1MjYzMiwxMy4xNDA2MzE2IEM2LjExNzU1ODAxLDEzLjE2OTc2NTggNi4xODQzNzE1MiwxMy4xODQ3NjkyIDYuMjUyLDEzLjE4NDUyNjMgQzYuNDQzNDMxOTMsMTMuMTg1MjUyNyA2LjYxNTg0MzA5LDEzLjA2ODg1NyA2LjY4NjczNTI4LDEyLjg5MTAzNCBDNi43NTc2Mjc0NiwxMi43MTMyMTEgNi43MTI1ODM5NCwxMi41MTAxMjMyIDYuNTczMTU3ODksMTIuMzc4OTQ3NCIgaWQ9IlNoYXBlIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgICAgICA8cGF0aCBkPSJNNi4wNzg5NDczNywxMy41NDQ4NDIxIEM1Ljc4NzI4OTQsMTMuNDgyOTgwOSA1LjUwMDUyNDEyLDEzLjY2ODYyODggNS40Mzc1Nzk1NiwxMy45NjAwNTQ5IEM1LjM3NDYzNSwxNC4yNTE0ODEgNS41NTkyMTYwOCwxNC41Mzg5MzQyIDUuODUwNDA2MjUsMTQuNjAyOTYxMiBDNi4xNDE1OTY0MywxNC42NjY5ODgyIDYuNDI5NzMzNDgsMTQuNDgzNDc2NiA2LjQ5NDg0MjExLDE0LjE5MjUyNjMgTDYuNDk0ODQyMTEsMTQuMTg5MDUyNiBDNi41NjAwMDYzOSwxMy44OTk4OTg5IDYuMzc4NDk1OTYsMTMuNjEyNjQ4OCA2LjA4OTM2ODQyLDEzLjU0NzM2ODQgTDYuMDc4NjMxNTgsMTMuNTQ1MTU3OSIgaWQ9IlNoYXBlIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgICAgICA8cGF0aCBkPSJNNi4wMTAxMDUyNiwxNi4zMzczNjg0IEM2LjI2NTc3OTM0LDE2LjMzMTczMDggNi40OTI4MTkxNywxNi4xNzI0NjcgNi41ODUxNTU5LDE1LjkzMzk4MjQgQzYuNjc3NDkyNjQsMTUuNjk1NDk3NyA2LjYxNjg5OTM5LDE1LjQyNDg2NzkgNi40MzE2ODQyMSwxNS4yNDg1MjYzIEM2LjMxNjY5NjA0LDE1LjEzNzc5NyA2LjE2MzQyMzM0LDE1LjA3NTY5NjEgNi4wMDM3ODk0NywxNS4wNzUxNTc5IEM1LjgzMTAyMDk1LDE1LjA3Mzg2NTMgNS42NjUxOTgzLDE1LjE0MzA5MTEgNS41NDQ2MzE1OCwxNS4yNjY4NDIxIEM1LjQyODE4MTgsMTUuMzg2ODc3NSA1LjM2NDkwNjgxLDE1LjU0ODcwNjcgNS4zNjkwNTI2MywxNS43MTU4OTQ3IEM1LjM3NTY4NDIxLDE2LjA0Njg0MjEgNS42NzIyMTA1MywxNi4zMzcwNTI2IDYuMDAwNjMxNTgsMTYuMzM3MDUyNiBMNi4wMTAxMDUyNiwxNi4zMzczNjg0IFoiIGlkPSJTaGFwZSIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+ICAgICAgICAgICAgPHBhdGggZD0iTTYuNDc4NzM2ODQsMTguMzAxODk0NyBDNi41MzM5OTA0NiwxOC4zMDIyMzAyIDYuNTg5MDYyODgsMTguMjk1NTQ1MSA2LjY0MjYzMTU4LDE4LjI4MiBDNy4wMDI3MjA1OSwxOC4xOTEwNTQ3IDcuMjM4NzM2OCwxNy44NDYyMDU3IDcuMTkzMTU0NzgsMTcuNDc3NjE3MyBDNy4xNDc1NzI3NiwxNy4xMDkwMjg5IDYuODM0NjU5MDUsMTYuODMyMDY0MSA2LjQ2MzI2MzE2LDE2LjgzMTU3ODkgQzYuNDAyODQ3NDgsMTYuODMxMzkzNCA2LjM0MjY2MjM0LDE2LjgzOTAzNTkgNi4yODQyMTA1MywxNi44NTQzMTU4IEM1Ljg5MDQ4Njg3LDE2Ljk1MzkzMDcgNS42NTE2MzQ0OSwxNy4zNTMzODM0IDUuNzUwMjEwNTMsMTcuNzQ3MzY4NCBDNS44MzA0MjEwNSwxOC4wNjMxNTc5IDYuMTQzMDUyNjMsMTguMzAyODQyMSA2LjQ3ODczNjg0LDE4LjMwMjg0MjEiIGlkPSJTaGFwZSIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+ICAgICAgICAgICAgPHBhdGggZD0iTTcuODc4OTQ3MzcsMjAuMzQ0NDIxMSBDOC4yMjYzMjQ2LDIwLjE2NzgyMDMgOC40MTEyODgyNCwxOS43Nzk0OTM2IDguMzI5NTA3NiwxOS4zOTg0ODA5IEM4LjI0NzcyNjk2LDE5LjAxNzQ2ODEgNy45MTk2OTYxNywxOC43MzkyNTA3IDcuNTMwNDQ0NDgsMTguNzIwNzYgQzcuMTQxMTkyNzksMTguNzAyMjY5NCA2Ljc4ODI2NjI2LDE4Ljk0ODEzOTMgNi42NzA3MzY4NCwxOS4zMTk2ODQyIEM2LjYwMDY0OTMsMTkuNTM0OTE4NSA2LjYxOTg3NTgsMTkuNzY5Mjc3IDYuNzI0MTA1MjYsMTkuOTcwMjEwNSBDNi44NzU3ODUzLDIwLjI1NzcxMTkgNy4xNzQ5NDY4OSwyMC40MzY4MTkyIDcuNSwyMC40MzQ3MzY4IEM3LjYzMTYzNDE0LDIwLjQzNTI2MDIgNy43NjE1MTE2MywyMC40MDQ1MjI1IDcuODc4OTQ3MzcsMjAuMzQ1MDUyNiIgaWQ9IlNoYXBlIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgICAgICA8cGF0aCBkPSJNOS45NTc3ODk0NywyMC45Njg0MjExIEM5LjkzMzk3Nzc2LDIwLjkzOTU1MTUgOS45MDg0NTgzOSwyMC45MTIxMzQgOS44ODEzNjg0MiwyMC44ODYzMTU4IEM5LjU1MzYyMTMxLDIwLjU3NzYxNiA5LjA2MDE4MTIxLDIwLjUyNTUxOTkgOC42NzUxOTUyNiwyMC43NTg5NzEzIEM4LjI5MDIwOTMxLDIwLjk5MjQyMjcgOC4xMDgyODY1OCwyMS40NTQwNTE3IDguMjMwNTAwMzMsMjEuODg3Mzg0NyBDOC4zNTI3MTQwOCwyMi4zMjA3MTc4IDguNzQ5MDMwNjYsMjIuNjE5MjY0NyA5LjE5OTI2MzE2LDIyLjYxNzE1NzkgQzkuNDMyNDc1MzEsMjIuNjE3MTEwOSA5LjY1ODE3NDQ4LDIyLjUzNDY4MjYgOS44MzY1MjYzMiwyMi4zODQ0MjExIEMxMC4yNTgwODYsMjIuMDI1MzY4OSAxMC4zMTIxNjE4LDIxLjM5MzkyMjMgOS45NTc3ODk0NywyMC45Njg0MjExIiBpZD0iU2hhcGUiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPiAgICAgICAgICAgIDxwYXRoIGQ9Ik04LjEyOTM2ODQyLDExLjg3MzY4NDIgQzguMDkyNTM4NzYsMTEuODY1NzA3NiA4LjA1NDk0NjEyLDExLjg2MTc4OTUgOC4wMTcyNjMxNiwxMS44NjIgQzcuNzI3MjI1MTIsMTEuODU5NTI2NiA3LjQ4NjA1MzYyLDEyLjA4NDYzMDMgNy40Njg1NTU0MiwxMi4zNzQxNTA2IEM3LjQ1MTA1NzIyLDEyLjY2MzY3MDkgNy42NjMzNjIzNiwxMi45MTYxODIxIDcuOTUxNTg3MDgsMTIuOTQ4NjU4MSBDOC4yMzk4MTE4LDEyLjk4MTEzNDEgOC41MDI5ODQyNSwxMi43ODIxOTc5IDguNTUwMzUwODYsMTIuNDk2MDQzIEM4LjU5NzcxNzQ2LDEyLjIwOTg4ODIgOC40MTI2ODQ1OSwxMS45MzY3NjE1IDguMTI5MzY4NDIsMTEuODc0NjMxNiIgaWQ9IlNoYXBlIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgICAgICA8cGF0aCBkPSJNOC4wNjE3ODk0NywxNC42NjgxMDUzIEM4LjMxNjMyNzkyLDE0LjY2MDA1MTQgOC41NDEyOTY2NiwxNC41MDAzNTQxIDguNjMyODY0MDksMTQuMjYyNzE5NyBDOC43MjQ0MzE1MiwxNC4wMjUwODUzIDguNjY0NzkyODksMTMuNzU1NzIwNSA4LjQ4MTQ3MzY4LDEzLjU3ODk0NzQgQzguMzY3MjYwMSwxMy40NjkxODYxIDguMjE1MTQxNDgsMTMuNDA3NjYgOC4wNTY3MzY4NCwxMy40MDcxNTc5IEw4LjAzNDMxNTc5LDEzLjQwNzE1NzkgQzcuODY4MDczODEsMTMuNDA4NTY3MyA3LjcwOTQwMzAzLDEzLjQ3Njg2MTggNy41OTQxMDUyNiwxMy41OTY2MzE2IEM3LjQ3ODIwMDUzLDEzLjcxODAzOTMgNy40MTUwNzQ1MywxMy44ODAzOTU3IDcuNDE4NTI2MzIsMTQuMDQ4MjEwNSBDNy40MjU0NzM2OCwxNC4zODQyMTA1IDcuNzE4MjEwNTMsMTQuNjY3Nzg5NSA4LjA1NjczNjg0LDE0LjY2Nzc4OTUgTDguMDYxNzg5NDcsMTQuNjY4MTA1MyBaIiBpZD0iU2hhcGUiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPiAgICAgICAgICAgIDxwYXRoIGQ9Ik03Ljg4MTc4OTQ3LDE1LjUyMTM2ODQgQzcuNzgxNzkwMjIsMTUuNjg4MzExMiA3Ljc1MjU3NTQ1LDE1Ljg4ODI2NzYgNy44MDA2MzE1OCwxNi4wNzY4NDIxIEM3Ljg3OTI2MzE2LDE2LjM5MjYzMTYgOC4xOTA5NDczNywxNi42MzI2MzE2IDguNTI2OTQ3MzcsMTYuNjMyNjMxNiBDOC41ODI0NjMyMywxNi42MzI1NjAxIDguNjM3NzQ2MDcsMTYuNjI1NDUwOCA4LjY5MTQ3MzY4LDE2LjYxMTQ3MzcgQzguOTkzODc5NzEsMTYuNTM1Mjk4MiA5LjIxNTMxOTYzLDE2LjI3NjYxNyA5LjI0Mzk1MTM5LDE1Ljk2NjA4MTUgQzkuMjcyNTgzMTUsMTUuNjU1NTQ1OSA5LjEwMjE3NTgyLDE1LjM2MDczNTkgOC44MTg3OTY1NCwxNS4yMzA1NTAzIEM4LjUzNTQxNzI2LDE1LjEwMDM2NDcgOC4yMDA3MzYwOCwxNS4xNjMxMzUgNy45ODM3ODk0NywxNS4zODcxNTc5IEM3Ljk0NDY5NTYsMTUuNDI3Nzg0MiA3LjkxMDQ2NTExLDE1LjQ3MjgyNDMgNy44ODE3ODk0NywxNS41MjEzNjg0IiBpZD0iU2hhcGUiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPiAgICAgICAgICAgIDxwYXRoIGQ9Ik04LjcyMTE1Nzg5LDE3LjY0Njk0NzQgQzguNjUxNTAwNzEsMTcuODYyNDg5MSA4LjY3MDQ3NTQ3LDE4LjA5Njg4OTkgOC43NzM4OTQ3NCwxOC4yOTg0MjExIEM4LjkyNTQ1NzQ2LDE4LjU4NjExNTkgOS4yMjQ2MTg3LDE4Ljc2NTQ2NjYgOS41NDk3ODk0NywxOC43NjM1Nzg5IEM5LjY4MDEwNjUxLDE4Ljc2MzU4NDcgOS44MDg2NDMxMSwxOC43MzMzMTU0IDkuOTI1MjYzMTYsMTguNjc1MTU3OSBDMTAuMzQ1NTg0MiwxOC40NTcyMzIxIDEwLjUxMTYyNzUsMTcuOTQxMjAxMiAxMC4yOTcyNjMyLDE3LjUxOTA1MjYgQzEwLjI1MzY5MzcsMTcuNDMxNzI3MiAxMC4xOTUxMTg5LDE3LjM1MjczNjcgMTAuMTI0MjEwNSwxNy4yODU2ODQyIEM5Ljk2NTUyNzY1LDE3LjEzNDk5MDkgOS43NTQ3MjY2NiwxNy4wNTE0ODUyIDkuNTM1ODk0NzQsMTcuMDUyNjMxNiBDOS40MDA5MjQ2OCwxNy4wNTI5NDIgOS4yNjc5MDE2NCwxNy4wODQ4NDU5IDkuMTQ3NDczNjgsMTcuMTQ1Nzg5NSBDOC45NDM0ODM4NSwxNy4yNDg2NzkgOC43ODk3MzY1NiwxNy40Mjk2NDUzIDguNzIxMTU3ODksMTcuNjQ3NTc4OSIgaWQ9IlNoYXBlIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgICAgICA8cGF0aCBkPSJNMTIuMDA3ODk0NywxOS4yOTk0NzM3IEMxMS45ODI5NjY5LDE5LjI2OTQ5OTQgMTEuOTU2NTEwNywxOS4yNDA4Mjk4IDExLjkyODYzMTYsMTkuMjEzNTc4OSBDMTEuNzQzNTg5MSwxOS4wMzczMDc1IDExLjQ5NzY2NzUsMTguOTM5MjMyOSAxMS4yNDIxMDUzLDE4LjkzOTc4OTUgQzEwLjg1MjE2NDcsMTguOTQwNDgwNCAxMC40OTc5NDgzLDE5LjE2NzA1MzMgMTAuMzMzODE5MywxOS41MjA3NzAzIEMxMC4xNjk2OTAyLDE5Ljg3NDQ4NzQgMTAuMjI1Mzg0NiwyMC4yOTEyNjM5IDEwLjQ3NjYzMTYsMjAuNTg5NDczNyBDMTAuNjY1MTM0NiwyMC44MTY4MDUzIDEwLjk0NTIwNzksMjAuOTQ4MjE2MyAxMS4yNDA1MjYzLDIwLjk0Nzg5NDcgQzExLjQ3NjI0ODgsMjAuOTQ3NTMyOSAxMS43MDQ1NjU0LDIwLjg2NTUxMyAxMS44ODY2MzE2LDIwLjcxNTc4OTUgQzEyLjMwOTg5NzUsMjAuMzU4MDE0MSAxMi4zNjQxMTcxLDE5LjcyNTMxMDYgMTIuMDA3ODk0NywxOS4zMDA3MzY4IiBpZD0iU2hhcGUiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNC41NDQ5NDc0LDIwLjk3NzI2MzIgQzE0LjUxMDgyMDUsMjAuOTQ0ODE1NiAxNC40NzQ4NjcxLDIwLjkxNDM0NDkgMTQuNDM3MjYzMiwyMC44ODYgQzE0LjIzNDgzODEsMjAuNzMyMTc3NCAxMy45ODc2MDcxLDIwLjY0ODg3OTcgMTMuNzMzMzY4NCwyMC42NDg4NDIxIEMxMy42NzcxMTc4LDIwLjY0ODQ2ODQgMTMuNjIwOTMwNywyMC42NTI2OTMgMTMuNTY1MzY4NCwyMC42NjE0NzM3IEMxMy4wMjQ0MjQ1LDIwLjczODYxMDkgMTIuNjA4MzA4LDIxLjE3ODkwMjggMTIuNTYxODA5OCwyMS43MjMzMzY3IEMxMi41MTUzMTE1LDIyLjI2Nzc3MDcgMTIuODUwNzM4NCwyMi43NzIyNDk0IDEzLjM3MDc2NzIsMjIuOTQwMDAwNiBDMTMuODkwNzk2LDIzLjEwNzc1MTggMTQuNDU3Nzg4OCwyMi44OTQzNzYzIDE0LjczODE5NzksMjIuNDI1Mzk3NCBDMTUuMDE4NjA3LDIxLjk1NjQxODYgMTQuOTM4MjE1NSwyMS4zNTU5NjI4IDE0LjU0NDMxNTgsMjAuOTc3MjYzMiIgaWQ9IlNoYXBlIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgICAgICA8cGF0aCBkPSJNOS45NjU2ODQyMSwxMi4yMDg0MjExIEMxMC4yMjA4NTE2LDEyLjIwMjA3MDggMTAuNDQ3MjgxMywxMi4wNDMxOTg1IDEwLjU0MDA2NCwxMS44MDU0MTI3IEMxMC42MzI4NDY2LDExLjU2NzYyNjkgMTAuNTczODU1LDExLjI5NzM4NDcgMTAuMzkwNDIxMSwxMS4xMTk4OTQ3IEMxMC4yNzAzNTQ3LDExLjAwNjU2MzIgMTAuMTExMjA3OCwxMC45NDM4OTk4IDkuOTQ2MTA1MjYsMTAuOTQ0OTQ3NCBDOS43Nzg0MjI4MSwxMC45NDgwOTggOS42MTg4Nzg4MiwxMS4wMTc4MTI4IDkuNTAyNjUxNTMsMTEuMTM4NzE5OSBDOS4zODY0MjQyNCwxMS4yNTk2MjcxIDkuMzIzMDU4NjIsMTEuNDIxNzk3NSA5LjMyNjUyNjMyLDExLjU4OTQ3MzcgQzkuMzMyODQyMTEsMTEuOTE5Nzg5NSA5LjYyNDYzMTU4LDEyLjIwOTY4NDIgOS45NTIxMDUyNiwxMi4yMDk2ODQyIEw5Ljk2NTY4NDIxLDEyLjIwODQyMTEgWiIgaWQ9IlNoYXBlIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgICAgICA8cGF0aCBkPSJNOS43MDkyNjMxNiwxMy42MTc0NzM3IEM5Ljc4NzU3ODk1LDEzLjkzMzI2MzIgMTAuMDk5NTc4OSwxNC4xNzM4OTQ3IDEwLjQzNTU3ODksMTQuMTczODk0NyBDMTAuNDkwMzQwNiwxNC4xNzM5MDM5IDEwLjU0NDkxNzYsMTQuMTY3NTQ1NCAxMC41OTgyMTA1LDE0LjE1NDk0NzQgQzEwLjk5MzIzNTEsMTQuMDU3NDQ4NiAxMS4yMzQ0MzI4LDEzLjY1ODE4NTcgMTEuMTM2OTQ3NCwxMy4yNjMxNTc5IEMxMS4xMDE1ODcsMTMuMTI4MDggMTEuMDI5ODIxLDEzLjAwNTMwMjMgMTAuOTI5NDczNywxMi45MDgyMTA1IEMxMC43OTM0OTksMTIuNzc3OTI2MSAxMC42MTI1MjcsMTIuNzA1MDg0OSAxMC40MjQyMTA1LDEyLjcwNDg0MjEgQzEwLjM2MzQ4MjksMTIuNzA0NjU2MSAxMC4zMDI5ODQ1LDEyLjcxMjI5OCAxMC4yNDQyMTA1LDEyLjcyNzU3ODkgQzkuODUxNjI5MzUsMTIuODI3NjQ2OSA5LjYxMzQwODk4LDEzLjIyNTgwOTIgOS43MTA4NDIxMSwxMy42MTkwNTI2IiBpZD0iU2hhcGUiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMC42ODI4NDIxLDE1Ljg0Mjg0MjEgQzEwLjgzNTMwNCwxNi4xMjkwNTE0IDExLjEzMzgyNTMsMTYuMzA3MTkxNCAxMS40NTgxMDUzLDE2LjMwNTQ3MzcgQzExLjU4Nzk0NjIsMTYuMzA1NjQyMSAxMS43MTU5NzYsMTYuMjc1MDE0NSAxMS44MzE2ODQyLDE2LjIxNjEwNTMgQzEyLjI1NDczNDMsMTYuMDAyMjc2MyAxMi40MjQzNTIzLDE1LjQ4NTk5MTUgMTIuMjEwNTQyOSwxNS4wNjI5MzE1IEMxMS45OTY3MzM2LDE0LjYzOTg3MTUgMTEuNDgwNDU2NywxNC40NzAyMjk2IDExLjA1NzM4NjgsMTQuNjg0MDE5MyBDMTAuNjM0MzE2OSwxNC44OTc4MDkgMTAuNDY0NjUxLDE1LjQxNDA3ODEgMTAuNjc4NDIxMSwxNS44MzcxNTc5IEMxMC42NzkxMzUyLDE1LjgzODkwMzEgMTAuNjc5OTc5NywxNS44NDA1OTIxIDEwLjY4MDk0NzQsMTUuODQyMjEwNSIgaWQ9IlNoYXBlIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgICAgICA8cGF0aCBkPSJNMTIuMzg0NjMxNiwxOC4xMzI2MzE2IEMxMi41NzM1MDUsMTguMzU5NDA1NSAxMi44NTMzOTk5LDE4LjQ5MDUwMTUgMTMuMTQ4NTI2MywxOC40OTA0MjExIEMxMy41MzkwMjIsMTguNDkwNDM5OCAxMy44OTQxNjU2LDE4LjI2NDIyNDMgMTQuMDU5MjMwMSwxNy45MTAzMzA4IEMxNC4yMjQyOTQ2LDE3LjU1NjQzNzQgMTQuMTY5MzgzOCwxNy4xMzg5NjI1IDEzLjkxODQyMTEsMTYuODM5Nzg5NSBDMTMuODk0NTg5NCwxNi44MTE1MzQ5IDEzLjg2OTA2OTEsMTYuNzg0NzQ5IDEzLjg0MiwxNi43NTk1Nzg5IEMxMy40NzM2OTI4LDE2LjQwNDk2OTUgMTIuODk2NzA4OSwxNi4zODY4MTk0IDEyLjUwNjg0MjEsMTYuNzE3NTc4OSBDMTIuMDg1NTk4NiwxNy4wNzYyNzM1IDEyLjAzMTEyMzksMTcuNzA3MDI1OSAxMi4zODQ2MzE2LDE4LjEzMjYzMTYiIGlkPSJTaGFwZSIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+ICAgICAgICAgICAgPHBhdGggZD0iTTE2LjU3ODk0NzQsMjAuMDcwMzE1OCBDMTYuOTQ4Mjg2MywxOS41NzU0MTA3IDE2Ljg3MDQ2OSwxOC44Nzg4NjkzIDE2LjQwMTAxODIsMTguNDc3NjczNCBDMTUuOTMxNTY3MywxOC4wNzY0Nzc1IDE1LjIzMTQwODgsMTguMTA4MTU1NiAxNC44MDAxMDUzLDE4LjU1MDEwNTMgQzE0Ljc2NzMxMjUsMTguNTg0MDA5MSAxNC43MzY3MjM2LDE4LjYxOTk3NzQgMTQuNzA4NTI2MywxOC42NTc3ODk1IEMxNC40NDUyNDI5LDE5LjAxMzk4ODEgMTQuNDAzNTkyLDE5LjQ4NzYyMzMgMTQuNjAwNjY4LDE5Ljg4NDMwNTMgQzE0Ljc5Nzc0NCwyMC4yODA5ODczIDE1LjIwMDM1NTgsMjAuNTMzOTA3OSAxNS42NDMyNjMyLDIwLjUzOTI2MzIgQzE1LjY5NzY1OTUsMjAuNTM5MjA5IDE1Ljc1MTk5MTMsMjAuNTM1NTE2NiAxNS44MDU4OTQ3LDIwLjUyODIxMDUgQzE2LjExNTEwMDQsMjAuNDg1OTkyMiAxNi4zOTQyMzY5LDIwLjMyMDkyMzcgMTYuNTgwMjEwNSwyMC4wNzAzMTU4IiBpZD0iU2hhcGUiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xOS45NDExNTc5LDE5Ljg1OTY4NDIgQzE5LjgyNzM1NTYsMTkuNzUxNjU3MyAxOS42OTYwMDkxLDE5LjY2Mzc3MjcgMTkuNTUyNzM2OCwxOS41OTk3ODk1IEMxOS4zNzg5NTQzLDE5LjUyMTgwOTUgMTkuMTkwNTgxMywxOS40ODE2NTkxIDE5LjAwMDEwNTMsMTkuNDgyIEMxOC40Mzc2MjQ2LDE5LjQ4MjMwOTcgMTcuOTMyMDAwNywxOS44MjUwNCAxNy43MjMzODg0LDIwLjM0NzQwNTMgQzE3LjUxNDc3NiwyMC44Njk3NzA2IDE3LjY0NTIwOTQsMjEuNDY2NTE3NCAxOC4wNTI3MzY4LDIxLjg1NDIxMDUgQzE4LjE2NjkyNjMsMjEuOTYyMjgwOSAxOC4yOTg1NzI2LDIyLjA1MDI1ODYgMTguNDQyMTA1MywyMi4xMTQ0MjExIEMxOC42MTU3MDM2LDIyLjE5MTg3MDIgMTguODAzNjk4MiwyMi4yMzE3OTM1IDE4Ljk5Mzc4OTUsMjIuMjMxNTc4OSBDMTkuNTU2MDY3MiwyMi4yMzAzODc2IDIwLjA2MTEyNDEsMjEuODg3NDEyNiAyMC4yNjk1ODk4LDIxLjM2NTIwNiBDMjAuNDc4MDU1NCwyMC44NDI5OTk1IDIwLjM0ODAzNzYsMjAuMjQ2NTAxNiAxOS45NDExNTc5LDE5Ljg1ODQyMTEiIGlkPSJTaGFwZSIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+ICAgICAgICA8L2c+ICAgIDwvZz48L3N2Zz4=');
    }
    &--mkr {
      background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSI0MnB4IiBoZWlnaHQ9IjQycHgiIHZpZXdCb3g9IjAgMCA0MiA0MiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4gICAgICAgIDx0aXRsZT5BcnRib2FyZCA1PC90aXRsZT4gICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaCBCZXRhLjwvZGVzYz4gICAgPGRlZnM+PC9kZWZzPiAgICA8ZyBpZD0iQXJ0Ym9hcmQtNSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+ICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsLTIiIGZpbGw9IiM1NDY4NzgiIGN4PSIyMSIgY3k9IjIxIiByPSIyMSI+PC9jaXJjbGU+ICAgICAgICA8ZyBpZD0iTWFrZXIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDkuMDAwMDAwLCAxNC4wMDAwMDApIj4gICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlLXBhdGgiIGZpbGwtb3BhY2l0eT0iMCIgZmlsbD0iIzAwMDAwMCIgZmlsbC1ydWxlPSJub256ZXJvIiB4PSIwLjkyNTkyNTkyNiIgeT0iMCIgd2lkdGg9IjIyLjIyMjIyMjIiIGhlaWdodD0iMTIuMDM3MDM3Ij48L3JlY3Q+ICAgICAgICAgICAgPHBhdGggZD0iTTExLjExMTExMTEsMTIuMDM3MDM3IEwxMS4xMTExMTExLDYuNTc0OTc3OTYgQzExLjExMTExMTEsNi4xMTgwMTM3NiAxMC44NjQ2OTA5LDUuNjk0NTAxMzggMTAuNDYxODA0OCw1LjQ1OTAzMDA4IEwyLjg2NjgwOTksMS4wMjAwMzExOSBDMi40MjAzOCwwLjc1OTEwOTY5MiAxLjg1MTg1MTg1LDEuMDcxNjU0MjcgMS44NTE4NTE4NSwxLjU3ODAwMTg3IEwxLjg1MTg1MTg1LDEyLjAzNzAzNyIgaWQ9IlNoYXBlIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMi4yIj48L3BhdGg+ICAgICAgICAgICAgPHBhdGggZD0iTTEzLjg4ODg4ODksMTIuMDM3MDM3IEwxMy44ODg4ODg5LDYuNTc0OTc3OTYgQzEzLjg4ODg4ODksNi4xMTgwMTM3NiAxNC4xMzUzMTA0LDUuNjk0NTAxMzggMTQuNTM4MTk4NSw1LjQ1OTAzMDA4IEwyMi4xMzMxOTE3LDEuMDIwMDMxMTkgQzIyLjU3OTYxNzEsMC43NTkxMDk2OTIgMjMuMTQ4MTQ4MSwxLjA3MTY1NDI3IDIzLjE0ODE0ODEsMS41NzgwMDE4NyBMMjMuMTQ4MTQ4MSwxMi4wMzcwMzciIGlkPSJTaGFwZSIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIuMiI+PC9wYXRoPiAgICAgICAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGUtcGF0aCIgZmlsbC1vcGFjaXR5PSIwIiBmaWxsPSIjMDAwMDAwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHg9IjAuOTI1OTI1OTI2IiB5PSIxMS4xMTExMTExIiB3aWR0aD0iMjIuMjIyMjIyMiIgaGVpZ2h0PSIxLjg1MTg1MTg1Ij48L3JlY3Q+ICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZS1wYXRoIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHg9IjAuNzUiIHk9IjExIiB3aWR0aD0iMi4yIiBoZWlnaHQ9IjIuMiIgcng9IjEuMSI+PC9yZWN0PiAgICAgICAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGUtcGF0aCIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJub256ZXJvIiB4PSIxMi43OSIgeT0iMTEiIHdpZHRoPSIyLjIiIGhlaWdodD0iMi4yIiByeD0iMS4xIj48L3JlY3Q+ICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZS1wYXRoIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHg9IjIyLjA1IiB5PSIxMSIgd2lkdGg9IjIuMiIgaGVpZ2h0PSIyLjIiIHJ4PSIxLjEiPjwvcmVjdD4gICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlLXBhdGgiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgeD0iMTAuMDEiIHk9IjExIiB3aWR0aD0iMi4yIiBoZWlnaHQ9IjIuMiIgcng9IjEuMSI+PC9yZWN0PiAgICAgICAgPC9nPiAgICA8L2c+PC9zdmc+');
    }
    &--ont {
      background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSI0MnB4IiBoZWlnaHQ9IjQycHgiIHZpZXdCb3g9IjAgMCA0MiA0MiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4gICAgICAgIDx0aXRsZT5BcnRib2FyZCA1PC90aXRsZT4gICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaCBCZXRhLjwvZGVzYz4gICAgPGRlZnM+PC9kZWZzPiAgICA8ZyBpZD0iQXJ0Ym9hcmQtNSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+ICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsLTIiIGZpbGw9IiM0MmE0YmUiIGN4PSIyMSIgY3k9IjIxIiByPSIyMSI+PC9jaXJjbGU+ICAgICAgICA8ZyBpZD0ib250b2xvZ3kiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDkuMDAwMDAwLCAxMC4wMDAwMDApIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPiAgICAgICAgICAgIDxwYXRoIGQ9Ik00LjQzNDQ1NDAzLDMuNDgyOTc1NDIgTDIzLjk4MjA5MzIsMjIuOTIwNTA3NSBMMjMuOTI0MTAxOSwxMy43OTEwMzU4IEwyMy45MTg4ODU1LDEzLjc5MTAzNTggQzI0LjIyMjUzMDQsOS43Mjk0MDI0OCAyMy40MjA5MjkzLDYuMzMzMzE1MjkgMjAuNzIyMDU3LDMuNjAzOTc0NDEgQzE2LjI0MDY1MSwtMC45MTg5NjAwNTUgOC45MTgwMjYzLC0xLjAzNjQyNDgxIDQuNDM0NDYxNywzLjQ4Mjk3MjE0IEw0LjQzNDQ1NDAzLDMuNDgyOTc1NDIgWiIgaWQ9InBhdGg0MjM0Ij48L3BhdGg+ICAgICAgICAgICAgPHBhdGggZD0iTTE5LjYwMjUwNjMsMTkuNTc0MDgxOCBMMC4xMTczMjg1NDgsMC4xMTk2MDQxNTcgTDAuMTE3MzI4NTQ4LDkuMjAzOTA4NzEgTDAuMTIyNTk5NzgxLDkuMjAzOTA1NDMgQy0wLjAwNjQ3MzA5NTg5LDEzLjI3OTQ1NjQgMC41MjUxNzczMTUsMTYuNjc4MzExNCAzLjI0ODc2MzA3LDE5LjM5NzQyNjkgQzcuNzcxMjAyNTIsMjMuOTAzNDE5NCAxNS4wNzc4NzczLDI0LjA3NjU1MzkgMTkuNjAyNDk5NywxOS41NzQwOTA2IEwxOS42MDI1MDYzLDE5LjU3NDA4MTggWiIgaWQ9InBhdGg0MjYzIj48L3BhdGg+ICAgICAgICA8L2c+ICAgIDwvZz48L3N2Zz4=');
    }
    &--etc {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMjYuOCIgaGVpZ2h0PSIyMjYuOCIgdmlld0JveD0iMCAwIDIyNi44IDIyNi44Ij48cGF0aCBmaWxsPSIjNDY5YjQxIiBkPSJNMTEzLjQgMEM1MC44IDAgMCA1MC44IDAgMTEzLjQgMCAxNzYgNTAuOCAyMjYuOCAxMTMuNCAyMjYuOFMyMjYuOCAxNzYgMjI2LjggMTEzLjRDMjI2LjggNTAuOCAxNzYgMCAxMTMuNCAwem0uMyAzOC4ybDQzIDY3LjgtNDMtMTkuMi00NC4zIDE4LjcgNDQuMy02Ny4zek0xMTQgOTZsNDQuOSAyMC00NC45IDI1LjEtNDYuMi0yNS42TDExNCA5NnptLjIgOTIuNmwtNDQuNy02Mi4zIDQ0LjMgMjUuNiA0NS4xLTI1LjYtNDQuNyA2Mi4zeiIvPjwvc3ZnPg==');
    }
    &--bsv {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiIHZpZXdCb3g9IjAgMCAzMiAzMiIgc3R5bGU9Ii1tcy10cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpOyAtd2Via2l0LXRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7IHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7Ij48cGF0aCBkPSJNMTYgMzJDNy4xNjMgMzIgMCAyNC44MzcgMCAxNlM3LjE2MyAwIDE2IDBzMTYgNy4xNjMgMTYgMTYtNy4xNjMgMTYtMTYgMTZ6bTYuMTUtMTcuNDNhLjA5LjA5IDAgMDAtLjA4LjA1di0uNDRsLS4xMS4wNmMtLjA3LjA3LS4wNy4wOC0uMDcuMTl2LjgyYS43LjcgMCAwMDAgLjI0LjcyLjcyIDAgMDEtLjA5LjRsLS4xOC4xMmgtLjA5YS4xOC4xOCAwIDAxMC0uMDl2LS4zM2gtLjA3YS40OS40OSAwIDAwLS4wOS4xNCAxLjEgMS4xIDAgMDAtLjE0LjU0Yy0uMDI0LjE1LS4wMjQuMyAwIC40NWEuNjEuNjEgMCAwMS0uMTIuNTcuMi4yIDAgMDEtLjEyLjA3LjIxLjIxIDAgMDAtLjE5LjEybC0uMDYuMTNhMS41MyAxLjUzIDAgMDEtLjA5LS4zMXYtLjM4YTEgMSAwIDAwLS4xNy4xNCAzIDMgMCAwMC0uNDUgMS40N2MtLjAyLjEyLS4wMi4yNi0uMjEuMjQtLjE5LS4wMi0uMjguMTUtLjMzLjI0LS4wNS4wOS0uMS4wOS0uMTcgMGEuNTQuNTQgMCAwMTAtLjU3bC4wNy0uMTRhLjM5LjM5IDAgMDAtLjMzLjA3IDIuMyAyLjMgMCAwMC0uNzEuNjRsLS40My42OWEzIDMgMCAwMS0uNTIuNzEgMS4zNyAxLjM3IDAgMDEtMS4yMy4zMyAyLjI1IDIuMjUgMCAwMS0uOTUtLjU0IDQuNjkgNC42OSAwIDAxLS43Ni0xIDMuMzQgMy4zNCAwIDAxLS4zMy0xYy0uMDItLjA3LS4wNSAwLS4xNCAwLS4yNS4xNS0uNTQyLjIxLS44My4xN2ExIDEgMCAwMS0uOC0uNjkuMjQuMjQgMCAwMC0uMDktLjEyYy0uMDctLjA3LS4xNy0uMTItLjI0LS4xOWEuODMuODMgMCAwMS0uMTctLjU0LjM0LjM0IDAgMDEtLjQzLS4yNC44NC44NCAwIDAxMC0uODUuMTQuMTQgMCAwMDAtLjA5Yy0uMTctLjE5LS41LS41Mi0uNS0uNTJ2LS4wOWMuMTUtLjI2LjM0Mi0uNDk0LjU3LS42OWEuMTUuMTUgMCAwMDAtLjE3LjQzLjQzIDAgMDEwLS4zOSAxLjQ0IDEuNDQgMCAwMS4yNC0uMzNsLS4zNS0uMDktMS0uMjFhLjMyLjMyIDAgMDAtLjIxIDAgMy43MiAzLjcyIDAgMDAtLjc4LjcxIDMuNDYgMy40NiAwIDAwLS4yMS4zMXYuMDdsLjEyLS4wNy4xNy0uMThhMy42MSAzLjYxIDAgMDAtLjI2LjM4Yy0uMTkuMzctLjQuNzUtLjU3IDEuMTNhMS4yMyAxLjIzIDAgMDAtLjE3LjY0di4xMmwuMDktLjA5YS43MS43MSAwIDAwLjA5LS4xNiA0LjQxIDQuNDEgMCAwMC0uMTcuNTIgNC42MyA0LjYzIDAgMDAtLjIxIDEuNDljLjAxNy4yMTUuMDgxLjQyNC4xOS42MS4wMi4wOS4xNC4xNC4xNC4wOXYtLjU1Yy4wNzUuMTkzLjEzOC4zOS4xOS41OS4wNDMuMTcuMDczLjM0NS4wOS41Mi4wNy4zNS4xMi43MS4yMSAxLjA2LjA2NC4xNDcuMTUyLjI4Mi4yNi40aC4xOXYtLjE3bC0uMDctLjE0YS41Mi41MiAwIDAxMC0uMzhsLjY0LjcxYS4wOS4wOSAwIDAxMCAuMDdjLjAyNC4zMy4xMTMuNjUzLjI2Ljk1YS44LjggMCAwMC43Ni41aC4xMmMtLjA5LS4wNS0uMDQtLjA0LS4wOS0uMTItLjA1LS4wOC0uMTItLjA5LS4xNy0uMTctLjA1LS4wOC4wNS0uMTcuMTItLjE3YS44NS44NSAwIDAxLjI2LjA5IDcuOCA3LjggMCAwMDEuNDkuODVsLjY5LjI4LjI0LjA5Yy0uMTYuNDUtLjMzLjg4LS40NyAxLjI4LS4xLS4yMS0uMTktLjQ1LS4zMS0uNjZsLS4xNC0uMjhhLjQzLjQzIDAgMDAtLjMxLS4yNCAxIDEgMCAwMS0uNTctLjE0Yy0uMTktLjAyLS40Ny4wNS0uNTQuMjRhLjYuNiAwIDAxLjU5LjEyYy0uMTIuMjYtLjA1LjQzLjE5LjVhLjM4LjM4IDAgMDEuMjguMzVjLjA2LjE3My4wODMuMzU3LjA3LjU0YS41NC41NCAwIDAxLS4zNS0uMjggMS41MSAxLjUxIDAgMDAtLjY2LS42MWMtLjE5LS4xLS40LS4xNC0uNTQuMDdoLS4wOWExLjM0IDEuMzQgMCAwMC0uMzEgMGMtLjIzLjA0LS4zMy4yNi0uNC40N2EuODUuODUgMCAwMS40Ny0uMTRjLjA1IDAgLjA5LjA0LjA5LjA5YS4yMy4yMyAwIDAwLjI2LjE5bC41NC4yMWEuOC44IDAgMDEuNDcuNDVoLS4xNGE0LjU1IDQuNTUgMCAwMC0uNTcgMCAxLjQ5IDEuNDkgMCAwMC0uNzEuMjQuODMuODMgMCAwMC0uNDMuNDMuMzMuMzMgMCAwMDAgLjIxdi4xNGEuNzkuNzkgMCAwMDAgLjI0Ljc1Ljc1IDAgMDAuMjEuMzggMSAxIDAgMDEuMTItLjY0Yy4yOC4xNC4zOC4xMi41OS0uMTJsLjE0LS4xOGEuNjcuNjcgMCAwMS41Mi0uMDdsLjcxLjA5YS4xMi4xMiAwIDAxMCAuMDcgMi4wNyAyLjA3IDAgMDEtLjUuNTIuNjIuNjIgMCAwMC0uMjEuOC40LjQgMCAwMTAgLjE3LjQyLjQyIDAgMDAuMy41MnYtLjM4YS40NS40NSAwIDAwLjU3LS4yNiAyIDIgMCAwMC4xNy0uNWMuMDg1LS4zMDYuMy0uNTU5LjU5LS42OWEuODcuODcgMCAwMC41Mi0uMzVsLjA3LjA5YS43NC43NCAwIDAwLjY5LjRjLjA1IDAgLjA5LjA0LjA5LjA5bC4wNy40OGMuMDUtLjA3LjE3LS4xNC4xNy0uMjFhLjkzLjkzIDAgMDAuMDktLjcxLjExLjExIDAgMDEwLS4xMi4zMi4zMiAwIDAwMC0uMzggMSAxIDAgMDAtLjQ3LS40N2wtLjM4LS4xNy4xNC0uMDcuNDMtLjIxYy4wNSAwIC4wOS0uMDcuMTQgMCAuMDUuMDcuMTIuMTQuMTIuMjFhMS40NSAxLjQ1IDAgMDEtLjA3LjI2aC4xMmEuNzcuNzcgMCAwMC40NS0uNTljLjAyLS4xNC4xLS4yNi4xOS0uMjZzLjE5LS4wNy4yNiAwYS4yNy4yNyAwIDAxLjA3LjI2bC0uMDcuMjFjLjE0LS4wOS4yOC0uMTcuNC0uMjYuMjczLS4xNzguNDYtLjQ2LjUyLS43OGEuNDMuNDMgMCAwMS4yOC0uMjggNS45NCA1Ljk0IDAgMDAuNjQtLjA5IDkuODEgOS44MSAwIDAwMS4xMy0uMjYgNi4yMSA2LjIxIDAgMDAxLjU2LS43MWMuMzYtLjIyLjY5LS40MyAxLS42OWE1LjkgNS45IDAgMDAuNzgtLjc2IDYuOCA2LjggMCAwMC42NC0uOGMuMjI2LS4zNC40My0uNjk0LjYxLTEuMDZhNiA2IDAgMDAuNS0xLjI4IDcuNyA3LjcgMCAwMC4yOC0xLjc3IDEwLjI4IDEwLjI4IDAgMDAwLTEuMjEgMS42IDEuNiAwIDAwMC0uMzNsLjcxLjE5YS44NS44NSAwIDAxLS4xNy4yNC4zOS4zOSAwIDAwLS4xNC40NWMuMDc1LjE3Mi4xNzYuMzMuMy40N2EuNDkuNDkgMCAwMC40LjE3Yy0uMDUtLjA4LjAyIDAtLjEyLS4xNy0uMTQtLjE3LS4xNC0uMTkgMC0uMzFhLjYzLjYzIDAgMDAuMTItLjE0Ljg1Ljg1IDAgMDAuMDktLjI2bC4yMS4wOWExLjEgMS4xIDAgMDEuNTUuNTIuMjYuMjYgMCAwMC4zMy4xN2MuMTItLjAyLjE5IDAgLjE5LjEydi4wNWguMDVhLjI1LjI1IDAgMDAuMTItLjMzYy0uMDctLjE1LS4xNy0uMjktLjI0LS40M2EuODUuODUgMCAwMC0uNjMtLjQzIDMuMjIgMy4yMiAwIDAwLjMzLS4xOS40NC40NCAwIDAxLjQ1IDAgLjE4LjE4IDAgMDAuMjUgMCAuMTMuMTMgMCAwMS4xOCAwbC4xOS4xNGEuMTguMTggMCAwMDAtLjA5LjUuNSAwIDAwLS4xNy0uMzMuMzUuMzUgMCAwMS0uMTItLjE0LjM3LjM3IDAgMDAtLjQzLS4yMSAzLjQyIDMuNDIgMCAwMS0uMzguMDkgMS41MyAxLjUzIDAgMDEuMTktLjIxYy4xNC0uMDkuMjEtLjE0LjE0LS4yOGwuMzMtLjE2YS4zNS4zNSAwIDAwLS4zNS0uMjEuOS45IDAgMDEtLjM1IDAgLjE4LjE4IDAgMDAtLjEyIDBjLS4xMi4wNS0uMTQuMjEtLjE5LjMxYS44Ni44NiAwIDAwLS4xMi4zMWMtLjA5LS4xOS0uMTctLjIxIDAtLjQuMTctLjE5LjE0LS4yOCAwLS40NWEuNC40IDAgMDAwLS40LjM5LjM5IDAgMDAtLjMuMzZoLS4wOWMtLjE5LS4wMy0uMjguMTYtLjI4LjM1LjAxMi4yMi4wMTIuNDQgMCAuNjZoLS4wN2EuNDkuNDkgMCAwMC0uMDktLjE0IDkuMzggOS4zOCAwIDAwLS42OS0uNjkgMS43NSAxLjc1IDAgMDAtLjc2LS40NWMtLjA3IDAtLjA3LS4wOS0uMDctLjA5YTIuMjYgMi4yNiAwIDAwLS40NS0uOCAxLjA4IDEuMDggMCAwMS0uMzEtLjY5YzAtLjA3LS4wOS0uMTItLjA5LS4xOWExLjY3IDEuNjcgMCAwMC0uMDcgMS4xNGMuMDYuMTczLjA4My4zNTcuMDcuNTRhMSAxIDAgMDAtLjIuMTJjLS4wNS4wNS0uMTcuMTktLjE3LjEydi0uMDdhLjMuMyAwIDAwMC0uMTQuMzMuMzMgMCAwMC0uMDctLjA5bC0uMDcuMDdhLjMuMyAwIDAxMCAuMTQgMS43MSAxLjcxIDAgMDAuMDcgMS4wOS40LjQgMCAwMTAgLjI4LjU2LjU2IDAgMDEwIC4xOWMtLjE0LS4wNS0uMTQuMDItLjE0LjA5bC0uMDcuMTR6TTkuODYgMTAuMDFhLjM2LjM2IDAgMDEuMTIuMTdjLjMyNi4yMDguNjg0LjM2IDEuMDYuNDUuNDIuMTMuOTIuMiAxLjQyLjMuMjQ3LjAxNS40OTEuMDU1LjczLjEyLjUwNy4xMzQuOTkxLjM0IDEuNDQuNjFhLjE1LjE1IDAgMDAuMTQgMGMuMjEtLjA3LjQtLjE3LjYxLS4yNGEzLjcyIDMuNzIgMCAwMTEuMTYtLjE5aC42MWMuMjgyLjA0NS41Ni4xMTUuODMuMjEuNDcuMTczLjg5Ny40NDYgMS4yNS44di0uMzVjMC0uMzEuMTg1LS41OS40Ny0uNzFhLjU4LjU4IDAgMDEuNjQuMTMuOTMuOTMgMCAwMS4yNC42NCA2LjY1IDYuNjUgMCAwMTAgMSAxIDEgMCAwMS0uMjguNTl2LjE3Yy4xODEuNDM0LjI3LjkuMjYgMS4zN2E0LjE1IDQuMTUgMCAwMS0uMDcuOTV2LjE5Yy4wNS0uMDUuMDYgMCAuMTQtLjE0LjA4LS4xNC4xLS4zMS4xNy0uNDVhLjgyLjgyIDAgMDEuNjItLjU2di0uNTJhMSAxIDAgMDEuNDUtLjgzdi0uMDdhMi44NiAyLjg2IDAgMDEwLS45Ljg2Ljg2IDAgMDEuMzEtLjU5LjE0LjE0IDAgMDAwLS4wOSA2IDYgMCAwMTAtLjY2IDIuODEgMi44MSAwIDAwLjE0LTEgMS4yOSAxLjI5IDAgMDAtLjE0LS40MyAzLjA4IDMuMDggMCAwMS0uMjQtLjM1IDMuNjggMy42OCAwIDAwLS4zOC0uNDcuNTQuNTQgMCAwMC0uNC0uMTljLjA3LjE5LjI4LjMzLjE5LjU5YTEuNTMgMS41MyAwIDAwLS4yMS0uMTkuMjQuMjQgMCAwMS0uMTQtLjE3IDEuMzIgMS4zMiAwIDAwLS40LS41OS42NC42NCAwIDAwLS42MS0uMTlsLjA5LjA3YS40Ny40NyAwIDAxLjI2LjMzdi4yMWgtLjE0Yy0uMTItLjA3LS4yMy0uMTctLjQtLjI2YTEuMjIgMS4yMiAwIDAwLS43Mi0uODIgMS4yNiAxLjI2IDAgMDAtLjQzLS4xMmMtLjA5LS4wNy0uMTcgMC0uMjYgMGguMDdhLjM4LjM4IDAgMDEuMjYuMzUuNTIuNTIgMCAwMS0uMTIuMDRoLS4wN2EuNDkuNDkgMCAwMC0uNDUtLjE5IDEuODMgMS44MyAwIDAwLS4xNy0uMzggMS4xIDEuMSAwIDAwLS43OC0uNDcuODYuODYgMCAwMC0uMzMgMHYuMTVoLjJhLjI3LjI3IDAgMDEuMTMuMzZjLS4wMi0uMDkuMDMtLjAyLS4wOS0uMDlhMSAxIDAgMDAtLjQtLjA3LjU3LjU3IDAgMDEtLjE3LS4wNyAxLjI0IDEuMjQgMCAwMC0uNTItLjQuODYuODYgMCAwMC0uODUuMTJoLjA3YS4yOC4yOCAwIDAxLjI4LjIxdi4wOWgtLjA3YS4zNy4zNyAwIDAwLS4zOCAwIC4yOC4yOCAwIDAxLS4yOC0uMDloLS4wN2ExIDEgMCAwMC0uNTQtLjIxLjgzLjgzIDAgMDAtLjYxLjE2LjExLjExIDAgMDAwIC4xNWMuMDkgMCAwIC4wNy4wOSAwcy4xMi4wMi4yMS4wNy4wOS4xMiAwIC4xMmwtLjM1LjEyYy0uMTcuMDktLjM4IDAtLjQ1IDBoLS4wNGExLjQxIDEuNDEgMCAwMC0uODMgMGMtLjE2LjA3LS4zMy4yMS0uMzMuMzhhLjE4LjE4IDAgMDAuMDkgMGMuMDktLjEyLjE5LS4wNS4yNiAwcy4wOS4xNCAwIC4xNGwtLjU3LjMxYS4xNi4xNiAwIDAxLS4xNCAwIDEuMTggMS4xOCAwIDAwLS44IDAgLjU5LjU5IDAgMDAtLjMzLjM3di4xMmguMDljLjA4IDAgLjE3LS4wNy4xNyAwcy4wNy4xNCAwIC4yMWEuNDEuNDEgMCAwMC0uMTIuMDlsLS41OS41OXptOS40NSA0LjdsLS4yMi4wMWEuNTUuNTUgMCAwMS0uNS0uNDUuMjMuMjMgMCAwMC0uMjEtLjIxYy0uMjEuMDItLjI2LS4xLS4zMy0uMjRhLjMuMyAwIDAxMC0uMTQuNDguNDggMCAwMS41LS4zOGguODVhLjU1LjU1IDAgMDAuNjEtLjQ3IDIuMzQgMi4zNCAwIDAwMC0xYzAtLjA4LjAzLS4xNy0uMDktLjE3cy0uMTIuMDctLjEyLjE0di42NGEuNTEuNTEgMCAwMS0uNDQuNDEgMSAxIDAgMDEtLjUyIDAgMi45MyAyLjkzIDAgMDAtLjY0LS4wNy43My43MyAwIDAwLS43Ni40Yy0uMDUuMDkuMDUuMTQtLjE0LjI2YTUuMzMgNS4zMyAwIDAxLS41Ny4zMS4yMS4yMSAwIDAxLS4yNiAwIC44NS44NSAwIDAwLS44NS0uMTJoLS4xMmEuMy4zIDAgMDEtLjE0LS4zMSAxLjQ0IDEuNDQgMCAwMDAtMSAuNC40IDAgMDAtLjQzLS4yMWMtLjE2LjA3LS4zLjE0LS40NyAwYTMgMyAwIDAwLTEuNDQtLjY5Yy0uNDUtLjEtLjkyLS4xNy0xLjM3LS4yNC0uMjgtLjA1LS41Ny0uMS0uODUtLjE3YTMuNjMgMy42MyAwIDAxLTEuMzQtLjY2IDkuNTYgOS41NiAwIDAxLS40NS0uNDNsLS4yNi0uMjhhLjIyLjIyIDAgMDAtLjE3IDB2LjIxYy4xLjMwMS4yODkuNTY2LjU0Ljc2YTMuNDIgMy40MiAwIDAwMSAuNTdjLjM1LjEwNy43MDguMTkgMS4wNy4yNWwuNjYuMDdhNSA1IDAgMDExLjQyLjMzYy4yNDIuMTA1LjQ4LjIyMS43MS4zNXYuMTFhMi4zMiAyLjMyIDAgMDEtLjM4LjEyLjExLjExIDAgMDEtLjEyIDBjLS4zMS0uMTItLjYyLS4yNi0uOTUtLjM4YTIuNzcgMi43NyAwIDAwLS42NC0uMTJsLS41Ny0uMDdjLS4yNi0uMDctLjQ3LS4wMi0uNzgtLjA3LS4zMS0uMDUtLjYxLS4xMi0uOTItLjE5YTMuMTUgMy4xNSAwIDAxLTEuMDYtLjVjLS4yNi0uMTktLjUtLjQ1LS43Ni0uNjZsLS4xNi0uMDloLS4xMnYuMTJhMS40IDEuNCAwIDAwLjE0LjMzYy4yNi40LjYuNzQgMSAxIC4zODcuMjQ0LjgwOC40MyAxLjI1LjU1YTUuNiA1LjYgMCAwMDEuMTMuMjhjLjI3Ni4wMzQuNTQ2LjEwOC44LjIyLjI4LjA5LjU3LjIzLjg1LjM1YTIgMiAwIDAxLjMxLjIxIDEuMiAxLjIgMCAwMS0uNTIuMjZsLS41NC4xYS4zMy4zMyAwIDAwLS4yNi4yNGMuMzI1LjAxMi42NDUuMDc3Ljk1LjE5LjM0Ni4xMi42MTYuMzkzLjczLjc0bC0uMDctLjA3YTEuNzIgMS43MiAwIDAwLS42Ni0uNCAxLjI0IDEuMjQgMCAwMC0uODMgMGMtLjE0LjEtLjMxLjI2LS40LjMzLS4wOS4wNy0uMDcuMTIgMCAuMTkuMjE0LjIyLjQ3My4zOS43Ni41aC0uMTJhLjU2LjU2IDAgMDAtLjQuNDUgMSAxIDAgMDEwIC4xMmguMTJjLjA3IDAgLjE1LS4wNy4yNCAwYS44Mi44MiAwIDAxLjMxLjI2LjE1LjE1IDAgMDEwIC4xNCAyLjMyIDIuMzIgMCAwMC0uMTIuMzhjLS4wNy4wMi0uMDUuMTQgMCAuMTRhLjUuNSAwIDAwLjEyLS4wOWwuMDcuMTRhLjkzLjkzIDAgMDAuMTkuMzMuNzkuNzkgMCAwMC45Mi4xNCA0IDQgMCAwMC41Mi0uMzUuMjkuMjkgMCAwMS4xOS0uMDkgMS4xNCAxLjE0IDAgMDEuMjggMCAuMTEuMTEgMCAwMS4wOS4wNy4zNS4zNSAwIDAxLS4wOS4zMyAyLjUgMi41IDAgMDAtLjI4LjI0LjY1LjY1IDAgMDAuNDcgMCAxLjE0IDEuMTQgMCAwMC40Ny0uMzUuMzguMzggMCAwMC4wOS0uMjggNS4wOCA1LjA4IDAgMDEtLjE5LS43MWMtLjAyLS4xOS0uMDktLjMxLS4yOC0uMzFhLjM0LjM0IDAgMDEwIC4xNGMtLjA3LjA5LS4wNS4wOS0uMTkgMGwtLjQtLjI4YS41Ny41NyAwIDAxLS4yNi0uNTIuMTkuMTkgMCAwMS4xOS0uMTkuNS41IDAgMDEuMjYuNDUuMzUuMzUgMCAwMTAgLjE0bC4yMS0uMTQuNDUuMTJjLjE1LjAxMi4zLjAxMi40NSAwYTEuNTQgMS41NCAwIDAwMCAuMzNjLjA3OC40NDkuMjMuODgxLjQ1IDEuMjguMTkuMzcuNC43NS41NyAxLjEzYS45NC45NCAwIDAxLjA3Ljc2di4wN2EuNTguNTggMCAwMS0uNzYuMzEgMS41MSAxLjUxIDAgMDEtLjUtLjU3Yy0uMTQtLjE5LS4zNS0uNTEtLjQtLjU5YS4yNi4yNiAwIDAwLS4yNi0uMTd2LjE0Yy4wNDYuMTQ3LjEwMy4yOTEuMTcuNDMuMTIuMTkuMjYuMzguNC41Ny4xNjEuMjE1LjM2MS4zOTguNTkuNTRhLjkuOSAwIDAwMS40NC0uOCAyLjM3IDIuMzcgMCAwMC0uMTctMWMtLjE0LS4zMS0uMzEtLjY1LS40NS0xYTIuODkgMi44OSAwIDAxLS4zMy0xLjI0Ljg1Ljg1IDAgMDEuMjYtLjU3YzAgLjA3LjA3LS4wNSAwIC4wN2EuNy43IDAgMDAtLjA3LjM4Yy4zNS0uMDcuNDktLjMzLjYxLS42NGEuNzIuNzIgMCAwMDAgLjIxLjUuNSAwIDAwLjA5LjEyLjIuMiAwIDAwLjE0LS4wNyAyLjUxIDIuNTEgMCAwMC4yMS0uMjZjLjA2MS4wNC4xMTguMDg4LjE3LjE0LjE0LjIxLjI0LjE5LjMxIDBhLjQyLjQyIDAgMDEuMjQtLjI4Yy4wODcuMDkzLjE4LjE4LjI4LjI2aC4xNGEuNDguNDggMCAwMDAtLjEydi0uMzVjLjMzLjA5LjY0LjA1LjY0LS4xMnptLTUuNTctLjY5bC4xMS0uMTJhMSAxIDAgMDAuNTIgMGwuMTctLjA3YS41MS41MSAwIDAxLjI2IDAgLjMyLjMyIDAgMDEuMTcuMjF2LjA3YTMuNjEgMy42MSAwIDAxLS4zOC4yNi4zOS4zOSAwIDAxLS40NyAwIDQuODcgNC44NyAwIDAxLS4zOC0uMzV6bTMuMjYuMzNhMS4zOSAxLjM5IDAgMDEuOTQuMDVjLjA3LjA1Ny4xMzMuMTIuMTkuMTktLjA3LjAyLS4xMi4wOS0uMTkuMDlhMS44MiAxLjgyIDAgMDEtLjM1IDAgLjc5Ljc5IDAgMDAtLjQ1LS4yNi4zNS4zNSAwIDAxLS4xNC0uMDd6TTQuNTQgMTcuNDNhLjM3LjM3IDAgMDEuMDIuMjEuNzYuNzYgMCAwMC42Ny41NGMuMTkuMDI0LjM4LjAyNC41NyAwYTEuNTQgMS41NCAwIDAwLjU1LS4xNSAxLjQ4IDEuNDggMCAwMC42Ni0uNzFjLjA5LS4yMS4xOS0uNC4yNi0uNjFsLjI4LS44Yy4xMi0uMzUuMjYtLjc1LjQtMS4wNi4xNC0uMzEuMy0uNTkuNDctLjlhNS4zMiA1LjMyIDAgMDEuOC0xLjExbC4xNC0uMTItLjMzLS4xNC0uNTItLjI4Yy0uMDUgMC0uMTQtLjA3LS4xNCAwYTguNzkgOC43OSAwIDAwLS40NS44Yy0uMjEuNDUtLjM1LjkyLS41NCAxLjM3YTEuNSAxLjUgMCAwMS0uMzMuNTIgMS4xOCAxLjE4IDAgMDEtMSAuMzEgMS42IDEuNiAwIDAxLS40Ny0uMTcuNTYuNTYgMCAwMS0uMjgtLjQuODkuODkgMCAwMC4wNSAxLjQ1Yy40MzcuMyAxLjAxMy4zIDEuNDUgMGEzLjU0IDMuNTQgMCAwMS4zLS4yNiAxLjM3IDEuMzcgMCAwMS0xLjUxLjc0aC0uMTRhMS4zMSAxLjMxIDAgMDEtLjg2LTEuNjQgMS4zIDEuMyAwIDAwLS41NCAxLjQ0Yy4wOC4zNjcuMzEzLjY4NC42NC44N2ExLjYyIDEuNjIgMCAwMDEuMTEuMTQuNC40IDAgMDEtLjI2LjI0IDEgMSAwIDAxLTEtLjI4em0xNC4wNy0uOGMuMDcgMCAuMDcgMCAuMzIuMDhIMTl2LS4wOWEuNDcuNDcgMCAwMC0uMTctLjM4IDMgMyAwIDAxLS41LS40NS4yNC4yNCAwIDAwLS4xMi0uMDlsLS4xNy0uMDd2LjIxYzAgLjA1LjA5LjE5IDAgLjE5bC0uMjYuMTRjLS4zNi0uNDMtLjM2LS4zMS0uNS0uMzEuMDIuMDcuMDkuMTIuMDkuMTlhLjM5LjM5IDAgMDEwIC4zMy40Ny40NyAwIDAxLS41NyAwbC0uMS0uMTJjLjA0Ni4zNy4xNTcuNzMuMzMgMS4wNmguMTRhLjg3Ljg3IDAgMDEuMjYtLjEyLjIzLjIzIDAgMDEuMy4xMmwuMDcuMjFoLjExYS4yNC4yNCAwIDAwLjA5LS4xMi41OC41OCAwIDAwMC0uNTJoLjEybC4yOC4xNGMuMTIuMDcuMjEuMDcuMjEtLjA3YTEuNTQgMS41NCAwIDAwMC0uMzN6TTYuOCAxNS4wNGEuNzguNzggMCAwMC0uMi0uNzcuNDUuNDUgMCAwMC0uNDUtLjA5LjI5LjI5IDAgMDAtLjE3LjI4YzAgLjA3LS4wMy4xMi0uMTIuMDctLjA5LS4wNS0uMTctLjE3LS4yNi0uMTdhLjM4LjM4IDAgMDAuMjguNTRjLjA5My4wMTIuMTg3LjAxMi4yOCAwYTEuMDUgMS4wNSAwIDAxLjY0LjE0eiIgZmlsbD0iI2UyYWQzZSIvPjwvc3ZnPg==');
    }
    &--xtz {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMjciIGhlaWdodD0iMjI3IiB2aWV3Qm94PSIwIDAgMjI3IDIyNyI+PHBhdGggZmlsbD0iIzJkN2RmNiIgZD0iTTExMy41IDBDNTAuODE2IDAgMCA1MC44MTYgMCAxMTMuNVM1MC44MTYgMjI3IDExMy41IDIyNyAyMjcgMTc2LjE4NCAyMjcgMTEzLjUgMTc2LjE4NCAwIDExMy41IDB6bTU2Ljc5NyAxNzguMDU0Yy0zLjE1NiA2LjM3Ny03Ljg1NyAxMS4xNDYtMTQuMjk0IDE0LjMwMy02LjI0OSAzLjA5Ni0xMy4xOCA0LjY0NC0yMC42MDQgNC42NDQtMTAuODkyIDAtMTguODczLTIuNi0yMy44MjMtNy44NjMtNS4wMTMtNS4yLTcuNDg4LTEwLjgzNS03LjQ4OC0xNi45MDIgMC0yLjIyOS40MzQtNC4wODYgMS4zLTUuNTcyczIuMDQyLTIuNzI0IDMuNTktMy41OTFjMS40ODQtLjg2NyAzLjM0MS0xLjMgNS41NjgtMS4zIDIuMjI3IDAgNC4wODQuNDMzIDUuNTY5IDEuMyAxLjQ4NC44NjcgMi43MjIgMi4wNDMgMy41ODkgMy41OTEuODY2IDEuNTQ4IDEuMjk5IDMuMzQzIDEuMjk5IDUuNTcyIDAgMi42NjMtLjYxOSA0LjgzLTEuOTE4IDYuNTAxLTEuMjk5IDEuNjcyLTIuNzg1IDIuNzg2LTQuNTE3IDMuMjgxIDEuNDg0IDIuMTA1IDMuODk3IDMuNTkyIDcuMTE1IDQuNDU5IDMuMjE5Ljg2NSA2LjQ5NyAxLjM2MSA5Ljc3NyAxLjM2MSA0LjUxNyAwIDguNjAxLTEuMjM5IDEyLjI1Mi0zLjY1MiAzLjY0OS0yLjQxNiA2LjM3My02LjA2OCA4LjEwNi0xMC43NzMgMS43MzEtNC43NjggMi41OTktMTAuMTU0IDIuNTk5LTE2LjIyMiAwLTYuNTYzLS45MjktMTIuMTk3LTIuODQ3LTE2Ljg0Mi0xLjg1Ni00LjY0My00LjY0Mi04LjExLTguMjkzLTEwLjQtMy42NDktMi4yOTEtNy42MS0zLjQwNi0xMS44MTctMy40MDYtMi43ODUgMC02LjI1IDEuMTc3LTEwLjQ1OCAzLjQ2OGwtNy42NzMgMy44Mzh2LTMuNzE1bDM0LjQ2Ny00NS45MzloLTQ3LjcwOXY0Ny43MzVjMCAzLjk2Mi44NjcgNy4xODMgMi41OTkgOS43ODIgMS43MzMgMi41MzkgNC4zOTUgMy44MzkgNy45ODIgMy44MzkgMi43ODUgMCA1LjQ0Ni0uOTI5IDcuOTgzLTIuNzg2YTI4Ljc5NCAyOC43OTQgMCAwIDAgNi42Mi02LjgxMWMuMjQ3LS40OTUuNDk1LS45MjguODY2LTEuMTc2cy43NDMtLjM3MiAxLjExNC0uMzcyYy42MTkgMCAxLjQyMy4zMSAyLjI4OS45MjkuODA1LjkyOSAxLjIzOCAxLjk4MSAxLjIzOCAzLjIyYTIwLjg4NCAyMC44ODQgMCAwIDEtLjQzNCAyLjQxNGMtMS45NzkgNC4zOTYtNC43MDMgNy44MDItOC4xNjggMTAuMDkyLTMuNDY1IDIuMzU0LTcuMzAyIDMuNDY5LTExLjUxIDMuNDY5LTEwLjMzMyAwLTE3LjQ1LTIuMDQzLTIxLjQxLTYuMDY4LTMuOTYtNC4wODYtNS45MzktOS41OTctNS45MzktMTYuNTMxVjg0LjE5Mkg2M3YtOC45MTZoMjQuMzgxVjU1LjA5MmwtNS41Ny01LjU3MlY0NWgxNi4xNWw2LjA2MyAzLjE1OHYyNy4xOGw2Mi45OTMtLjE4NiA2LjI0OSA2LjI1NC0zOC42MTIgMzguNjM0YzIuMzUzLS45MjggNC43NjYtMS40ODYgNy4zMDMtMS43MzMgNC4yMDggMCA4LjkxIDEuMzAxIDE0LjE3IDMuOTYyIDUuMjYgMi42NjMgOS4yODIgNi4yNTUgMTIuMTI4IDEwLjc3MyAyLjg0NyA0LjU4MiA0LjcwMyA4LjkxNiA1LjUwNyAxMy4xMjYuODY3IDQuMjEgMS4yMzggNy45MjUgMS4yMzggMTEuMTQ2IDAgNy40MjktMS41NDcgMTQuMzYzLTQuNzAzIDIwLjc0eiIvPjwvc3ZnPg==');
    }
    &--gas {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMjciIGhlaWdodD0iMjI3IiB2aWV3Qm94PSIwIDAgMjI3IDIyNyI+PHBhdGggZmlsbD0iIzU2YmEyZiIgZD0iTTExMy41IDBDNTAuODE2IDAgMCA1MC44MTYgMCAxMTMuNVM1MC44MTYgMjI3IDExMy41IDIyNyAyMjcgMTc2LjE4NCAyMjcgMTEzLjUgMTc2LjE4NCAwIDExMy41IDB6bS05LjkxMSAxNzdMNjEgMTU2Ljg1NFY3OS44NDdsNDIuNTg5IDIwLjE5M1YxNzd6bTEuMDgyLTg0LjgwM0w2Mi43NTggNzIuMzI0IDEyNC40MTEgNTBsNDEuOTEzIDE5Ljg3NC02MS42NTMgMjIuMzIzek0xNjcgMTU1LjM1N2wtNDMuNjcxLTIwLjY5VjkzLjQ4OUwxNjcgNzcuNjc3djc3LjY4eiIvPjwvc3ZnPg==');
    }
    &--atom {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAwIDI1MDAiPgogICAgPGNpcmNsZSBjeD0iMTI1MCIgY3k9IjEyNTAiIHI9IjEyNTAiIHN0eWxlPSJmaWxsOiMyZTMxNDgiLz4KICAgIDxjaXJjbGUgY3g9IjEyNTAiIGN5PSIxMjUwIiByPSI3MjUuMzEiIHN0eWxlPSJmaWxsOiMxYjFlMzYiLz4KICAgIDxwYXRoIGQ9Ik0xMjUyLjU3LDE1OS40N2MtMTM0LjkzLDAtMjQ0LjM0LDQ4OS40LTI0NC4zNCwxMDkzLjExczEwOS40MSwxMDkzLjExLDI0NC4zNCwxMDkzLjExLDI0NC4zNC00ODkuNCwyNDQuMzQtMTA5My4xMVMxMzg3LjUsMTU5LjQ3LDEyNTIuNTcsMTU5LjQ3Wk0xMjY5LjQ0LDIyODRjLTE1LjQzLDIwLjU4LTMwLjg2LDUuMTQtMzAuODYsNS4xNC02Mi4xNC03Mi05My4yMS0yMDUuNzYtOTMuMjEtMjA1Ljc2LTEwOC42OS0zNDkuNzktODIuODItMTEwMC44Mi04Mi44Mi0xMTAwLjgyLDUxLjA4LTU5Ni4yNCwxNDQtNzM3LjA5LDE3NS42Mi03NjguMzZhMTkuMjksMTkuMjksMCwwLDEsMjQuNzQtMmM0NS44OCwzMi41MSw4NC4zNiwxNjguNDcsODQuMzYsMTY4LjQ3LDExMy42Myw0MjEuODEsMTAzLjM0LDgxNy45LDEwMy4zNCw4MTcuOSwxMC4yOSwzNDQuNjUtNTYuOTQsNzMwLjQ1LTU2Ljk0LDczMC40NUMxMzQxLjkyLDIyMjIuMjIsMTI2OS40NCwyMjg0LDEyNjkuNDQsMjI4NFoiIHN0eWxlPSJmaWxsOiM2ZjczOTAiLz4KICAgIDxwYXRoIGQ9Ik0yMjAwLjcyLDcwOC41OWMtNjcuMTgtMTE3LjA4LTU0Ni4wOSwzMS41OC0xMDcwLDMzMnMtODkzLjQ3LDYzOC44OS04MjYuMzQsNzU1LjkyLDU0Ni4wOS0zMS41OCwxMDcwLTMzMiw4OTMuNDctNjM4Ljg5LDgyNi4zNC03NTUuOTJoMFpNMzY2LjM2LDE3ODAuNDVjLTI1LjcyLTMuMjQtMTkuOTEtMjQuMzgtMTkuOTEtMjQuMzhDMzc4LDE2NjYuMzYsNDc4LjQsMTU3Mi44NCw0NzguNCwxNTcyLjg0YzI0OS40My0yNjguMzYsOTEzLjc5LTYxOS42NSw5MTMuNzktNjE5LjY1LDU0Mi41NC0yNTIuNDIsNzExLjA2LTI0MS43Nyw3NTMuODEtMjMwYTE5LjI5LDE5LjI5LDAsMCwxLDE0LDIwLjU4Yy01LjE0LDU2LTEwNC4xNywxNTctMTA0LjE3LDE1N0MxNzQ2LjcxLDEyMDkuMzYsMTM5OCwxMzk3LjU4LDEzOTgsMTM5Ny41OGMtMjkzLjgzLDE4MC41LTY2MS45MywzMTQuMDktNjYxLjkzLDMxNC4wOS0yODAuMDksMTAwLjkzLTM2OS43LDY4Ljc4LTM2OS43LDY4Ljc4aDBaIiBzdHlsZT0iZmlsbDojNmY3MzkwIi8+CiAgICA8cGF0aCBkPSJNMjE5OC4zNSwxODAwLjQxYzY3LjctMTE2Ljc3LTMwMC45My00NTYuNzktODIzLTc1OS40N1MzNzQuNDMsNTg3Ljc2LDMwNi43OSw3MDQuNzNzMzAwLjkzLDQ1Ni43OSw4MjMuMyw3NTkuNDdTMjEzMC43MSwxOTE3LjM5LDIxOTguMzUsMTgwMC40MVpNMzUxLjY1LDc0OS44NWMtMTAtMjMuNzEsMTEuMTEtMjkuNDIsMTEuMTEtMjkuNDJDNDU2LjIyLDcwMi43OCw1ODcuNSw3NDMsNTg3LjUsNzQzYzM1Ny4xNSw4MS4zMyw5OTQsNDgwLjI1LDk5NCw0ODAuMjUsNDkwLjMzLDM0My4xMSw1NjUuNTMsNDk0LjI0LDU3Ni44LDUzNy4xNGExOS4yOSwxOS4yOSwwLDAsMS0xMC43LDIyLjQzYy01MS4xMywyMy40MS0xODguMDctMTEuNDctMTg4LjA3LTExLjQ3LTQyMi4wNy0xMTMuMTctNzU5LjYyLTMyMC41Mi03NTkuNjItMzIwLjUyLTMwMy4yOS0xNjMuNTgtNjAzLjE5LTQxNS4yOC02MDMuMTktNDE1LjI4LTIyNy44OC0xOTEuODctMjQ1LTI4NS40NC0yNDUtMjg1LjQ0WiIgc3R5bGU9ImZpbGw6IzZmNzM5MCIvPgogICAgPGNpcmNsZSBjeD0iMTI1MCIgY3k9IjEyNTAiIHI9IjEyOC42IiBzdHlsZT0iZmlsbDojYjdiOWM4Ii8+CiAgICA8ZWxsaXBzZSBjeD0iMTc3Ny4yNiIgY3k9Ijc1Ni4xNyIgcng9Ijc0LjU5IiByeT0iNzcuMTYiIHN0eWxlPSJmaWxsOiNiN2I5YzgiLz4KICAgIDxlbGxpcHNlIGN4PSI1NTIuOTgiIGN5PSIxMDE4LjUyIiByeD0iNzQuNTkiIHJ5PSI3Ny4xNiIgc3R5bGU9ImZpbGw6I2I3YjljOCIvPgogICAgPGVsbGlwc2UgY3g9IjEwOTguMjUiIGN5PSIxOTY1LjAyIiByeD0iNzQuNTkiIHJ5PSI3Ny4xNiIgc3R5bGU9ImZpbGw6I2I3YjljOCIvPgo8L3N2Zz4=');
    }
    &--usdc {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAwIDIwMDAiPgogIDxwYXRoIGQ9Ik0xMDAwIDIwMDBjNTU0LjE3IDAgMTAwMC00NDUuODMgMTAwMC0xMDAwUzE1NTQuMTcgMCAxMDAwIDAgMCA0NDUuODMgMCAxMDAwczQ0NS44MyAxMDAwIDEwMDAgMTAwMHoiIGZpbGw9IiMyNzc1Y2EiLz4KICA8cGF0aCBkPSJNMTI3NSAxMTU4LjMzYzAtMTQ1LjgzLTg3LjUtMTk1LjgzLTI2Mi41LTIxNi42Ni0xMjUtMTYuNjctMTUwLTUwLTE1MC0xMDguMzRzNDEuNjctOTUuODMgMTI1LTk1LjgzYzc1IDAgMTE2LjY3IDI1IDEzNy41IDg3LjUgNC4xNyAxMi41IDE2LjY3IDIwLjgzIDI5LjE3IDIwLjgzaDY2LjY2YzE2LjY3IDAgMjkuMTctMTIuNSAyOS4xNy0yOS4xNnYtNC4xN2MtMTYuNjctOTEuNjctOTEuNjctMTYyLjUtMTg3LjUtMTcwLjgzdi0xMDBjMC0xNi42Ny0xMi41LTI5LjE3LTMzLjMzLTMzLjM0aC02Mi41Yy0xNi42NyAwLTI5LjE3IDEyLjUtMzMuMzQgMzMuMzR2OTUuODNjLTEyNSAxNi42Ny0yMDQuMTYgMTAwLTIwNC4xNiAyMDQuMTcgMCAxMzcuNSA4My4zMyAxOTEuNjYgMjU4LjMzIDIxMi41IDExNi42NyAyMC44MyAxNTQuMTcgNDUuODMgMTU0LjE3IDExMi41cy01OC4zNCAxMTIuNS0xMzcuNSAxMTIuNWMtMTA4LjM0IDAtMTQ1Ljg0LTQ1Ljg0LTE1OC4zNC0xMDguMzQtNC4xNi0xNi42Ni0xNi42Ni0yNS0yOS4xNi0yNWgtNzAuODRjLTE2LjY2IDAtMjkuMTYgMTIuNS0yOS4xNiAyOS4xN3Y0LjE3YzE2LjY2IDEwNC4xNiA4My4zMyAxNzkuMTYgMjIwLjgzIDIwMHYxMDBjMCAxNi42NiAxMi41IDI5LjE2IDMzLjMzIDMzLjMzaDYyLjVjMTYuNjcgMCAyOS4xNy0xMi41IDMzLjM0LTMzLjMzdi0xMDBjMTI1LTIwLjg0IDIwOC4zMy0xMDguMzQgMjA4LjMzLTIyMC44NHoiIGZpbGw9IiNmZmYiLz4KICA8cGF0aCBkPSJNNzg3LjUgMTU5NS44M2MtMzI1LTExNi42Ni00OTEuNjctNDc5LjE2LTM3MC44My04MDAgNjIuNS0xNzUgMjAwLTMwOC4zMyAzNzAuODMtMzcwLjgzIDE2LjY3LTguMzMgMjUtMjAuODMgMjUtNDEuNjdWMzI1YzAtMTYuNjctOC4zMy0yOS4xNy0yNS0zMy4zMy00LjE3IDAtMTIuNSAwLTE2LjY3IDQuMTYtMzk1LjgzIDEyNS02MTIuNSA1NDUuODQtNDg3LjUgOTQxLjY3IDc1IDIzMy4zMyAyNTQuMTcgNDEyLjUgNDg3LjUgNDg3LjUgMTYuNjcgOC4zMyAzMy4zNCAwIDM3LjUtMTYuNjcgNC4xNy00LjE2IDQuMTctOC4zMyA0LjE3LTE2LjY2di01OC4zNGMwLTEyLjUtMTIuNS0yOS4xNi0yNS0zNy41ek0xMjI5LjE3IDI5NS44M2MtMTYuNjctOC4zMy0zMy4zNCAwLTM3LjUgMTYuNjctNC4xNyA0LjE3LTQuMTcgOC4zMy00LjE3IDE2LjY3djU4LjMzYzAgMTYuNjcgMTIuNSAzMy4zMyAyNSA0MS42NyAzMjUgMTE2LjY2IDQ5MS42NyA0NzkuMTYgMzcwLjgzIDgwMC02Mi41IDE3NS0yMDAgMzA4LjMzLTM3MC44MyAzNzAuODMtMTYuNjcgOC4zMy0yNSAyMC44My0yNSA0MS42N1YxNzAwYzAgMTYuNjcgOC4zMyAyOS4xNyAyNSAzMy4zMyA0LjE3IDAgMTIuNSAwIDE2LjY3LTQuMTYgMzk1LjgzLTEyNSA2MTIuNS01NDUuODQgNDg3LjUtOTQxLjY3LTc1LTIzNy41LTI1OC4zNC00MTYuNjctNDg3LjUtNDkxLjY3eiIgZmlsbD0iI2ZmZiIvPgo8L3N2Zz4K');
    }
    &--doge {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAwIDIwMDAiIHdpZHRoPSIyNTAwIiBoZWlnaHQ9IjI1MDAiPjxnIGZpbGw9IiNjMmE2MzciPjxwYXRoIGQ9Ik0xMDI0IDY1OUg4ODEuMTJ2MjgxLjY5aDIyNC43OXYxMTcuOTRIODgxLjEydjI4MS42N0gxMDMxYzM4LjUxIDAgMzE2LjE2IDQuMzUgMzE1LjczLTMyNy43MlMxMDc3LjQ0IDY1OSAxMDI0IDY1OXoiLz48cGF0aCBkPSJNMTAwMCAwQzQ0Ny43MSAwIDAgNDQ3LjcxIDAgMTAwMHM0NDcuNzEgMTAwMCAxMDAwIDEwMDAgMTAwMC00NDcuNzEgMTAwMC0xMDAwUzE1NTIuMjkgMCAxMDAwIDB6bTM5LjI5IDE1NDAuMUg2NzcuMTR2LTQ4MS40Nkg1NDkuNDhWOTQwLjdoMTI3LjY1VjQ1OS4yMWgzMTAuODJjNzMuNTMgMCA1NjAuNTYtMTUuMjcgNTYwLjU2IDU0OS40OCAwIDU3NC4wOS01MDkuMjEgNTMxLjQxLTUwOS4yMSA1MzEuNDF6Ii8+PC9nPjwvc3ZnPg==');
    }
    &--leo {
      background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDE5OCAyMjMiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxnIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLDEsLTkzLjgsLTc3LjIpIj4KICAgICAgICA8cGF0aCBkPSJNMTQwLDE3Mi4zTDE0MC4xLDE3Mi4zTDE0MS43LDE3Mi45TDE0My40LDE3My41TDE0NSwxNzQuMUwxNDYuNywxNzQuOEwxNDguMywxNzUuNEwxNTAsMTc1LjlMMTUxLjYsMTc2LjVMMTUzLjIsMTc3LjJMMTU2LjQsMTc4LjRMMTU4LjEsMTc4LjlMMTU5LjcsMTc5LjZMMTYxLjQsMTgwLjJMMTYzLDE4MC44TDE2NC43LDE4MS40TDE2Ni4zLDE4MkwxNjgsMTgyLjZMMTY5LjYsMTgzLjJMMTcxLjMsMTgzLjhMMTcyLjksMTg0LjVMMTc0LjYsMTg1TDE3NC42LDE4Mi40TDE3NC42LDE4MkwxNzQuNiwxNzkuOUwxNzQuNiwxNzguNUwxNzQuNiwxNzcuNEwxNzQuNiwxNzQuOEwxNzQuNiwxNzIuMkwxNzQuNiwxNjkuNkwxNzQuNiwxNjcuMUwxNzQuNiwxNjQuNUwxNzQuNiwxNjJMMTc0LjYsMTYxLjdMMTcyLjYsMTYxLjdMMTcwLjcsMTYxLjdMMTcwLjUsMTYxLjdMMTY4LjQsMTYxLjdMMTY2LjgsMTYxLjdMMTY2LjIsMTYxLjdMMTY0LjEsMTYxLjdMMTYzLDE2MS43TDE2MS45LDE2MS43TDE1OS43LDE2MS43TDE1OS4yLDE2MS43TDE1Ny42LDE2MS43TDE1NS41LDE2MS43TDE1NS40LDE2MS43TDE1NS4zLDE2MS43TDE1My4zLDE2MS43TDE1MS41LDE2MS43TDE1MS4yLDE2MS43TDE0OSwxNjEuN0wxNDcuNiwxNjEuN0wxNDMuOCwxNjEuN0wxNDAuMSwxNjEuN0wxNDAsMTYxLjdMMTM3LjcsMTYxLjdMMTM2LjEsMTYyLjVMMTMyLjMsMTY0LjVMMTI4LjQsMTY2LjVMMTI0LjYsMTY4LjVMMTIwLjgsMTcwLjVMMTE2LjksMTcyLjVMMTEzLDE3NC41TDEwOS4yLDE3Ni41TDEwNS40LDE3OC41TDEwMS41LDE4MC41TDk3LjcsMTgyLjVMOTQuMiwxODQuNEw5My44LDI0MS43TDk3LjcsMjQ0LjRMMTAxLjUsMjQ3LjFMMTA1LjQsMjQ5LjdMMTEzLDI1NS4xTDExNi45LDI1Ny44TDExOC42LDI1OS4xTDEyMC44LDI1Ni40TDEyNC42LDI1MS40TDEyNC45LDI1MC45TDEyNC42LDI1MC42TDEyMC44LDI0Ny45TDExNi45LDI0NS4xTDExMywyNDIuNEwxMDkuMiwyMzkuN0wxMDUuNCwyMzdMMTA0LjMsMjM2LjNMMTA0LjYsMTkwTDEwNS40LDE4OS42TDEwOS4yLDE4Ny43TDExMywxODUuN0wxMTYuOSwxODMuOUwxMjAuOCwxODEuOUwxMjQuNiwxODBMMTI4LjQsMTc4LjFMMTMyLjMsMTc2LjJMMTM2LjEsMTc0LjNMMTQwLDE3Mi4zWiIgZmlsbD0iI2Y2Y2Q0NyIvPgogICAgICAgIDxwYXRoIGQ9Ik0yMDYuMiwyODEuN0wyMDIuOSwyODNMMTk5LjMsMjg0LjRMMTk1LjcsMjg1LjlMMTkyLjEsMjg3LjNMMTkwLjUsMjg4TDE4OC42LDI4N0wxODUsMjg1LjJMMTgxLjUsMjgzLjRMMTc3LjksMjgxLjZMMTc0LjMsMjc5LjhMMTcwLjcsMjc4TDE2Ny4xLDI3Ni4yTDE2My41LDI3NC4zTDE1OS45LDI3Mi42TDE1Ni40LDI3MC43TDE1Mi44LDI2OC45TDE0OS4zLDI2Ny4yTDE0NS43LDI2NS4zTDE0NS4zLDI2NS4xTDE0NS4zLDIxOC40TDE0Mi4xLDIxOC40TDEzOC41LDIxOC40TDEzNC45LDIxOC40TDEzNC45LDI3MS41TDE0OS4zLDI3OC43TDE1Mi44LDI4MC41TDE1Ni40LDI4Mi40TDE1OS45LDI4NC4xTDE2My41LDI4NkwxNjcuMSwyODcuOEwxNzAuNywyODkuNUwxNzQuMywyOTEuNEwxODEuNSwyOTVMMTg1LDI5Ni44TDE5MCwyOTkuM0wxOTIuMSwyOTguNEwxOTUuNywyOTdMMTk5LjMsMjk1LjZMMjAyLjksMjk0LjFMMjA2LjUsMjkyLjZMMjEwLjEsMjkxLjNMMjA2LjUsMjgyLjNMMjA2LjIsMjgxLjdaIiBmaWxsPSIjZjZjZDQ3Ii8+CiAgICAgICAgPHBhdGggZD0iTTI3MC4xLDIxNi42TDI3MC4zLDIzOC43TDI2OS4zLDIzOS40TDI2My4yLDI0My43TDI1Ny4yLDI0OC4xTDI1MS4xLDI1Mi40TDI0NSwyNTYuOEwyMzguOCwyNjFMMjMyLjgsMjY1LjRMMjI2LjcsMjY5LjhMMjIzLjEsMjcyLjRMMjIwLjYsMjcwLjRMMjE0LjYsMjY1LjhMMjA4LjUsMjYxLjFMMjAyLjQsMjU2LjVMMTk2LjQsMjUxLjhMMTk1LjMsMjUxLjFMMTk1LjMsMjI3LjNMMTk2LjQsMjI2LjNMMjAyLjQsMjE5LjlMMjA4LjUsMjEzLjZMMjE0LjYsMjA3LjJMMjIwLjYsMjAwLjlMMjI2LjUsMTk0LjdMMjIwLjYsMTk0LjdMMjE0LjYsMTk0LjdMMjA4LjUsMTk0LjdMMjAyLjQsMTk0LjdMMTk2LjQsMTk0LjdMMTkwLjMsMTk0LjdMMTg0LjIsMTk0LjdMMTc4LjIsMTk0LjdMMTcyLjEsMTk0LjdMMTY1LjksMTk0LjdMMTU5LjksMTk0LjdMMTUzLjgsMTk0LjdMMTU5LjksMjAxLjFMMTY1LjksMjA3LjRMMTcyLjEsMjEzLjdMMTc4LjIsMjIwLjFMMTg0LjIsMjI2LjRMMTg1LDIyNy4zTDE4NSwyNTYuMUwxOTAuMywyNjAuMkwxOTYuNCwyNjQuOEwyMDIuNCwyNjkuNUwyMDguNSwyNzQuMUwyMTQuNiwyNzguOEwyMjAuNiwyODMuNEwyMjIuOSwyODUuMkwyMjYuNywyODIuNEwyMzIuOCwyNzguMUwyMzguOCwyNzMuN0wyNDUsMjY5LjRMMjUxLjEsMjY1LjFMMjU3LjIsMjYwLjhMMjYzLjIsMjU2LjRMMjY5LjMsMjUyLjFMMjc1LjQsMjQ3LjhMMjgwLjQsMjQ0LjFMMjgxLjQsMjE3TDI3NS40LDIxNi44TDI3MC4xLDIxNi42WiIgZmlsbD0iI2Y2Y2Q0NyIvPgogICAgICAgIDxwYXRoIGQ9Ik0xMDMuNywxNjUuNUwxMDQuNCwxNjUuNUwxMDQuNSwxMzYuMUwxMDguNSwxMzMuNkwxMTMuMywxMzAuN0wxMTguMiwxMjcuOEwxMjIuOSwxMjQuN0wxMjcuOCwxMjEuOEwxMzIuNiwxMTguOEwxMzcuNCwxMTUuOUwxNDIuMiwxMTNMMTQ3LDExMEwxNTEuOSwxMDcuMUwxNTIsMTA3TDE1Ni42LDEwOS43TDE2MS41LDExMi40TDE3MS4xLDExOEwxNzUuOSwxMjAuN0wxODAuOCwxMjMuNEwxODUuNSwxMjYuMkwxOTAuMiwxMjguOEwxOTAuNCwxMjguNEwxOTUuMiwxMTkuOEwxOTAuNCwxMTdMMTg1LjUsMTE0LjNMMTgwLjgsMTExLjZMMTc1LjksMTA4LjlMMTcxLjEsMTA2TDE2Ni4zLDEwMy4zTDE2MS41LDEwMC42TDE1Ni42LDk3LjlMMTUxLjksOTUuMkwxNTEuNyw5NS4xTDE0Nyw5Ny45TDE0Mi4yLDEwMC45TDEzNy40LDEwMy44TDEzMi42LDEwNi44TDEyNy44LDEwOS43TDEyMi45LDExMi42TDExOC4yLDExNS42TDExMy4zLDExOC41TDEwOC41LDEyMS41TDEwMy43LDEyNC41TDk4LjksMTI3LjRMOTQuMiwxMzAuM0w5NCwxNjUuNEw5OC45LDE2NS40TDEwMy43LDE2NS41WiIgZmlsbD0iI2Y2Y2Q0NyIvPgogICAgICAgIDxwYXRoIGQ9Ik0yOTEuNywxMzguNUwyODkuMywxMzYuNkwyODYuNywxMzQuNUwyODQuMiwxMzIuNUwyODEuNywxMzAuNUwyNzkuMiwxMjguNEwyNzYuNywxMjYuNUwyNzQuMSwxMjQuNUwyNzEuNiwxMjIuNEwyNjksMTIwLjRMMjY3LjIsMTE4LjlMMjY2LjUsMTE5LjdMMjY0LDEyMi44TDI2MS40LDEyNkwyNjAuOCwxMjYuOUwyNjEuNCwxMjcuNkwyNjQsMTI5LjdMMjY2LjUsMTMxLjdMMjY5LDEzMy45TDI3MS42LDEzNkwyNzQuMSwxMzguMUwyNzYuNywxNDAuM0wyNzkuMiwxNDIuNEwyODAuNCwxNDMuNEwyODAuNSwxOTAuN0wyNzkuMiwxOTEuNUwyNzYuNywxOTMuMkwyNzQuMSwxOTQuN0wyNzEuNiwxOTYuNEwyNjksMTk3LjlMMjY2LjUsMTk5LjZMMjY0LDIwMS4xTDI2MS40LDIwMi44TDI1OC45LDIwNC4zTDI1Ni40LDIwNkwyNTMuOSwyMDcuNUwyNTEuNCwyMDkuMkwyNDguOCwyMTAuN0wyNDYuMywyMTIuNEwyNDMuOCwyMTMuOUwyNDEuMywyMTUuNkwyMzguNywyMTcuMUwyNDEuMywyMjEuMUwyNDMuOCwyMjUuMkwyNDQuMywyMjUuOUwyNDYuMywyMjQuNkwyNDguOCwyMjNMMjUxLjQsMjIxLjVMMjUzLjksMjE5LjlMMjU2LjQsMjE4LjNMMjU4LjksMjE2LjdMMjYxLjQsMjE1LjJMMjY0LDIxMy42TDI2Ni41LDIxMi4xTDI2OSwyMTAuNUwyNzEuNiwyMDguOUwyNzQuMSwyMDcuM0wyNzYuNywyMDUuOEwyNzkuMiwyMDQuMkwyODEuNywyMDIuN0wyODQuMiwyMDEuMUwyODYuNywxOTkuNUwyODkuMywxOTcuOUwyOTEuOCwxOTYuNEwyOTEuNywxMzguNVoiIGZpbGw9IiNmNmNkNDciLz4KICAgICAgICA8cGF0aCBkPSJNMjA5LjMsMTY2LjdMMjA5LjMsMTg3LjJMMjEwLjEsMTg2LjlMMjEzLjQsMTg1LjVMMjE2LjgsMTg0LjJMMjIwLjEsMTgyLjhMMjIzLjUsMTgxLjVMMjI2LjksMTgwLjFMMjMwLjIsMTc4LjdMMjMzLjYsMTc3LjRMMjM3LDE3NkwyNDAuMywxNzQuN0wyNDMuNywxNzMuM0wyNDcsMTcyTDI0NywxNjkuM0wyNDcsMTY4LjRMMjQ3LDE2MS41TDI0NywxMTBMMjQzLjIsMTA3LjdMMjM5LjMsMTA1LjVMMjM1LjUsMTAzLjJMMjMxLjYsMTAwLjlMMjI3LjcsOTguN0wyMjMuOCw5Ni40TDIyMCw5NC4xTDIxNi4yLDkxLjlMMjEyLjMsODkuNkwyMDguNCw4Ny4zTDIwNC41LDg1LjFMMjAwLjcsODIuOEwxOTYuOSw4MC41TDE5Myw3OC4zTDE5MSw3Ny4yTDE4OS4xLDc4LjFMMTg1LjIsODAuM0wxODEuNCw4Mi4zTDE3Ny42LDg0LjRMMTczLjcsODYuNkwxNjkuOCw4OC42TDE2NS45LDkwLjdMMTY5LjgsOTNMMTczLjcsOTUuMkwxNzYuMSw5Ni42TDE3Ny42LDk1LjlMMTgxLjQsOTMuOEwxODUuMiw5MS44TDE4OS4xLDg5LjhMMTkwLjcsODlMMTkzLDkwLjNMMTk2LjksOTIuNkwyMDQuNSw5N0wyMTIuMywxMDEuNkwyMTYuMiwxMDMuOEwyMjMuOCwxMDguNEwyMjcuNywxMTAuNkwyMzUuNSwxMTUuMkwyMzYuNywxMTUuOEwyMzYuNywxNjEuNUwyMzUuOCwxNjEuNUwyMzUuNSwxNjEuNUwyMzMuNiwxNjEuNUwyMzEuNiwxNjEuNUwyMzEuNCwxNjEuNUwyMjkuMiwxNjEuNUwyMjcuNywxNjEuNUwyMjYuOSwxNjEuNUwyMjQuNywxNjEuNUwyMjMuOCwxNjEuNUwyMjIuNiwxNjEuNUwyMjAuMywxNjEuNUwyMjAsMTYxLjVMMjE4LjEsMTYxLjVMMjE2LjIsMTYxLjVMMjE1LjksMTYxLjVMMjEzLjYsMTYxLjVMMjEyLjMsMTYxLjVMMjExLjQsMTYxLjVMMjA5LjgsMTYxLjVMMjA5LjQsMTYxLjUiIGZpbGw9IiNmNmNkNDciLz4KICAgIDwvZz4KICAgIDxnIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLDEsLTkzLjgsLTc3LjIpIj4KICAgICAgICA8cGF0aCBkPSJNMjA5LjMsMTg3LjJMMjQ3LDE3MkwyMDkuMiwxNjEuNSIgZmlsbD0iI2Y2Y2Q0NyIvPgogICAgPC9nPgogICAgPGcgdHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsMSwtOTMuOCwtNzcuMikiPgogICAgICAgIDxwYXRoIGQ9Ik0xNzQuNiwxODcuMkwxNzQuNiwxNjEuOUwxNDAuMSwxNzIuMkwxNzQuNiwxODcuMSIgZmlsbD0iI2Y2Y2Q0NyIvPgogICAgPC9nPgo8L3N2Zz4K');
    }
    &--xem {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMjYuNzc3IiBoZWlnaHQ9IjIyNi43NzciIHZpZXdCb3g9IjAgMCAyMjYuNzc3IDIyNi43NzciPjxwYXRoIGQ9Ik0xMTMuNDk0IDBDNTAuODEzIDAgMCA1MC44MTMgMCAxMTMuNDk0czUwLjgxMyAxMTMuNDk0IDExMy40OTQgMTEzLjQ5NCAxMTMuNDk0LTUwLjgxMyAxMTMuNDk0LTExMy40OTRTMTc2LjE3NSAwIDExMy40OTQgMHpNNTYuMjI5IDEwOS43MThhMTI1LjgwOCAxMjUuODA4IDAgMCAxLTEuMDg4LTQuNzkyIDEyNy4wODkgMTI3LjA4OSAwIDAgMS0yLjUyMy0yMS42MjNjLS4wMTMtLjQ1LjAyOC0uNTQxLjE3My0uNzkuMDY2LS4xMTcuMTI1LS4yMTcuOTg2LS42NzUgMTguMzEtOS43NTEgMzguOTU3LTE0LjkwNSA1OS43MDYtMTQuOTA1IDQuNDY5IDAgOC45OTUuMjQ2IDEzLjUxMy43MzUtMTEuMTQ5IDYuNDU4LTE4LjA5NCAxOC4zMjMtMTguMDk0IDMxLjYybC4wMDEuMDczYy0uMDQyIDkuNjU5LTUuMDIgMTguMzk2LTEzLjM0NiAyMy4zOTNhMjcuNCAyNy40IDAgMCAxLTE0LjAzMyAzLjg2NWMtMTAuOTMgMC0yMS4wNzktNi43ODctMjUuMjk1LTE2LjkwMXptNzkuMDIzIDYxLjQ4YTEyNC41OCAxMjQuNTggMCAwIDEtMy42MzQgMy4zNjUgMTI2Ljk4NSAxMjYuOTg1IDAgMCAxLTE2LjEzMyAxMi4xNTVjLS41NDQuMzQzLS44MTIuNDU0LTEuOTE3LjQ1NC0xLjIyMSAwLTEuNTY3LS4xNC0yLjA2OC0uNDU5LTIwLjkxOS0xMy4yNzctMzcuNzg4LTMyLjkxNC00Ny45NjItNTUuNzAxIDUuNDg4IDMuMTEgMTEuNzA5IDQuNzg0IDE3Ljk4NyA0Ljc4NCA2LjIxIDAgMTIuMzQzLTEuNTg2IDE3LjcyLTQuNTc3LjM2NC0uMTk2LjcyOS0uNDA4IDEuMDA1LS41OCA0LjAwOS0yLjIzMiA4LjU4OC0zLjQxMiAxMy4yNDUtMy40MTIgNC42MzEgMCA5LjIwOSAxLjE4IDEzLjE0OCAzLjM1OGwuMjUyLjE0NmMuMjA3LjExNi40MTYuMjM2LjY0NC4zNzcgOC4yMjEgNC45MjEgMTMuMzI3IDEzLjkyNiAxMy4zMjcgMjMuNS0uMDAxIDUuOTQyLTEuOTkzIDExLjgyOC01LjYxNCAxNi41OXptMTQuNzg5LTE2Ljk1N2MtLjEyOS0xMi42NDYtNi45MS0yNC40OTYtMTcuNzUyLTMwLjk4OGEyMC4xOSAyMC4xOSAwIDAgMC0uODY5LS41bC0uMTE5LS4wNzRjLTguMjczLTUuMDA3LTEzLjIxNC0xMy43NjQtMTMuMjE3LTIzLjQyNHYtLjM1Yy4xODItMTQuOTQgMTIuMzkxLTI3LjAzOCAyNy4zNzEtMjcuMDM4IDEuMzgzIDAgMi43OS4xMDggNC4xODguMzIyIDEuNTU2LjQ2IDMuMDg1Ljk0NCA0LjU0NiAxLjQzN2ExMjYuNzQ3IDEyNi43NDcgMCAwIDEgMTkuMDIxIDguMjEyYy44NjMuNDU5LjkyMy41NjMuOTg4LjY3NC4xNDcuMjU2LjE4My4zMzQuMTcuNzgyLS43NjUgMjUuMzQ1LTkuMzYyIDUwLjMyNi0yNC4zMjcgNzAuOTQ3eiIgZmlsbD0iI2Y1YTc0MSIvPjwvc3ZnPg');
    }
    &--cro {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3OC45IDkxLjEiPgogICAgPHBhdGggZmlsbD0iIzAyMjQ1NSIgZD0iTTM5LjUgMEwwIDIyLjh2NDUuNmwzOS41IDIyLjhMNzkgNjguNFYyMi44TDM5LjUgMHoiLz4KICAgIDxwYXRoIGZpbGw9IiMwMjI0NTUiIGQ9Ik0zOS41IDBMMCAyMi44djQ1LjZsMzkuNSAyMi44VjB6Ii8+CiAgICA8cGF0aCBkPSJNNTQuOSAxOS43aC0zMWwtMy42IDE1LjhoMzguNHpNMjkuNCA1Ny4yVjQ2LjdsLTkuMi01LjgtMTAuNCA3LjdMMjQgNzMuM2g1LjdsNi43LTYuM3YtMy4xeiIgZmlsbD0iI2ZmZiIvPgogICAgPHBhdGggZD0iTTQ5LjUgMzcuOWgtMjBsMy4zIDguOC0xIDkuOWgxNS40bC0xLTkuOXoiIGZpbGw9IiNmZmYiLz4KICAgIDxwYXRoIGQ9Ik01OC43IDQwLjhsLTkuMSA1Ljl2MTAuNWwtNi45IDYuN1Y2N2w2LjcgNi4ySDU1bDE0LjEtMjQuNnoiIGZpbGw9IiNmZmYiLz4KPC9zdmc+');
    }
  }

  &__name {
    width: 100%;
    font-size: 16px;
    color: #253137;
    font-weight: 600;
    line-height: 22px;
    margin: 0 4px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__title {
    font-size: 12px;
    color: #9ea3a6;
    font-weight: 600;
  }

  &__chart {
    position: relative;
    width: 100%;
    height: 120px;
    overflow: hidden;

    @media (max-width: $xs) {
      height: 96px;
    }
  }

  &__volume {
    font-size: 16px;
    color: #253137;
    font-weight: 600;
    text-transform: uppercase;
  }

  &__price,
  &__percent {
    font-size: 22px;
    color: #253137;
    font-weight: 700;
    line-height: 26px;
    letter-spacing: -0.5px;
  }

  &__percent {
    position: relative;
    margin-left: 20px;
    transition: color 0.5s ease-out;
    color: #9ea3a6;

    &:before {
      content: '';
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      left: -12px;
      transition: border-color 0.5s ease-out;
    }

    &.up {
      color: #00c954;

      &:before {
        border: 4px solid transparent;
        border-bottom: 4px solid #00c954;
        top: calc(50% - 5px);
      }
    }

    &.down {
      color: #ec0429;

      &:before {
        border: 4px solid transparent;
        border-top: 4px solid #ec0429;
        top: calc(50% - 1px);
      }
    }

    &--highlight {
      color: #253137 !important;

      &.down:before {
        border-top: 4px solid #253137;
      }
      &.up:before {
        border-bottom: 4px solid #253137;
      }
    }
  }

  &__adjust-huener {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #ffcd06;

    &::before {
      display: inline-block;
      font-size: 16px;
      animation: chart-loader-adjust-hue 1s linear infinite;

      @media (min-width: $sm) {
        font-size: 22px;
      }
    }
  }
}
</style>
