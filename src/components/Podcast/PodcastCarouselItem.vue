<template>
  <a
    :href="carouselItem.slug"
    :class="$style['carousel-item']"
    data-testid="podcast-carousel-item"
  >
    <img
      :src="imageSrc"
      :alt="carouselItem.title"
      :height="imageWidthHeight"
      :width="imageWidthHeight"
      :class="$style['carousel-item__image']"
    />
    {{ carouselItem.title }}
  </a>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { useStore } from '~/lib/framework';
import { type Podcast } from '~/components/Podcasts/types';

export default defineComponent({
  name: 'PodcastCarouselItem',
  props: {
    carouselItem: {
      type: Object as PropType<Podcast>,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const isMobileWidth = computed(() => store.getters['viewport/IS_MOBILE_BREAKPOINT']);
    const isDesktopWidth = computed(() => store.getters['viewport/IS_DESKTOP_WIDTH']);
    const imageWidthHeight = computed(() => {
      if (isMobileWidth.value) return '160px';
      if (isDesktopWidth.value) return '237px';

      return '180px';
    });
    const imageSrc = computed(() => {
      return props.carouselItem?.buzzsproutPodcast.artworkUrl;
    });

    return {
      imageWidthHeight,
      imageSrc,
    };
  },
});
</script>

<style module lang="scss">
@import '~/assets/styles/_vars.scss';
.carousel-item {
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  color: $color-white;
  letter-spacing: -0.02em;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  user-select: none;
  max-width: v-bind(imageWidthHeight);

  &__image {
    // reassign tailwind base styles
    max-width: inherit;
  }
}
</style>
