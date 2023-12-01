<template>
  <div
    class="tags-list"
    :class="[isRtl && 'tags-list_rtl']"
  >
    <ul class="tags-list__list">
      <li
        v-for="(tag, index) in tags"
        :key="index"
        class="tags-list__item"
      >
        <LinkResolver
          class="tags-list__link"
          :to="tag.url"
          :language-short="languageShort"
          :data-gtm-locator="getTagLocatorName(tag.title)"
        >
          <span class="tags-list_hash-sign">#</span>{{ tag.title }}
        </LinkResolver>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { ROOT } from '~/store/types';
import LinkResolver from '~/components/Shared/LinkResolver';

export default {
  name: 'PostTagsList',
  components: {
    LinkResolver,
  },
  props: {
    tagsList: {
      type: Array,
      default: () => [],
    },
    postId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState({
      languageShort: ({ currentLanguage: { short } }) => short,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
    tags() {
      return this.tagsList.filter((item) => item.title);
    },
  },
  methods: {
    getTagLocatorName(name) {
      const nameLowerCase = name.toLowerCase().replace(/\s/g, '_');
      return `article_${this.postId}_clickon_tag_${nameLowerCase}`;
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';
@import '~/assets/styles/_mixins.scss';

.tags-list {
  color: #000 !important;
  font-size: 1rem !important;
  font-weight: 400 !important;
  line-height: 22px !important;
}
.tags-list__list {
  list-style: none !important;
  margin: -10px 0 0 !important;
  padding: 0 !important;
}
.tags-list__item {
  display: inline-flex !important;
  margin: 10px 8px 0 0 !important;
  background-color: #f0f0f0 !important;
  transition: background-color 0.15s linear !important;
  border-radius: 2px !important;
  padding-left: 0 !important;
}

.tags-list__item::before {
  display: none !important;
}

.tags-list__item:hover {
  background-color: $color-accent !important;
}
.tags-list__link {
  padding: 1px 6px !important;
  display: block !important;
  color: inherit !important;
  text-decoration: none !important;
  transition: color 0.15s !important;

  font-style: normal !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  line-height: 22px !important;
  letter-spacing: -0.02em !important;
  border-bottom-width: 0 !important;
}
.tags-list_rtl {
  direction: rtl !important;
}
.tags-list_rtl .tags-list__item {
  margin-left: 10px !important;
  margin-right: 0 !important;
}
.tags-list_hash-sign {
  opacity: 0.5 !important;
}

@media (min-width: $md) {
  .tags-list {
    margin-left: 74px !important;
  }
  .tags-list__list {
    margin-left: 0 !important;
  }
  .tags-list_rtl {
    margin-left: 0 !important;
    margin-right: 74px !important;
  }
  .tags-list_rtl .tags-list__list {
    margin-right: 0 !important;
  }
}
</style>
