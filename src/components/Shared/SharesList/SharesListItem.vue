<template>
  <a
    class="btn shares-list-item"
    target="_blank"
    rel="noreferrer noopener"
    :data-gtm-locator="`article_clickon_share_${item.id}`"
    :href="shareUrl"
  >
    <component
      :is="iconComponent"
      class="text-white w-full"
      :class="{
        [$style['icon']]: true,
        [`shares-list-item_${item.id}`]: true,
        '!text-[#1877F2] hover:!text-[#106CE3]': item.id === 'facebook',
        '!text-[#101318] hover:!text-[#2C3545]': item.id === 'twitter',
        '!text-[#2AABEE] hover:!text-[#1A9BDE]': item.id === 'telegram',
        '!text-[#FF5700] hover:!text-[#E04C00]': item.id === 'reddit',
        '!text-[#0077B5] hover:!text-[#006AA1]': item.id === 'linkedin',
        '!text-[#25D366] hover:!text-[#0DB94D]': item.id === 'whatsapp',
        '!text-[#00C73C] hover:!text-[#00A331]': item.id === 'naver',
        '!text-[#00B1DE] hover:!text-[#0096BD]': item.id === 'hatena',
        '!text-[#EF4056] hover:!text-[#EC1D37]': item.id === 'pocket',
        '!text-[#06C755] hover:!text-[#05A346]': item.id === 'line',
        '!text-[#DF2029] hover:!text-[#C01C23]': item.id === 'weibo',
        '!text-[#3458B0] hover:!text-[#2C4B96]': item.id === 'qq',
      }"
    />
  </a>
</template>

<script>
import { mapState } from 'vuex';
import TwitterIcon from '~/assets/icons/socials/twitter.svg';
import TelegramIcon from '~/assets/icons/socials/telegram.svg';
import FacebookIcon from '~/assets/icons/socials/facebook.svg';
import RedditIcon from '~/assets/icons/socials/reddit.svg';
import LinkedinIcon from '~/assets/icons/socials/linkedin.svg';
import WhatsappIcon from '~/assets/icons/socials/whatsapp.svg';
import QqIcon from '~/assets/icons/socials/qq.svg';
import WeiboIcon from '~/assets/icons/socials/weibo.svg';
import NaverIcon from '~/assets/icons/socials/naver.svg';
import HatenaIcon from '~/assets/icons/socials/hatena.svg';
import PocketIcon from '~/assets/icons/socials/pocket.svg';
import LineIcon from '~/assets/icons/socials/line.svg';

export default {
  name: 'SharesListItem',
  props: {
    postInfo: {
      type: Object,
      default: () => ({}),
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState('settings', {
      twitterAccount: ({ socialLinks }) => socialLinks.twitterAccount,
    }),
    twitterText() {
      const { postInfo, twitterAccount } = this;
      const title = postInfo.title.replace(/&/g, ' and ');
      return `${title} ${postInfo.url} via ${twitterAccount}`;
    },
    shareUrl() {
      const { url, title, previewText } = this.postInfo;
      const { id } = this.item;
      return encodeURI(
        this.item.url
          .replace('%URL%', url)
          .replace('%TEXT%', id === 'twitter' ? this.twitterText : previewText)
          .replace('%TITLE%', title)
      );
    },
    iconComponent() {
      switch (this.item.id) {
        case 'twitter':
          return TwitterIcon;
        case 'telegram':
          return TelegramIcon;
        case 'facebook':
          return FacebookIcon;
        case 'weibo':
          return WeiboIcon;
        case 'qq':
          return QqIcon;
        case 'naver':
          return NaverIcon;
        case 'hatena':
          return HatenaIcon;
        case 'pocket':
          return PocketIcon;
        case 'line':
          return LineIcon;
        case 'whatsapp':
          return WhatsappIcon;
        case 'reddit':
          return RedditIcon;
        default:
          return LinkedinIcon;
      }
    },
  },
};
</script>
<style module>
.icon * {
  @media (max-width: 370px) {
    scale: 0.8;
  }
}
</style>
