<template>
  <div
    v-if="posts.length"
    class="jp-editors-choice-mobile"
  >
    <div class="jp-editors-choice-mobile__container">
      <h1
        v-if="i18n.editorsChoice"
        class="jp-editors-choice-mobile__header"
      >
        {{ i18n.editorsChoice }}
      </h1>
      <div
        ref="container"
        class="jp-editors-choice-mobile__news-wrapper"
      >
        <ul
          ref="list"
          class="jp-editors-choice-mobile__news"
        >
          <li
            v-for="post in list"
            :key="post.id"
            class="jp-editors-choice-mobile__news-item"
          >
            <LinkResolver
              :to="post.url"
              :title="post.title"
              :language-short="languageShort"
              class="jp-editors-choice-mobile__news-link"
            >
              <figure class="jp-editors-choice-mobile__figure">
                <LazyImage
                  class="jp-editors-choice-mobile__cover"
                  :src="post.cover"
                  :srcset="post.coverRetina"
                  :alt="post.title"
                />
              </figure>
              <h3 class="jp-editors-choice-mobile__news-title">
                {{ post.title }}
              </h3>
            </LinkResolver>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { POST_FALLBACK_COVER_URL } from '~/app.config';
import { getThumbnail } from '~/assets/libs/getThumbnail';
import carouselScrollTo from '~/assets/libs/carouselScrollTo';
import LinkResolver from '~/components/Shared/LinkResolver';
import LazyImage from '~/components/Shared/LazyImage';
import { useStore } from '~/lib/framework';
import { computed } from 'vue';
import { useQuery } from '~/graphql';
import editorsChoiceQuery from '~/graphql/queries/editorsChoice.graphql';
import filterNoneObjects from '~/assets/libs/filterNoneObjects';
import { getMappedPostPreview } from '~/assets/helpers/posts';

const SWITCH_DELAY = 5000;

export default {
  name: 'JpEditorsChoiceMobile',
  components: {
    LinkResolver,
    LazyImage,
  },
  setup() {
    const store = useStore();
    const i18n = computed(() => store.state.i18n);
    const languageShort = computed(() => store.state.currentLanguage.short);

    const editorsPostsQuery = useQuery({
      query: editorsChoiceQuery,
      variables: {
        short: languageShort,
      },
    });

    const editorsPosts = computed(() => {
      const posts = editorsPostsQuery.data.value?.locale.editorsPosts || [];
      const currentLanguage = computed(() => store.state.currentLanguage);

      return filterNoneObjects(posts).map((item) =>
        getMappedPostPreview(item, {
          languageDomain: currentLanguage.value.languageDomain,
          languageCode: currentLanguage.value.code,
          timeZone: currentLanguage.value.timezone,
          languageShort,
        })
      );
    });

    return {
      i18n,
      posts: editorsPosts,
    };
  },
  data() {
    return {
      currentShow: 0,
    };
  },
  computed: {
    ...mapState({
      languageShort: ({ currentLanguage: { short } }) => short,
    }),
    list() {
      return this.posts.map((item) => {
        const cover = getThumbnail({
          imageUrl: item.cover,
          width: 370,
          defaultImage: POST_FALLBACK_COVER_URL,
        });
        const coverX2 = getThumbnail({
          imageUrl: item.cover,
          width: 740,
          defaultImage: POST_FALLBACK_COVER_URL,
        });
        const coverRetina = `${cover} 1x, ${coverX2} 2x`;
        return {
          ...item,
          cover,
          coverRetina,
        };
      });
    },
  },
  mounted() {
    this.startCarousel();
  },
  beforeDestroy() {
    this.stopCarousel();
  },
  methods: {
    handleTouchStart() {
      this.stopCarousel();
    },
    startCarousel() {
      this.carouselInterval = setInterval(() => {
        const childrenCount = this.posts.length;
        this.currentShow = this.currentShow === childrenCount - 1 ? 0 : this.currentShow + 1;
        const coords = this.$refs.list.children[this.currentShow].getBoundingClientRect();
        const newPosition = this.$refs.container.scrollLeft + coords.left;
        carouselScrollTo(this.$refs.container, newPosition, 500);
      }, SWITCH_DELAY);
      this.$refs.container?.addEventListener('touchstart', this.handleTouchStart);
    },
    stopCarousel() {
      if (this.carouselInterval) {
        clearInterval(this.carouselInterval);
      }
      this.$refs.container?.removeEventListener('touchstart', this.handleTouchStart);
    },
  },
};
</script>

<style>
.jp-editors-choice-mobile__container {
  padding: 8px 16px 0;
  background: #fff;
  -webkit-overflow-scrolling: touch;
}
.jp-editors-choice-mobile__header {
  color: #000000;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 7px;
}
.jp-editors-choice-mobile__container,
.jp-editors-choice-mobile__news-wrapper {
  overflow: auto;
}
.jp-editors-choice-mobile__news {
  list-style: none;
  padding: 0 0 16px;
  margin: 0 -16px;
  white-space: nowrap;
  font-size: 0;
}
.jp-editors-choice-mobile__news-item {
  display: inline-flex;
  width: 295px;
  max-width: 100%;
  padding: 0 16px;
}
.jp-editors-choice-mobile__news-link {
  display: block;
  width: 100%;
  text-decoration: none;
}
.jp-editors-choice-mobile__news-link:hover {
  color: #ffb405;
}
.jp-editors-choice-mobile__figure {
  display: block;
  max-width: 100%;
  max-height: 210px;
  width: auto;
  height: auto;
  margin: 0;
  padding: 0;
}
.jp-editors-choice-mobile__cover {
  position: relative;
  display: block;
  width: 100%;
  height: 0;
  padding-top: 56.25%;
}
.jp-editors-choice-mobile__news-title {
  max-width: 100%;
  white-space: initial;
  color: #000000;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 0;
}
.jp-editors-choice-mobile__news-link:hover .jp-editors-choice-mobile__news-title,
.jp-editors-choice-mobile__news-title:hover {
  color: #ffb405;
  text-decoration: none;
}
</style>
