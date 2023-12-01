<template>
  <div class="shares-list">
    <ul class="shares-list__list">
      <li
        v-for="item in sharesList"
        :key="item.id"
        class="shares-list__item"
      >
        <SharesListKakao
          v-if="item.id === 'kakao'"
          class="shares-list__btn"
          :post-info="postInfo"
          data-testid="shares-link-kakao"
          @click.native="socialMediaClick(item)"
        />
        <SharesListWeChat
          v-else-if="item.id === 'wechat'"
          :post-info="postInfo"
          data-testid="shares-link-wechat"
          @click.native="socialMediaClick(item)"
        />
        <SharesListCopy
          v-else-if="item.id === 'copy'"
          class="shares-list__btn"
          :post-info="postInfo"
          data-testid="shares-link-copy"
          @copied="onCopy"
        />
        <SharesListToTop
          v-else-if="item.id === 'to-top'"
          class="shares-list__btn"
          data-testid="shares-link-to-top"
          :data-gtm-locator="`article_${post.id}_clickon_top_button`"
        />
        <SharesListItem
          v-else
          class="shares-list__btn"
          :post-info="postInfo"
          :item="item"
          :data-testid="`shares-link-${item.id}`"
          @click.native="socialMediaClick(item)"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { POST_FALLBACK_COVER_URL } from '~/app.config';
import { getThumbnail } from '~/assets/libs/getThumbnail';
import SharesListItem from './SharesListItem';
import SharesListCopy from './SharesListCopy';
import SharesListToTop from './SharesListToTop';
import { sendShareSocialMediaClick } from '@/api/modules/shared/SendShareClick';

export default {
  name: 'SharesList',
  components: {
    SharesListItem,
    SharesListCopy,
    SharesListToTop,
    SharesListKakao: () => import('./SharesListKakao'),
    SharesListWeChat: () => import('./SharesListWeChat'),
  },
  props: {
    post: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState('settings', {
      sharesList: ({ socials: { sharesNewsFloatPanel } }) => {
        if (!sharesNewsFloatPanel) {
          return [{ id: 'to-top' }];
        }

        return [...sharesNewsFloatPanel, { id: 'to-top' }];
      },
    }),
    postInfo() {
      const { absoluteUrl: url, title, twitterLeadText, previewText, cover } = this.post;
      const coverLarge = getThumbnail({
        imageUrl: cover,
        width: 2960,
        defaultImage: POST_FALLBACK_COVER_URL,
      });
      return {
        url,
        title,
        twitterLeadText,
        previewText,
        coverLarge,
      };
    },
  },
  methods: {
    isSharesAllowed(item) {
      const socialsToShare = [
        'telegram',
        'linkedin',
        'whatsapp',
        'copy',
        'kakao',
        'naver',
        'wechat',
        'weibo',
        'qq',
        'pocket',
        'line',
        'hatena',
        'tumblr',
        'pinterest',
      ];
      return socialsToShare.some((social) => social === item);
    },
    onCopy() {
      this.$emit('copied');
      this.socialMediaClick({ id: 'copy' });
    },
    async socialMediaClick(social) {
      const { post } = this;
      if (this.isSharesAllowed(social.id)) {
        await sendShareSocialMediaClick({
          translationId: post.translationId,
          target: social.id,
        });
      }
    },
  },
};
</script>

<style lang="scss">
@use '~/assets/styles/_vars.scss' as vars;

.shares-list__list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  max-width: 375px;
  margin: -2.5px auto;
  padding: 5px;
  box-sizing: border-box;
  list-style: none;
  background-color: #ffffff;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
}
.shares-list__item {
  padding: 2.5px;
}
.shares-list__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 33px;
  height: 33px;
  overflow: visible;
  border-radius: 3px;
}

@media (min-width: 370px) {
  .shares-list__btn {
    width: 40px;
    height: 40px;
  }
}
@media (min-width: 376px) {
  .shares-list__list {
    margin-bottom: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
  }
  .shares-list__btn {
    max-width: 40px;
    max-height: 40px;
  }
}
@media (min-width: vars.$md) {
  .shares-list__list {
    display: block;
    width: 50px;
    margin: -2.5px 0;
    padding: 0;
    background-color: transparent;
    box-shadow: none;
  }
  .shares-list__item {
    display: block;
  }
  .shares-list__btn {
    width: 40px;
    height: 40px;
    border-radius: 4px;
  }
}
</style>
