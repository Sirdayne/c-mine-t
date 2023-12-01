<template>
  <label
    class="checkbox"
    :class="isRtl && 'checkbox_rtl'"
  >
    <input
      class="checkbox__input"
      type="checkbox"
      :disabled="disabled"
      :checked="value"
      @input="handleInput"
    />
    <span class="checkbox__wrp">
      <span class="checkbox__icon">
        <span class="checkbox__tick" />
      </span>
      <span
        v-if="cap"
        class="checkbox__cap"
      >
        {{ cap }}
      </span>
    </span>
  </label>
</template>

<script>
import { mapGetters } from 'vuex';
import { ROOT } from '~/store/types';

export default {
  name: 'Checkbox',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    cap: {
      type: String,
      default: '',
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
  },
  methods: {
    handleInput({ target: { checked } }) {
      this.$emit('input', checked);
    },
  },
};
</script>

<style>
.checkbox {
  display: inline-block;
}
.checkbox__input {
  position: absolute;
  z-index: -1;
  pointer-events: none;
  opacity: 0;
}
.checkbox__wrp {
  display: flex;
  align-items: flex-start;
  width: 100%;
  user-select: none;
  cursor: pointer;
}
.checkbox__icon {
  flex-shrink: 0;
  display: block;
  width: 16px;
  height: 16px;
  margin-top: 2px;
  background-color: #ffffff;
  border: 1px solid #afbdc4;
  border-radius: 2px;
  transition: border-color 0.15s, background-color 0.15s;
}
.checkbox__tick {
  display: block;
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' fill='%23ffffff'%3E%3Cpath d='M77.12,220.17,6,297.56,195.42,471.65,506,108.69,426.14,40.35,186.37,320.57Z'/%3E%3C/svg%3E")
    center no-repeat;
  background-size: 12px auto;
  opacity: 0;
  transition: opacity 0.15s;
}
.checkbox__cap {
  display: block;
  margin-left: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.checkbox__wrp:hover .checkbox__icon {
  border-color: #afbdc4;
  background-color: #eceff1;
}
.checkbox__input:checked + .checkbox__wrp .checkbox__icon {
  border-color: #253137;
  background-color: #253137;
}
.checkbox__input:checked + .checkbox__wrp .checkbox__tick {
  opacity: 1;
}
.checkbox__input:disabled + .checkbox__wrp {
  opacity: 0.6;
  cursor: not-allowed;
}
.checkbox_rtl {
  direction: rtl;
}
.checkbox_rtl .checkbox__cap {
  margin-left: 0;
  margin-right: 8px;
}
</style>
