<template>
  <div
    class="editors-choice-widget"
    :class="[isRtl && 'editors-choice-widget_rtl']"
  >
    <span
      v-if="i18n.editorChoiceTitle"
      class="editors-choice-widget__title"
      data-testid="editors-choice-widget-title"
    >
      {{ i18n.editorChoiceTitle }}
    </span>
    <ul
      class="editors-choice-widget__list"
      data-testid="editors-choice-widget"
    >
      <li
        v-for="item in editorsPosts"
        :key="item.id"
        class="editors-choice-widget__item"
        @click="setDataLayerValue(item.url)"
      >
        <a
          v-if="item.isMagazinePost"
          class="editors-choice-widget__link"
          :href="item.url"
          target="_blank"
          data-testid="editors-choice-widget-article"
        >
          {{ item.title }}
        </a>
        <LinkResolver
          v-else
          class="editors-choice-widget__link"
          :to="item.url"
          :language-short="languageShort"
          data-testid="editors-choice-widget-article"
        >
          {{ item.title }}
        </LinkResolver>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { ROOT } from '~/store/types';
import { pushDataLayerEvent } from '~/assets/helpers/dataLayerEvents';
import LinkResolver from '~/components/Shared/LinkResolver';
import { useQuery } from '~/graphql';
import editorsChoiceQuery from '~/graphql/queries/editorsChoice.graphql';
import { useStore } from '~/lib/framework';
import { computed } from 'vue';
import filterNoneObjects from '~/assets/libs/filterNoneObjects';
import { getMappedPostPreview } from '~/assets/helpers/posts';

export default {
  name: 'EditorsChoiceWidget',
  components: {
    LinkResolver,
  },
  setup() {
    const store = useStore();
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
      editorsPosts,
    };
  },
  computed: {
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
    ...mapState({
      i18n: ({ i18n }) => i18n,
      languageShort: ({ currentLanguage: { short } }) => short,
      currentLanguage: ({ currentLanguage }) => currentLanguage,
    }),
  },
  methods: {
    setDataLayerValue(url) {
      if (this.currentLanguage.id === '21') {
        pushDataLayerEvent({
          type: 'editorsChoiceAction',
          dataLayerEventData: {
            editorsChoiceAction: {
              event: 'Editors Choice',
              eventCategory: 'Editors Choice',
              eventAction: 'Upper Link Click RS',
              eventLabel: window.location.host + url,
            },
          },
        });
      }
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.editors-choice-widget__title {
  display: block;
  padding: 10px 15px 10px 0;
  font-size: 0.8125rem;
  letter-spacing: 0.54px;
  color: #000000;
  text-transform: uppercase;
}
.editors-choice-widget__list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.editors-choice-widget__item {
  margin-bottom: 16px;
  padding: 0 0 16px;
  border-bottom: 1px solid #eceff2;
}
.editors-choice-widget__item:last-child {
  margin-bottom: 0;
  border-bottom: 0;
}
.editors-choice-widget__link {
  font-size: 1rem;
  font-weight: bold;
  line-height: 1.38;
  text-decoration: none;
  color: #000000;
}
.editors-choice-widget__item:first-child .editors-choice-widget__link {
  font-size: 1.5rem;
}
.editors-choice-widget__link:hover {
  text-decoration: underline;
}
.editors-choice-widget_rtl .editors-choice-widget__title {
  padding-left: 15px;
  padding-right: 0;
}
</style>
