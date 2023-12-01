<template>
  <div class="instagram-wrapper">
    <blockquote
      class="instagram-media"
      :data-instgrm-permalink="`https://www.instagram.com/reel/${postId}/?utm_source=ig_embed&amp;utm_campaign=loading`"
      data-instgrm-version="14"
    />
    <script
      async
      src="//www.instagram.com/embed.js"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  postId: {
    type: [String, Number],
    required: true,
  },
});
</script>

<style lang="scss">
.instagram-wrapper {
  max-width: 550px;
  padding: 0;
  width: 99.375%;
  width: -webkit-calc(100% - 2px);
  width: calc(100% - 2px);
  min-height: 600px;
}
.instagram-media-rendered {
  background: #fff;
  border: 0;
  // reassign insta iframe inline styles
  border-radius: 12px !important;
  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.5), 0 1px 10px 0 rgba(0, 0, 0, 0.15);
  margin: 1px;
  max-width: 550px;
  min-width: 300px !important;
  padding: 0;
  width: 99.375%;
  width: -webkit-calc(100% - 2px);
  width: calc(100% - 2px);
  min-height: 600px;
}
</style>
