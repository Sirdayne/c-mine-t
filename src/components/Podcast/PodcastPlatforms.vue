<template>
  <section
    :class="$style['listen-on']"
    data-testid="podcast-listen-on-block"
  >
    <span :class="$style['listen-on__title']">{{ sectionTitle }}:</span>
    <div :class="$style['listen-on__platform-wrapper']">
      <template v-for="platform in platforms">
        <a
          :key="platform.name"
          :href="platform.url"
          target="_blank"
          :class="$style['listen-on__link']"
          data-testid="podcast-listen-on-icon"
        >
          <img
            :key="platform.name"
            :src="platform.logo"
            height="40"
            width="40"
            :alt="platform.name"
          />
          <div :class="$style['listen-on__popup']">
            {{ platform.publicName }}
          </div>
        </a>
      </template>
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { PODCAST_PLATFORMS } from '~/components/Podcasts/PodcastsPlatforms';
import { useStore } from '~/lib/framework';

export default defineComponent({
  name: 'PodcastPlatforms',
  props: {
    podcast: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const store = useStore<any>();
    const sectionTitle = computed(() => store.state.i18n.podcastListenOnHeading);

    const podcastPlatforms = PODCAST_PLATFORMS;
    const platforms = computed(() => {
      let localPlatforms = [];
      podcastPlatforms.forEach((platform) => {
        if (props.podcast[platform.name]) {
          localPlatforms.push({ ...platform, url: props.podcast[platform.name] });
        }
      });
      return localPlatforms;
    });

    return {
      platforms,
      sectionTitle,
    };
  },
});
</script>

<style module lang="scss">
@import '~/assets/styles/_vars.scss';
.listen-on {
  display: flex;
  flex-direction: column;
  @media screen and (min-width: $md) {
    flex-direction: row;
    align-items: flex-start;
  }
  &__title {
    margin-right: 16px;
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 28px;
    display: block;
    margin-bottom: 16px;
    white-space: nowrap;
    @media screen and (min-width: $md) {
      margin-bottom: 0;
    }
  }
  &__link {
    text-decoration: none;
    margin: 4px;
    display: inline-block;
    height: 40px;
    position: relative;
    &:hover .listen-on__popup {
      @media (min-width: $md) {
        display: inline-block;
      }
    }
  }
  &__popup {
    display: none;
    position: absolute;
    top: -50%;
    left: 0;
    min-width: 80px;
    padding: 8px;
    color: $color-gray-150;
    border-radius: 8px;
    text-align: center;
    transform: translate(-20%, -75%);
    background: $color-black-950;
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 27px;
  }
}
</style>
