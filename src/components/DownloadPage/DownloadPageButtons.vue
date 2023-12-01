<template>
  <div class="download-page-buttons">
    <a
      v-if="localI18n.appStoreButtonLabel"
      class="download-page-buttons__link"
      :href="localI18n.iOsAppUrl"
      download
      rel="noopener nofollow"
    >
      <span class="download-page-buttons__link-content">
        <span class="download-page-buttons__icon download-page-buttons__icon_apple" />
        {{ localI18n.appStoreButtonLabel }}
      </span>
    </a>
    <a
      v-if="localI18n.androidButtonLabel"
      class="download-page-buttons__link"
      :href="localI18n.androidAppUrl"
    >
      <span class="download-page-buttons__link-content">
        <span class="download-page-buttons__icon download-page-buttons__icon_android" />
        {{ localI18n.androidButtonLabel }}
      </span>
    </a>
    <div class="download-page-buttons__qr-code-wrp">
      <button
        :class="isQrCodeVisible && 'download-page-buttons__button_active'"
        class="download-page-buttons__button"
        @mouseenter="qrCodeMouseEventsHandler"
        @mouseleave="qrCodeMouseEventsHandler"
      >
        <span class="download-page-buttons__icon download-page-buttons__icon_qr-code" />
      </button>
      <Transition name="fade">
        <span
          v-if="isQrCodeVisible"
          class="download-page-buttons__qr-popover"
        >
          <img
            v-if="localI18n.qrCodeUrl"
            :src="localI18n.qrCodeUrl"
            class="download-page-buttons__qr-code"
            :alt="localI18n.qrCodeAlt"
          />
        </span>
      </Transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DownloadPageButtons',
  props: {
    localI18n: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isQrCodeVisible: false,
    };
  },
  methods: {
    qrCodeMouseEventsHandler() {
      this.isQrCodeVisible = !this.isQrCodeVisible;
    },
    handleOutsideClick() {
      this.isQrCodeVisible = false;
    },
  },
};
</script>

<style lang="scss">
@use '~/assets/styles/_icons-download-page.scss' as icons;
@import '~/assets/styles/_vars.scss';

.download-page-buttons {
  display: block;
}
.download-page-buttons__button,
.download-page-buttons__link {
  display: block;
  background: #fabf2c;
  border-radius: 3px;
}
.download-page-buttons__link {
  color: #253137;
  font-weight: 600;
  font-size: 0.9375rem;
  text-align: center;
  text-decoration: none;
  margin-top: 15px;
  padding: 8px;
  max-width: 250px;
  display: flex;
}
.download-page-buttons__link:first-child {
  margin-top: 0;
}
.download-page-buttons__link-content {
  margin-left: auto;
  margin-right: auto;
  display: flex;
  align-items: center;
  width: 110px;
}
.download-page-buttons__icon {
  display: block;
  width: 17px;
  height: 17px;
  margin-right: 15px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
.download-page-buttons__icon_apple {
  @include icons.apple(#253137);
}
.download-page-buttons__icon_android {
  @include icons.android(#253137);
}
.download-page-buttons__qr-code-wrp {
  display: none;
}

@media (hover: hover) {
  .download-page-buttons__button_active,
  .download-page-buttons__link:hover,
  .download-page-buttons__button:hover {
    background-color: #253137;
    color: #ffffff;
    cursor: pointer;
  }
  .download-page-buttons__link:hover .download-page-buttons__icon_apple {
    @include icons.apple(#ffffff);
  }
  .download-page-buttons__link:hover .download-page-buttons__icon_android {
    @include icons.android(#ffffff);
  }
  .download-page-buttons__button_active .download-page-buttons__icon_qr-code,
  .download-page-buttons__button:hover .download-page-buttons__icon_qr-code {
    @include icons.qr-code(#ffffff);
  }
}
@media (min-width: $sm) {
  .download-page-buttons {
    display: flex;
  }
  .download-page-buttons__qr-code-wrp,
  .download-page-buttons__link {
    margin-left: 15px;
  }
  .download-page-buttons__link {
    max-width: none;
    font-size: 0.8125rem;
    padding: 7px 10px;
    margin-top: 0;
  }
  .download-page-buttons__link-content {
    width: auto;
  }
  .download-page-buttons__button {
    padding: 7px;
    border: none;
    display: block;
    outline: none;
    margin: 0;
  }
  .download-page-buttons__qr-code-wrp:first-child,
  .download-page-buttons__link:first-child {
    margin-left: 0;
  }
  .download-page-buttons__icon {
    margin-right: 8px;
  }
  .download-page-buttons__icon_qr-code {
    @include icons.qr-code(#253137);
    margin-right: 0;
    width: 17px;
  }
  .download-page-buttons__qr-code-wrp {
    position: relative;
    display: block;
  }
  .download-page-buttons__qr-popover {
    position: absolute;
    width: 140px;
    height: 140px;
    background: #ffffff;
    box-shadow: 0 0 10px rgba(74, 87, 93, 0.3);
    border-radius: 3px;
    right: 0;
    top: calc(100% + 15px);
    box-sizing: border-box;
    padding: 14px;
  }
  .download-page-buttons__qr-code {
    display: block;
    max-width: 100%;
    height: auto;
  }
}
@media (min-width: $md) {
  .download-page-buttons__qr-code-wrp,
  .download-page-buttons__link {
    margin-left: 20px;
  }
  .download-page-buttons__link {
    font-weight: 600;
    font-size: 1.25rem;
    padding: 12px 14px;
  }
  .download-page-buttons__button {
    padding: 10px;
  }
  .download-page-buttons__icon {
    width: 27px;
    height: 27px;
    margin-right: 8px;
  }
  .download-page-buttons__icon_qr-code {
    width: 31px;
    height: 31px;
    margin-right: 0;
  }
  .download-page-buttons__qr-popover {
    width: 200px;
    height: 200px;
    padding: 20px;
  }
}
@media (min-width: $lg) {
  .download-page-buttons__link {
    padding-left: 26px;
    padding-right: 26px;
  }
  .download-page-buttons__qr-popover {
    width: 220px;
    height: 220px;
  }
}
</style>
