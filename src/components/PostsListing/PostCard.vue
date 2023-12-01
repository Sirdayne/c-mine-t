<template>
  <div
    class="post-card"
    :class="[isRtl && 'post-card_rtl']"
  >
    <article
      class="post-card__article rounded-lg"
      data-gtm-locator="home_hover_on_article"
    >
      <Component
        :is="linkComponent"
        v-if="postData.url"
        :href="href"
        :data-gtm-locator="`clickon_article_${postData.id}`"
        :to="to"
        :target="target"
        :language-short="to && languageShort"
        class="post-card__figure-link"
      >
        <figure
          class="post-card__figure"
          data-testid="post-card-image"
        >
          <LazyImage
            class="post-card__cover"
            :src="cover"
            :srcset="coverRetina"
            :alt="postData.title"
          />
          <span
            v-if="postData.badgeName"
            class="block absolute bottom-2 right-2 py-0.5 px-2 uppercase text-center whitespace-nowrap text-uiSStrong bg-bg-primary rounded-sm"
            data-testid="post-card-badge"
            :class="`post-card__badge_${postData.badgeSlug}`"
          >
            {{ postData.badgeName }}
          </span>
        </figure>
      </Component>
      <figure
        v-else
        class="post-card__figure"
        data-testid="post-card-image"
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
          data-testid="post-card-badge"
          :class="`post-card__badge_${postData.badgeSlug}`"
        >
          {{ postData.badgeName }}
        </span>
      </figure>
      <header
        v-if="postData.title"
        class="px-5 pt-5 md:pt-3 pb-3"
        data-testid="post-card-header"
      >
        <Component
          :is="linkComponent"
          v-if="postData.url"
          class="block hover:underline"
          :href="href"
          :to="to"
          :title="postData.title"
          :target="target"
          :language-short="to && languageShort"
        >
          <span
            class="post-card__title text-headlineMl text-fg-strong !text-[19px]"
            data-testid="post-card-title"
          >
            {{ postData.title }}
          </span>
        </Component>
        <span
          v-else
          class="post-card__title text-headlineMl text-fg-strong !text-[19px]"
          data-testid="post-card-title"
        >
          {{ postData.title }}
        </span>
      </header>
      <div
        v-if="postData.previewText"
        class="post-card__text-wrp"
      >
        <p
          class="post-card__text"
          data-testid="post-card-preview-text"
        >
          {{ postData.previewText }}
        </p>
      </div>
      <footer class="flex justify-between px-5 pb-5 md:pb-3 pt-3 md:pt-0 lg:pt-3 xxs:mt-auto">
        <p
          v-if="authorName"
          class="text-uiSDefault"
        >
          <span>
            {{ i18n.by }}
          </span>
          <LinkResolver
            v-if="postData.authorUrl && !postData.isMagazinePost"
            class="post-card__author-link hover:underline"
            data-testid="post-card-author-link"
            :to="postData.authorUrl"
            :language-short="languageShort"
          >
            {{ authorName }}
          </LinkResolver>
          <span
            v-else
            data-testid="post-card-author-text"
            class="post-card__author-text"
          >
            {{ authorName }}
          </span>
        </p>
        <time
          v-if="postData.datePublished"
          class="text-uiSWeak"
          data-testid="post-card-pulished-date"
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

export default {
  name: 'PostCard',
  components: {
    LinkResolver,
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
.post-card__date {
  margin-left: auto;
  white-space: nowrap;
  text-transform: uppercase;
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
