<script setup lang="ts">
import { useStore } from '~/lib/framework';
import { computed } from 'vue';
import { mainPageLinksEvent } from '~/assets/helpers/dataLayerEvents';
import { CtTabs } from '~/lib/ui';
import LinkResolver from '~/components/Shared/LinkResolver.vue';
import EyeIcon from '~/assets/icons/eye.svg';
import { useFeatureManager } from '~/lib/feature-manager';

const props = withDefaults(
  defineProps<{
    posts: any[];
    tabsLabels: string[];
    currentItem: number;
    editorsChoiceIsActive: boolean;
  }>(),
  {
    currentItem: 0,
  }
);

const emit = defineEmits<{
  (e: 'setActive', arg: number): void;
  (e: 'setMouseenter'): void;
  (e: 'setMouseleave'): void;
}>();

const EDITORS_CHOICE_START_FROM = 0;
const HOT_STORIES_START_FROM = 5;
const EDITORS_CHOICE_TAB_INDEX = 0;
const HOT_STORIES_TAB_INDEX = 1;

const store = useStore();
const i18n = computed(() => store.state.i18n);
const activeTabIndex = computed(() => (props.editorsChoiceIsActive ? EDITORS_CHOICE_TAB_INDEX : HOT_STORIES_TAB_INDEX));
const tabs = computed(() => props.tabsLabels.map((item) => ({ label: i18n.value[item] })));
const featureManager = useFeatureManager();

const viewsAllowed = featureManager.isEnabled('hot_stories_viewer_counter');

const setActiveList = (index: number) => {
  if (index === EDITORS_CHOICE_TAB_INDEX) {
    emit('setActive', EDITORS_CHOICE_START_FROM);
  } else if (props.posts.length > HOT_STORIES_START_FROM) {
    emit('setActive', HOT_STORIES_START_FROM);
  }
};

const sendDataLayerEvent = (index: number) => {
  if (featureManager.isEnabled('links_event_active')) {
    mainPageLinksEvent(
      props.editorsChoiceIsActive
        ? `editors_choice_${index + 1}`
        : `hot_stories_${index + 1 - EDITORS_CHOICE_START_FROM}`
    );
  }
};

const getLocatorName = (index: number) => {
  const prefix = props.editorsChoiceIsActive ? 'editorchoice' : 'hotstories';
  return `home_${prefix}_clickon_${index}_article`;
};

const getItemPostClass = (index: number) => {
  const classes = [];
  if (props.editorsChoiceIsActive) {
    index < HOT_STORIES_START_FROM ? classes.push('block') : classes.push('hidden');
  } else {
    index >= HOT_STORIES_START_FROM ? classes.push('block') : classes.push('hidden');
  }
  if (props.currentItem === index) {
    classes.push('font-semibold');
  }
  return classes;
};
</script>

<template>
  <div class="ltr:lg:ml-6 rtl:lg:mr-6 w-full">
    <CtTabs
      :tabs="tabs"
      :active-tab-index="activeTabIndex"
      @change="setActiveList"
    />
    <ul class="p-0 flex flex-col">
      <li
        v-for="(item, index) in posts"
        :key="index"
        class="text-headlineM text-[#13181C] font-normal border-b-default [&:nth-child(5)]:border-b-0 last:border-b-0 border-border-default cursor-pointer focus:!outline-0"
        :class="getItemPostClass(index)"
        @mouseenter="emit('setMouseenter')"
        @mouseleave="emit('setMouseleave')"
      >
        <div
          :class="item.showStats && item.views > 0 ? 'py-4' : 'py-4 lg:py-6'"
          class="px-4 lg:px-0"
          @mouseenter="$emit('setActive', index)"
        >
          <LinkResolver
            v-if="item.url"
            :to="item.url"
            :data-gtm-locator="getLocatorName(index)"
            :target="item.isMagazinePost ? '_blank' : '_self'"
            :stop-client-side-navigation="item.isMagazinePost"
            @click.capture="sendDataLayerEvent(index)"
          >
            {{ item.title }}
          </LinkResolver>
          <div class="text-right pt-xs">
            <span
              v-if="item.showStats && item.views > 0 && viewsAllowed"
              class="flex flex-row justify-end items-center"
            >
              <EyeIcon class="mr-xxs text-fg-subtle" />
              <span class="text-uiXsWeak text-fg-subtle">
                {{ item.views }}
              </span>
            </span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
