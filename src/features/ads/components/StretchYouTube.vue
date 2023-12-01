<template>
  <div class="stretch-youtube rounded-containerM">
    <div
      v-if="!deviceInfo.desktop"
      class="stretch-youtube__hint"
    >
      <span class="stretch-youtube__hint-icon" />
    </div>
    <div class="stretch-youtube__wrp">
      <div class="stretch-youtube__video-wrp">
        <YoutubeAutoplay
          class="stretch-youtube__video"
          :video-id="props.youtubeVideoId"
        />
      </div>
      <div
        class="stretch-youtube__meta"
        :class="{ 'stretch-youtube__meta--rtl': isRtl }"
      >
        <div
          v-if="deviceInfo.desktop"
          class="stretch-youtube__hint"
        >
          <span class="stretch-youtube__hint-icon" />
        </div>
        <a
          v-if="props.title"
          class="stretch-youtube__title-link"
          :class="{ 'stretch-youtube__title-link--rtl': isRtl }"
          rel="noopener"
          target="_blank"
          data-gtm-locator="home_youtube_clickon_video"
          :href="`https://youtu.be/${props.youtubeVideoId}`"
        >
          {{ props.title }}
        </a>
        <p
          v-if="props.description"
          class="stretch-youtube__desc"
          :class="{ 'stretch-youtube__desc--rtl': isRtl }"
          v-html="props.description"
        />
        <div
          v-if="i18n.stretchWatchNow && adItem.getRedirectUrl()"
          class="stretch-youtube__action"
        >
          <a
            class="stretch-youtube__action-link"
            target="_blank"
            rel="noopener"
            data-gtm-locator="home_youtube_clickon_subscribed"
            :href="adItem.getRedirectUrl()"
          >
            <span class="stretch-youtube__link-wrp">
              <span class="stretch-youtube__link-icon" />
              <span
                v-if="i18n.stretchWatchNow"
                class="stretch-youtube__link-cap"
                :class="{ 'stretch-youtube__link-cap--rtl': isRtl }"
              >
                {{ i18n.stretchWatchNow }}
              </span>
            </span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '~/lib/framework';
import { ROOT } from '~/store/types';
import { useAdSlotContext, useCustomRenderingProps } from '~/features/ads/adslot/useAdSlotContext';
import { CustomRenderingViews } from '~/features/ads/core/CustomRenderingViews';
import YoutubeAutoplay from '~/components/Shared/YoutubeAutoplay.vue';
import { useDeviceInfo } from '~/lib/device-detector';

const store = useStore();
const isRtl = computed(() => store.getters[ROOT.IS_RTL]);
const i18n = computed(() => store.state.i18n);
const { adItem } = useAdSlotContext();
const props = useCustomRenderingProps(CustomRenderingViews.STRETCH_YOUTUBE);

const deviceInfo = useDeviceInfo();
</script>

<style lang="scss">
@use '~/assets/styles/_icons-socials.scss' as social-icons;
@import '~/assets/styles/_vars.scss';

.stretch-youtube {
  display: block;
  padding: 32px;
  text-decoration: none;
  color: #27282d;
  background-color: #ffffff;
  border-top: 2px solid #ec2028;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  box-shadow: 0 1px 20px 0 rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.15s;

  @media (min-width: $md) {
    display: flex;
    flex-direction: column;
  }
}
.stretch-youtube__hint {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 32px;

  @media (min-width: $md) {
    flex-shrink: 0;
    justify-content: flex-start;
    flex-wrap: nowrap;
  }
}
.stretch-youtube__hint-icon {
  @include social-icons.youtube-horizontal-colored;
  display: block;
  width: 107px;
  height: 24px;
  margin: 4px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;

  @media (min-width: $md) {
    margin: 0 8px 0 0;
  }
}
.stretch-youtube__wrp {
  @media (min-width: $md) {
    flex-direction: row;
    align-items: center;
    height: 100%;
    margin-top: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
}
.stretch-youtube__video-wrp {
  position: relative;
  display: block;
  width: 100%;
  height: 0;
  padding-top: calc(56.25% + 9px);
  overflow: hidden;

  @media (min-width: $md) {
    order: 2;
    flex-shrink: 0;
    align-self: center;
    height: 100%;
  }
  @media (min-width: $md) {
    padding-top: 173px;
    border-radius: 4px;
  }
  @media (min-width: $lg) {
    padding-top: 302px;
  }
}
.stretch-youtube__video {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
.stretch-youtube__meta {
  margin-top: 32px;

  @media (min-width: $md) {
    display: flex;
    flex-direction: column;
    height: 100%;
    order: 1;
    margin-top: 0;
    margin-right: 18px;
  }
  @media (min-width: $md) {
    margin-right: 64px;
  }
}
.stretch-youtube__meta--rtl {
  direction: rtl;
  @media (min-width: $md) {
    margin-left: 18px;
    margin-right: 0;
  }
  @media (min-width: $md) {
    margin-left: 64px;
    margin-right: 0;
  }
}
.stretch-youtube__title-link,
.stretch-youtube__title-link:hover {
  display: block;
  color: inherit;
  overflow-wrap: break-word;
  word-break: break-word;
  word-wrap: break-word;
  text-decoration: none;
  font-size: 23px;
  font-weight: 600;
  line-height: 28px;
  letter-spacing: -0.02em;
  text-align: center;

  @media (min-width: $md) {
    flex-shrink: 0;
    font-size: 28px;
    font-weight: 600;
    line-height: 34px;
    letter-spacing: -0.02em;
    text-align: left;
  }
}
.stretch-youtube__title-link--rtl,
.stretch-youtube__title-link--rtl:hover {
  text-align: right;

  @media (min-width: $md) {
    text-align: right;
  }
}
.stretch-youtube__desc {
  margin: 16px 0 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0;
  overflow-wrap: break-word;
  word-break: break-word;
  word-wrap: break-word;
  text-align: center;

  @media (min-width: $md) {
    flex-grow: 1;
    font-size: 16px;
    font-weight: 400;
    line-height: 26px;
    letter-spacing: -0.01em;
    text-align: left;
  }
}
.stretch-youtube__desc--rtl {
  text-align: right;
}
.stretch-youtube__action {
  margin-top: 16px;
  text-align: center;

  @media (min-width: $md) {
    flex-shrink: 0;
    text-align: inherit;
  }
}
.stretch-youtube__action-link {
  display: inline-block;
  height: 32px;
  padding: 0 16px;
  text-decoration: none;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #ffffff;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background-color: rgba(236, 32, 39, 1);
  transition: background-color 0.15s;
}
.stretch-youtube__action-link:hover {
  text-decoration: none;
  color: #ffffff;
  background-color: rgba(236, 32, 39, 0.8);
}
.stretch-youtube__link-wrp {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.stretch-youtube__link-icon {
  @include social-icons.youtube-play-white;
  display: block;
  width: 20px;
  height: 14px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
.stretch-youtube__link-cap {
  margin-left: 8px;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0;
  text-align: center;
}
.stretch-youtube__link-cap--rtl {
  margin-right: 8px;
}
.stretch-youtube:hover {
  box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.1);
}
</style>
