<template>
  <article
    :class="[isRtl && 'more-about-item_rtl', post.selection && 'more-about-item_selected']"
    class="more-about-item"
  >
    <LinkResolver
      class="more-about-item__link"
      :to="post.url"
      :language-short="languageShort"
    >
      <figure
        v-if="post.cover"
        class="more-about-item__figure"
      >
        <LazyImage
          class="more-about-item__figure-image"
          :src="cover"
          :srcset="coverRetina"
          :alt="post.title"
        />
      </figure>
      <div class="more-about-item__about">
        <div
          v-if="post.title"
          class="more-about-item__title"
        >
          {{ post.title }}
        </div>
        <div
          v-if="post.previewText"
          class="more-about-item__lead"
        >
          {{ post.previewText }}
        </div>
        <div class="more-about-item__meta">
          <span
            v-if="post.dateHuman"
            class="more-about-item__date"
            >{{ post.dateHuman }}</span
          >
          <span class="more-about-item__views">
            <span class="more-about-item__icon more-about-item__eye-icon" />
            {{ post.views }}
          </span>
        </div>
      </div>
    </LinkResolver>
  </article>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { ROOT } from '~/store/types';
import { POST_FALLBACK_COVER_URL } from '~/app.config';
import { getThumbnail } from '~/assets/libs/getThumbnail';
import LinkResolver from '~/components/Shared/LinkResolver';
import LazyImage from '~/components/Shared/LazyImage.vue';

export default {
  name: 'PostMoreAboutItem',
  components: {
    LazyImage,
    LinkResolver,
  },
  props: {
    post: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState({
      languageShort: ({ currentLanguage: { short } }) => short,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
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

<style lang="scss">
@use '~/assets/styles/_icons-common.scss' as icons;
@import '~/assets/styles/_vars.scss';

.more-about-item {
  padding-left: 16px;
  padding-right: 16px;
  margin-left: -16px;
  margin-right: -16px;
}
.more-about-item__link {
  display: block;
  margin-left: -10px;
  margin-right: -10px;
  padding: 20px 10px;
  color: #000;
  text-decoration: none;
  transition: background-color 0.15s;
}
.more-about-item__figure {
  display: none;
  flex-shrink: 0;
}
.more-about-item__figure-image {
  display: block;
  width: 137px;
  height: 90px;
  position: relative;
}
.more-about-item__title,
.more-about-item__lead {
  display: inline;
  font-size: 1.125rem;
  line-height: 22px;
}
.more-about-item__title {
  font-weight: 700;
  color: inherit;
}
.more-about-item__lead {
  font-weight: 400;
  color: #999;
}
.more-about-item__meta {
  display: flex;
  align-items: center;
  margin-top: 8px;
}
.more-about-item__icon {
  display: block;
  width: 16px;
  height: 16px;
  margin-right: 4px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
.more-about-item__eye-icon {
  @include icons.eye;
}
.more-about-item__date,
.more-about-item__views {
  color: #999;
  font-size: 0.75rem;
  font-weight: 600;
}
.more-about-item__views {
  margin-left: 8px;
  display: flex;
  align-items: center;
}

.more-about-item_selected {
  background-color: #fff8e6;
}
.more-about-item_rtl {
  direction: rtl;
}
.more-about-item_rtl .more-about-item__about {
  text-align: right;
}
.more-about-item_rtl .more-about-item__icon {
  margin-right: 0;
  margin-left: 4px;
}
.more-about-item_rtl .more-about-item__views {
  margin-left: 0;
  margin-right: 8px;
}

@media (min-width: $sm) {
  .more-about-item__link {
    display: flex;
    align-items: center;
    box-sizing: border-box;
  }
  .more-about-item__figure {
    display: block;
    margin: 0 20px 0 0;
  }

  .more-about-item_rtl .more-about-item__figure {
    margin-right: 0;
    margin-left: 20px;
  }
}
</style>
