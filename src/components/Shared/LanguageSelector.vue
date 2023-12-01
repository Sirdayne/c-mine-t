<template>
  <ul
    class="language-selector"
    tabindex="-1"
  >
    <li
      v-for="item in languages"
      :key="item.id"
      class="language-selector__item"
    >
      <a
        class="btn language-selector__btn"
        :data-gtm-locator="`header_cliсkon_language_arrow_${item.short}`"
        :href="item.url"
        data-testid="language-link"
      >
        <span class="btn__wrp language-selector__btn-wrp">
          <span class="btn__cap leading-4">
            {{ item.name }}
          </span>
        </span>
      </a>
    </li>
  </ul>
</template>

<script>
import createFocusTrap from 'focus-trap';
import { mapGetters } from 'vuex';
import { ROOT } from '~/store/types';

export default {
  name: 'LanguageSelector',
  computed: {
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
      languages: ROOT.LANGUAGES_FOR_LANG_SELECTOR,
    }),
  },
  mounted() {
    this.focusTrap = null;
    this.initTrap();
  },
  beforeDestroy() {
    if (this.focusTrap) {
      this.focusTrap.deactivate();
    }
    this.focusTrap = null;
  },
  methods: {
    hide() {
      this.$emit('on-hide');
    },
    initTrap() {
      this.focusTrap = createFocusTrap(this.$el, {
        initialFocus: this.$el,
        returnFocusOnDeactivate: true,
        clickOutsideDeactivates: true,
        onDeactivate: this.hide,
      });
      this.focusTrap.activate();
    },
  },
};
</script>

<style scoped lang="scss">
@import '~/assets/styles/_vars.scss';

.language-selector {
  margin: 0;
  padding: 0;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
  list-style: none;
  outline: none;
}
.language-selector__item {
  padding: 0;
  margin: 0;
}
.language-selector__btn {
  display: block;
  width: 100%;
  height: 40px;
  padding: 0 15px;
  text-transform: none;
  text-align: inherit;
  font-size: 12px;
  font-weight: 600;
  line-height: 12px;
  letter-spacing: -0.02em;
  direction: ltr;
  color: #273036;
  background-color: #f0f3f4;
  transition: background-color 0.15s, color 0.15s;
}
.language-selector__btn:hover {
  color: #ffffff;
  background-color: #5e6d74;
}
.language-selector__btn:disabled {
  color: #ffffff;
  background-color: #465a65;
  opacity: 1;
  cursor: default;
}
.language-selector__btn-wrp {
  justify-content: flex-start;
}
</style>
