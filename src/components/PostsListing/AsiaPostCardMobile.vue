<template>
  <article
    :class="isBig && 'asia-post-card-mobile_big'"
    class="asia-post-card-mobile"
  >
    <LinkResolver
      class="asia-post-card-mobile__figure-link"
      :to="post.url"
      :title="post.title"
      :language-short="languageShort"
    >
      <figure class="asia-post-card-mobile__figure">
        <LazyImage
          class="asia-post-card-mobile__cover"
          :src="cover"
          :srcset="coverRetina"
          :alt="post.title"
        />
        <span
          v-if="post.badgeName && isBig"
          class="asia-post-card-mobile__badge"
          :class="`asia-post-card-mobile__badge_${post.badgeSlug}`"
        >
          {{ post.badgeName }}
        </span>
      </figure>
    </LinkResolver>
    <div class="asia-post-card-mobile__info">
      <LinkResolver
        v-if="post.title"
        :to="post.url"
        :title="post.title"
        :language-short="languageShort"
        class="asia-post-card-mobile__title-link"
      >
        <div class="asia-post-card-mobile__title">
          {{ post.title }}
        </div>
      </LinkResolver>
      <div class="asia-post-card-mobile__meta">
        <span
          v-if="post.authorName"
          class="asia-post-card-mobile__author"
        >
          <LinkResolver
            v-if="post.authorUrl"
            class="asia-post-card-mobile__author-link"
            :to="post.authorUrl"
            :language-short="languageShort"
          >
            {{ post.authorName }}<template v-if="isDateVisible">,</template>
          </LinkResolver>
          <span v-else> {{ post.authorName }}<template v-if="isDateVisible">,</template> </span>
        </span>
        <time
          v-if="isDateVisible"
          class="asia-post-card-mobile__date"
          :datetime="post.datePublished"
        >
          {{ post.dateHuman }}
        </time>
      </div>
    </div>
  </article>
</template>

<script>
import { mapState } from 'vuex';
import { POST_FALLBACK_COVER_URL } from '~/app.config';
import { getThumbnail } from '~/assets/libs/getThumbnail';
import LinkResolver from '~/components/Shared/LinkResolver';
import LazyImage from '~/components/Shared/LazyImage';

export default {
  name: 'AsiaPostsCardMobile',
  components: {
    LinkResolver,
    LazyImage,
  },
  props: {
    post: {
      type: Object,
      default: () => ({}),
    },
    isBig: {
      type: Boolean,
    },
    i18n: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState({
      languageShort: ({ currentLanguage: { short } }) => short,
    }),
    isDateVisible() {
      const { post } = this;
      return !post.isSponsored && post.datePublished;
    },
    cover() {
      return getThumbnail({
        imageUrl: this.post.cover,
        width: 370,
        defaultImage: POST_FALLBACK_COVER_URL,
      });
    },
    coverRetina() {
      const x2 = getThumbnail({
        imageUrl: this.post.cover,
        width: 740,
        defaultImage: POST_FALLBACK_COVER_URL,
      });
      return `${this.cover} 1x, ${x2} 2x`;
    },
  },
};
</script>

<style>
.asia-post-card-mobile {
  display: flex;
  flex-direction: column;
  padding: 12px 0;
}
.asia-post-card-mobile__figure-link,
.asia-post-card-mobile__title-link {
  text-decoration: none;
  color: #000000;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  display: block;
}
.asia-post-card-mobile__title-link:hover {
  color: #ffd405;
}
.asia-post-card-mobile__figure {
  position: relative;
  display: block;
  margin: 0;
  pointer-events: none;
  background-color: #f6f7f8;
}
.asia-post-card-mobile__cover {
  position: relative;
  display: block;
  overflow: hidden;
  width: 100%;
  height: 97px;
  flex-grow: 0;
  flex-shrink: 0;
}
.asia-post-card-mobile__info {
  box-sizing: border-box;
  margin-top: 8px;
}
.asia-post-card-mobile__author,
.asia-post-card-mobile__date {
  color: #999;
  font-size: 12px;
  font-weight: 600;
}
.asia-post-card-mobile__date {
  white-space: nowrap;
}
.asia-post-card-mobile__author-link {
  color: inherit;
  text-decoration: none;
  text-transform: capitalize;
}
.asia-post-card-mobile__badge {
  display: inline-block;
  min-width: 10px;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  vertical-align: middle;
  white-space: nowrap;
  text-align: center;
  background: #ffcd04;
  position: absolute;
  bottom: 10px;
  right: 16px;
  padding: 5px;
  text-transform: uppercase;
  border-radius: 4px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.75);
  color: #3d3d3d;
}

.asia-post-card-mobile_big {
  display: block;
  padding-top: 0;
  padding-bottom: 0;
}
.asia-post-card-mobile_big .asia-post-card-mobile__info {
  padding: 14px 16px;
}
.asia-post-card-mobile_big .asia-post-card-mobile__cover {
  width: 100%;
  height: 250px;
}

@media (min-width: 290px) {
  .asia-post-card-mobile {
    flex-direction: row;
  }
  .asia-post-card-mobile__info {
    padding-left: 8px;
    margin-top: 0;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }
  .asia-post-card-mobile__cover {
    width: 144px;
  }
}
</style>
