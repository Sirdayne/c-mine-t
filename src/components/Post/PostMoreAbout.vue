<template>
  <div
    :class="[isRtl && 'more-about_rtl']"
    class="more-about"
  >
    <span class="more-about__title">
      {{ i18n.articleMoreAboutTopic }}
    </span>
    <ul class="more-about__list">
      <li
        v-for="(post, i) in topics"
        :key="i"
        :class="{ 'more-about__item_selected': post.selection }"
        class="more-about__item"
      >
        <PostMoreAboutItem :post="post" />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { ROOT } from '~/store/types';
import PostMoreAboutItem from './PostMoreAboutItem';

export default {
  name: 'PostMoreAbout',
  components: {
    PostMoreAboutItem,
  },
  props: {
    topics: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState({
      i18n: ({ i18n }) => i18n,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.more-about {
  color: #000;
}
.more-about__title {
  display: block;
  color: inherit;
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 26px;
}
.more-about__list {
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}
.more-about__item:not(:first-child)::before {
  content: '';
  display: block;
  height: 1px;
  background-color: rgba(206, 206, 206, 0.81);
  transition: background-color 0.15s;
}

.more-about__item_selected + .more-about__item::before,
.more-about__item_selected:not(:first-child)::before {
  background-color: #fff8e6;
}
.more-about_rtl .more-about__title {
  direction: rtl;
}

@media (min-width: $sm) {
  .more-about__title {
    font-size: 1.5rem;
    line-height: 28px;
  }
}
</style>
