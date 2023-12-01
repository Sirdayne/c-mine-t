<template>
  <h3 :class="$style['authors']">
    {{ withHosts }}
    <template v-for="(author, index) in authors">
      <NuxtLink
        v-if="index === 0"
        :key="index"
        :to="getAuthorUrl(author.author.slug)"
        :class="$style['authors--name']"
        data-testid="authors-link"
      >
        {{ author.author.authorTranslates[0].name }}
      </NuxtLink>
      <span
        v-if="index > 0"
        :key="index"
      >
        {{ andHosts }}
      </span>
      <NuxtLink
        v-if="index > 0"
        :key="index"
        :class="$style['authors--name']"
        :to="getAuthorUrl(author.author.slug)"
        data-testid="authors-link"
      >
        {{ author.author.authorTranslates[0].name }}
      </NuxtLink>
    </template>
  </h3>
</template>

<script lang="ts">
import { defineComponent, useStore } from '~/lib/framework';
import { computed } from 'vue';

export default defineComponent({
  name: 'PodcastTitleAuthors',
  props: {
    authors: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const store = useStore();
    const withHosts = computed(() => store.state.i18n.podcastHostWith);
    const andHosts = computed(() => store.state.i18n.podcastHostAnd);
    const getAuthorUrl = (slug: string) => {
      return `/authors/${slug}`;
    };

    return {
      withHosts,
      andHosts,
      getAuthorUrl,
    };
  },
});
</script>

<style module lang="scss">
@import '~/assets/styles/_vars.scss';

.authors {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  margin: 0;
  color: $color-gray-150;
  @media (min-width: $xs--tablet) {
    font-size: 16px;
    line-height: 24px;
  }

  &--name {
    cursor: pointer;
    text-decoration: none;
    font-weight: 600;
    color: $color-gray-150;

    &:hover {
      color: $color-orange-500;
      text-decoration: underline;
    }
  }
}
</style>
