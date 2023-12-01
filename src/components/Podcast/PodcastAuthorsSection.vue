<template>
  <section>
    <h3
      :class="$style['authors--title']"
      data-testid="podcast-about-hosts-title"
    >
      {{ sectionTitle }}
    </h3>
    <div
      :class="$style['authors--wrapper']"
      data-testid="podcast-hosts-wrapper"
    >
      <template v-for="author in podcast.authorsWithDesc">
        <PodcastAuthor
          :key="author.id"
          :podcast-author="author"
        />
      </template>
    </div>
  </section>
</template>

<script lang="ts">
import PodcastAuthor from '~/components/Podcast/PodcastAuthor.vue';
import { computed, defineComponent } from 'vue';
import { useStore } from '~/lib/framework';

export default defineComponent({
  name: 'PodcastAuthorsSection',
  components: { PodcastAuthor },
  props: {
    podcast: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const store = useStore<any>();
    const sectionTitle = computed(() => store.state.i18n.podcastAboutTheHostsHeading);

    return {
      sectionTitle,
    };
  },
});
</script>

<style module lang="scss">
@import '~/assets/styles/_mixins.scss';
.authors {
  &--title {
    margin: 0 0 24px 0;
    @include section-title;
  }
  &--wrapper {
    display: grid;
  }
}
</style>
