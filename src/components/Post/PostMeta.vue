<template>
  <div
    class="post-meta"
    :class="{
      'post-meta_rtl': isRtl,
    }"
  >
    <div
      v-if="post.authorUrl && post.authorName && !post.isPressRelease && !post.isMarketRelease"
      class="post-meta__author"
      :class="{
        'post-meta__author--explained': explained,
        '!ml-0': isRtl && explained,
      }"
    >
      <LinkResolver
        class="post-meta__author-link"
        :to="post.authorUrl"
        :language-short="languageShort"
      >
        <div class="post-meta__author-image">
          <ClientOnly>
            <LazyImage
              v-if="authorImage"
              :src="authorImage"
              :srcset="authorImageRetina"
              :alt="post.authorName"
              class="post-meta__author-avatar"
            />
          </ClientOnly>
        </div>
        <div
          lang="en"
          class="post-meta__author-name"
          :class="{
            'post-meta__author-name--explained': explained,
          }"
        >
          {{ post.authorName }}
        </div>
      </LinkResolver>
    </div>
    <span
      v-if="explained"
      class="text-bg-lessSubtle mx-2"
    >
      &#x2022;
    </span>
    <div
      v-if="post.categorySlug === 'press-releases'"
      class="post-meta__category-name"
    >
      {{ i18n.pressRelease }}
    </div>
    <div
      v-else-if="post.categorySlug === 'market-releases'"
      class="post-meta__category-name"
    >
      {{ i18n.marketReleases }}
    </div>
    <div
      v-if="post.datePublished && publishedAt"
      class="post-meta__publish-date"
      :class="{
        'post-meta__publish-date--explained': explained,
      }"
    >
      <time :datetime="post.datePublished">
        {{ publishedAt }}
      </time>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { ROOT } from '~/store/types';
import getProperty from '~/assets/libs/getProperty';
import { getThumbnail } from '~/assets/libs/getThumbnail';
import LinkResolver from '~/components/Shared/LinkResolver.vue';
import LazyImage from '~/components/Shared/LazyImage.vue';

export default {
  name: 'PostMeta',
  components: {
    LinkResolver,
    LazyImage,
  },
  props: {
    post: {
      type: Object,
      default: () => ({}),
    },
    explained: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState({
      i18n: ({ i18n }) => i18n,
      languageShort: ({ currentLanguage: { short } }) => short,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
      isJp: ROOT.IS_JP,
    }),
    authorImage() {
      const avatar = getProperty(this, 'post.authorAvatar', '');
      return getThumbnail({
        imageUrl: avatar,
        width: 32,
      });
    },
    authorImageRetina() {
      const avatar = getProperty(this, 'post.authorAvatar', '');
      const w32 = getThumbnail({
        imageUrl: avatar,
        width: 32,
      });
      const w64 = getThumbnail({
        imageUrl: avatar,
        width: 64,
      });
      return `${w32} 1x, ${w64} 2x`;
    },
    publishedAt() {
      const { isJp, post } = this;
      return isJp ? post.humanDateTime : post.dateHuman;
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.post-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 0;
}
.post-meta__author {
  margin-right: auto;
  &--explained {
    margin-right: 0;
  }
}
.post-meta__author-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}
.post-meta__author-image {
  display: block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}
.post-meta_rtl .post-meta__author-image {
  margin-right: 0;
  margin-left: 10px;
}
.post-meta__author-avatar {
  position: relative;
  display: block;
  width: 100%;
  height: 0;
  padding-top: 100%;
}
.post-meta__author-name {
  color: #000;
  letter-spacing: 0.23px;
  text-transform: uppercase;
  font-size: 0.625rem;
  border-bottom: 1px solid transparent;
  transition: border-bottom 0.15s;
  &--explained {
    color: #dee5e8;
  }
}
.post-meta__category-name {
  color: #000;
  letter-spacing: 0.23px;
  font-size: 0.625rem;
  text-transform: uppercase;
  transition: color 0.15s;
  margin-right: auto;
}
.post-meta__author-name:hover {
  border-bottom: 1px solid $color-accent;
}
.post-meta__category-name:hover {
  color: $color-accent;
}
.post-meta__publish-date {
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.23px;
  color: #000000;
  &--explained {
    color: #dee5e8;
  }
}
.post-meta_rtl {
  direction: rtl;
}
.post-meta_rtl .post-meta__author,
.post-meta_rtl .post-meta__category-name {
  margin-left: auto;
  margin-right: 0;
}
@media (min-width: $md) {
  .post-meta__publish-date,
  .post-meta__author-name,
  .post-meta__category-name {
    font-size: 0.8125rem;
    letter-spacing: 0.3px;
  }
  .post-meta__author-image {
    width: 32px;
    height: 32px;
  }
}
</style>
