<template>
  <div class="story-read-more">
    <div class="story-read-more-background">&nbsp;</div>
    <a
      class="story-read-more-button"
      target="_blank"
      :href="postUrl"
    >
      Read more
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StoryReadMore',

  props: {
    postUrl: {
      type: String,
      required: true,
    },
  },
});
</script>

<style scoped lang="scss">
$story-read-more-button-text-color: rgb(23, 26, 28);
$story-read-more-button-background-color: rgb(250, 191, 44);
$story-read-more-background-image: linear-gradient(360deg, #000000 0%, rgba(0, 0, 0, 0) 100%);

.story-read-more {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding-bottom: 12px;
}

.story-read-more-background {
  height: 180px;
  background-image: $story-read-more-background-image;
}

.story-read-more-button {
  display: block;

  padding: 12px 16px;
  margin-left: 12px;
  margin-right: 12px;
  border-radius: 8px;
  color: $story-read-more-button-text-color;
  background-color: $story-read-more-button-background-color;

  font-weight: 600;
  font-size: 15px;
  line-height: 24px;
  text-align: center;

  // reset post-content styles
  border-bottom: none !important;
  transition: noe !important;
}
</style>
