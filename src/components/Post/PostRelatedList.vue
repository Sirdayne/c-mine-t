<template>
  <div
    :class="isRtl && 'related-list_rtl'"
    class="related-list"
  >
    <div class="related-list__title">
      {{ title }}
    </div>

    <ul class="related-list__list">
      <li
        v-for="(post, index) in postsWithAd"
        :key="post.id"
        class="related-list__item"
      >
        <PostAdRenderer
          v-if="post.isAd"
          :html="post.adHtml"
          :data-gtm-locator="`article_clickon_relatedarticle_${index + 1}`"
        />

        <LinkResolver
          v-if="!post.isAd"
          :href="post.url"
          :data-gtm-locator="`article_clickon_relatedarticle_${index + 1}`"
          class="related-list__link"
        >
          <div class="related-list__item-image">
            <LazyImage
              :alt="post.title"
              :src="post.cover"
              :srcset="post.coverRetina"
              class="post-cover__image"
            />
          </div>
          <div class="related-list__item-title">
            {{ post.title }}
          </div>
        </LinkResolver>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineComponent, h, unref } from 'vue';
import { useStore } from '~/lib/framework';
import { useAdSlot } from '~/features/ads';
import { ROOT } from '~/store/types';
import { POST_FALLBACK_COVER_URL } from '~/app.config';
import { getThumbnail } from '~/assets/libs/getThumbnail';
import LinkResolver from '~/components/Shared/LinkResolver.vue';
import LazyImage from '~/components/Shared/LazyImage.vue';

const RELATED_NEWS_COVER_IMAGE_WIDTH = 240;
// idk why 2x not really a 2x; this component should be rewritten from scratch
const RELATED_NEWS_COVER_IMAGE_WIDTH_2X = 528;

const RELATED_NEWS_SLOT_2_PLACE = 'related_news_slot_2';
const BANNER_SLOT_INDEX = 1;

/**
 * idk why Vue2 cant handle both DOM-native <div> and <LinkResolver>
 * as child of <li> (one of each selected by "v-if")
 * so this wrapper helps to avoid that weird behaviour
 */
const PostAdRenderer = defineComponent({
  // eslint-disable-next-line vue/require-prop-types
  props: ['html'],
  setup(props) {
    return () =>
      h('div', {
        domProps: {
          innerHTML: props.html,
        },
      });
  },
});

const props = defineProps({
  title: {
    type: String,
    default: '',
  },

  posts: {
    type: Array,
    default: () => [],
  },
});

const store = useStore();
const adSlot = useAdSlot(RELATED_NEWS_SLOT_2_PLACE, 0);

const isRtl = computed(() => store.getters[ROOT.IS_RTL]);

const postsWithAd = computed(() => {
  const adHtml = unref(adSlot).adItem?.getBody();
  const result = props.posts.map((item: any) => {
    const cover = getThumbnail({
      imageUrl: item.cover,
      width: RELATED_NEWS_COVER_IMAGE_WIDTH,
      defaultImage: POST_FALLBACK_COVER_URL,
    });

    const coverX2 = getThumbnail({
      imageUrl: item.cover,
      width: RELATED_NEWS_COVER_IMAGE_WIDTH_2X,
      defaultImage: POST_FALLBACK_COVER_URL,
    });

    const coverRetina = `${cover} 1x, ${coverX2} 2x`;

    return {
      ...item,
      isAd: false,
      cover,
      coverRetina,
    };
  });

  if (adHtml) {
    const item = {
      adHtml,
      isAd: true,
      id: RELATED_NEWS_SLOT_2_PLACE,
    };

    if (result.length >= BANNER_SLOT_INDEX) {
      result[BANNER_SLOT_INDEX] = item;
    } else {
      result.push(item);
    }
  }

  return result;
});
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.related-list {
  color: #000;
  font-size: 1rem;
}

.related-list__title {
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #000000;
  padding: 25px 0;
}

.related-list__list {
  list-style: none;
  margin: inherit;
  padding: 0;
}

.related-list__item {
  width: 100%;
  margin-bottom: 24px;
  position: relative;
  min-height: 83.23px;
}

.related-list__item:last-child {
  margin-bottom: 0;
}

.related-list__link {
  display: flex;
  color: inherit;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  text-decoration: none;
  transition: color 0.15s;
}

.related-list__item-image {
  position: relative;
  width: 140px;
}

.related-list__item-image img {
  border-radius: 4px;
}

.related-list__item-title {
  width: calc(100% - 140px);
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.62;
  color: #000000;
  padding: 0 20px;
}

.related-list__item-title:hover {
  text-decoration: underline;
}

@media (min-width: $sm) {
  .related-list__list {
    margin-left: 0;
  }
  .related-list__item {
    display: inline-block;
    vertical-align: top;
    width: calc((100% / 3) - 10px);
  }
  .related-list__item:nth-child(3n-1) {
    margin-right: 5px;
    margin-left: 5px;
  }
  .related-list__item:nth-child(3n-2) {
    margin-right: 10px;
  }
  .related-list__item:nth-child(3n) {
    margin-left: 10px;
  }
  .related-list__link {
    display: block;
  }
  .related-list__item-image {
    width: 100%;
  }
  .related-list__item-title {
    width: 100%;
    margin-top: 16px;
    padding: 0;
  }
  .related-list_rtl .related-list__list {
    margin-right: 0;
  }
  .related-list_rtl .related-list__item:nth-child(3n-2) {
    margin-right: 0;
    padding-left: 10px;
  }
  .related-list_rtl .related-list__item:nth-child(3n) {
    margin-right: 10px;
    margin-left: 0;
  }
}

@media (min-width: $md) {
  .related-list {
    margin-left: 74px;
  }
  .related-list_rtl {
    margin-left: 0;
    margin-right: 74px;
  }
}
</style>
