<template>
  <div
    :id="`buzzsprout-player-${podcastId}`"
    :class="$style['podcast_placement']"
    data-testid="podcast-player"
  >
    <!--    Temporary solution  => change after useExternalScript will be reworked -->
    <client-only>
      <script :src="externalScriptUrl" />
    </client-only>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { type PlayerType } from './types';

export default defineComponent({
  name: 'PodcastPlayer',
  props: {
    podcastId: {
      type: [Number, String],
      required: true,
    },
    playerType: {
      type: String as PropType<PlayerType>,
      required: true,
    },
  },
  setup(props) {
    const externalScriptUrl = computed(() => {
      const { podcastId, playerType } = props;
      return `https://www.buzzsprout.com/${podcastId}.js?container_id=buzzsprout-player-${podcastId}&player=${playerType}`;
    });

    return {
      externalScriptUrl,
    };
  },
});
</script>

<style module lang="scss">
.podcast_placement {
  margin: 10px 0 0 0;
  min-height: 380px;
}
</style>
