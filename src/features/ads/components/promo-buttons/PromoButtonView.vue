<template>
  <div
    :class="{
      [$style['promo-button']]: true,
      [$style['promo-button--full-width']]: true,
    }"
    data-testid="promo-button"
  >
    <LinkResolver
      to="/advertise"
      stop-client-side-navigation
      target="_blank"
      :class="$style['promo-button-ad-label']"
    >
      Ad
    </LinkResolver>
    <a
      :class="{
        [$style['promo-button-link']]: true,
        [$style['promo-button-link--reversed']]: contentReversed,
        [$style['promo-button-link--rtl']]: rtl,
      }"
      :href="redirectUrl"
      target="_blank"
      data-testid="promo-button-link"
    >
      <img
        :class="{
          [$style['promo-button-logo-small']]: true,
          [$style['promo-button-logo-small--reversed']]: contentReversed,
          [$style['promo-button-logo-small--reversed-rtl']]: contentReversed && rtl,
          [$style['promo-button-logo-small--direction-rtl']]: rtl,
          [$style['promo-button-logo-small--direction-ltr']]: !rtl,
        }"
        :src="logoSmallUrl"
      />
      <span
        :class="{
          [$style['promo-button-label']]: true,
          [$style['promo-button-label--reversed']]: contentReversed,
        }"
      >
        {{ labelText }}
      </span>
    </a>

    <div
      v-if="!disclaimerHidden"
      :class="{
        [$style['promo-button-disclaimer']]: true,
        [$style['promo-button-disclaimer--without-tooltip']]: promoButtonWithOutToolTip,
        [$style['promo-button-disclaimer--popover-top']]: popoverPosition === 'top' && !promoButtonWithOutToolTip,
        [$style['promo-button-disclaimer--popover-bottom']]: popoverPosition === 'bottom' && !promoButtonWithOutToolTip,
      }"
      data-testid="promo-button-disclaimer"
    >
      <img
        :src="logoFullUrl"
        :class="$style['promo-button-disclaimer__logo']"
        data-testid="promo-button-logo"
      />
      <p
        :class="$style['promo-button-disclaimer__text']"
        data-testid="promo-button-disclaimer-text"
      >
        {{ tooltipText }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { usePromoButtonPopoverPosition } from './usePromoButtonPopoverPosition';
import LinkResolver from '~/components/Shared/LinkResolver.vue';

const popoverPosition = usePromoButtonPopoverPosition();

defineProps({
  fullWidth: {
    type: Boolean,
    required: true,
  },

  rtl: {
    type: Boolean,
    required: true,
  },

  disclaimerHidden: {
    type: Boolean,
    required: true,
  },

  redirectUrl: {
    type: String,
    required: true,
  },

  labelColor: {
    type: String,
    required: true,
  },

  backgroundColor: {
    type: String,
    required: false,
    default: null,
  },

  backgroundImage: {
    type: String,
    required: false,
    default: null,
  },

  logoSmallUrl: {
    type: String,
    required: true,
  },

  logoFullUrl: {
    type: String,
    required: true,
  },

  tooltipText: {
    type: String,
    required: true,
  },

  labelText: {
    type: String,
    required: true,
  },

  contentReversed: {
    type: Boolean,
    required: true,
  },
  promoButtonWithOutToolTip: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" module>
@import '~/assets/styles/_vars.scss';

$promo-button-disclaimer-popover-background-color: #fafafa;
$promo-button-disclaimer-text-color: #92989b;
$promo-button-active-shadow-color: rgb(0 69 83 / 40%);
$promo-button-cannoli-cream-border-color: #efede0;

.promo-button {
  position: relative;
  min-height: 40px;
  // TODO: concrete category page overrides width to 243px. refactor page styles
  width: 100% !important;

  @media (min-width: $md) {
    max-width: 273px;
    &.sidebar__promo-button {
      max-width: unset;
    }
  }

  @media (min-width: $lg) {
    max-width: unset;
  }

  &:hover .promo-button-disclaimer {
    visibility: visible;
  }

  &--full-width {
    max-width: unset;
  }
}

.promo-button-link {
  --shadow-color: transparent;

  display: flex;
  justify-content: center;
  align-items: center;

  box-sizing: border-box;
  padding: 8px 20px 8px 8px;
  text-align: center;
  text-transform: uppercase;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.05px;
  border-radius: 3px;

  box-shadow: 0 10px 16px var(--shadow-color);
  background-color: v-bind(backgroundColor);
  background-image: v-bind(backgroundImage);
  color: v-bind(labelColor);
  transition: box-shadow 0.15s;

  &:hover {
    --shadow-color: $promo-button-active-shadow-color;
  }

  &--rtl {
    direction: rtl;
  }

  &--reversed {
    // post content issues
    border: 1px solid $promo-button-cannoli-cream-border-color !important;
    border-radius: 8px;
  }
}

.promo-button-logo-small {
  width: 23px;
  height: 23px;
  object-position: 50%;

  &--direction-ltr {
    margin-right: 12px;
  }

  &--direction-rtl {
    margin-left: 12px;
  }

  // important because of post content styles
  &--reversed {
    width: auto;
    height: 20px;
    order: 2;
    margin-right: 0;
    margin-left: 8px;
    @media (min-width: $sm) {
      height: 16px !important;
    }
    &-rtl {
      margin-right: 8px;
      margin-left: 0;
    }
  }
}
.promo-button-ad-label {
  position: absolute;
  top: 2px;
  right: 4px;
  color: #b3b3b3;
  mix-blend-mode: luminosity;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
}
.promo-button-label {
  overflow: auto;
  text-overflow: clip;
  white-space: normal;
  word-wrap: break-word;
  color: v-bind(labelColor);

  &--reversed {
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 19px;
    text-transform: initial;
    @media (min-width: $md) {
      font-size: 12px;
      line-height: 16px;
    }
  }
}

.promo-button-disclaimer {
  color: $promo-button-disclaimer-text-color;
  padding: 16px;
  // TODO: price indexes page overrides styles. refactor selectors
  margin: 0 !important;

  &__logo {
    display: none;
  }

  &__text {
    margin: 0;
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.7;
    color: currentColor;
    text-align: center;
  }

  @media (min-width: $xs--tablet) {
    left: 0;
    right: 0;
    position: absolute;
    z-index: 1;
    visibility: hidden;
    background-color: $promo-button-disclaimer-popover-background-color;
    border: 1px solid currentColor;
    border-radius: 4px;
    // TODO: shitty price indexes page overrides this element with `:nth-child(3)`
    max-height: unset !important;

    &::before {
      content: '';
      display: block;
      position: absolute;
      width: 16px;
      height: 16px;
      left: 50%;
      transform: rotate(45deg) translateX(-50%);

      border-color: currentColor;
      border-style: solid;
      border-width: 0;
      background-color: $promo-button-disclaimer-popover-background-color;
      backface-visibility: hidden;
    }

    &--popover-top {
      bottom: calc(100% + 16px);

      &::before {
        bottom: -16px;
        border-right-width: 1px;
        border-bottom-width: 1px;
      }
    }

    &--popover-bottom {
      top: calc(100% + 16px);

      &::before {
        top: -2px;
        border-left-width: 1px;
        border-top-width: 1px;
      }
    }

    &__logo {
      display: inline-block;
      width: 70px;
      height: 30px;
      object-position: 50%;
    }

    &__text {
      text-align: unset;
    }
  }
  &--without-tooltip {
    display: block;
    border: none;
    background: transparent;
    visibility: visible;
    position: static;
    font-style: normal;
    font-weight: 400;
    font-size: 10px;
    line-height: 15px;
    text-align: center;
    padding: 12px 0 0 0;
  }
}
.promo-button-disclaimer--without-tooltip .promo-button-disclaimer__logo {
  display: none;
}
.promo-button-disclaimer--without-tooltip .promo-button-disclaimer__text {
  font-weight: 400;
  font-size: 10px;
  line-height: 15px;
  text-align: center;
}
</style>
