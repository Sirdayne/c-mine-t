<template>
  <div
    class="reactions-picker"
    :class="{
      [$style['reactions-picker--rtl']]: isRtl,
    }"
    @mouseleave="hidePicker"
  >
    <div :class="$style['reactions-picker--header']">
      <AddReactionIcon />
      <p :class="$style['reactions-picker--header-text']">{{ headerText }}</p>
      <CloseReactionModalIcon
        v-if="isMobileWidth"
        :class="$style['reactions-picker--close']"
        @click.native="$emit('hidePicker')"
      />
    </div>
    <ReactionsCarouselMobile
      v-if="!isDesktop"
      :reactions="availableReactions"
      @handleSelectReaction="updateReaction"
    />
    <template
      v-for="(imageUrl, symbol) in availableReactions"
      v-else
    >
      <ReactionItem
        v-if="imageUrl"
        :key="symbol"
        :symbol="symbol"
        :image-url="imageUrl"
        :data-gtm-locator="`article_${postId}_clickon_add_reaction`"
        @handleSelectReaction="updateReaction(symbol)"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import AddReactionIcon from '~/components/Post/ReactionsPicker/AddReactionIcon.vue';
import CloseReactionModalIcon from '~/components/Post/ReactionsPicker/CloseReactionModalIcon.vue';
import ReactionItem from '~/components/Post/ReactionsPicker/ReactionItem.vue';
import { ROOT } from '~/store/types';
import { POST_AVAILABLE_REACTIONS } from '~/components/Post/ReactionsPicker/AvailableReactions';
import { useStore } from '~/lib/framework';
import ReactionsCarouselMobile from '~/components/Post/ReactionsPicker/ReactionsCarouselMobile.vue';
import { useDeviceInfo } from '~/lib/device-detector';

export default defineComponent({
  name: 'ReactionsPickerPopup',
  components: { ReactionsCarouselMobile, ReactionItem, CloseReactionModalIcon, AddReactionIcon },
  props: {
    postTranslateId: {
      type: String,
      required: true,
    },
    alreadyReact: {
      type: Boolean,
      default: false,
    },
    postId: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const store = useStore<any>();
    const isMobileWidth = computed(() => store.getters['viewport/IS_MOBILE_BREAKPOINT']);
    const addReactionText = computed(() =>
      store.state.i18n?.postAddReactionButton ? store.state.i18n?.postAddReactionButton : 'Add reaction'
    );
    const changeReactionText = computed(() =>
      store.state.i18n?.postChangeReactionButton ? store.state.i18n?.postChangeReactionButton : 'Change reaction'
    );
    const availableReactions = POST_AVAILABLE_REACTIONS;
    const deviceInfo = useDeviceInfo();
    const isDesktop = computed(() => deviceInfo.desktop);
    const isRtlGetter = () => store.getters[ROOT.IS_RTL];
    const isRtl = isRtlGetter();
    const headerText = computed(() => {
      return props.alreadyReact ? changeReactionText.value : addReactionText.value;
    });
    const updateReaction = (reaction: string) => {
      emit('handleSelectReaction', reaction);
    };
    const hidePicker = () => {
      if (!deviceInfo.desktop) return;

      emit('hidePicker');
    };
    return {
      isMobileWidth,
      headerText,
      updateReaction,
      isRtl,
      availableReactions,
      isDesktop,
      hidePicker,
    };
  },
});
</script>

<style module lang="scss">
@import '~/assets/styles/_vars.scss';
.reactions-picker {
  &--header {
    display: flex;
    align-items: center;
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    color: $color-black;
    margin: 0 0 12px 0;
    &-text {
      margin: 0 0 0 4px;
    }
  }
  &--close {
    margin-left: auto;
  }
}
.reactions-picker--rtl {
  direction: rtl;
  .reactions-picker--header-text {
    margin: 0 4px 0 0;
  }
}
</style>
