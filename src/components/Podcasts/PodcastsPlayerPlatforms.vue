<template>
  <section :class="$style['podcast-platforms']">
    <template v-for="platform in platforms">
      <a
        :key="platform.name"
        :href="platform.url"
        target="_blank"
        :class="$style['podcast-platforms__link']"
        data-testid="podcast-platforms-link"
      >
        <img
          :key="platform.name"
          :src="platform.logo"
          :alt="platform.name"
        />
      </a>
    </template>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { PODCASTS_PLATFORMS_WITH_TEXT } from '~/components/Podcasts/PodcastsPlatforms';

interface Platform {
  name: string;
  logo: string;
  publicName: string;
  url: string;
}
export default defineComponent({
  name: 'PodcastsPlayerPlatforms',
  props: {
    podcast: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const podcastPlatforms = PODCASTS_PLATFORMS_WITH_TEXT;

    const platforms = computed(() => {
      let localPlatforms: Array<Platform> = [];
      podcastPlatforms.forEach((platform) => {
        if (props.podcast[platform.name]) {
          localPlatforms.push({ ...platform, url: props.podcast[platform.name] });
        }
      });
      return localPlatforms;
    });
    return {
      platforms,
    };
  },
});
</script>

<style lang="scss" module>
@import '~/assets/styles/_vars.scss';
.podcast-platforms {
  display: flex;
  flex-wrap: wrap;

  &__link {
    height: 32px;
    text-decoration: none;
    margin-right: 8px;
    margin-bottom: 8px;
    &:last-child,
    &:nth-child(3) {
      margin-bottom: 0;
    }
    @media (min-width: $xs) {
      margin-bottom: 0;
    }
  }
}
</style>
