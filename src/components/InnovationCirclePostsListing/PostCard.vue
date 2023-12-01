<template>
  <div
    class="post-card"
    :class="[isRtl && 'post-card_rtl']"
  >
    <article class="post-card__article">
      <Component
        :is="linkComponent"
        v-if="postData.url.split('/news/').join('/innovation-circle/')"
        :href="href"
        :to="to"
        :target="target"
        :language-short="to && languageShort"
        class="post-card__figure-link"
      >
        <figure class="post-card__figure">
          <LazyImage
            class="post-card__cover"
            :src="cover"
            :srcset="coverRetina"
            :alt="postData.title"
          />
          <span
            v-if="postData.badgeName"
            class="post-card__badge"
            :class="`post-card__badge_${postData.badgeSlug}`"
          >
            {{ postData.badgeName }}
          </span>
        </figure>
      </Component>
      <figure
        v-else
        class="post-card__figure"
      >
        <LazyImage
          class="post-card__cover"
          :src="cover"
          :srcset="coverRetina"
          :alt="postData.title"
        />
        <span
          v-if="postData.badgeName"
          class="post-card__badge"
          :class="`post-card__badge_${postData.badgeSlug}`"
        >
          {{ postData.badgeName }}
        </span>
      </figure>
      <header
        v-if="postData.title"
        class="post-card__header"
      >
        <Component
          :is="linkComponent"
          v-if="postData.url.split('/news/').join('/innovation-circle/')"
          class="post-card__title-link"
          :href="href"
          :to="to"
          :title="postData.title"
          :target="target"
          :language-short="to && languageShort"
        >
          <span class="post-card__title">
            {{ postData.title }}
          </span>
        </Component>
        <span
          v-else
          class="post-card__title"
        >
          {{ postData.title }}
        </span>
      </header>
      <div
        v-if="postData.previewText"
        class="post-card__text-wrp"
      >
        <p class="post-card__text">
          {{ postData.previewText }}
        </p>
      </div>
      <footer class="post-card__footer">
        <p
          v-if="authorName"
          class="post-card__author"
        >
          <span>
            {{ i18n.by }}
          </span>
          <ExternalLink
            v-if="postData.authorUrl && !postData.isMagazinePost"
            class="post-card__author-link"
            :href="postData.authorUrl"
            :is-external="true"
            :new-tab="true"
          >
            {{ authorName }}
          </ExternalLink>
          <span
            v-else
            class="post-card__author-text"
          >
            {{ authorName }}
          </span>
        </p>
        <time
          v-if="!postData.isSponsored && postData.datePublished"
          class="post-card__date"
          :datetime="postData.datePublished"
        >
          {{ postData.dateHuman }}
        </time>
      </footer>
    </article>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { ROOT } from '~/store/types';
import { POST_FALLBACK_COVER_URL } from '~/app.config';
import { getThumbnail } from '~/assets/libs/getThumbnail';
import LinkResolver from '~/components/Shared/LinkResolver';
import ExternalLink from '~/components/Shared/ExternalLink';

export default {
  name: 'PostCard',
  components: {
    LinkResolver,
    ExternalLink,
    LazyImage: () => import('~/components/Shared/LazyImage'),
  },
  props: {
    postData: {
      type: Object,
      default: () => ({}),
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
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
    cover() {
      return getThumbnail({
        imageUrl: this.postData.cover,
        width: 370,
        defaultImage: POST_FALLBACK_COVER_URL,
      });
    },
    coverRetina() {
      const x2 = getThumbnail({
        imageUrl: this.postData.cover,
        width: 740,
        defaultImage: POST_FALLBACK_COVER_URL,
      });
      return `${this.cover} 1x, ${x2} 2x`;
    },
    linkComponent() {
      const {
        postData: { isMagazinePost },
      } = this;
      return isMagazinePost ? 'a' : 'LinkResolver';
    },
    href() {
      const {
        postData: { isMagazinePost, url },
      } = this;
      return isMagazinePost ? url : undefined;
    },
    to() {
      const {
        postData: { isMagazinePost, url },
      } = this;
      return isMagazinePost ? undefined : url;
    },
    target() {
      const {
        postData: { isMagazinePost },
      } = this;
      return isMagazinePost ? '_blank' : undefined;
    },
    authorName() {
      const {
        i18n,
        postData: { isMagazinePost, authorName },
      } = this;
      return isMagazinePost ? i18n.magazinePostAuthor : authorName;
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.post-card__article {
  position: relative;
  display: block;
  color: #27282d;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0 1px 20px 0 rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.15s;
}
.post-card__figure-link {
  display: block;
  text-decoration: none;
  color: inherit;
}
.post-card__figure {
  position: relative;
  display: block;
  margin: 0;
  pointer-events: none;
  background-color: #f6f7f8;
}
.post-card__cover {
  position: relative;
  display: block;
  width: 100%;
  height: 0;
  padding-top: 65.5%;
  overflow: hidden;
  border-radius: 5px 5px 0 0;
}
.post-card__badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: block;
  padding: 4px;
  text-transform: uppercase;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 700;
  white-space: nowrap;
  color: #3d3d3d;
  background-color: #ffcd04;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.75);
  border-radius: 4px;
}
.post-card__badge_danger {
  background-color: #a90329;
}
.post-card__badge_success {
  background-color: #436043;
  color: #ffffff;
}
.post-card__badge_warning {
  background-color: #c79121;
}
.post-card__badge_info {
  background-color: #385a6b;
  color: #ffffff;
}
.post-card__header {
  display: block;
  padding: 10px;
}
.post-card__title-link {
  display: block;
  text-decoration: none;
  color: inherit;
}
.post-card__title-link:hover {
  text-decoration: underline;
  color: inherit;
}
.post-card__title {
  overflow: hidden;
  font-weight: 600;
  font-size: 1rem;
}
.post-card__text-wrp {
  position: absolute;
  left: 0;
  top: 0;
  display: none;
  margin: 8%;
  overflow: auto;
  opacity: 0;
  backface-visibility: hidden;
  pointer-events: none;
  transform: translateY(10px);
  transition: transform 0.15s ease-in-out, opacity 0.15s;
}
.post-card__text {
  margin: 0;
  padding: 6% 8%;
  font-size: 0.875rem;
  font-weight: 300;
  line-height: 1.5;
  word-wrap: break-word;
  color: #ffffff;
  background-color: rgba(37, 49, 54, 0.85);
  border-radius: 5px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
}
.post-card__footer {
  display: flex;
  align-items: flex-end;
  padding: 10px;
  font-size: 0.875rem;
  color: #27282d;
}
.post-card__date {
  margin-left: auto;
  white-space: nowrap;
  text-transform: uppercase;
}
.post-card__author {
  margin: 0 10px 0 0;
}
.post-card__author-link,
.post-card__author-text {
  font-weight: 600;
}
.post-card__author-link {
  text-decoration: none;
  color: inherit;
}
.post-card__author-link:hover {
  text-decoration: underline;
  color: inherit;
}
.post-card__date + .post-card__author {
  margin-left: 8px;
  padding-left: 8px;
  border-left: 1px solid #a1a1a1;
}
.post-card__article:hover {
  box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.1);
}
.post-card__article:hover .post-card__text-wrp,
.post-card__article:focus-within .post-card__text-wrp {
  opacity: 1;
  transform: translateY(0);
}
.post-card_rtl {
  direction: rtl;
}
.post-card_rtl .post-card__date {
  order: 1;
}
.post-card_rtl .post-card__author {
  order: 2;
}

@media (min-width: $xs) {
  .post-card__footer {
    margin-top: auto;
  }
}
@media (min-width: $sm) {
  .post-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 374px;
    height: 100%;
  }
  .post-card__article {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
}
@media (min-width: $md) {
  .post-card {
    min-height: 321px;
  }
  .post-card__text-wrp {
    display: block;
  }
}
@media (min-width: $lg) {
  .post-card {
    min-height: 395px;
  }
}
</style>
