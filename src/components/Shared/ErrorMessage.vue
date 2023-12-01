<template>
  <div class="error-message">
    <div class="error-message__wrp">
      <div class="error-message__col--first">
        <div
          v-if="isArticleDeleted"
          class="error-message__article"
        >
          <span class="error-message__article-message">
            <span class="error-message__article-title-prefix">
              {{ i18n.errorArticleTitlePrefix }}
            </span>
            <span class="error-message__article-title"> "{{ error.deletedArticleTitle }}" </span>
            <span class="error-message__article-title-postfix">
              {{ i18n.errorArticleTitlePostfix }}
            </span>
          </span>
          <img
            class="error-message__article-img"
            alt="Article was deleted"
            :src="deletedArticleImageUrl"
          />
        </div>
        <div
          v-else-if="isMobile404"
          class="error-message__mobile-404-error"
        >
          <img
            :src="mobile404ErrorImageUrl"
            alt="404 error"
            class="error-message__mobile-404-error--image"
          />
        </div>
        <div
          v-else-if="isDesktop404"
          class="error-message__desktop-video-wrapper"
        >
          <video
            id="video"
            loop
            autoplay
            muted
            :src="desktop404ErrorVideoUrl"
            class="error-message__desktop-video-player"
          />
        </div>
        <span
          v-else-if="isDefault404ErrorVisible"
          class="error-message__code"
        >
          {{ error.statusCode }}
        </span>
      </div>
      <div class="error-message__col--side">
        <div
          v-if="errorText"
          class="error-message__message"
          v-html="errorText"
        />
        <div
          v-if="i18n.errorGoBackButtonCap && i18n.errorGoBackButtonUrl"
          class="error-message__go-back"
        >
          <a
            class="btn error-message__go-back-link"
            :href="i18n.errorGoBackButtonUrl"
          >
            <span class="btn__wrp">
              <span class="btn__cap">
                {{ i18n.errorGoBackButtonCap }}
              </span>
            </span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { VIEWPORT } from '~/store/types';

const DELETED_ARTICLE_IMAGE_URL =
  'https://s3.cointelegraph.com/storage/uploads/view/15540a332064548694c882446d199dd5.png';

const MOBILE_404_ERROR_IMAGE_URL =
  'https://s3.cointelegraph.com/storage/uploads/view/25540a9bdc446c7f12329be40102011e.png';

const DESKTOP_404_ERROR_VIDEO_URL =
  'https://s3.cointelegraph.com/storage/uploads/view/943ab0ae0389d124c65c79c1d49a200a.mp4';

export default {
  name: 'ErrorMessage',
  props: {
    error: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isMounted: false,
    };
  },
  computed: {
    ...mapState({
      i18n: ({ i18n }) => i18n,
    }),
    ...mapGetters('viewport', {
      isDesktopWidth: VIEWPORT.IS_LARGE_WIDTH,
    }),
    isDefault404ErrorVisible() {
      return !this.is404 && this.isMounted;
    },
    isArticleDeleted() {
      return this.error.deletedArticleTitle;
    },
    isMobile404() {
      return this.isMounted && this.is404 && !this.isDesktopWidth;
    },
    isDesktop404() {
      return this.isMounted && this.is404 && this.isDesktopWidth;
    },
    is403() {
      return this.error.statusCode === 403;
    },
    is404() {
      return this.error.statusCode === 404;
    },
    is500() {
      return this.error.statusCode === 500;
    },
    errorText() {
      if (this.isArticleDeleted) {
        return this.i18n.errorArticleDesc;
      }
      if (this.is403) {
        return this.i18n.error403Text;
      }
      if (this.is404) {
        return this.i18n.error404Text;
      }
      if (this.is500) {
        return this.i18n.error500Text;
      }
      return null;
    },
    deletedArticleImageUrl() {
      return DELETED_ARTICLE_IMAGE_URL;
    },
    mobile404ErrorImageUrl() {
      return MOBILE_404_ERROR_IMAGE_URL;
    },
    desktop404ErrorVideoUrl() {
      return DESKTOP_404_ERROR_VIDEO_URL;
    },
  },
  mounted() {
    this.isMounted = true;
  },
};
</script>

<style scoped lang="scss">
@import '~/assets/styles/_vars.scss';

.error-message {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-message__wrp {
  width: 100%;
}

.error-message__article {
  position: relative;
  min-height: 300px;
}

.error-message__article::before {
  content: '';
  position: absolute;
  top: 0;
  left: calc(50% - 300px / 2);
  width: 300px;
  height: 300px;
  background-color: #ebeff1;
  border-radius: 50%;
  pointer-events: none;
}

.error-message__article-message {
  position: relative;
  display: block;
}

.error-message__article-title-prefix {
  display: block;
}

.error-message__article-title {
  display: block;
  margin-top: 5px;
  font-size: 1.375rem;
  font-weight: 700;
}

.error-message__article-title-postfix {
  display: block;
  margin-top: 10px;
}

.error-message__article-img {
  position: relative;
  display: block;
  width: auto;
  height: 89px;
  margin: 40px 0 0 64px;
  object-fit: contain;
}

.error-message__mobile-404-error {
  position: relative;
  width: 300px;
  height: 300px;
  margin: 0 auto;

  &--image {
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.error-message__code {
  display: block;
  text-align: center;
  font-size: 7.25rem;
  font-weight: 800;
  color: #eceff1;
  line-height: 1;
  text-shadow: -1px -1px 0 #465a65, 1px -1px 0 #465a65, -1px 1px 0 #465a65, 1px 1px 0 #465a65;
}

.error-message__desktop-video-wrapper {
  width: 100%;
  height: 300px;
}

.error-message__desktop-video-player {
  width: 100%;
  height: auto;
}

.error-message__message {
  margin-top: 40px;
  color: #465a65;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.4;
  font-size: 1rem;
  display: inline-block;
  text-align: left;
}

.error-message__go-back {
  margin-top: 40px;
  text-align: center;
}

.error-message__go-back-link {
  display: inline-block;
  padding: 12px 55px;
  width: auto;
  height: 40px;
  text-decoration: none;
  color: #253137;
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 20px;
  background-color: #f7b323;
  transition: background-color 0.15s;
}

.error-message__go-back-link:hover {
  background-color: #dda01f;
}

@media (min-width: $sm) {
  .error-message__wrp {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .error-message__article {
    width: $col-8;
    min-height: 367px;
  }
  .error-message__code {
    font-size: 10rem;
  }
  .error-message__article::before {
    left: 0;
    width: 367px;
    height: 367px;
  }
  .error-message__article-message {
    padding-top: 50px;
  }
  .error-message__article-title {
    font-size: 1.625rem;
    line-height: 40px;
  }
  .error-message__col--first {
    width: $col-10;
  }
  .error-message__col--side {
    width: $col-6;
  }
  .error-message__go-back {
    text-align: inherit;
  }
}

@media (min-width: $md) {
  .error-message__wrp {
    max-width: $col-11;
    margin-left: auto;
    margin-right: auto;
  }
  .error-message__code {
    font-size: 13rem;
  }
  .error-message__go-back-link {
    padding: 12px 60px;
  }
}
</style>

<style lang="scss">
.error-message__message p {
  margin: 0 0 8px;
}

.error-message__message p:last-child {
  margin-bottom: 0;
}
</style>
