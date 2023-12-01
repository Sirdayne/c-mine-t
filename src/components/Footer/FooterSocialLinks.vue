<template>
  <div
    class="footer-social-links"
    :class="[isRtl && 'footer-social-links_rtl', dark && 'footer-social-links_dark']"
  >
    <ul class="footer-social-links__list">
      <li
        v-for="item in socialLinks"
        :key="item.id"
        class="footer-social-links__item"
      >
        <a
          class="btn footer-social-links__link group footer-icon"
          rel="noopener"
          target="_blank"
          :class="item.gtm"
          :href="item.url"
          :title="item.name"
          data-testid="footer-social-link"
        >
          <component
            :is="setIconComponent(item.id)"
            :data-testid="`footer-social-link-${item.id}icon`"
            class="text-[#4E5D65] group-hover:text-[#3A464C]"
            :class="{ 'self-end': item.id === 'facebook' }"
          />
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { ROOT } from '~/store/types';
import RssIcon from '~/assets/icons/socials/rounded/small/rss.svg';
import TwitterIcon from '~/assets/icons/socials/rounded/small/twitter.svg';
import TelegramIcon from '~/assets/icons/socials/rounded/small/telegram.svg';
import FacebookFooterIcon from '~/assets/icons/socials/rounded/small/facebook.svg';
import YoutubeIcon from '~/assets/icons/socials/rounded/small/youtube.svg';
import InstagramIcon from '~/assets/icons/socials/rounded/small/instagram.svg';
import LinkedInIcon from '~/assets/icons/socials/rounded/small/linkedin.svg';
import DiscordIcon from '~/assets/icons/socials/rounded/small/discord.svg';
import LineIcon from '~/assets/icons/socials/rounded/small/line.svg';
import PhaverIcon from '~/assets/icons/socials/rounded/small/phaver.svg';

export default {
  name: 'FooterSocialLinks',

  props: {
    dark: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState('settings', {
      socialLinks: ({ socials: { socialsFooter } }) => socialsFooter,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
  },
  methods: {
    setIconComponent(socialId) {
      switch (socialId) {
        case 'rss':
          return RssIcon;
        case 'twitter':
          return TwitterIcon;
        case 'telegram':
          return TelegramIcon;
        case 'facebook':
          return FacebookFooterIcon;
        case 'youtube':
          return YoutubeIcon;
        case 'line':
          return LineIcon;
        case 'linkedin':
          return LinkedInIcon;
        case 'instagram':
          return InstagramIcon;
        case 'discord':
          return DiscordIcon;
        case 'phaver':
          return PhaverIcon;
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import '~/assets/styles/_vars.scss';

.footer-social-links__list {
  display: flex;
  justify-content: center;
  gap: 16px 0;
  padding: 0;
  list-style: none;
  overflow: hidden;
}

html[dir='ltr'] {
  .footer-social-links__item {
    &:not(:last-child) {
      margin-right: 4px;
    }
  }
}
html[dir='rtl'] {
  .footer-social-links__item {
    margin-left: 4px;
  }
}

.footer-social-links__link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  text-decoration: none;
  background-color: #4e5d65;
  border-radius: 50%;
  transition: 0.25s ease-out;
}

@media (min-width: $lg) {
  .footer-social-links__list {
    justify-content: flex-start;
  }
}
.footer-social-links_rtl {
  direction: rtl;
}
.footer-icon {
  width: 32px;
  height: 32px;
  align-items: baseline;
  path {
    color: #192024;
  }
  &:hover path {
    color: #f0f3f4;
  }
  @media (min-width: $sm) {
    .shares-list__btn {
      width: 32px;
      height: 32px;
    }
  }
}
</style>
