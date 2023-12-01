<template>
  <a
    :class="$style['stretch-promo']"
    :href="adItem.getRedirectUrl()"
    target="_blank"
  >
    <p :class="$style['stretch-promo__title']">{{ props.title }}</p>
    <p :class="$style['stretch-promo__subtitle']">{{ props.description }}</p>
  </a>
</template>

<script setup lang="ts">
import { useAdSlotContext, useCustomRenderingProps } from '../adslot/useAdSlotContext';
import { CustomRenderingViews } from '../core/CustomRenderingViews';

const { adItem } = useAdSlotContext();
const props = useCustomRenderingProps(CustomRenderingViews.STRETCH_PROMO);
const cssBackgroundImageUrl = `url(${adItem.getImageUrl()})`;
</script>

<style module lang="scss">
.stretch-promo {
  height: 340px;
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  background-image: linear-gradient(180deg, hsla(0, 0%, 93.3%, 0), rgba(39, 39, 45, 0.65) 40%, #27272d),
    v-bind(cssBackgroundImageUrl);
  background-size: cover;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  text-decoration: none;
}

.stretch-promo__title {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.44;
  word-break: break-word;
  word-wrap: break-word;
  max-width: 440px;
  margin-bottom: 0;
  margin-top: 0;
}

.stretch-promo__title:hover {
  text-decoration: underline;
}

.stretch-promo__subtitle {
  font-size: 14px;
  line-height: 1.57;
  word-break: break-word;
  word-wrap: break-word;
  max-width: 440px;
}

@media (min-width: 767px) {
  .stretch-promo {
    padding: 0 56px;
    justify-content: center;
  }

  .stretch-promo__title {
    font-size: 21px;
  }
}

@media (max-width: 450px) {
  .stretch-promo {
    background-image: linear-gradient(180deg, hsla(0, 0%, 93.3%, 0), rgba(39, 39, 45, 0.65) 40%, #27272d),
      v-bind(cssBackgroundImageUrl);
    background-size: cover;
  }
}
</style>
