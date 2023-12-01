<template>
  <div class="download-page">
    <div class="container download-page__container">
      <div class="download-page__row">
        <div class="download-page__col download-page__col_content">
          <img
            class="download-page__logo"
            src="https://s3.cointelegraph.com/storage/uploads/view/252505ec6994085ff46b0d96b349ce75.svg"
            :alt="localI18n.logoImageAlt"
          />
          <h1
            v-if="localI18n.title"
            class="download-page__title"
          >
            {{ localI18n.title }}
          </h1>
          <DownloadPageButtons
            :local-i18n="localI18n"
            class="download-page__buttons"
          />
        </div>
        <div class="download-page__col download-page__col_phone">
          <img
            src="https://s3.cointelegraph.com/storage/uploads/view/4cfb6c1cc72ce87080d8130406e5c4f2.png"
            srcset="
              https://s3.cointelegraph.com/storage/uploads/view/4cfb6c1cc72ce87080d8130406e5c4f2.png 1x,
              https://s3.cointelegraph.com/storage/uploads/view/16f4946cc729acaec0cc909bbfea533c.png 2x
            "
            :alt="localI18n.mainImageAlt"
            class="download-page__phone"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { fetchDownloadPageInitialState } from '~/api/modules/downloadPage';
import getProperty from '~/assets/libs/getProperty';
import { getDownloadPageMeta } from '~/assets/helpers/meta';
import DownloadPageButtons from '~/components/DownloadPage/DownloadPageButtons.vue';

export default {
  name: 'DownloadPage',
  components: {
    DownloadPageButtons,
  },
  async asyncData({ store: { state }, route, error, app }) {
    const isCn = state.currentLanguage.id.toString() === '4';
    const { i18n: localI18n, meta } = await fetchDownloadPageInitialState({
      pathname: route.path,
      languageShort: state.currentLanguage.short,
      apolloTransport: app.$apolloTransport,
    });
    return !meta || !isCn ? error({ statusCode: 404 }) : { localI18n, meta };
  },
  computed: {
    ...mapState({
      i18n: ({ i18n }) => i18n,
      currentLanguage: ({ currentLanguage }) => currentLanguage,
    }),
    ...mapState('viewport', {
      isAndroid: ({ userDeviceType: { android } }) => android.phone || android.tablet,
    }),
    iOsAppUrl() {
      return getProperty(this.localI18n, 'iOsAppUrl', '');
    },
    androidAppUrl() {
      return getProperty(this.localI18n, 'androidAppUrl', '');
    },
  },
  mounted() {
    this.tryToDownloadAndroidApp();
  },
  methods: {
    tryToDownloadAndroidApp() {
      const { isAndroid, androidAppUrl } = this;
      if (!isAndroid || process.server) {
        return;
      }
      window.location.href = androidAppUrl;
    },
  },
  head() {
    const { currentLanguage, meta, i18n, $route } = this;
    return getDownloadPageMeta({
      currentLanguage,
      meta,
      i18n,
      routeName: $route.name,
    });
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.download-page {
  padding-top: 24px;
  position: relative;
  background-image: url(https://s3.cointelegraph.com/storage/uploads/view/080439f404f6a7395092b708dff3a2b5.jpg);
  background-position: bottom center;
  background-size: cover;
  background-repeat: no-repeat;
  margin-top: -8px;
  min-height: 60vh;
  display: flex;
  align-items: flex-end;
}
.download-page::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 76px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 89.06%);
}
.download-page__row {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  flex-direction: column;
  margin-left: -$gutter;
  margin-right: -$gutter;
}
.download-page__col {
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  margin-top: 6px;
}
.download-page__col:first-child {
  margin-top: 0;
}
.download-page__col_content {
  width: 270px;
  padding-right: $gutter;
  padding-left: $gutter;
}
.download-page__col_phone {
  width: 100%;
}
.download-page__logo {
  max-width: 198px;
  width: 100%;
}
.download-page__title {
  color: #253137;
  font-weight: 500;
  font-size: 1.125rem;
  margin: 0;
  letter-spacing: 0.5px;
}
.download-page__buttons {
  margin-top: 24px;
}
.download-page__phone {
  height: 256px;
  max-width: 320px;
  width: 100%;
  object-position: top;
  object-fit: cover;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 576px) {
  .download-page {
    padding-top: 34px;
  }
  .download-page__col_content {
    width: 287px;
  }
  .download-page__logo {
    max-width: 236px;
  }
  .download-page__title {
    font-size: 1.25rem;
  }
  .download-page__phone {
    max-width: 457px;
    height: 354px;
  }
}

@media (min-width: $sm) {
  .download-page {
    padding-bottom: 40px;
    margin-top: -16px;
    align-items: center;
  }
  .download-page::after {
    content: none;
  }
  .download-page__row {
    flex-direction: row;
    align-items: center;
  }
  .download-page__col {
    margin-top: 0;
  }
  .download-page__col_phone {
    width: $col-9;
    order: -1;
  }
  .download-page__col_content {
    width: $col-7;
  }
  .download-page__phone {
    width: 437px;
    height: auto;
    max-width: none;
    transform: translateX(-40px);
  }
  .download-page__logo {
    max-width: 266px;
    margin-bottom: 17px;
  }
  .download-page__title {
    font-weight: 500;
    font-size: 1.375rem;
  }
  .download-page__buttons {
    margin-top: 14px;
  }
}
@media (min-width: $md) {
  .download-page {
    padding-top: 65px;
    padding-bottom: 70px;
  }
  .download-page__phone {
    width: 600px;
    transform: translateX(-60px);
  }
  .download-page__logo {
    max-width: 363px;
    margin-bottom: 24px;
  }
  .download-page__title {
    font-size: 1.875rem;
  }
  .download-page__buttons {
    margin-top: 24px;
  }
}
@media (min-width: $lg) {
  .download-page {
    padding-top: 50px;
    padding-bottom: 67px;
  }
  .download-page__logo {
    max-width: 420px;
  }
  .download-page__title {
    font-weight: 500;
    font-size: 2.25rem;
  }
  .download-page__phone {
    width: 706px;
    transform: translateX(-60px);
  }
  .download-page__buttons {
    margin-top: 29px;
  }
}
</style>
