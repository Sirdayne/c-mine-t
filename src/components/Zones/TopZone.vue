<template>
  <div class="top-zone">
    <LanguageOffer
      v-if="isLanguageOfferShown"
      class="top-zone__language-offer"
      theme="top"
      :preferred-language="preferredLanguage"
      :i18n="i18n"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { ROOT } from '~/store/types';
import LanguageOffer from '~/components/Shared/LanguageOffer.vue';

export default {
  name: 'TopZone',
  components: {
    LanguageOffer,
  },
  computed: {
    ...mapState({
      i18n: ({ i18n }) => i18n,
    }),
    ...mapState('menu', {
      isMobileMenuOpened: ({ isMobileMenuOpened }) => isMobileMenuOpened,
      isSearchOpened: ({ isSearchOpened }) => isSearchOpened,
    }),
    ...mapState('settings', {
      isLanguageOfferHidden: ({ isLanguageOfferHidden }) => isLanguageOfferHidden,
    }),
    ...mapState('viewport', {
      isIosDevice: ({
        userDeviceType: {
          apple: { device },
        },
      }) => device,
    }),
    ...mapGetters({
      preferredLanguage: ROOT.PREFERRED_LANGUAGE,
    }),
    isMainPage() {
      return this.$route.name === 'index';
    },
    isLanguageOfferShown() {
      return (
        !this.isLanguageOfferHidden &&
        this.preferredLanguage &&
        this.i18n &&
        this.i18n.languageOfferTitle &&
        this.i18n.languageOfferDescription &&
        this.i18n.languageOfferYes &&
        this.i18n.languageOfferNo &&
        !this.isMobileMenuOpened &&
        !this.isSearchOpened
      );
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.top-zone__language-offer,
.top-zone__android-app-banner,
.top-zone__ios-app-banner {
  @media (min-width: $md) {
    display: none;
  }
}
</style>
