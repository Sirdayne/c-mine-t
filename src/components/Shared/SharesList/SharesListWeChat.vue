<template>
  <div
    class="shares-list-wechat"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <button
      class="btn shares-list-wechat__btn group"
      type="button"
      data-e2e="wechat-qr-code"
      data-gtm-locator="article_clickon_share_wechat"
      @click="handleClick"
    >
      <WecahtIcon class="shares-list-wechat__icon text-[#09B83E] group-hover:text-[#079733] wechat-icon" />
    </button>
    <Transition name="fade">
      <div
        v-if="isPopoverOpen"
        class="shares-list-wechat__popover"
      >
        <div class="shares-list-wechat__popover-header">
          {{ i18n.socialWechatHeaderText }}
        </div>
        <div class="shares-list-wechat__popover-body">
          <div class="shares-list-wechat__popover-img-box">
            <Transition
              :duration="{ enter: 400, leave: 250 }"
              name="fade"
              mode="out-in"
            >
              <img
                v-if="isQrCodeLoaded"
                :key="1"
                :src="image"
                class="shares-list-wechat__popover-image"
                alt=""
              />
              <div
                v-else-if="pending"
                :key="2"
                class="shares-list-wechat__popover-spinner"
              />
              <div
                v-else
                :key="3"
                class="shares-list-wechat__error-wrap"
              >
                <span class="shares-list-wechat__error-image" />
              </div>
            </Transition>
          </div>
          <div class="shares-list-wechat__popover-description">
            {{ footerMessageText }}
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { fetchQrCode } from '~/api/modules/qrCode';
import getProperty from '~/assets/libs/getProperty';
import WecahtIcon from '~/assets/icons/socials/wechat.svg';

const MOBILE_BREAKPOINTS = ['xxs', 'xs', 'sm'];

export default {
  name: 'SharesListWeChat',
  components: {
    WecahtIcon,
  },
  props: {
    postInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      currentPostUrl: null,
      hasError: false,
      image: '',
      isPopoverOpen: false,
      pending: false,
    };
  },
  computed: {
    ...mapState({
      languageShort: ({ currentLanguage: { short } }) => short,
      i18n: ({ i18n }) => i18n,
    }),
    ...mapState('viewport', {
      isMobileView: ({ breakpoint }) => {
        return MOBILE_BREAKPOINTS.includes(breakpoint);
      },
    }),
    isQrCodeLoaded() {
      return this.image && this.postInfo.url === this.currentPostUrl && !this.pending && !this.hasError;
    },
    footerMessageText() {
      const { i18n, hasError } = this;
      return !hasError ? i18n.socialWechatFooterText : i18n.socialWechatFooterError;
    },
  },
  watch: {
    postInfo: 'postInfoWatcherCallback',
  },
  methods: {
    async fetchQrCode() {
      this.pending = true;
      this.image = '';
      const {
        data: { image },
        error,
      } = await fetchQrCode({
        languageShort: this.languageShort,
        apolloTransport: this.$apolloTransport,
        url: this.postInfo.url,
      });
      this.pending = false;
      this.setCurrentPost();
      if (error || !image) {
        this.hasError = true;
        return;
      }
      this.image = image;
    },
    tryToFetchQrCode() {
      return !this.isQrCodeLoaded && this.fetchQrCode();
    },
    postInfoWatcherCallback() {
      const { isPopoverOpen } = this;
      return isPopoverOpen && this.tryToFetchQrCode();
    },
    handleClick() {
      const { isPopoverOpen, isMobileView } = this;
      if (!isMobileView) {
        return;
      }
      if (!isPopoverOpen) {
        this.tryToFetchQrCode();
        this.isPopoverOpen = true;
        return;
      }
      this.close();
    },
    handleMouseEnter() {
      if (this.isMobileView) {
        return;
      }
      this.tryToFetchQrCode();
      this.isPopoverOpen = true;
    },
    handleMouseLeave() {
      if (this.isMobileView) {
        return;
      }
      this.close();
    },
    setCurrentPost() {
      const { postInfo } = this;
      this.currentPostUrl = getProperty(postInfo, 'url', '');
    },
    close() {
      this.isPopoverOpen = false;
      this.hasError = false;
    },
  },
};
</script>

<style lang="scss">
@use '~/assets/styles/_icons-socials.scss' as social-icons;
@use '~/assets/styles/_vars.scss' as vars;

.shares-list-wechat__btn {
  display: flex;
  align-items: center;
  width: 33px;
  height: 33px;
  border-radius: 3px;
  background-color: #09b83e;
  justify-content: center;
}
.shares-list-wechat__icon {
  min-width: 16px;
  min-height: 16px;
}
.shares-list-wechat__popover {
  position: absolute;
  z-index: 1;
  left: 50%;
  bottom: 100%;
  width: 200px;
  margin-bottom: 16px;
  font-size: 0.875rem;
  background-color: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.16);
  transform: translateX(-50%);
}
.shares-list-wechat__popover-header,
.shares-list-wechat__popover-body {
  text-align: center;
}
.shares-list-wechat__popover-header {
  background-color: #f0f0f0;
  padding: 8px;
}
.shares-list-wechat__popover-body {
  padding: 14px;
  box-sizing: border-box;
  text-align: center;
}
.shares-list-wechat__popover-img-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  margin-left: auto;
  margin-right: auto;
}
.shares-list-wechat__popover-image {
  max-width: 100%;
  height: auto;
}
.shares-list-wechat__error-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: inherit;
  height: inherit;
  background-color: #f0f0f0;
}
.shares-list-wechat__error-image {
  @include social-icons.sad-face;
  display: block;
  width: 52px;
  height: 52px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
.shares-list-wechat__popover-image:not(:first-child),
.shares-list-wechat__popover-description:not(:first-child) {
  margin-top: 8px;
}
.shares-list-wechat__popover-spinner {
  display: block;
  width: 14px;
  height: 14px;
  border: 3px solid #000;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 1s infinite linear;
}

@media (min-width: 360px) {
  .shares-list-wechat__btn {
    width: 38px;
    height: 38px;
  }
}
@media (min-width: 376px) {
  .shares-list-wechat__btn {
    width: 40px;
    height: 40px;
  }
}
@media (min-width: vars.$md) {
  .shares-list-wechat {
    position: relative;
  }
  .shares-list-wechat__btn {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
    transition: box-shadow 0.15s linear;
    will-change: box-shadow;
  }
  .shares-list-wechat__btn:hover {
    background: #079733;
  }
  .shares-list-wechat__popover {
    left: 100%;
    top: 0;
    bottom: auto;
    margin-bottom: 0;
    transform: translateX(8px);
  }
  .shares-list-wechat__popover::before {
    content: '';
    position: absolute;
    left: -8px;
    top: 0;
    width: 8px;
    height: 100%;
  }
}
.wechat-icon * {
  @media (max-width: 370px) {
    scale: 0.8;
  }
}
</style>
