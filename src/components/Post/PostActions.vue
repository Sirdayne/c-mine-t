<script lang="ts" setup>
import PostAudioPlayer from './PostAudioPlayer.vue';
import { useStore } from '~/lib/framework';
import { computed } from 'vue';
import { useFeatureManager } from '~/lib/feature-manager';

defineProps<{
  audioSrc: string;
  postId: string;
  isPressRelease: boolean;
  views: number;
  shares: number;
}>();

const store = useStore();
const featureManager = useFeatureManager();

const i18n = computed(() => store.state.i18n);
const languageShort = computed(() => store.state.currentLanguage.short);

const postActionsAllowed = computed(() => featureManager.isEnabled('posts_actions_visible'));
</script>

<template>
  <div
    v-if="views && !isPressRelease && postActionsAllowed"
    class="flex flex-wrap items-center bg-[#eceff2]"
  >
    <div
      v-if="views && !isPressRelease && languageShort !== 'de'"
      class="flex items-center px-[10px] first:py-[5px] ml-[10px] first:ml-0"
    >
      <span
        class="block w-4 h-4 mr-1 bg-center bg-no-repeat bg-contain sm:hidden"
        :class="$style['eye-icon']"
      />
      <span class="sm:mx-1 text-black text-[13px] font-semibold">
        {{ views }}
      </span>
      <span class="hidden sm:block text-[13px] text-[#4a4a4a] font-light">
        {{ i18n.articleTotalViews }}
      </span>
    </div>
    <div
      v-if="shares && !isPressRelease"
      class="flex items-center px-[10px] first:py-[5px] ml-[10px] first:ml-0"
    >
      <span
        class="block w-4 h-4 mr-1 bg-center bg-no-repeat bg-contain sm:hidden"
        :class="$style['eye-icon']"
      />
      <span class="sm:mx-1 text-black text-[13px] font-semibold">
        {{ shares }}
      </span>
      <span class="hidden sm:block text-[13px] text-[#4a4a4a] font-light">
        {{ i18n.articleTotalShares }}
      </span>
    </div>
    <div
      v-if="audioSrc"
      class="flex items-center ml-auto"
    >
      <span class="hidden sm:block text-[13px] text-[#4a4a4a] font-light sm:mr-[15px]">
        {{ i18n.articleListenTo }}
      </span>
      <PostAudioPlayer
        :src="audioSrc"
        :post-id="postId"
      />
    </div>
  </div>
</template>

<style module lang="scss">
@use '~/assets/styles/_icons-common.scss' as icons;

.eye-icon {
  @include icons.eye;
}
.share-icon {
  @include icons.share-arrow;
}
</style>
