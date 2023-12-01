<template>
  <button
    class="btn to-top-button"
    :class="[isRtl && 'to-top-button_rtl', isBelowFirstScreen && 'to-top-button_shown']"
    type="button"
    data-gtm-locator="home_clickon_uparrow"
    data-testid="to-top-button"
    @click="handleToTop"
  >
    <span class="btn__wrp">
      <span class="btn__icon to-top-button__icon" />
      <span
        v-if="backToTopLabel"
        class="btn__cap to-top-button__label"
      >
        {{ backToTopLabel }}
      </span>
    </span>
  </button>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import scrollTo from '~/assets/libs/scrollTo';
import { ROOT } from '~/store/types';

export default {
  name: 'ToTopButton',
  computed: {
    ...mapState({
      backToTopLabel: ({ i18n }) => i18n.backToTop,
    }),
    ...mapState('viewport', {
      isBelowFirstScreen: ({ scrollTop, viewportHeight }) => {
        return scrollTop > viewportHeight;
      },
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
  },
  methods: {
    handleToTop() {
      scrollTo();
    },
  },
};
</script>

<style scoped lang="scss">
@use '~/assets/styles/_icons-common.scss' as icons;
@use '~/assets/styles/_vars.scss' as vars;

.to-top-button {
  display: block;
  padding: 9px 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  transform: translateX(-50%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
}
.to-top-button:hover {
  box-shadow: 0 2px 25px rgba(0, 0, 0, 0.2);
}
.to-top-button_shown {
  opacity: 1;
  pointer-events: auto;
}
.to-top-button_rtl {
  direction: rtl;
}
.to-top-button__icon {
  @include icons.arrow-up-smooth(#afbdc4);
  width: 20px;
  height: 1rem;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
.to-top-button__label {
  margin-left: 10px;
  font-weight: bold;
  font-size: 1rem;
  line-height: normal;
  color: #4e575c;
}
.to-top-button_rtl .to-top-button__label {
  margin-left: 0;
  margin-right: 10px;
}

@media (min-width: vars.$sm) {
  .to-top-button {
    width: 50px;
    height: 50px;
    padding: 0;
    border-radius: 5px;
    transform: translateX(0);
  }
  .to-top-button__icon {
    width: 30px;
    height: 30px;
    transition: background 0.15s;
  }
  .to-top-button:hover .to-top-button__icon {
    @include icons.arrow-up-smooth(#27282d);
  }
  .to-top-button__label {
    display: none;
  }
}
</style>
