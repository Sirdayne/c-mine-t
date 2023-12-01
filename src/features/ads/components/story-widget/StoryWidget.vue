<template>
  <div
    v-show="postQueryFetching || storyViewProps"
    :class="$style['story-widget']"
  >
    <StoryWidgetView
      v-if="storyViewProps"
      v-bind="storyViewProps"
    />

    <div v-else>&nbsp;</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, unref, watchEffect } from 'vue';
import { useStore } from '~/lib/framework';
import { captureError } from '~/lib/telemetry';
import { useQuery, ArticleStoryDocument } from '~/graphql';
import { pushVirtualPageView } from '~/assets/helpers/dataLayerEvents';
import { getPostUrl, getMappedPostTags } from '~/assets/helpers/posts';
import { useCustomRenderingProps, useAdSlotContext } from '../../adslot/useAdSlotContext';
import { CustomRenderingViews } from '../../core/CustomRenderingViews';
import { StoryWidgetSameSlugError } from './StoryWidgetSameSlugError';
import { StoryWidgetMissingPostError } from './StoryWidgetMissingPostError';
import StoryWidgetView from './StoryWidgetView.vue';

const FALLBACK_BADGE = 'Advertisement';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const { config } = useAdSlotContext();
const props = useCustomRenderingProps(CustomRenderingViews.STORY_WIDGET);
const store = useStore();

const sameSlug = props.postSlug === config.postSlug;

const storyViewProps = ref<object | null>(null);
const languageShort = computed(() => store.state.currentLanguage.short);
const languageDomain = computed(() => store.state.currentLanguage.domain);

const { fetching: postQueryFetching, data: postQueryData } = useQuery({
  query: ArticleStoryDocument,
  pause: sameSlug,
  variables: {
    short: languageShort,
    slug: props.postSlug,
  },
});
const isDefined = computed(
  () => unref(postQueryData)?.locale?.post?.postBadge?.postBadgeTranslates?.[0]?.title?.toLowerCase() === 'defined'
);

/**
 * Format body text for defined posts
 * */
const formatBodyText = (bodyText: string): string => {
  if (!isDefined.value) return bodyText;

  const arr: Array<string> = [];
  const doc = new DOMParser().parseFromString(bodyText, 'text/html');
  const contentBlocks = doc.querySelectorAll('[data-ct-widget="content-block"]');
  contentBlocks.forEach((node) => {
    arr.push(node.outerHTML);
  });
  return arr.join('');
};
onMounted(async () => {
  watchEffect(() => {
    try {
      /**
       * Hide Close button if same slug or no post
       * */
      if (sameSlug) {
        emit('close');
        throw new StoryWidgetSameSlugError(props.postSlug, config.postSlug);
      }

      const result = unref(postQueryData);

      // wait till query complete
      if (!result && unref(postQueryFetching)) return;

      const post = result?.locale?.post;

      if (!post) {
        emit('close');
        throw new StoryWidgetMissingPostError(props.postSlug);
      }

      const { category, tags } = post;
      const { title, leadText, bodyText, avatar, publishedHumanFormat } = post.postTranslate;

      const postUrl = getPostUrl({
        slug: props.postSlug,
        categoryId: category.id,
      });

      storyViewProps.value = {
        title,
        postUrl,
        badge: props.badge || FALLBACK_BADGE,
        leadingText: leadText,
        coverImageUrl: avatar,
        formattedPublicationDate: publishedHumanFormat,
        postBodyHtml: formatBodyText(bodyText),
        trackingPixelUrl: post.pixelUrl ?? null,
      };

      pushVirtualPageView({
        url: `${unref(languageDomain)}${postUrl}`,
        title,
        category: category?.slug ?? '',
        tags: getMappedPostTags(tags),
      });
    } catch (error) {
      captureError(error);
    }
  });
});
</script>

<style module lang="scss">
.story-widget {
  height: 50vh;
  margin: 16px -10px;
}
</style>
