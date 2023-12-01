<template>
  <div
    class="footer-app-china"
    :class="isRtl && 'footer-app-china_rtl'"
  >
    <ul class="footer-app-china__list">
      <li
        v-for="(item, index) in mobileApps"
        :key="index"
        class="footer-app-china__item"
      >
        <a
          v-if="item.type"
          class="btn footer-app-china__link"
          rel="noopener nofollow"
          :href="item.url"
          :aria-label="item.title"
        >
          <span :class="`footer-app-china__icon footer-app-china__icon_${item.type}`" />
          <span
            v-if="!isDesktop"
            class="footer-app-china__title"
          >
            {{ item.title }}
          </span>
        </a>
      </li>
      <li
        v-if="isDesktop"
        class="footer-app-china__item footer-app-china__qr"
      >
        <img
          :src="i18n.qrCodeChina"
          alt="qr"
        />
        <button class="btn footer-app-china__link">
          <span :class="`footer-app-china__icon footer-app-china__icon_qr`" />
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { ROOT, VIEWPORT } from '~/store/types';

export default {
  name: 'FooterChinaApp',
  computed: {
    ...mapState({
      i18n: ({ i18n }) => i18n,
    }),
    ...mapGetters('viewport', {
      isDesktop: VIEWPORT.IS_DESKTOP_WIDTH,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
    mobileApps() {
      const { i18n } = this;
      return [
        {
          type: 'ios',
          title: i18n.iosAppTitle,
          url: i18n.iosAppChinaUrl,
        },
        {
          type: 'android',
          title: i18n.androidAppTitle,
          url: i18n.androidAppChinaUrl,
        },
      ];
    },
  },
};
</script>

<style scoped lang="scss">
@use '~/assets/styles/_icons-socials.scss' as social-icons;
@import '~/assets/styles/_vars.scss';

.footer-app-china__list {
  display: flex;
  margin: 0 -5px;
  padding: 0;
}
.footer-app-china__item {
  box-sizing: border-box;
  display: block;
  padding: 0 5px;
  width: 50%;
}
.footer-app-china__link {
  display: block;
  white-space: nowrap;
  background: #394347;
  width: 100%;
  max-width: initial;
  height: 50px;
  padding: 8px 8px;
  box-sizing: border-box;
  color: #fafafa;
  border-radius: 5px;
  cursor: pointer;
  transition: color 0.25s ease-out;
}
.footer-app-china__link:hover {
  color: #fabf2c;
}
.footer-app-china__link span {
  vertical-align: middle;
  display: inline-block;
  transition: background-image 0.25s ease-out;
}
.footer-app-china__icon {
  width: 28px;
  height: 34px;
}
.footer-app-china__icon_ios {
  @include social-icons.ios(#fafafa);
  transform: translateX(-8px);
}
.footer-app-china__icon_android {
  @include social-icons.android(#fafafa);
  transform: translateX(-14px);
}
.footer-app-china__icon_qr {
  @include social-icons.qr(#fafafa);
  height: 28px;
}
.footer-app-china__link:hover .footer-app-china__icon_ios {
  @include social-icons.ios(#fabf2c);
}
.footer-app-china__link:hover .footer-app-china__icon_android {
  @include social-icons.android(#fabf2c);
}
.footer-app-china__link:hover .footer-app-china__icon_qr {
  @include social-icons.qr(#fabf2c);
}
.footer-app-china__qr {
  position: relative;
}
.footer-app-china__qr img {
  opacity: 0;
  visibility: hidden;
  position: absolute;
  bottom: calc(100% + 12px);
  right: 8px;
  min-width: 168px;
  width: 168px;
  max-width: initial;
  height: 168px;
  border: 5px solid #394347;
  border-radius: 5px;
  background: #1a1b1d;
  transition: opacity 0.25s ease-in-out;
}
.footer-app-china__qr:hover img {
  opacity: 1;
  visibility: visible;
}
.footer-app-china__title {
  padding-left: 10px;
  font-weight: 600;
  font-size: 14px;
}
.footer-app-china_rtl {
  direction: rtl;
}
@media (min-width: $sm) {
  .footer-app-china__list {
    margin: 0 -7px;
  }
  .footer-app-china__item {
    width: auto;
    padding: 0 7px;
  }
  .footer-app-china__link {
    width: 50px;
    text-align: center;
  }
  .footer-app-china__icon_android,
  .footer-app-china__icon_ios {
    transform: none;
  }
  .footer-app-china__title {
    display: none;
  }
}
@media (min-width: $md) {
  .footer-app-china__list {
    display: inline-flex;
  }
}
</style>
