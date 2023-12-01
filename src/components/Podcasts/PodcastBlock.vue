<template>
  <div
    :class="$style['podcast']"
    data-testid="podcast-block"
  >
    <div
      :class="$style['podcast_head']"
      data-testid="podcast-head"
    >
      <div :class="$style['podcast_title']">{{ podcast.buzzsproutPodcast.title }}</div>
      <div
        :class="$style['podcast_author']"
        data-testid="podcast-author"
      >
        Hosted by
        <span
          v-for="(author, index) in podcast.authorsWithDesc"
          :key="index"
        >
          <span v-if="index > 0"> and </span>
          {{ author.author.authorTranslates[0].name }}
        </span>
      </div>
    </div>
    <div
      :class="$style['podcast_desc']"
      data-testid="podcast-description"
    >
      {{ podcast.description }}
    </div>
    <PodcastPlayer
      :podcast-id="podcast.buzzsproutPodcast.id"
      :player-type="podcast.playerType"
    />
    <PodcastsPlayerPlatforms :podcast="podcast" />
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import PodcastPlayer from '~/components/Podcasts/PodcastPlayer.vue';
import { Podcast } from '~/components/Podcasts/types';
import PodcastsPlayerPlatforms from '~/components/Podcasts/PodcastsPlayerPlatforms.vue';

export default defineComponent({
  name: 'PodcastBlock',
  components: {
    PodcastsPlayerPlatforms,
    PodcastPlayer,
  },
  props: {
    podcast: {
      type: Object as PropType<Podcast>,
      required: true,
    },
  },
});
</script>

<style lang="scss" module>
@import '~/assets/styles/_vars.scss';

$black: #171a1c;
$blackish: #35434a;
$gray: #809098;

.podcast {
  padding: 0 10px 0 10px;
  margin: 0 0 55px 0;

  @media (min-width: $sm) {
    padding-top: 10px;
  }
}

.podcast_head {
  margin-bottom: 16px;
}

.podcast_title {
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: -0.02em;
  color: $black;

  @media (min-width: $md) {
    font-size: 24px;
  }
}

.podcast_author {
  font-weight: 400;
  font-size: 15px;
  line-height: 22px;
  color: $gray;
}

.podcast_desc {
  font-weight: 400;
  font-size: 15px;
  line-height: 22px;
  letter-spacing: -0.01em;
  color: $blackish;
  margin-bottom: 16px;
}

.podcast_author,
.podcast_desc {
  @media (min-width: $md) {
    font-size: 16px;
  }
}
</style>
