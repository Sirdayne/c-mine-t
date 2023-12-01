<script setup lang="ts">
import LazyImage from '~/components/Shared/LazyImage.vue';
import { computed } from 'vue';
import { mainPageLinksEvent } from '~/assets/helpers/dataLayerEvents';
import { useStore } from '~/lib/framework';
import { getThumbnail } from '~/assets/libs/getThumbnail';
import { DEFAULT_LANGUAGE, POST_FALLBACK_COVER_URL } from '~/app.config';
import LinkResolver from '~/components/Shared/LinkResolver.vue';
import { CtArrowsButtonConnected } from '~/lib/ui';
import { useFeatureManager } from '~/lib/feature-manager';

interface Props {
  postData: any;
  index: number;
  editorsChoiceIsActive: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  editorsChoiceIsActive: false,
});

const store = useStore();
const i18n = computed(() => store.state.i18n);
const featureManager = useFeatureManager();

const locatorName = computed(() => {
  const prefix = props.editorsChoiceIsActive ? 'editorchoice' : 'hotstories';
  return `home_${prefix}_carousel_clickon_article`;
});

const sendDataLayerEvent = () => {
  if (featureManager.isEnabled('links_event_active')) {
    mainPageLinksEvent(props.editorsChoiceIsActive ? `editors_choice` : `hot_stories`);
  }
};

const cover = computed(() => {
  return getThumbnail({
    imageUrl: props.postData.cover,
    width: 740,
    defaultImage: POST_FALLBACK_COVER_URL,
  });
});

const coverRetina = computed(() => {
  const x2 = getThumbnail({
    imageUrl: props.postData.cover,
    width: 1480,
    defaultImage: POST_FALLBACK_COVER_URL,
  });
  return `${cover.value} 1x, ${x2} 2x`;
});

const categoryLocatorName = computed(() => {
  const name = props.postData.categoryName.toLowerCase().replace(/\s/g, '_');
  return `wigdet_clickon_article_${name}_category`;
});

const magazineUrl = `${DEFAULT_LANGUAGE.url}/magazine/`;
const footerLink = computed(() => {
  return props.postData.isMagazinePost ? magazineUrl : props.postData.categoryUrl;
});
const handleMouseUp = (f: MouseEvent) => f;

const getLocatorNameForButton = (direction: string) => {
  const prefix = props.editorsChoiceIsActive ? 'editorchoice' : 'hotstories';
  return `home_${prefix}_carousel_clickon_${direction}_arrow`;
};
</script>

<template>
  <article class="relative flex w-full h-full overflow-hidden rounded focus:!outline-0">
    <LinkResolver
      v-if="postData.url"
      class="cursor-pointer h-128"
      :data-gtm-locator="locatorName"
      :to="postData.url"
      :target="postData.isMagazinePost ? '_blank' : '_self'"
      @mouseenter="$emit('setActive', index)"
      @click.capture="sendDataLayerEvent"
    >
      <figure>
        <LazyImage
          :immediate="true"
          :src="cover"
          :srcset="coverRetina"
          :alt="postData.title"
        />
      </figure>
    </LinkResolver>

    <header
      v-if="postData.title"
      class="absolute left-0 top-0 block w-full text-fg-inverted"
      @mouseup.stop="handleMouseUp"
    >
      <LinkResolver
        v-if="postData.url"
        class="block hover:underline p-4 bg-[#13171BB2]"
        :data-gtm-locator="locatorName"
        :to="postData.url"
        @click.capture="sendDataLayerEvent"
      >
        <span class="text-headlineXxxl text-fg-inverted !text-[34px] !leading-[120%] focus:!outline-0">
          {{ postData.title }}
        </span>
      </LinkResolver>
      <span
        v-else
        class="block text-headlineXxxl text-fg-inverted p-4 bg-[#13171BB2]"
      >
        {{ postData.title }}
      </span>
    </header>

    <footer
      class="absolute left-0 bottom-0 flex justify-between items-center w-full text-fg-inverted bg-[#13171BB2] p-2"
    >
      <div class="flex flex-row items-stretch m-1">
        <p
          v-if="postData.categoryName"
          class="border-r-default border-border-onDarkForced text-fg-primaryDefault pr-4 pl-1 hover:underline"
        >
          <template v-if="postData.categoryUrl">
            <LinkResolver
              :to="footerLink"
              :data-gtm-locator="categoryLocatorName"
              class="text-uiMDefault text-m text-interfaceS"
              @click.capture="sendDataLayerEvent"
            >
              {{ postData?.categoryName }}
            </LinkResolver>
          </template>
          <span
            v-else
            class="text-uiMDefault"
          >
            {{ postData?.categoryName }}
          </span>
        </p>

        <p
          v-if="postData.authorName"
          class="border-r-default border-border-onDarkForced px-4 hover:underline cursor-pointer"
        >
          <LinkResolver
            v-if="postData.authorUrl"
            class="inline text-uiMDefault"
            :to="postData.authorUrl"
            data-gtm-locator="article_clickon_top_author"
          >
            {{ `${i18n?.by ? i18n?.by + ' ' : ''}${postData?.authorName}` }}
          </LinkResolver>
          <span
            v-else
            class="text-uiMDefault"
          >
            {{ postData?.authorName }}
          </span>
        </p>
        <time
          v-if="postData.dateHuman"
          class="pl-4 cursor-default text-uiMDefault"
          :datetime="postData.datePublished"
        >
          {{ postData?.dateHuman }}
        </time>
      </div>
      <CtArrowsButtonConnected
        :left-locator="getLocatorNameForButton('prev')"
        :right-locator="getLocatorNameForButton('next')"
        class="px-2 py-1 !outline-[#FFFFFF4D] gap-2 bg-black"
        @left="$emit('left')"
        @right="$emit('right')"
      />
    </footer>
  </article>
</template>

<style module lang="scss">
.main-news-item_rtl {
  direction: rtl;
}
</style>
