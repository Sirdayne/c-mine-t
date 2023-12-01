<template>
  <div
    class="post-cover"
    :class="[isRtl && 'post-cover_rtl']"
  >
    <div class="post-cover__wrp">
      <YoutubeAutoplay
        v-if="post.youtubeVideoIdCover"
        class="post-cover__youtube-cover"
        :video-id="post.youtubeVideoIdCover"
        @playing="isBadgeShown = false"
      />
      <template v-else>
        <LazyImage
          class="post-cover__image"
          image-class="type:primaryImage"
          :immediate="immediate"
          :src="cover"
          :srcset="coverRetina"
          :sources="coverSources"
          :alt="post.title"
        />
        <span
          v-if="post.badgeName && isBadgeShown"
          class="post-cover__badge"
          hidden
        >
          {{ post.badgeName }}
        </span>
      </template>
    </div>
    <YoutubeHeader
      v-if="post.youtubeVideoIdCover"
      class="post-cover__youtube-header"
      :i18n="i18n"
    />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { ROOT } from '~/store/types';
import { POST_FALLBACK_COVER_URL } from '~/app.config';
import { getThumbnail, getImageSources } from '~/assets/libs/getThumbnail';
import LazyImage from '~/components/Shared/LazyImage.vue';
import YoutubeAutoplay from '~/components/Shared/YoutubeAutoplay.vue';
import YoutubeHeader from '~/components/Shared/YoutubeHeader.vue';

export default {
  name: 'PostCover',
  components: {
    LazyImage,
    YoutubeAutoplay,
    YoutubeHeader,
  },
  props: {
    immediate: {
      type: Boolean,
    },
    post: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isBadgeShown: true,
    };
  },
  computed: {
    ...mapState({
      i18n: ({ i18n }) => i18n,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
    cover() {
      return getThumbnail({
        imageUrl: this.post.cover,
        width: 1434,
        defaultImage: POST_FALLBACK_COVER_URL,
      });
    },
    coverRetina() {
      const x2 = getThumbnail({
        imageUrl: this.post.cover,
        width: 1480,
        defaultImage: POST_FALLBACK_COVER_URL,
      });
      return `${this.cover} 1x, ${x2} 2x`;
    },
    coverSources() {
      return getImageSources({
        imageUrl: this.post.cover,
        defaultImage: POST_FALLBACK_COVER_URL,
        sizes: [
          { media: '1200px', srcset: [717, 1434] },
          { media: '992px', srcset: [587, 1174] },
          { media: '768px', srcset: [638, 1276] },
          { media: '480px', srcset: [747, 1494] },
          { media: 'default', srcset: [480, 960] },
        ],
      });
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';
.post-cover__wrp {
  position: relative;
}
.post-cover__youtube-cover {
  position: relative;
  width: 100%;
  margin: 0;
  height: 0;
  padding-top: 56.25%;
}
.post-cover__youtube-header {
  justify-content: center;
}
.post-cover__image {
  display: block;
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 66.66%;
}
.post-cover__badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: block;
  padding: 4px;
  text-transform: uppercase;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 700;
  white-space: nowrap;
  color: #3d3d3d;
  background-color: #ffcd04;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.75);
  border-radius: 4px;
}
.post-cover__badge-adbutler {
  position: absolute;
  display: block;
  padding: 4px;
  border-radius: 4px;
  text-transform: capitalize;
  font-weight: 600;
  font-size: 11px;
  line-height: 18px;
  text-align: center;
  letter-spacing: 0.06em;
  color: #ffffff;
  opacity: 0.9;
  right: 4px;
  bottom: 4px;
}

.post-cover__badge_danger {
  background-color: #a90329;
}
.post-cover__badge_success {
  background-color: #436043;
  color: #ffffff;
}
.post-cover__badge_warning {
  background-color: #c79121;
}
.post-cover__badge_info {
  background-color: #385a6b;
  color: #ffffff;
}
.post-cover_rtl {
  direction: rtl;
}
</style>
