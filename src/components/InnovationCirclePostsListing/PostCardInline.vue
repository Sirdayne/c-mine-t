<template>
  <article
    class="post-card-inline"
    :class="[isRtl && 'post-card-inline_rtl']"
  >
    <LinkResolver
      v-if="!isWithoutImageTheme"
      class="post-card-inline__figure-link"
      tabindex="-1"
      :to="postData.url.split('/news/').join('/innovation-circle/')"
      :language-short="languageShort"
    >
      <figure class="post-card-inline__figure">
        <LazyImage
          class="post-card-inline__cover"
          :src="cover"
          :srcset="coverRetina"
          :alt="postData.title"
        />
        <span
          v-if="postData.badgeName"
          class="post-card-inline__badge"
          :class="`post-card-inline__badge_${postData.badgeSlug}`"
        >
          {{ postData.badgeName }}
        </span>
      </figure>
    </LinkResolver>
    <div class="post-card-inline__content">
      <div class="post-card-inline__header">
        <LinkResolver
          v-if="postData.title"
          class="post-card-inline__title-link"
          :to="postData.url.split('/news/').join('/innovation-circle/')"
          :language-short="languageShort"
        >
          <span class="post-card-inline__title">
            {{ postData.title }}
          </span>
        </LinkResolver>
        <div class="post-card-inline__meta">
          <time
            v-if="postData.datePublished && postData.dateHuman"
            class="post-card-inline__date"
            :datetime="postData.datePublished"
          >
            {{ postData.dateHuman }}
          </time>
          <p
            v-if="postData.authorName"
            class="post-card-inline__author"
          >
            <span v-if="!isWithoutImageTheme">{{ i18n.by }}</span>
            <ExternalLink
              v-if="postData.authorUrl"
              class="post-card-inline__link"
              :href="postData.authorUrl"
              :is-external="true"
              :new-tab="true"
            >
              {{ postData.authorName }}
            </ExternalLink>
            <span v-else>
              {{ postData.authorName }}
            </span>
          </p>
        </div>
      </div>
      <p
        v-if="postData.previewText"
        class="post-card-inline__text"
        v-html="postData.previewText"
      />
      <div
        v-if="postData.showStats && areStatsShown"
        class="post-card-inline__stats"
      >
        <span
          v-if="doViewsExist"
          class="post-card-inline__stats-item"
        >
          <span class="post-card-inline__stats-icon post-card-inline__eye-icon" />
          <span> &nbsp;{{ postData.views }} </span>
        </span>
      </div>
    </div>
  </article>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { ROOT } from '~/store/types';
import { POST_FALLBACK_COVER_URL } from '~/app.config';
import { getThumbnail } from '~/assets/libs/getThumbnail';
import LinkResolver from '~/components/Shared/LinkResolver';
import ExternalLink from '~/components/Shared/ExternalLink';

export default {
  name: 'PostCardInline',
  components: {
    LinkResolver,
    ExternalLink,
    LazyImage: () => import('~/components/Shared/LazyImage'),
  },
  props: {
    theme: {
      type: String,
      default: '',
      validator(value) {
        return ['inline', 'without-image'].includes(value);
      },
    },
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
  },
  created() {
    const { postData } = this;
    this.doViewsExist = postData.views > 0;
    this.areStatsShown = this.doViewsExist && !(postData.isPressRelease || postData.isExplained);
    this.isWithoutImageTheme = this.theme.includes('without-image');
    this.cover = getThumbnail({
      imageUrl: postData.cover,
      width: 370,
      defaultImage: POST_FALLBACK_COVER_URL,
    });
    const coverX2 = getThumbnail({
      imageUrl: postData.cover,
      width: 740,
      defaultImage: POST_FALLBACK_COVER_URL,
    });
    this.coverRetina = `${this.cover} 1x, ${coverX2} 2x`;
  },
};
</script>

<style lang="scss">
@use '~/assets/styles/_icons-common.scss' as icons;
@import '~/assets/styles/_vars.scss';

.post-card-inline {
  display: block;

  @media (min-width: $sm) {
    display: flex;
    align-items: flex-start;
  }
}
.post-card-inline__figure-link {
  flex-shrink: 0;
  display: block;

  @media (min-width: $sm) {
    margin-right: 16px;
  }
}
.post-card-inline__figure {
  position: relative;
  display: block;
  width: 100%;
  height: auto;
  margin: 0;
  background-color: #f6f7f8;

  @media (min-width: $sm) {
    width: 200px;
  }
  @media (min-width: $md) {
    width: 190px;
  }
  @media (min-width: $lg) {
    width: 230px;
  }
}
.post-card-inline__figure::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  box-shadow: 0 2px 2px 0 rgba(195, 156, 4, 0.75);
  opacity: 0;
  transition: opacity 0.15s;
}
.post-card-inline__cover {
  position: relative;
  display: block;
  width: 100%;
  height: 0;
  padding-top: 56.25%;
}
.post-card-inline__badge {
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
.post-card-inline__badge_danger {
  background-color: #a90329;
}
.post-card-inline__badge_success {
  background-color: #436043;
  color: #ffffff;
}
.post-card-inline__badge_warning {
  background-color: #c79121;
}
.post-card-inline__badge_info {
  background-color: #385a6b;
  color: #ffffff;
}
.post-card-inline__content {
  flex-grow: 1;
}
.post-card-inline__header {
  display: block;
}
.post-card-inline__title-link {
  display: block;
  margin-top: 8px;
  text-decoration: none;
  color: #27282d;

  @media (min-width: $sm) {
    margin-top: 0;
  }
}
.post-card-inline__title-link:hover {
  color: inherit;
  text-decoration: underline;
}
.post-card-inline__title {
  font-weight: 600;
  line-height: 1.5;
  font-size: 0.875rem;
}
.post-card-inline__meta {
  display: flex;
  align-items: flex-start;
  margin-top: 8px;
  font-size: 0.875rem;
  line-height: 1.375;
  color: #a1a1a1;
}
.post-card-inline__date {
  margin: 0;
  text-transform: uppercase;
}
.post-card-inline__author {
  margin: 0;
}
.post-card-inline__date + .post-card-inline__author {
  margin-left: 8px;
  padding-left: 8px;
  border-left: 1px solid #a1a1a1;
}
.post-card-inline__link {
  text-decoration: none;
  color: inherit;
}
.post-card-inline__link:hover {
  color: inherit;
  text-decoration: underline;
}
.post-card-inline__text {
  margin: 8px 0 0;
  font-size: 0.875rem;
  word-wrap: break-word;
  color: #27282d;
}
.post-card-inline__stats {
  display: block;
  margin-top: 4px;
  color: #555555;
}
.post-card-inline__stats-item {
  display: flex;
  align-items: center;
  line-height: normal;
  font-size: 0.875rem;
}
.post-card-inline__stats-icon {
  display: block;
  width: 19px;
  height: 14px;
  margin-right: 6px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
.post-card-inline__eye-icon {
  @include icons.eye(#555555);
}
.post-card-inline__article:hover .post-card-inline__figure::after {
  opacity: 1;
}
.post-card-inline_rtl {
  direction: rtl;
}
.post-card-inline_rtl .post-card-inline__figure-link {
  @media (min-width: $sm) {
    margin-left: 16px;
    margin-right: 0;
  }
}
.post-card-inline_rtl .post-card-inline__date + .post-card-inline__author {
  margin-left: 0;
  padding-left: 0;
  border-left: 0;
  margin-right: 8px;
  padding-right: 8px;
  border-right: 1px solid #a1a1a1;
}
</style>
