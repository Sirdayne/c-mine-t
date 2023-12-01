<template>
  <section :class="$style['related-articles']">
    <h3
      :class="$style['related-articles__title']"
      data-testid="podcast-related-article-block-title"
    >
      {{ sectionTitle }}
    </h3>
    <div
      :class="$style['related-articles__wrapper']"
      data-testid="podcast-related-article-block"
    >
      <div
        v-for="post in posts"
        :key="post.id"
      >
        <LinkResolver
          :class="$style['related-articles__link']"
          :to="post.url"
          language-short="en"
          data-testid="podcast-related-article-link"
        >
          <div :class="$style['related-articles__image-wrapper']">
            <div :class="$style['related-articles__link-image-wrapper']">
              <img
                :src="post.cover"
                :class="$style['related-articles__link-image']"
                data-testid="podcast-related-article-image"
              />
            </div>
          </div>
          <div
            :class="$style['related-articles__item-title']"
            data-testid="podcast-related-article-title"
          >
            {{ post.title }}
          </div>
        </LinkResolver>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, useStore } from '~/lib/framework';
import LinkResolver from '~/components/Shared/LinkResolver.vue';
import { computed } from 'vue';

export default defineComponent({
  name: 'PodcastRelatedArticles',
  components: { LinkResolver },
  props: {
    posts: {
      type: Array,
      required: true,
    },
  },

  setup() {
    const store = useStore<any>();
    const sectionTitle = computed(() => store.state.i18n.podcastRelatedArticlesHeading);

    return {
      sectionTitle,
    };
  },
});
</script>

<style module lang="scss">
@import '~/assets/styles/_vars.scss';
@import '~/assets/styles/_mixins.scss';

.related-articles {
  display: flex;
  flex-direction: column;

  &__title {
    @include section-title;
    margin: 0 0 24px 0;
  }

  &__wrapper {
    display: grid;
    grid-template-columns: 1fr;
    grid-row-gap: 24px;
    @media (min-width: $sm) {
      grid-template-columns: 1fr 1fr 1fr;
      grid-column-gap: 12px;
    }
  }

  &__link {
    display: flex;
    font-style: normal;
    @include section-title(16px, 400);
    line-height: 24px;
    text-decoration: none;
    cursor: pointer;
    color: $color-gray-150;
    transition: color 0.15s;
    @media (min-width: $sm) {
      display: block;
    }
  }

  &__image-wrapper {
    min-width: 140px;
    @media (min-width: $sm) {
      width: 100%;
      margin-bottom: 8px;
    }
  }

  &__link-image-wrapper {
    padding-top: 66.66%;
    position: relative;
  }

  &__link-image {
    position: absolute;
    border-radius: 4px;
    width: 100%;
    top: 0;
    border: 0;
    left: 0;
    right: 0;
    height: 100%;
    object-fit: cover;
  }

  &__item-title {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    padding: 0 20px;
    color: $color-white;
    text-decoration: none;
    @media (min-width: $sm) {
      padding: 0;
    }
  }

  &__item-title:hover {
    text-decoration: underline;
  }
}
</style>
