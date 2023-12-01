<script lang="ts">
import EventsPostsListing from '~/components/Events/EventsPostsListing.vue';
import EventsIntro from '~/components/Events/EventsIntro.vue';
import { useLayoutUiStore } from '~/lib/layout-store';
import EventsCalendar from '~/components/Events/calendar/EventsCalendar.vue';
import { useMeta, useRoute, useStore, defineComponent, useContext } from '~/lib/framework';
import { CarouselEventsDocument, SeoMetaQueryDocument, useQuery } from '~/graphql';
import { computed, onMounted } from 'vue';
import { getMappedMeta } from '~/assets/helpers/seo';
import { getEventsPageMeta } from '~/assets/helpers/meta/events';

export default defineComponent({
  name: 'EventsPage',
  components: {
    EventsIntro,
    EventsCalendar,
    EventsPostsListing,
  },

  setup() {
    const layoutUiStore = useLayoutUiStore();
    layoutUiStore.setHeaderVariant('dark');

    const context = useContext();

    const store = useStore();
    const route = useRoute();

    const currentLanguage = computed(() => store.state.currentLanguage);

    const languages = computed(() => store.state.languages);

    onMounted(() => {
      context.$chartBeat.sendPageView();
    });

    const carouselEventsQuery = useQuery({
      query: CarouselEventsDocument,
      variables: {
        short: computed(() => store.state.currentLanguage.short),
      },
    });

    const events = computed(() => carouselEventsQuery.data.value?.locale?.carouselEvents ?? []);

    const pageMetaQuery = useQuery({
      query: SeoMetaQueryDocument,
      variables: {
        short: computed(() => currentLanguage.value.short),
        url: computed(() => route.value?.path),
      },
    });

    const meta = computed(() => getMappedMeta(pageMetaQuery.data.value?.locale?.seoMeta));

    useMeta(() => {
      return getEventsPageMeta({
        currentLanguage: currentLanguage.value,
        languages: languages.value,
        meta: meta.value,
        routeName: route.value.name,
        events: events.value,
      });
    });

    return {
      events,
    };
  },
  head: {},
});
</script>

<template>
  <div class="pb-12 sm:pb-8">
    <EventsIntro :events="events" />
    <EventsCalendar />
    <EventsPostsListing />
  </div>
</template>
