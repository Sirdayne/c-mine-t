<template>
  <div :class="$style['podcast-author']">
    <OptimizedImage
      :height="imageSize"
      :width="imageSize"
      data-testid="podcast-authors-image"
      :src="authorAvatarUrl"
    />
    <div :class="$style['podcast-author--body']">
      <NuxtLink
        :class="$style['podcast-author--name']"
        :to="authorUrl"
        data-testid="podcast-authors-link"
      >
        {{ authorName }}
      </NuxtLink>
      <p
        :class="$style['podcast-author--about']"
        data-testid="podcast-authors-description"
      >
        {{ podcastAuthor.description }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { AUTHOR_FALLBACK_FEMALE_URL, AUTHOR_FALLBACK_MALE_URL } from '~/app.config';
import { OptimizedImage } from '~/lib/image';

const IMAGE_SIZE = 92;
export default defineComponent({
  name: 'PodcastAuthor',
  components: { OptimizedImage },
  props: {
    podcastAuthor: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const imageSize = IMAGE_SIZE;
    const authorAvatarUrl = computed(() => {
      if (props.podcastAuthor?.author.avatar) return props.podcastAuthor.author.avatar;

      return props.podcastAuthor.author.gender === 'female' ? AUTHOR_FALLBACK_FEMALE_URL : AUTHOR_FALLBACK_MALE_URL;
    });
    const authorName = computed(() => {
      if (!props?.podcastAuthor?.author?.authorTranslates[0]?.name) return '';

      return props?.podcastAuthor?.author?.authorTranslates[0]?.name;
    });
    const authorUrl = computed(() => {
      return `/authors/${props?.podcastAuthor.author.slug}`;
    });

    return {
      authorAvatarUrl,
      authorName,
      authorUrl,
      imageSize,
    };
  },
});
</script>

<style module lang="scss">
@import '~/assets/styles/_vars.scss';
@import '~/assets/styles/_mixins.scss';
.podcast-author {
  display: flex;
  margin-bottom: 24px;
  &--body {
    margin-left: 16px;
    @media screen and (min-width: $md) {
      margin-left: 20px;
    }
  }
  &--name,
  &--about {
    margin: 0;
  }
  &--about {
    color: $color-gray-150;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
  }
  &--name {
    margin-bottom: 8px;
    cursor: pointer;
    color: $color-white;
    text-decoration: none;
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 28px;
    @include section-title(16px);
    @media (min-width: $md) {
      @include section-title(20px);
    }
    &:hover {
      color: $color-orange-500;
      text-decoration: underline;
    }
  }
}
</style>
