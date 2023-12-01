<template>
  <div
    v-if="posts.length"
    class="price-index-guides"
  >
    <h2
      v-if="hasValue(blockTitle)"
      class="price-index-guides__title"
    >
      {{ blockTitle }}
    </h2>
    <div class="price-index-guides__posts">
      <div
        v-for="(post, i) in posts"
        :key="i"
        class="price-index-guides__post-wrap"
      >
        <a
          :href="post.url"
          :title="post.title"
          class="price-index-guides__post"
        >
          <div class="price-index-guides__post-title-wrap">
            <div class="price-index-guides__post-title">
              {{ post.title }}
            </div>
          </div>
          <div class="price-index-guides__post-image-wrap">
            <LazyImage
              class="price-index-guides__post-image"
              :src="post.thumb"
              :srcset="imageSrcSet(post)"
              :alt="post.title"
            />
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import LazyImage from '~/components/Shared/LazyImage';

export default {
  name: 'PriceIndexGuides',
  components: {
    LazyImage,
  },
  props: {
    posts: {
      type: Array,
      default: () => [],
    },
    blockTitle: {
      type: String,
      default: '',
    },
  },
  methods: {
    imageSrcSet(post) {
      const { thumb, img } = post;
      return [`${thumb} 1x`, `${img} 2x`].join(', ');
    },
    hasValue(value) {
      return value.indexOf('price_index') === -1 && value.indexOf('price.index') === -1 && !!value.trim();
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

$gutter: 20px;

.price-index-guides {
  &__title {
    margin: 0;
    color: #253137;
    font-size: 15px;
    font-weight: 700;
    @media (min-width: $sm) {
      font-size: 22px;
    }
  }
  &__posts {
    @media (min-width: $sm) {
      display: flex;
      margin-left: -10px;
      margin-right: -10px;
    }
  }
  &__posts:not(:first-child) {
    margin-top: 16px;
  }
  &__post {
    display: flex;
    align-items: center;
    text-decoration: none;
    @media (min-width: $sm) {
      flex-direction: column-reverse;
    }
  }
  &__post:hover {
    text-decoration: none;
  }
  &__post:active {
    text-decoration: underline;
  }
  &__post-wrap {
    @media (min-width: $sm) {
      padding-left: 10px;
      padding-right: 10px;
      box-sizing: border-box;
      width: 33.33%;
    }
  }
  &__post-wrap:not(:first-child)::before {
    content: '';
    display: block;
    background-color: #eeeeee;
    height: 1px;
    margin: 8px 0;
    @media (min-width: $sm) {
      display: none;
    }
  }
  &__post-title-wrap {
    box-sizing: border-box;
    padding-right: 20px;
    flex-grow: 2;
    @media (min-width: $sm) {
      padding-right: 0;
      margin-top: 12px;
      width: 100%;
    }
  }
  &__post-image-wrap {
    flex-basis: 90px;
    height: 60px;
    flex-shrink: 0;
    position: relative;
    @media (min-width: $sm) {
      flex-basis: 160px;
      margin-top: 0;
      width: 100%;
    }
  }
  &__post-image {
    display: block;
    height: auto;
    width: 100%;
  }
  &__post-image-lazy {
    overflow: hidden;
    position: relative;
    padding-bottom: 67.4%;
    background-color: #f6f7f8;
  }
  &__post-image-lazy::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(100deg, #f6f7f8 10%, #edeef1 40%, #f6f7f8 80%);
    backface-visibility: hidden;
    animation: lazy-image-pending 0.75s linear infinite forwards;
    will-change: transform;
  }
  &__post-title {
    color: #253137;
    font-size: 12px;
    font-weight: 700;
    text-decoration: none;
    @media (min-width: $sm) {
      font-size: 16px;
    }
  }

  &__post:hover &__post-title,
  &__post:active &__post-title {
    color: #253137;
  }
  &__post:hover &__post-title {
    text-decoration: none;
  }
  &__post:active &__post-title {
    text-decoration: underline;
  }
}
</style>
