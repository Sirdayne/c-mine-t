<template>
  <div
    :class="isRtl && 'author-about_rtl'"
    class="author-about"
  >
    <div class="author-about__wrp">
      <figure class="author-about__figure">
        <LazyImage
          v-if="author.avatar"
          :src="authorImage"
          :srcset="authorImageRetina"
          :alt="author.name"
          class="author-about__avatar"
        />
      </figure>
      <div class="author-about__info">
        <h1
          v-if="author.name"
          lang="en"
          class="author-about__header"
        >
          {{ author.name }}
        </h1>
        <ul
          v-if="author.socialLinks && author.socialLinks.length"
          class="author-about__links-list"
        >
          <li
            v-for="item in author.socialLinks"
            :key="item.id"
            class="author-about__links-item"
          >
            <a
              class="author-about__link group"
              rel="noopener"
              target="_blank"
              :href="item.url"
            >
              <component
                :is="setIconComponent(item.id)"
                class="text-[#809098] group-hover:text-black"
              />
            </a>
          </li>
        </ul>
        <p
          v-if="author.about"
          class="author-about__desc"
          v-html="author.about"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ROOT } from '~/store/types';
import { getThumbnail } from '~/assets/libs/getThumbnail';
import getProperty from '~/assets/libs/getProperty';
import LazyImage from '~/components/Shared/LazyImage.vue';
import TwitterIcon from '~/assets/icons/socials/author/twitter.svg';
import LinkedInIcon from '~/assets/icons/socials/author/linkedin.svg';
import EmailIcon from '~/assets/icons/email.svg';

export default {
  name: 'AuthorAbout',
  components: {
    LazyImage,
  },
  props: {
    pending: {
      type: Boolean,
      default: false,
    },
    failedOnServerFetch: {
      type: Boolean,
      default: false,
    },
    failedOnClientFetch: {
      type: Boolean,
      default: false,
    },
    author: {
      type: Object,
      default: () => ({}),
    },
    i18n: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
    authorImage() {
      const avatar = getProperty(this, 'author.avatar', '');
      return getThumbnail({
        imageUrl: avatar,
        width: 150,
      });
    },
    authorImageRetina() {
      const avatar = getProperty(this, 'author.avatar', '');
      const w150 = getThumbnail({
        imageUrl: avatar,
        width: 150,
      });
      const w300 = getThumbnail({
        imageUrl: avatar,
        width: 300,
      });
      return `${w150} 1x, ${w300} 2x`;
    },
  },
  methods: {
    setIconComponent(socialId) {
      switch (socialId) {
        case 'twitter':
          return TwitterIcon;
        case 'linkedin':
          return LinkedInIcon;
        default:
          return EmailIcon;
      }
    },
  },
};
</script>

<style lang="scss">
@use '~/assets/styles/_icons-socials.scss' as social-icons;
@import '~/assets/styles/_vars.scss';

.author-about {
  position: relative;
  padding: 10px;
  border: 3px solid #ffcd04;
  @media (min-width: $sm) {
    padding: 20px;
  }
  @media (min-width: $lg) {
    padding: 48px;
  }
}
.author-about__wrp {
  @media (min-width: $sm) {
    display: flex;
    align-items: flex-start;
  }
}
.author-about__figure {
  flex-shrink: 0;
  display: block;
  width: 150px;
  min-height: 150px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 3px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  @media (min-width: $sm) {
    margin: 0;
  }
}
.author-about__avatar {
  position: relative;
  display: block;
  width: 100%;
  height: 0;
  padding-top: 100%;
  background-color: #fbfbfb;
}
.author-about__info {
  flex-grow: 1;
  margin-top: 12px;
  overflow-wrap: break-word;
  word-break: break-word;
  word-wrap: break-word;
  @media (min-width: $sm) {
    margin-top: 0;
    margin-left: 24px;
  }
  @media (min-width: $md) {
    margin-top: 0;
    margin-left: 48px;
  }
}
.author-about__header {
  margin-top: 0;
  font-weight: 600;
}
.author-about__links-list {
  display: flex;
  align-items: center;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}
.author-about__links-item {
  padding-left: 0;
  margin-right: 16px;
}
.author-about__links-item:last-child {
  margin-right: 0;
}
.author-about__desc {
  margin: 12px 0 0;
  font-weight: 600;
  font-size: 0.875rem;

  @media (min-width: $sm) {
    font-size: 1rem;
  }
}
.author-about__placeholder-header,
.author-about__placeholder-icon,
.author-about__placeholder-text {
  display: block;
  width: 100%;
  background-color: #fbfbfb;
  border-radius: 2px;
}
.author-about__placeholder-header {
  height: 40px;
}
.author-about__placeholder-icon {
  width: 14px;
  height: 14px;
}
.author-about__placeholder-text {
  height: 16px;
  margin: 9px 0;
}
.author-about__placeholder-text_short {
  max-width: 150px;
}
.author-about_rtl .author-about__info {
  margin-left: 0;
  margin-right: 48px;
}
.author-about_rtl .author-about__links-item {
  margin-left: 16px;
  margin-right: 0;
}
</style>
