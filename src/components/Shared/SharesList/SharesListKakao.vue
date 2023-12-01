<template>
  <button
    ref="kakaoButton"
    class="btn group"
    data-gtm-locator="article_clickon_share_kakao"
    type="button"
  >
    <KakaoIcon
      class="!text-[#FFE812] group-hover:!text-[#F0D800]"
      :class="$style['kakao-icon']"
    />
  </button>
</template>

<script>
import { KAKAO_API_KEY, KAKAO_API_URL } from '~/app.config';
import { appendScript } from '~/assets/helpers/utils';
import KakaoIcon from '~/assets/icons/socials/kakao.svg';

export default {
  name: 'SharesListKakao',
  components: {
    KakaoIcon,
  },
  props: {
    postInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  mounted() {
    this.createDefaultKakaoButton();
  },
  methods: {
    async initKakao() {
      if (typeof window.Kakao === 'object') {
        return;
      }
      await appendScript({
        src: KAKAO_API_URL,
      });
      window.Kakao.init(KAKAO_API_KEY);
    },
    async createDefaultKakaoButton() {
      const { url, title, previewText, coverLarge } = this.postInfo;
      const container = this.$refs.kakaoButton;
      await this.initKakao();
      window.Kakao.Link.createDefaultButton({
        container,
        objectType: 'feed',
        content: {
          title,
          description: previewText,
          imageUrl: coverLarge,
          link: {
            mobileWebUrl: url,
            webUrl: url,
          },
        },
        buttons: [
          {
            title,
            link: {
              mobileWebUrl: url,
              webUrl: url,
            },
          },
        ],
      });
    },
  },
};
</script>
<style module>
.kakao-icon * {
  @media (max-width: 370px) {
    scale: 0.8;
  }
}
</style>
