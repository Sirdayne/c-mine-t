<script setup lang="ts">
import { OptimizedImage } from '~/lib/image';
import LinkResolver from '~/components/Shared/LinkResolver.vue';
import { type GtmLocatorVariant, type PostLike } from './types';
import { computed } from 'vue';
import { getThumbnail } from '~/assets/libs/getThumbnail';
import { useDeviceInfo } from '~/lib/device-detector';

const props = defineProps<{
  post: PostLike;
  postIndex: number;
  gtmLocatorVariant: GtmLocatorVariant;
  coverHeight: number;
}>();

const deviceInfo = useDeviceInfo();

const coverWidth = computed(() => (deviceInfo.desktop ? 112 : 82));

const coverRetina = computed(() => {
  const x1 = getThumbnail({
    imageUrl: props.post.cover,
    width: coverWidth.value,
  });
  const x2 = getThumbnail({
    imageUrl: props.post.cover,
    width: coverWidth.value * 2,
  });
  return `${x1} 1x, ${x2} 2x`;
});
</script>

<template>
  <LinkResolver
    class="flex overflow-hidden flex-nowrap focus:underline hover:underline active:underline"
    :to="post.url"
    :title="post.title"
    :data-gtm-locator="`home_${gtmLocatorVariant}_clickon_${postIndex + 1}_article`"
  >
    <OptimizedImage
      class="block rounded shrink-0 object-cover"
      :src="post.cover"
      :srcset="coverRetina"
      :height="coverHeight"
      :width="coverWidth"
    />
    <p class="ltr:ml-3 rtl:mr-3 text-m leading-default flex-grow font-semibold text-fg-strong self-center line-clamp-4">
      {{ post.title }}
    </p>
  </LinkResolver>
</template>
