<template>
  <div
    :class="{
      [$style['reactions']]: true,
      [$style['reactions--rtl']]: isRtl,
    }"
  >
    <button
      :class="{
        [$style['reactions--button']]: true,
      }"
      @mouseover="showReactionsPicker"
      @click="showMobileReactionsModal"
    >
      <AddReactionIcon />
      <p
        v-if="!postHasReactions"
        :class="$style['reactions--button-text']"
      >
        {{ popupTitle }}
      </p>
    </button>
    <ReactionsPickerPopup
      :already-react="userAlreadyReact"
      :post-id="postId"
      :post-translate-id="postTranslateId"
      :class="{
        [$style['reactions-list']]: true,
        [$style['reactions-list--active']]: isReactionsPickerVisible && !isMobileReactionsPickerVisible,
        [$style['reactions-list--mobile']]: isMobileReactionsPickerVisible,
      }"
      @hidePicker="hidePicker"
      @handleSelectReaction="toggleReaction"
    />
    <template v-for="reaction in postReactions">
      <ReactionItem
        :key="reaction.symbol"
        :symbol="reaction.symbol"
        :has-own="reaction.hasOwn"
        :count="reaction.count"
        :data-gtm-locator="`article_${postId}_clickon_add_reaction`"
        class="mr-1"
        @handleSelectReaction="toggleReaction(reaction.symbol)"
      />
    </template>
    <!-- bad realisation => refactor :before click outside-->
    <a
      v-if="isMobileReactionsPickerVisible"
      href="javascript:void(0)"
      :class="$style['backdrop']"
      @click="hidePicker"
      @wheel.prevent
      @touchmove.prevent
      @scroll.prevent
    />
  </div>
</template>

<script lang="ts">
import AddReactionIcon from '~/components/Post/ReactionsPicker/AddReactionIcon.vue';
import { computed, defineComponent, onMounted, ref } from 'vue';
import ReactionsPickerPopup from '~/components/Post/ReactionsPicker/ReactionsPickerPopup.vue';
import ReactionItem from '~/components/Post/ReactionsPicker/ReactionItem.vue';
import { ROOT } from '~/store/types';
import { useStore } from '~/lib/framework';
import { type Reaction, useReactionsApi } from './core/ReactionsApi';

interface OptimisticReaction {
  symbol: string;
}

// TODO: refactor to separate view model
/**
 * @param reactions rurrent reactions
 * @param optimisticSymbol reaction symbol to toggle
 * @return reactions with optimistic update
 */
const updateReactionsOptimisticOnToggle = (reactions: Reaction[], optimisticSymbol: string | null): Reaction[] => {
  reactions = reactions.slice();

  if (optimisticSymbol) {
    const originalIndex = reactions.findIndex((reaction) => reaction.symbol === optimisticSymbol);
    const original = reactions[originalIndex];

    if (original) {
      const { hasOwn, count } = original;

      // update existing reaction
      reactions[originalIndex] = {
        symbol: optimisticSymbol,
        count: hasOwn ? count - 1 : count + 1,
        hasOwn: !hasOwn,
      };
    } else {
      // append new optimistic reaction
      reactions.push({
        symbol: optimisticSymbol,
        count: 1,
        hasOwn: true,
      });
    }

    // reactions that already toggled by current user,
    // but have another symbol than optimistic update
    // should be dis-owned
    {
      const anotherOwnReactionIndex = reactions.findIndex(
        (reaction) => reaction.hasOwn && reaction.symbol !== optimisticSymbol
      );

      const anotherOwnReaction = reactions[anotherOwnReactionIndex] ?? null;

      if (anotherOwnReaction)
        reactions[anotherOwnReactionIndex] = {
          symbol: anotherOwnReaction.symbol,
          count: anotherOwnReaction.count - 1,
          hasOwn: false,
        };
    }
  }

  // en-US enough to collate emojis
  const collator = new Intl.Collator('en-US');

  return reactions
    .filter((reaction) => reaction.count > 0)
    .sort((a, b) => {
      const countDiff = b.count - a.count;

      // for reactions with same count fallback to symbol comprarison
      if (countDiff === 0) return collator.compare(b.symbol, a.symbol);

      return countDiff;
    });
};

export default defineComponent({
  name: 'PostReactions',
  components: { ReactionItem, ReactionsPickerPopup, AddReactionIcon },
  props: {
    postTranslateId: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const isReactionsPickerVisible = ref(false);
    const isMobileReactionsPickerVisible = ref(false);
    const postReactions = ref<Reaction[]>([]);
    const isRtl = computed(() => store.getters[ROOT.IS_RTL]);
    const isMobileWidth = computed(() => store.getters['viewport/IS_MOBILE_BREAKPOINT']);
    const addReactionText = computed(() =>
      store.state.i18n?.postAddReactionButton ? store.state.i18n?.postAddReactionButton : 'Add reaction'
    );
    const changeReactionText = computed(() =>
      store.state.i18n?.postChangeReactionButton ? store.state.i18n?.postChangeReactionButton : 'Change reaction'
    );
    const postHasReactions = computed(() => {
      return postReactions.value?.length;
    });

    const optimisticReaction = ref<OptimisticReaction | null>(null);

    const postReactionsApi = useReactionsApi();
    const showReactionsPicker = () => {
      if (!isMobileWidth.value) {
        isReactionsPickerVisible.value = true;
      }
    };
    const userAlreadyReact = computed(() => {
      return postReactions.value?.some((reaction: Reaction) => reaction?.hasOwn) ?? false;
    });

    const popupTitle = computed(() => {
      const text = userAlreadyReact.value ? changeReactionText.value : addReactionText.value;
      return text;
    });

    const toggleReaction = async (symbol: string) => {
      postReactions.value = updateReactionsOptimisticOnToggle(postReactions.value, symbol);
      await postReactionsApi.toggleReaction(props.postTranslateId, symbol);
      hidePicker();
    };

    const lockBodyScroll = (val: boolean) => {
      const body = document.body;
      val ? (body.style.overflowY = 'hidden') : (body.style.overflowY = 'scroll');
    };
    const hidePicker = () => {
      if (isMobileWidth.value) {
        lockBodyScroll(false);
        isMobileReactionsPickerVisible.value = false;
      } else {
        isReactionsPickerVisible.value = false;
      }
    };
    const showMobileReactionsModal = () => {
      if (isMobileWidth.value) {
        lockBodyScroll(true);
        isMobileReactionsPickerVisible.value = true;
      }
    };

    const getPostReactions = async (): Promise<void> => {
      const loadedReactions = await postReactionsApi.getReactions(props.postTranslateId);
      postReactions.value = updateReactionsOptimisticOnToggle(loadedReactions, null);
      optimisticReaction.value = null;
    };

    onMounted(async () => {
      await getPostReactions();
    });

    return {
      isReactionsPickerVisible,
      isMobileReactionsPickerVisible,
      showReactionsPicker,
      hidePicker,
      isMobileWidth,
      showMobileReactionsModal,
      popupTitle,
      toggleReaction,
      userAlreadyReact,
      postReactions,
      postHasReactions,
      isRtl,
    };
  },
});
</script>

<style module lang="scss">
@import '~/assets/styles/_vars.scss';

.reactions {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 24px 0;
  @media (min-width: $md) {
    margin-left: 74px;
  }
  &-list {
    display: none;
    padding: 20px;
    box-sizing: border-box;

    @media (min-width: $xs--tablet) {
      padding: 16px;
    }
    @media (min-width: $md) {
      padding: 8px 10px 10px;
    }
  }
  &--button {
    border-radius: 20px;
    padding: 8px;
    display: flex;
    align-items: center;
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    color: $color-black;
    border: none;
    cursor: pointer;
    background: $color-gray-94;
    margin: 2px 4px 2px 2px;
    @media (min-width: $md) {
      &:hover {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        max-width: 340px;
        width: 100%;
        background: $color-white;
      }
    }
    &-text {
      margin: 0 0 0 4px;
    }
  }
}
.reactions-list--mobile {
  background: $color-white;
  box-shadow: 0 4px 40px rgba(0, 0, 0, 0.15);
  position: fixed;
  min-width: 192px;
  display: block;
  flex-direction: column;
  z-index: 200;
  font-size: 16px;
  line-height: 20px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;

  @media screen and (min-width: $xs--tablet) {
    margin: 0 auto;
    max-width: 420px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.25);
    border-radius: 20px 20px 0 0;
  }
}
.reactions-list--active {
  z-index: 100;
  display: block;
  flex-wrap: wrap;
  top: 0;
  max-width: 340px;
  width: 100%;
  left: 0;
  position: absolute;
  background: $color-white;
  box-shadow: 0 4px 40px rgba(0, 0, 0, 0.15);
  border-radius: 20px;
}
.backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #4e5d65;
  opacity: 0.4;
  z-index: 1;
  overflow-y: hidden;
}
.reactions--rtl {
  direction: rtl;
  @media (min-width: $md) {
    margin-right: 74px;
  }
  .reactions--button-text {
    margin: 0 4px 0 0;
  }
  .reactions-list--active {
    right: 0;
  }
}
</style>
