<template>
  <div class="flash-news-listing">
    <template v-for="(post, index) in postsWithDividers">
      <div
        v-if="post.divider && post.dividerContent"
        :key="`divider-${index}`"
        class="flash-news-listing__items-divider"
      >
        {{ post.dividerContent }}
      </div>
      <FlashNewsPost
        :key="`post-${index}`"
        :post="post"
        class="flash-news-listing__item"
      />
    </template>
    <div class="posts-listing__more-wrp">
      <button
        v-if="hasMore && i18n.postsLoadMore"
        class="btn flash-news-listing__more-btn"
        :class="pending && 'btn_pending'"
        :disabled="pending"
        @click="handleLoadMoreClick"
      >
        <span class="btn__wrp">
          <span
            v-if="!pending"
            class="btn__icon posts-listing__more-icon"
          />
          <span
            v-else
            class="btn__spinner"
          />
          <span
            v-if="!pending"
            class="btn__cap"
          >
            &nbsp;{{ i18n.postsLoadMore }}
          </span>
          <span
            v-else
            class="btn__cap"
          >
            &nbsp;{{ i18n.postsLoading }}
          </span>
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import getProperty from '~/assets/libs/getProperty';
import FlashNewsPost from '~/components/FlashNews/FlashNewsPost.vue';

export default {
  name: 'FlashNewsListing',
  components: {
    FlashNewsPost,
  },
  props: {
    posts: {
      type: Array,
      default: () => [],
    },
    pending: {
      type: Boolean,
      default: false,
    },
    hasMore: {
      type: Boolean,
      default: true,
    },
    i18n: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    postsWithDividers() {
      const { posts } = this;
      return posts.map((post, index) => {
        const isFirstPost = index === 0;
        const prevPost = getProperty(posts, [index - 1], {});
        const { publishedDateTimeObject: currentPostTimeObject } = post;
        const { publishedDateTimeObject: prevPostTimeObject } = prevPost;
        const divider =
          isFirstPost || prevPostTimeObject ? this.isNotSameDay(currentPostTimeObject, prevPostTimeObject) : false;
        const dividerContent = divider ? post.dateHuman : '';
        return {
          ...post,
          divider,
          dividerContent,
        };
      });
    },
  },
  methods: {
    handleLoadMoreClick() {
      if (this.pending || !this.hasMore) {
        return;
      }
      this.$emit('load-more');
    },
    isNotSameDay(currentTimeObject = {}, prevTimeObject = {}) {
      const { day: currentDay, month: currentMonth, year: currentYear } = currentTimeObject;
      const { day: nextDay, month: nextMonth, year: nextYear } = prevTimeObject;
      const isPrevObjectAnotherDay = nextDay !== currentDay;
      const isPrevObjectAnotherMonth = nextMonth !== currentMonth;
      const isPrevObjectAnotherYear = nextYear !== currentYear;
      return isPrevObjectAnotherDay || isPrevObjectAnotherMonth || isPrevObjectAnotherYear;
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.flash-news-listing__item:not(:first-child) {
  margin-top: 40px;
}
.flash-news-listing__items-divider {
  width: 100%;
  position: relative;
  text-align: right;
  border-top: #465a65 1px solid;
  color: #253137;
  font-weight: 700;
  font-size: 0.75rem;
  margin-bottom: 40px;
}
.flash-news-listing__items-divider:not(:first-child) {
  margin-top: 40px;
}
.flash-news-listing__items-divider::before {
  content: '';
  top: -1px;
  height: 1px;
  position: absolute;
  background-color: #465a65;
  display: inline-block;
  left: -10px;
  width: 10px;
}
.posts-listing__more-wrp {
  margin-top: 24px;
}
.flash-news-listing__more-btn {
  width: 100%;
  margin-top: 15px;
  background-image: linear-gradient(180deg, #dae2e7 0%, #afbdc4 100%);
  border: none;
  border-radius: 2px;
  padding: 8px 10px;
}

@media (min-width: $sm) {
  .flash-news-listing__items-divider {
    font-size: 1rem;
  }
}
@media (min-width: $md) {
  .flash-news-listing__items-divider::before {
    left: -54px;
    width: 54px;
  }
}
</style>
