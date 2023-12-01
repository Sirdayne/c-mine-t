<template>
  <button
    ref="button"
    v-clipboard="postInfo.url"
    class="btn shares-list-item md:relative group copy-btn"
    :class="[isRtl && 'shares-list-copy_rtl']"
    data-gtm-locator="article_clickon_share_copylink"
    @success="handleClipboardSuccess"
  >
    <component
      :is="componentName"
      class="!text-bg-subtle group-hover:!text-bg-lessSubtle copy-icon"
    />
    <Transition name="fade">
      <span
        v-if="!isMobileBreakpoint && socialClipboardLabel && isCopied"
        class="shares-list-copy__popup"
      >
        {{ socialClipboardLabel }}
      </span>
    </Transition>
  </button>
</template>

<script>
import Vue from 'vue';
import VueClipboards from 'vue-clipboards';
import { mapState, mapGetters } from 'vuex';
import { ROOT, VIEWPORT } from '~/store/types';
import CopyIcon from '~/assets/icons/copy.svg';

Vue.use(VueClipboards);

const COPIED_TIMEOUT = 2000;

export default {
  name: 'SharesListCopy',
  components: {
    CopyIcon,
  },
  props: {
    postInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isCopied: false,
    };
  },
  computed: {
    ...mapState({
      socialClipboardLabel: ({ i18n: { socialClipboardLabel } }) => socialClipboardLabel,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
    ...mapGetters('viewport', {
      isMobileBreakpoint: VIEWPORT.IS_MOBILE_BREAKPOINT,
    }),

    componentName() {
      return CopyIcon;
    },
  },
  methods: {
    handleClipboardSuccess() {
      this.$emit('copied');
      if (this.isMobileBreakpoint) {
        return undefined;
      }
      this.isCopied = true;
      return setTimeout(() => {
        this.isCopied = false;
      }, COPIED_TIMEOUT);
    },
  },
};
</script>

<style lang="scss">
@use '~/assets/styles/_vars.scss' as vars;

.shares-list-copy {
  background-color: #b3b5b6;
}
.shares-list-copy__popup {
  position: absolute;
  left: 50%;
  top: calc(-100% + 8px);
  padding: 10px 20px;
  box-sizing: border-box;
  font-size: 0.875rem;
  white-space: nowrap;
  color: inherit;
  background-color: #ffffff;
  border-radius: 2px;
  box-shadow: 0 2px 10px rgba(37, 49, 55, 0.2);
  pointer-events: none;
  transform: translate(-50%, -50%);
}
.shares-list-copy_ko .shares-list-copy__popup {
  font-size: 0.925rem;
}

@media (min-width: vars.$md) {
  .shares-list-copy__popup {
    left: calc(100% + 16px);
    top: 0;
    transform: translate(0, 0);
  }
  .shares-list-copy_rtl .shares-list-copy__popup {
    right: calc(100% + 16px);
    left: auto;
    transform: translate(0, 0);
  }
}
.copy-btn {
  path {
    color: #5e6d74;
  }
  &:hover {
    path {
      color: #273036;
    }
  }
}
.copy-icon * {
  @media (max-width: 370px) {
    scale: 0.8;
  }
}
</style>
