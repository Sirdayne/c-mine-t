<template>
  <span
    role="img"
    :class="{
      [$style['reaction']]: true,
      [$style['reaction--reacted']]: reactionCountGreaterThanZero,
      [$style['reaction--has-own']]: localHasOwn,
    }"
    @click="handleSelectReaction"
  >
    <img
      :src="reactionImage"
      :class="$style['reaction-image']"
    />
    <span
      v-if="reactionCountGreaterThanZero"
      :class="$style['reaction--counter']"
    >
      {{ count }}
    </span>
  </span>
</template>
<script lang="ts">
import { computed } from 'vue';
import { defineComponent } from '~/lib/framework';
import { POST_AVAILABLE_REACTIONS } from '~/components/Post/ReactionsPicker/AvailableReactions';

export default defineComponent({
  name: 'ReactionItem',
  props: {
    symbol: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
      default: null,
    },
    count: {
      type: [Number, String],
      default: null,
    },
    hasOwn: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const reactionCountGreaterThanZero = computed(() => {
      return props.count > 0;
    });
    const reactionImage = computed(() => {
      if (props.imageURL) return props.imageURL;

      return POST_AVAILABLE_REACTIONS[props.symbol].imageURL;
    });

    const localHasOwn = computed(() => {
      return props.hasOwn;
    });

    const handleSelectReaction = () => {
      emit('handleSelectReaction');
    };
    return {
      handleSelectReaction,
      reactionCountGreaterThanZero,
      reactionImage,
      localHasOwn,
    };
  },
});
</script>

<style module lang="scss">
@import '~/assets/styles/_vars.scss';
.reaction {
  min-width: 24px;
  display: inline-flex;
  font-size: 24px;
  line-height: 100%;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  padding: 8px;
  gap: 4px;
  border-radius: 9999px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  max-height: 40px;
  height: 100%;

  &:hover {
    background-color: $color-gray-300;
  }

  &--counter {
    font-size: 14px;
    line-height: 18px;
    color: $color-black-950;
    margin-left: 4px;
  }

  &--reacted {
    min-width: 40px;
    background-color: $color-gray-300;

    @media (min-width: $md) {
      &:hover {
        background-color: $color-orange-500;
      }
    }
  }
  &--has-own {
    background-color: $color-orange-500;
    &:hover {
      background-color: $color-orange-600;
    }
  }
  &-image {
    width: 24px;
    height: 24px;
  }
}
</style>
