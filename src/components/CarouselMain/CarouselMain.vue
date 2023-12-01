<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useStore } from '~/lib/framework';
import CarouselMainImage from '~/components/CarouselMain/CarouselMainImage.vue';
import CarouselMainNewsList from '~/components/CarouselMain/CarouselMainNewsList.vue';
import { VIEWPORT } from '~/store/types';
import { NewsRotatorQueryDocument, useQuery } from '~/graphql';
import filterNoneObjects from '~/assets/libs/filterNoneObjects';
import { getMappedPostPreview } from '~/assets/helpers/posts';

const PAUSE_TIME = 8000;
const HOT_STORIES_START_FROM = 5;

const store = useStore();
const isRTL = store.getters.IS_RTL;
const languageShort = computed(() => store.state.currentLanguage.short);
const tabsLabels = ['editorsChoice', 'hotStories'];

const postsQuery = useQuery({
  query: NewsRotatorQueryDocument,
  variables: {
    short: languageShort,
    promo: false,
  },
});

const posts = computed(() => {
  const data = postsQuery.data.value?.locale || {
    editorsPosts: [],
    hotPosts: [],
  };
  const concatedPosts = [...(data.editorsPosts as any[]), ...(data.hotPosts as any[])];
  const currentLanguage = computed(() => store.state.currentLanguage);

  return filterNoneObjects(concatedPosts).map((item) =>
    getMappedPostPreview(item, {
      languageDomain: currentLanguage.value.languageDomain,
      languageCode: currentLanguage.value.code,
      timeZone: currentLanguage.value.timezone,
      languageShort,
    })
  );
});

const handleMouseEnter = () => {
  endRotation();
  hasPointerEntered.value = true;
};
const handleMouseLeave = () => {
  hasPointerEntered.value = false;
  startRotation();
};
const handleBlur = () => {
  hasPointerEntered.value = false;
  startRotation();
};
const onPrev = () => {
  const index = currentItem.value;
  currentItem.value = index === 0 ? posts.value.length - 1 : index - 1;
};
const onNext = () => {
  const index = currentItem.value;
  currentItem.value = index === posts.value.length - 1 ? 0 : index + 1;
};
const setActive = (index: number) => {
  currentItem.value = index;
};

const editorsChoiceIsActive = computed(() => currentItem.value < HOT_STORIES_START_FROM);

/*rotation logic*/
const hasPointerEntered = ref(false);
const rotationInterval = ref<ReturnType<typeof setInterval> | null>(null);
const currentItem = ref(0);

const endRotation = () => {
  if (rotationInterval.value) {
    clearInterval(rotationInterval.value);
  }
};

const startRotation = () => {
  endRotation();
  if (hasPointerEntered.value) {
    return;
  }

  rotationInterval.value = setInterval(() => {
    const index = currentItem.value;
    currentItem.value = index === posts.value.length - 1 ? 0 : index + 1;
  }, PAUSE_TIME);
};
const handleWindowActiveChange = (value: boolean) => {
  return value ? startRotation() : endRotation();
};

const isWindowActive = computed(() => store.state.viewport.isWindowActive);

watch(isWindowActive, handleWindowActiveChange);

onMounted(() => {
  if (store.getters[`viewport/${VIEWPORT.IS_LARGE_WIDTH}`]) {
    startRotation();
  }
});
onBeforeUnmount(() => {
  endRotation();
});
</script>

<template>
  <div
    class="flex overflow-hidden shadow-default lg:rounded-none rounded-lg lg:shadow-none border-default lg:border-none border-border-default"
  >
    <div
      class="hidden lg:block flex-[0_0_747px]"
      :class="isRTL && 'main-news-rotator_rtl'"
    >
      <div
        class="hidden md:block relative"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @blur="handleBlur"
      >
        <ul class="flex relative">
          <template v-for="(item, index) in posts">
            <Transition
              :key="index"
              name="main-news-rotator-show"
            >
              <li
                v-if="index === currentItem"
                class="flex w-full"
              >
                <CarouselMainImage
                  :post-data="item"
                  :index="index"
                  :editors-choice-is-active="editorsChoiceIsActive"
                  @left="onPrev"
                  @right="onNext"
                />
              </li>
            </Transition>
          </template>
        </ul>
      </div>
    </div>
    <CarouselMainNewsList
      :posts="posts"
      :tabs-labels="tabsLabels"
      :current-item="currentItem"
      :editors-choice-is-active="editorsChoiceIsActive"
      @setActive="setActive"
      @setMouseenter="handleMouseEnter"
      @setMouseleave="handleMouseLeave"
    />
  </div>
</template>

<style scoped lang="scss">
.main-news-rotator_rtl {
  direction: rtl;
}

.main-news-rotator-show-enter-active,
.main-news-rotator-show-leave-active {
  transition: opacity 0.3s;
}
.main-news-rotator-show-enter-active {
  position: relative;
}
.main-news-rotator-show-leave-active {
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.main-news-rotator-show-enter,
.main-news-rotator-show-leave-to {
  opacity: 0;
}
</style>
