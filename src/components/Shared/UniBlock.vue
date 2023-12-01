<template>
  <div
    class="uni-block"
    :class="[
      `uni-block_${theme}`,
      isRtl && 'uni-block_rtl',
      !posts.length && 'hidden',
      theme === 'card' && 'rounded-containerM',
    ]"
  >
    <div class="uni-block__header">
      <span
        v-if="title"
        class="uni-block__title"
        :class="{
          '!text-m leading-[1.2em] !font-semibold !normal-case self-baseline': isTopUniBlock,
          '!text-[23px] leading-[1.2em] !font-semibold !normal-case !text-bg-invertedStrong': isBetweenPostsUniBlock,
        }"
      >
        {{ title || '' }}
      </span>
      <span
        v-else
        class="uni-block__title"
      >
        &nbsp;
      </span>
      <div
        :class="{
          'translate-y-1': isTopUniBlock,
          'translate-x-2 rtl:-translate-x-2': deviceInfo.desktop,
          'translate-x-4 rtl:-translate-x-4': !deviceInfo.desktop && isRtl,
        }"
      >
        <CtArrowsButtonConnected
          v-if="posts.length > PER_PAGE"
          left-locator="uni-block-arrow-prev"
          right-locator="uni-block-arrow-next"
          :size="deviceInfo.desktop && isBetweenPostsUniBlock ? 'lg' : 'md'"
          class="px-1 md:px-2 py-1 !outline-[#627F8C59] gap-2 flex"
          :class="{ 'translate-x-2': !deviceInfo.desktop }"
          @left="handlePrevPage"
          @right="handleNextPage"
        />
      </div>
    </div>
    <hr
      v-if="isTopUniBlock"
      class="w-[calc(100%_-_72px)] mb-4 border-t border-1 border-[#627f8c59]"
    />
    <ul class="uni-block__list">
      <li
        v-for="item in pageItems"
        :key="item.id"
        class="uni-block__item"
      >
        <LinkResolver
          class="uni-block__link"
          :to="item.url"
          :language-short="languageShort"
          @click.capture="sendDataLayerEvent(item.id)"
        >
          <figure class="uni-block__figure">
            <LazyImage
              class="uni-block__image"
              :src="item.cover"
              :srcset="item.coverRetina"
              :alt="item.title"
            />
            <ClientOnly>
              <span
                v-if="isCommunityPosts && isKindOfDesktop"
                :class="`post-card__badge post-card__badge_default`"
              >
                Innovation Circle
              </span>
            </ClientOnly>
          </figure>
          <span
            class="uni-block__name"
            :class="{ '!text-s !leading-[17px]': isTopUniBlock }"
            :title="item.title"
          >
            {{ getTrimmedString(item.title) }}
          </span>
        </LinkResolver>
      </li>
    </ul>
  </div>
</template>

<script>
import chunk from 'lodash/chunk';
import { mapState, mapGetters } from 'vuex';
import { ROOT } from '~/store/types';
import { BREAKPOINTS, POST_FALLBACK_COVER_URL, UNI_BLOCK_TYPES } from '~/app.config';
import { getThumbnail } from '~/assets/libs/getThumbnail';
import scrollTo from '~/assets/libs/scrollTo';
import LinkResolver from '~/components/Shared/LinkResolver';
import LazyImage from '~/components/Shared/LazyImage.vue';
import { mainPageLinksEvent } from '~/assets/helpers/dataLayerEvents';
import { UniBlocksQueryDocument, useQuery } from '~/graphql';
import { useStore } from '~/lib/framework';
import { computed } from 'vue';
import getProperty from '~/assets/libs/getProperty';
import filterNoneObjects from '~/assets/libs/filterNoneObjects';
import { getMappedUniBlock } from '~/assets/helpers/posts';
import CtArrowsButtonConnected from '~/lib/ui/ct-arrows-button-connected/CtArrowsButtonConnected.vue';
import { useDeviceInfo } from '~/lib/device-detector';

const PER_PAGE = 4;

export default {
  name: 'UniBlock',
  components: {
    CtArrowsButtonConnected,
    LinkResolver,
    LazyImage,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    isCommunityPosts: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: 'inline',
      validator: (value) => {
        return ['inline', 'card'].includes(value);
      },
    },
  },
  setup(props) {
    const store = useStore();
    const languageShort = computed(() => store.state.currentLanguage.short);
    const deviceInfo = useDeviceInfo();

    const isTopUniBlock = computed(() => props.type === UNI_BLOCK_TYPES.TOP);
    const isBetweenPostsUniBlock = computed(() => props.type === UNI_BLOCK_TYPES.BETWEEN_POSTS);
    const isCardTheme = computed(() => props.theme === 'card');

    const uniblocksQuery = useQuery({
      query: UniBlocksQueryDocument,
      variables: {
        short: languageShort,
        type: props.type,
      },
    });

    const uniblockData = computed(() => {
      const value = uniblocksQuery.data.value;
      const universalBlocks = getProperty(value?.locale, 'universalBlocks', []);
      const languageDomain = store.state.currentLanguage.domain;
      const languageCode = store.state.currentLanguage.code;
      const timeZone = store.state.currentLanguage.timezone;
      const data = filterNoneObjects(universalBlocks).map((item) =>
        getMappedUniBlock(item, {
          languageDomain,
          languageCode,
          timeZone,
        })
      );
      return data.find((item) => item.type === props.type);
    });
    const posts = computed(() => uniblockData.value?.posts || []);
    const title = computed(() => uniblockData.value?.title || '');

    return {
      posts,
      title,
      uniblocksQuery,
      isBetweenPostsUniBlock,
      isTopUniBlock,
      isCardTheme,
      deviceInfo,
    };
  },
  data() {
    return {
      page: 0,
      PER_PAGE,
      mobileListExpanded: false,
    };
  },
  computed: {
    ...mapState({
      i18n: ({ i18n }) => i18n,
      languageShort: ({ currentLanguage: { short } }) => short,
    }),
    ...mapState('viewport', {
      viewportWidth: ({ viewportWidth }) => viewportWidth,
      breakpoint: ({ breakpoint }) => breakpoint,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
      isEn: ROOT.IS_EN,
    }),
    isKindOfDesktop() {
      return [BREAKPOINTS.MD, BREAKPOINTS.LG].includes(this.breakpoint);
    },
    list() {
      return this.posts.map((item) => {
        const cover = getThumbnail({
          imageUrl: item.cover,
          width: 370,
          defaultImage: POST_FALLBACK_COVER_URL,
        });
        const coverX2 = getThumbnail({
          imageUrl: item.cover,
          width: 740,
          defaultImage: POST_FALLBACK_COVER_URL,
        });
        const coverRetina = `${cover} 1x, ${coverX2} 2x`;
        return {
          ...item,
          cover,
          coverRetina,
          url: this.isCommunityPosts ? item.url.split('/news/').join('/innovation-circle/') : item.url,
        };
      });
    },
    pageItems() {
      if (this.mobileListExpanded) {
        return this.list;
      }
      return this.pagedList[this.page] || [];
    },
    pagedList() {
      return chunk(this.list, PER_PAGE);
    },
    areAllItemsShown() {
      return this.pageItems.length === this.posts.length;
    },
    areMinimumItemsShown() {
      return this.pageItems.length <= PER_PAGE;
    },
    titleMaxLength() {
      if (this.theme === 'inline' && this.breakpoint === BREAKPOINTS.LG) {
        return 70;
      }
      if (this.theme === 'inline' && this.breakpoint === BREAKPOINTS.MD) {
        return 45;
      }
      if (this.theme === 'card' && this.breakpoint === BREAKPOINTS.LG) {
        return 90;
      }
      if (this.theme === 'card' && this.breakpoint === BREAKPOINTS.MD) {
        return 78;
      }
      return 0;
    },
  },
  watch: {
    breakpoint: 'handleBreakpointChange',
  },
  methods: {
    getItemIndex(id) {
      return this.list.findIndex((item) => item.id === id);
    },
    sendDataLayerEvent(id) {
      const index = this.getItemIndex(id);
      const text = index >= 6 ? 'market_news_other' : `market_news_${index + 1}`;
      if (this.isEn) {
        mainPageLinksEvent(text);
      }
    },
    handleBreakpointChange(value, prevValue) {
      const wasPrevValueDesktop = [BREAKPOINTS.MD, BREAKPOINTS.LG].includes(prevValue);
      const isValueDesktop = [BREAKPOINTS.MD, BREAKPOINTS.LG].includes(value);
      if (wasPrevValueDesktop !== isValueDesktop) {
        this.page = 0;
      }
    },
    handlePrevPage() {
      if (!this.posts.length) {
        return;
      }
      if (this.page <= 0) {
        this.page = this.pagedList.length - 1;
      } else {
        this.page -= 1;
      }
    },
    handleNextPage() {
      if (!this.posts.length) {
        return;
      }
      if (this.page >= this.pagedList.length - 1) {
        this.page = 0;
      } else {
        this.page += 1;
      }
    },
    handleMoreShow() {
      if (this.isKindOfDesktop || !this.posts.length || this.areAllItemsShown) {
        return;
      }
      this.mobileListExpanded = true;
    },
    hideItems() {
      if (this.isKindOfDesktop) {
        return;
      }
      this.mobileListExpanded = false;
      scrollTo({
        destination: this.$el,
        duration: 0,
      });
    },
    getTrimmedString(string) {
      return !this.titleMaxLength || string.length < this.titleMaxLength
        ? string
        : `${string.slice(0, this.titleMaxLength)}...`;
    },
  },
};
</script>

<style lang="scss">
@use '~/assets/styles/_icons-common.scss' as icons;
@import '~/assets/styles/_vars.scss';

.uni-block__header {
  display: flex;
  align-items: center;
}
.uni-block__title {
  flex-grow: 1;
  display: block;
  color: #27272d;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
}
.uni-block_ko .uni-block__title {
  font-size: 1.05rem;
}

.uni-block__list {
  display: block;
  margin: 0;
  padding: 0;
  list-style: none;
}
.uni-block__item {
  &:not(:last-child) {
    margin-bottom: 20px;
  }
}
.uni-block__link {
  display: flex;
  text-decoration: inherit;
  color: inherit;
}
.uni-block__link:hover {
  color: inherit;
}
.uni-block__figure {
  flex-shrink: 0;
  position: relative;
  display: block;
  width: 90px;
  margin: 0 18px 0 0;
  overflow: hidden;
  border-radius: 3px;
}
.uni-block__image {
  position: relative;
  display: block;
  width: 100%;
  height: 0;
  padding-top: 66.62%;
  background-color: #fbfbfb;
}
.uni-block__name {
  @apply text-fg-strong;
  display: block;
  font-size: 16px;
  font-weight: 600;
  line-height: 19px;
}
.uni-block_inline {
}
.uni-block_inline .uni-block__figure {
  width: 78px;
  margin: 0 10px 0 0;
}
.uni-block_inline .uni-block__name {
  font-size: 0.75rem;
}
.uni-block_card {
  padding: 32px;
  background-color: #ffffff;
  border-top: 2px solid #fabf2c;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  box-shadow: 0 1px 20px 0 rgba(0, 0, 0, 0.1);
}
.uni-block_card .uni-block__header {
  padding-bottom: 0;
  margin-bottom: 32px;
  border-bottom: 0;
}
.uni-block_card .uni-block__name {
  max-height: 56px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.uni-block_rtl {
  direction: rtl;
}

.uni-block_rtl .uni-block__figure {
  margin-left: 18px;
  margin-right: 0;
}
.uni-block_rtl.uni-block_inline .uni-block__figure {
  margin-left: 10px;
  margin-right: 0;
}

@media (min-width: $md) {
  .uni-block__list {
    display: flex;
    margin-left: -10px;
    margin-right: -10px;
  }
  .uni-block__item {
    flex-basis: calc(100% / 4);
    margin-bottom: 0;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 0;
    border-bottom: 0;
    box-sizing: border-box;
  }

  .uni-block_inline .uni-block__title {
    font-size: 0.75rem;
  }
  .uni-block_inline .uni-block__name {
    height: 52px;
    overflow: hidden;
  }
  .uni-block_card {
    padding: 32px 20px 40px;
  }
  .uni-block_card .uni-block__title {
    font-size: 1rem;
    font-weight: 900;
  }

  .uni-block_card .uni-block__link {
    display: block;
  }
  .uni-block_card .uni-block__figure {
    width: 100%;
    margin: 0 0 8px;
  }
  .uni-block_card .uni-block__name {
    font-size: 16px;
    line-height: 1.2em;
    letter-spacing: -0.01em;
  }
}
</style>
