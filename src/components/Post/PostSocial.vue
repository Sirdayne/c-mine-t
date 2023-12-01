<template>
  <a
    v-if="social.id"
    :key="social.id"
    :href="social.url"
    class="group"
    :class="$style['post-social__link']"
    :data-gtm-locator="locatorName"
    target="_blank"
  >
    <component
      :is="iconComponent"
      class="text-fg-primaryDefault group-hover:text-fg-primaryStrong"
    />
  </a>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import TwitterIcon from '~/assets/icons/socials/rounded/twitter.svg';
import TelegramIcon from '~/assets/icons/socials/rounded/telegram.svg';
import FacebookIcon from '~/assets/icons/socials/rounded/facebook.svg';
import YoutubeIcon from '~/assets/icons/socials/rounded/youtube.svg';
import InstagramIcon from '~/assets/icons/socials/rounded/instagram.svg';
import LinkedinIcon from '~/assets/icons/socials/rounded/linkedin.svg';
import PhaverIcon from '~/assets/icons/socials/rounded/phaver.svg';
import RedditIcon from '~/assets/icons/socials/rounded/reddit.svg';

interface Social {
  id: string;
  name: string;
  url: string;
}
export default defineComponent({
  name: 'PostSocial',
  props: {
    social: {
      type: Object as PropType<Social>,
      required: true,
    },
  },
  computed: {
    locatorName() {
      if (this.social.name.toLowerCase() === 'line') {
        return 'article_clickon_socialmedia_line_jp';
      }
      return `article_clickon_socialmedia_${this.social.name.toLowerCase()}_en`;
    },

    iconComponent() {
      switch (this.social.id) {
        case 'twitter':
          return TwitterIcon;
        case 'telegram':
          return TelegramIcon;
        case 'facebook':
          return FacebookIcon;
        case 'youtube':
          return YoutubeIcon;
        case 'phaver':
          return PhaverIcon;
        case 'linkedin':
          return LinkedinIcon;
        case 'reddit':
          return RedditIcon;
        case 'instagram':
          return InstagramIcon;
        default:
          return null;
      }
    },
  },
});
</script>

<style lang="scss" module>
@import '~/assets/styles/_vars.scss';

.post-social {
  &__link {
    width: 36px;
    height: 36px;
    text-decoration: none;
    border-radius: 50%;
    transition: 0.25s ease-out;
    @media (min-width: $xs) {
      width: 40px;
      height: 40px;
    }
    & path {
      color: black;
    }
  }
}
</style>
