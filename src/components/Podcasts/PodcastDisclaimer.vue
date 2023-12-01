<template>
  <div
    :class="{
      [$style['podcast-disclaimer']]: true,
      [$style['podcast-disclaimer--single-podcast']]: isSinglePodcastPage,
    }"
    data-testid="podcast-disclaimer"
  >
    <p
      v-if="podcast && podcast.disclaimerPrefix"
      :class="{
        [$style['podcast-disclaimer_text']]: true,
        [$style['podcast-disclaimer_text_title']]: true,
      }"
      data-testid="podcast-disclaimer-text"
    >
      {{ podcast.disclaimerPrefix }}
    </p>
    <p
      :class="$style['podcast-disclaimer_text']"
      data-testid="podcast-disclaimer-text"
    >
      <span
        :class="$style['podcast-disclaimer_text_title']"
        data-testid="podcast-disclaimer-title"
        >Disclaimer.
      </span>
      {{ podcastDisclaimer }}
    </p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRoute, useStore } from '~/lib/framework';

export default defineComponent({
  name: 'PodcastDisclaimer',
  props: {
    podcast: {
      type: Object,
      required: false,
      default: () => ({
        disclaimerPrefix: '',
      }),
    },
  },
  setup() {
    const store: any = useStore();
    const route = useRoute();
    const podcastDisclaimer = computed(() => store.state.i18n.podcastDisclaimer);
    const isSinglePodcastPage = computed(() => {
      return route?.value?.name === 'podcasts-slug';
    });
    return {
      podcastDisclaimer,
      isSinglePodcastPage,
    };
  },
});
</script>

<style lang="scss" module>
@import '~/assets/styles/_vars.scss';

$black: #171a1c;
$gray: #a9a9a9;
$whitegray: #e3e6e7;

.podcast-disclaimer {
  position: relative;
  padding: 32px 10px 0 10px;
  margin-bottom: 72px;

  @media (min-width: $sm) {
    margin-bottom: 120px;
  }
  @media (min-width: $md) {
    margin-bottom: 149px;
  }
  @media (min-width: $lg) {
    margin-bottom: 155px;
    padding-top: 24px;
  }

  &::before {
    content: '';
    width: calc(100% - 20px);
    border-top: 1px solid $whitegray;
    position: absolute;
    top: 0;
  }

  &_text {
    font-weight: 400;
    font-size: 12px;
    line-height: 24px;
    color: $gray;
    margin: 0;
  }

  &_text_title {
    font-weight: 600;
  }

  &--single-podcast {
    color: $color-gray-400;
    opacity: 0.5;
    padding: 32px 0;
    margin-bottom: 48px;
    @media screen and (min-width: $md) {
      margin-bottom: 64px;
    }
    @media screen and (min-width: $lg) {
      padding: 24px 0;
    }

    &::before {
      content: '';
      width: 100%;
      border-top: 1px solid rgba($color-gray-400, 0.2);
      position: absolute;
      top: 0;
    }

    &::after {
      content: '';
      width: 100%;
      border-top: 1px solid rgba($color-gray-400, 0.2);
      position: absolute;
      bottom: 0;
    }
  }
}
</style>
