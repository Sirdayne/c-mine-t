<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '~/lib/framework';

const props = defineProps<{
  targetCoin?: string;
}>();

const CHANGELLY_WIDGET_URL =
  'https://widget.changelly.com/v2/?theme=day&merchantId=QIGmvRRnNaD4syJ4&widgetId=2&c2cAmount=100&f2cAmount=100&c2cFrom=usdt20-crypto&c2cTo=eth-crypto&f2cFrom=usd-fiat&f2cTo=usdt20-crypto&v=1013';

const iframeSrc = computed(() => {
  const url = new URL(CHANGELLY_WIDGET_URL);

  if (props.targetCoin) {
    url.searchParams.set('c2cTo', props.targetCoin);
    url.searchParams.set('f2cTo', props.targetCoin);
  }

  url.searchParams.set('headerId', '3');

  return url.href;
});

const store = useStore();
const title = computed(() => {
  const targetCoin = props.targetCoin || '';
  const coinName = targetCoin.split('-')[0] || '';
  const translatedTitle = store.state.i18n['changelly-widget.title'];

  return `${translatedTitle} ${coinName.toUpperCase()}`;
});
</script>

<template>
  <div
    :class="$style['changelly-widget']"
    data-gtm-locator="changelly-widget"
  >
    <p :class="$style['changelly-widget__title']">{{ title }}</p>

    <div :class="$style['changelly-widget__wrapper']">
      <div :class="$style['changelly-widget__iframe-wrapper']">
        <iframe
          width="100%"
          height="100%"
          frameborder="none"
          allow="camera"
          :src="iframeSrc"
        />
      </div>
      <div :class="$style['changelly-widget__disclaimer']">
        <span :class="$style['changelly-widget__disclaimer-label']">Disclaimer:</span>
        The information contained on this widget is not intended as, and shall not be understood or construed as legal,
        tax, investment, financial, or other advice. Nothing contained on this widget constitutes a solicitation,
        recommendation, endorsement, or offer by Cointelegraph or any third party service provider to buy or sell any
        cryptoassets or other financial instruments. We advise you to spend only what you can afford to lose, and always
        seek independent financial advice if you are in doubt. You should not purchase any cryptoassets if you do not
        fully understand the nature of your purchase and the risks involved. We recommend that you refer to the
        issuer’s/ advertiser’s t&c and help/ support pages for more information.
      </div>
      <div :class="$style['changelly-widget__ad-badge']">Ad</div>
    </div>
  </div>
</template>

<style module lang="scss">
@import '~/assets/styles/_vars.scss';

.changelly-widget {
  box-sizing: border-box;
  margin: 32px 0;
}

.changelly-widget__title {
  color: #000;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.24px;
  margin-bottom: 16px;
}

.changelly-widget__wrapper {
  position: relative;
  background: #ffffff;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
}

/* As on configurator
 * @see https://changelly.com/earn/tools/widget
 */
.changelly-widget__iframe-wrapper {
  width: 100%;
  display: flex;
  height: 450px;
}

.changelly-widget__disclaimer {
  border-top: 1px solid #f1f5f9;
  padding: 16px;
  font-size: 11px;
  color: #9ca3af;
}

.changelly-widget__disclaimer-label {
  font-weight: bold;
}

.changelly-widget__ad-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #9ca3af;
  font-size: 14px;
}
</style>
