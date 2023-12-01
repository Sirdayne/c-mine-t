<template>
  <div :class="$style['podcast-hero']">
    <h1
      :class="$style['podcast-hero_heading']"
      data-testid="podcasts-page-title"
    >
      {{ podcastHeroHeading }}
    </h1>
    <p
      :class="$style['podcast-hero_desc']"
      data-testid="podcasts-page-description"
    >
      {{ podcastHeroDesc }}
    </p>
    <div :class="$style['podcast-hero_images']">
      <div
        v-for="podcast in podcasts"
        :key="podcast.id"
        :class="$style['podcast-hero_item']"
      >
        <LinkResolver
          :to="getPodcastUrlBySlug(podcast.slug)"
          :class="$style['podcast-hero_item-link']"
          :data-gtm-locator="getLocatorName(podcast.title)"
        >
          <img
            :src="podcast.buzzsproutPodcast.artworkUrl"
            :alt="podcast.title"
            :class="$style['podcast-hero_image']"
            data-testid="podcast-image"
          />
          <p
            :class="$style['podcast-hero_title']"
            data-testid="podcast-title"
          >
            {{ podcast.title }}
          </p>
        </LinkResolver>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, computed } from 'vue';
import { Podcast } from '~/components/Podcasts/types.ts';
import { useStore } from '~/lib/framework';
import LinkResolver from '~/components/Shared/LinkResolver';

export default defineComponent({
  name: 'PodcastsHero',
  props: {
    podcasts: {
      type: Array as PropType<Array<Podcast>>,
      required: true,
    },
  },
  components: {
    LinkResolver,
  },
  setup() {
    const store: any = useStore();
    const getPodcastUrlBySlug = (slug: string) => {
      return `/podcasts/${slug}`;
    };

    const getLocatorName = (item: string) => {
      const name = item.toLowerCase().replace(/\s/g, '_');
      return `menubar_clickon_podcasts_${name}`;
    };

    return {
      podcastHeroHeading: computed(() => store.state.i18n.podcastHeroHeading),
      podcastHeroDesc: computed(() => store.state.i18n.podcastHeroDesc),
      getPodcastUrlBySlug,
      getLocatorName,
    };
  },
});
</script>

<style lang="scss" module>
@import '~/assets/styles/_vars.scss';

$podcasts-gradient: linear-gradient(180deg, #000000 20.34%, #37465e 100%);
$white-blue: #e3e6e7;

.podcast-hero {
  padding: 0 10px 24px 10px;
  background: $podcasts-gradient;
  margin-bottom: 24px;

  @media (min-width: $sm) {
    display: flex;
    flex-direction: column;
    padding-top: 40px;
    margin-bottom: 32px;
  }

  @media (min-width: $md) {
    padding-bottom: 48px;
  }

  &_heading {
    font-weight: 600;
    font-size: 30px;
    line-height: 40px;
    text-align: center;
    letter-spacing: -0.02em;
    color: #fff;
    margin: 0 0 16px 0;
    padding: 16px 0 0 0;

    @media (min-width: $lg) {
      font-size: 44px;
    }
  }

  &_desc {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    color: $white-blue;
    margin: 0 auto;
    margin-bottom: 24px;

    @media (min-width: $sm) {
      max-width: 637px;
    }

    @media (min-width: $md) {
      max-width: 660px;
      line-height: 140%;
      font-size: 18px;
    }

    @media (min-width: $lg) {
      margin: 0 auto;
      margin-bottom: 40px;
    }
  }
  &_item-link {
    text-decoration: none;
    &:hover {
      .podcast-hero_image {
        border-radius: 16px;
        transform: translateZ(0);
        transition: 0.3s ease-out;
        scale: 1.07;
        -webkit-filter: drop-shadow(0px 23px 9px rgba(0, 0, 0, 0.03)) drop-shadow(0px 13px 8px rgba(0, 0, 0, 0.11))
          drop-shadow(0px 6px 6px rgba(0, 0, 0, 0.18)) drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.21))
          drop-shadow(0px 0px 0px rgba(0, 0, 0, 0.21));
        filter: drop-shadow(0px 23px 9px rgba(0, 0, 0, 0.03)) drop-shadow(0px 13px 8px rgba(0, 0, 0, 0.11))
          drop-shadow(0px 6px 6px rgba(0, 0, 0, 0.18)) drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.21))
          drop-shadow(0px 0px 0px rgba(0, 0, 0, 0.21));
      }
      .podcast-hero_title {
        color: $color-orange-500;
      }
    }
  }

  &_images {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: center;
    align-content: center;
    gap: 20px;
    max-width: 306px;
    margin: 0 auto;
    @media (min-width: $sm) {
      justify-content: center;
      text-align: center;
      display: flex;
      flex-wrap: wrap;
      max-width: unset;
    }
  }

  &_item:nth-child(even) {
    justify-self: flex-start;
  }

  &_item:nth-child(odd) {
    justify-self: flex-end;
  }

  &_item {
    max-width: 143px;
  }

  &_image {
    width: 143px;
    height: 143px;
    border-radius: 16px;
    margin: 0 0 12px 0;
  }

  &_title {
    font-weight: 700;
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    letter-spacing: -0.02em;
    color: #ffffff;
    margin: 0;
  }
}
</style>
