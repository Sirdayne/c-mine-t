<template>
  <div
    :class="{
      [$style['text-banner']]: true,
      [$style['text-banner--bordered']]: config.textBannerBordered,
    }"
  >
    <a
      :class="$style['text-banner__wrapper']"
      :href="props.bannerURL"
    >
      <h3 :class="$style['text-banner__heading']">Advertisement</h3>
      <h4 :class="$style['text-banner__description']">{{ props.bannerText }}</h4>
    </a>
    <div
      v-if="props.disclaimerText"
      :class="{
        [$style['text-banner__disclaimer']]: true,
        [$style['text-banner__disclaimer--mobile']]: deviceInfo.mobile,
      }"
    >
      <img
        v-if="props.disclaimerImg"
        :src="props.disclaimerImg"
        :class="$style['text-banner__disclaimer-logo']"
      />
      <h3
        :class="{
          [$style['text-banner__disclaimer-text']]: true,
          [$style['text-banner__disclaimer-text--mobile']]: deviceInfo.mobile,
        }"
      >
        {{ props.disclaimerText }}
      </h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDeviceInfo } from '~/lib/device-detector';
import { CustomRenderingViews } from '../core/CustomRenderingViews';
import { useCustomRenderingProps, useAdSlotContext } from '../adslot/useAdSlotContext';

const deviceInfo = useDeviceInfo();
const props = useCustomRenderingProps(CustomRenderingViews.TEXT_BANNER);
const { config } = useAdSlotContext();
</script>

<style module lang="scss">
@import '~/assets/styles/_vars.scss';

.text-banner {
  position: relative;
  font-family: $font-open-sans;
  background: #fff !important;
  cursor: pointer !important;
  text-decoration: none !important;
  display: block !important;
  color: $color-black-950 !important;
  border-top: none;
  border-bottom: none;

  &--bordered {
    border-top: 1px solid #eae9e9;
    border-bottom: 1px solid #eae9e9;
    padding: 12px 0;
  }

  &:hover .text-banner__disclaimer {
    visibility: visible;
  }

  &__wrapper {
    text-decoration: none !important;
    color: $color-black-950 !important;
    border-top: 1px solid #eae9e9 !important;
    border-bottom: 1px solid #eae9e9 !important;
  }

  &__description {
    margin: 0 !important;
    font-weight: 700 !important;
    font-size: 16px !important;
    line-height: 22px !important;
    letter-spacing: -0.01em !important;
  }

  &__heading {
    margin: 0 0 8px 0 !important;
    font-size: 0.75rem !important;
    color: $color-darkgold !important;
  }

  &__disclaimer {
    padding: 8px 12px;
    background: $color-white;
    border: 1px solid #c8d0d3;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    // TODO: price indexes page overrides styles. refactor selectors
    margin: 0 !important;
    left: 0;
    right: 0;
    //12px margin of separator line
    transform: translateY(12px);
    visibility: hidden;
    position: absolute;
    z-index: 1000;

    &-text {
      margin: 0 !important;
      font-style: normal !important;
      font-weight: 400 !important;
      font-size: 12px !important;
      line-height: 16px !important;
      color: $color-gray-700 !important;

      &--mobile {
        color: $color-gray-600 !important;
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 11px !important;
        line-height: 15px !important;
        margin: 8px 0 0 0 !important;
      }
    }

    &-logo {
      display: inline-block;
      width: 70px;
      height: 30px;
      object-position: 50%;
    }

    &--mobile {
      position: static;
      display: flex;
      flex-direction: column;
      color: $color-gray-600;
      visibility: visible;
      border: none;
      box-shadow: none;
      padding: 0;
      transform: translateY(0);
    }
  }
}
</style>
