<template>
  <div class="flash-news-post">
    <div class="flash-news-post__time">
      {{ timePublished }}
    </div>
    <LinkResolver
      class="flash-news-post__link"
      :to="post.url"
      :language-short="languageShort"
    >
      <h2 class="flash-news-post__title">
        {{ post.title }}
      </h2>
      <div class="flash-news-post__description">
        {{ post.previewText }}
      </div>
    </LinkResolver>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import getProperty from '~/assets/libs/getProperty';
import LinkResolver from '~/components/Shared/LinkResolver';

export default {
  name: 'FlashNewsPost',
  components: {
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
    timePublished() {
      const dateTime = getProperty(this.post, 'publishedDateTimeObject', {});
      const hoursWithLeadZero = `0${dateTime.hour}`.slice(-2);
      const minutesWithLeadZero = `0${dateTime.minute}`.slice(-2);
      return `${hoursWithLeadZero}:${minutesWithLeadZero}`;
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.flash-news-post__link {
  display: block;
  margin-top: 20px;
  text-decoration: none;
}
.flash-news-post__link:hover,
.flash-news-post__link:focus {
  text-decoration: none;
}
.flash-news-post__title {
  font-weight: bold;
  color: #253137;
  font-size: 1.125rem;
  line-height: 1.1;
  margin: 0;
}
.flash-news-post__description {
  color: #253137;
  line-height: 1.5;
  margin-top: 24px;
}
.flash-news-post__time {
  border-radius: 2px;
  background-color: #465a65;
  padding: 1px 18px;
  color: #fafafa;
  display: inline-block;
  font-weight: 700;
  position: relative;
}
.flash-news-post__time::before {
  content: '';
  height: 1px;
  background-color: #465a65;
  position: absolute;
  top: 0;
  bottom: 0;
  margin-top: auto;
  margin-bottom: auto;
  left: -10px;
  width: 10px;
}

@media (min-width: $sm) {
  .flash-news-post__title {
    font-size: 1.375rem;
  }
  .flash-news-post__description {
    line-height: 1.75;
  }
}
@media (min-width: $md) {
  .flash-news-post__time::before {
    left: -54px;
    width: 54px;
  }
}
</style>
