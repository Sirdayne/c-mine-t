<template>
  <div
    class="tag-about"
    :class="[isRtl && 'tag-about_rtl', !tag.cover && 'tag-about_desc-only']"
  >
    <div
      v-if="tag.cover"
      class="tag-about__cover-wrp"
    >
      <LazyImage
        class="tag-about__cover"
        :src="tag.cover"
        :alt="tag.title"
        :immediate="true"
      />
    </div>
    <div class="tag-about__desc-col">
      <div
        v-if="tag.about"
        class="tag-about__desc"
        v-html="tag.about"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ROOT } from '~/store/types';
import LazyImage from '~/components/Shared/LazyImage.vue';

export default {
  name: 'TagAbout',
  components: {
    LazyImage,
  },
  props: {
    tag: {
      type: Object,
      default: () => ({}),
    },
    i18n: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.tag-about {
  background-color: #fafafa;
  padding: 12px 0 0;
}
.tag-about__cover-wrp {
  display: block;
  width: 100%;
  max-width: 220px;
  margin: 0 auto 12px;
}
.tag-about__cover {
  position: relative;
  display: block;
  width: 100%;
  height: 0;
  padding-top: 100%;
}
.tag-about__desc-col {
  padding: 0 12px 12px;
}
.tag-about__desc {
  font-size: 0.875rem;
}
.tag-about__desc p,
.tag-about__desc ul {
  margin: 10px 0;
}
.tag-about__desc p {
  font-weight: normal;
  font-size: inherit;
}
.tag-about__desc p:empty {
  display: none;
}
.tag-about__desc ul {
  padding-left: 24px;
}
.tag-about__desc li {
  font-weight: 600;
  font-size: inherit;
  color: #000;
}
.tag-about__desc a {
  text-decoration: none;
  font-size: inherit;
  font-weight: 600;
  color: #337ab7;
}
.tag-about__desc a:hover {
  text-decoration: underline;
  color: #23527c;
}
.tag-about__desc p:first-child,
.tag-about__desc ul:first-child,
.tag-about__desc li:first-child {
  margin-top: 0;
}
.tag-about__desc p:last-child,
.tag-about__desc ul:last-child,
.tag-about__desc li:last-child {
  margin-bottom: 0;
}
.tag-about_desc-only .tag-about__desc {
  padding: 12px;
}
.tag-about__cover .lazy-image__img {
  object-fit: contain;
}

.tag-about_rtl {
  direction: rtl;
}
.tag-about_rtl .tag-about__desc ul {
  padding-left: 0;
  padding-right: 24px;
}

@media (min-width: $sm) {
  .tag-about__cover-wrp {
    margin: 12px auto 24px;
  }
  .tag-about__desc-col {
    padding: 0 24px 24px;
  }
  .tag-about__desc {
    font-size: 1rem;
  }
  .tag-about_desc-only .tag-about__desc-col {
    padding: 24px;
  }
}
@media (min-width: $md) {
  .tag-about {
    display: flex;
    align-items: flex-start;
  }
  .tag-about__cover-wrp {
    flex-shrink: 0;
    width: 240px;
    margin: 48px;
  }
  .tag-about__desc-col {
    flex-grow: 1;
    padding: 48px 48px 48px 0;
  }
  .tag-about_desc-only {
    display: block;
  }
  .tag-about_desc-only .tag-about__desc-col {
    padding: 48px;
  }
}
</style>
