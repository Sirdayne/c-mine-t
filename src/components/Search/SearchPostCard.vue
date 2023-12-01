<template>
  <div class="post-item">
    <div class="post-item__thumbnail">
      <Component
        :is="linkComponent"
        :href="href"
        :to="to"
        :target="target"
        :language-shot="to && languageShort"
      >
        <div class="image-container">
          <LazyImage
            :src="cover"
            :srcset="coverRetina"
            :alt="post.title"
            class="post-item__lazy-image"
            data-testid="search-article-cover"
          />
          <p :class="`sponsored post-item__badge post-item__badge-${post.badgeSlug}`">
            {{ post.badgeName }}
          </p>
        </div>
      </Component>
    </div>
    <div class="post-item__content">
      <h2
        class="header"
        data-testid="search-article-title"
      >
        <Component
          :is="linkComponent"
          :href="href"
          :to="to"
          :target="target"
          :language-shot="to && languageShort"
        >
          <span :inner-html.prop="post.title | highlight" />
        </Component>
      </h2>
      <div
        class="info"
        data-testid="search-article-publication-date"
      >
        <time class="date">{{ post.dateHuman }}</time> |
        <span
          class="author"
          data-testid="search-article-author"
        >
          {{ i18n.by }}
          <ExternalLink
            v-if="post.authorUrl && !post.isMagazinePost"
            :href="post.authorUrl"
            :is-external="true"
            :new-tab="true"
          >
            {{ authorName }}
          </ExternalLink>
          <span v-else>
            {{ authorName }}
          </span>
        </span>
      </div>
      <p
        v-if="post.previewText"
        class="text"
        data-testid="search-article-text"
      >
        <Component
          :is="linkComponent"
          :href="href"
          :to="to"
          :target="target"
          :language-shot="to && languageShort"
        >
          <span :inner-html.prop="post.previewText | highlight" />
        </Component>
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LinkResolver from '~/components/Shared/LinkResolver';
import { getThumbnail } from '~/assets/libs/getThumbnail';
import { POST_FALLBACK_COVER_URL } from '~/app.config';
import ExternalLink from '~/components/Shared/ExternalLink';
import LazyImage from '~/components/Shared/LazyImage.vue';

export default {
  name: 'SearchPostCard',
  components: {
    LinkResolver,
    ExternalLink,
    LazyImage,
  },
  filters: {
    highlight(value) {
      const params = new URLSearchParams(window.location.search);
      const query = params.get('query');

      const newText = value.replace(new RegExp(decodeURI(query), 'i'), (foundText) => {
        return `<em data-testid="search-highlights">${foundText}</em>`;
      });

      return newText;
    },
  },
  props: {
    post: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    cover: '',
    coverRetina: '',
  }),
  computed: {
    ...mapState({
      languageShort: ({ currentLanguage }) => currentLanguage.short,
      i18n: ({ i18n }) => i18n,
    }),
    linkComponent() {
      const {
        post: { isMagazinePost },
      } = this;
      return isMagazinePost ? 'a' : 'LinkResolver';
    },
    href() {
      const {
        post: { isMagazinePost, url },
      } = this;
      return isMagazinePost ? url : undefined;
    },
    to() {
      const {
        post: { isMagazinePost, url },
      } = this;
      return isMagazinePost ? undefined : url;
    },
    target() {
      const {
        post: { isMagazinePost },
      } = this;
      return isMagazinePost ? '_blank' : undefined;
    },
    authorName() {
      const {
        i18n,
        post: { isMagazinePost, authorName },
      } = this;
      return isMagazinePost ? i18n.magazinePostAuthor : authorName;
    },
  },
  created() {
    this.cover = getThumbnail({
      imageUrl: this.post.cover,
      width: 370,
      defaultImage: POST_FALLBACK_COVER_URL,
    });
    const coverX2 = getThumbnail({
      imageUrl: this.post.cover,
      width: 740,
      defaultImage: POST_FALLBACK_COVER_URL,
    });
    this.coverRetina = `${this.cover} 1x, ${coverX2} 2x`;
  },
};
</script>

<style lang="scss" scoped>
@import '~/assets/styles/_vars.scss';

.post-item {
  $pi: &;
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;

  &:hover .image-container {
    -webkit-box-shadow: 0 2px 2px 0 rgb(195 156 4 / 75%);
    -moz-box-shadow: 0 2px 2px 0 rgba(195, 156, 4, 0.75);
    box-shadow: 0 2px 2px 0 rgb(195 156 4 / 75%);
  }

  &__thumbnail {
    width: 100%;
    margin-right: 15px;
    margin-left: 15px;

    @media (min-width: $sm) {
      width: calc(((100% / 12) * 4) - 30px);
    }

    .image-container {
      display: inline-block;
      width: 100%;
      position: relative;
      overflow: hidden;
      border-radius: 5px;
      margin-bottom: 10px;
      -webkit-transition: box-shadow 0.2s ease 0s;
      -moz-transition: box-shadow 0.2s ease 0s;
      -o-transition: box-shadow 0.2s ease 0s;
      transition: box-shadow 0.2s ease 0s;

      p.sponsored {
        position: absolute;
        bottom: 10px;
        right: 10px;
        margin: 0;
        text-transform: uppercase;
        border-radius: 4px;
        -webkit-box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.75);
        -moz-box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.75);
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.75);
      }
    }
  }

  &__content {
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;

    @media (min-width: $sm) {
      width: calc(((100% / 12) * 8) - 30px);
    }

    a {
      text-decoration: none;
    }

    &:hover {
      img {
        -webkit-box-shadow: 0 2px 2px 0 rgba(195, 156, 4, 0.75);
        -moz-box-shadow: 0 2px 2px 0 rgba(195, 156, 4, 0.75);
        box-shadow: 0 2px 2px 0 rgba(195, 156, 4, 0.75);
      }
    }

    h2 {
      margin: 5px 0 10px 0;
      overflow-wrap: break-word;
      word-break: break-word;
      word-wrap: break-word;
      font-size: 30px;
      font-family: inherit;
      font-weight: 500;
      line-height: 1.1;
      color: inherit;

      a {
        color: #010101;
        font-weight: 600;
        word-break: keep-all;
        line-height: 28px;

        &:hover {
          text-decoration: underline;
        }

        em {
          background-color: #ffcd04;
          font-style: normal;
          display: inline-block;
          padding: 0px;
        }
        &:hover em {
          text-decoration: underline;
        }
      }
    }

    .info {
      padding: 10px 0;
      font-size: 14px;
      color: #a1a1a1;

      .author {
        margin-left: 10px;
        display: inline-block;
        white-space: nowrap;
      }

      .date {
        margin-right: 10px;
        display: inline-block;
        white-space: nowrap;
      }

      a {
        font-size: 14px;
        color: #27282d;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    p {
      margin: 0 0 10px;

      a {
        color: #27282d;
        font-size: 14px;

        em {
          background-color: #ffcd04;
          font-weight: bold;
          font-style: normal;
        }
      }
    }
  }

  &__lazy-image {
    padding-bottom: 66%;
  }

  &__badge {
    display: inline-block;
    padding: 4px;
    text-transform: uppercase;
    text-align: center;
    font-size: 12px;
    font-weight: bold;
    white-space: nowrap;
    color: #3d3d3d;
    background-color: #ffcd04;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.75);
    border-radius: 4px;

    &-default {
      background-color: #ffcd04;
      color: #3d3d3d;
    }

    &-danger {
      background-color: #a90329;
      color: #ffffff;
    }

    &-success {
      background-color: #436043;
      color: #ffffff;
    }

    &-warning {
      background-color: #c79121;
      color: #3d3d3d;
    }

    &-info {
      background-color: #385a6b;
      color: #ffffff;
    }
  }
}
</style>

<style lang="scss">
.search-page__post-item {
  h2 a {
    em {
      background-color: #ffcd04;
      font-style: normal;
      display: inline-block;
      padding: 0px;
    }

    &:hover em {
      text-decoration: underline;
    }
  }

  p a em {
    background-color: #ffcd04;
    font-weight: bold;
    font-style: normal;
  }
}
</style>
