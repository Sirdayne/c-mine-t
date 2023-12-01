<template>
  <span
    v-if="label"
    class="post-copied-popover"
    :class="[isRtl && 'post-copied-popover_rtl', languageShort && `post-copied-popover_${languageShort}`]"
  >
    {{ label }}
  </span>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { ROOT } from '~/store/types';

export default {
  name: 'PostCopiedPopover',
  props: {
    label: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapState({
      languageShort: ({ currentLanguage: { short } }) => short,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
  },
};
</script>

<style>
.post-copied-popover {
  position: fixed;
  left: 50%;
  padding: 10px 20px;
  box-sizing: border-box;
  font-size: 1.375rem;
  font-weight: 600;
  white-space: nowrap;
  color: #051323;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 10px rgba(37, 49, 55, 0.2);
  pointer-events: none;
  bottom: 50%;
  transform: translate(-50%, 50%);
  z-index: 1001;
}
.post-copied-popover_jp {
  font-size: 1.125rem;
}
</style>
