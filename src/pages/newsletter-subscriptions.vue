<template>
  <div
    class="newsletter-page"
    :class="[isAsia && isMobile && 'newsletter-page_asia', isRtl && 'newsletter-page_rtl']"
  >
    <div class="container">
      <div class="newsletter-page__title-wrap">
        <h1 class="newsletter-page__title">
          {{ i18n.newsletterPageTitle }}
        </h1>
        <p class="newsletter-page__tagline">
          {{ i18n.newsletterPageDescription }}
        </p>
      </div>
      <a
        class="newsletter-page__select-all"
        href="javascript:void(0)"
        @click="selectAllSubscriptions"
      >
        {{ selectAllButtonTitle }}
      </a>
      <div class="newsletter-page__rows">
        <div class="newsletter-page__items">
          <NewsletterSubscribeItem
            v-for="subItem in newsletterSubscriptions"
            :key="subItem.title"
            :ref="subItem.value"
            :subscription-data="subItem"
            :all-selected="allSelected"
            @update="pushDataToCheckedNewsletterList"
          />
        </div>
      </div>
      <NewsletterSubscriptionPopup
        v-if="checkedNewsletters.length > 0"
        :checked-subscriptions="checkedNewsletters"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import { ROOT, VIEWPORT } from '~/store/types';
import { pushVirtualPageView } from '~/assets/helpers/dataLayerEvents';
import { pathValidator } from '~/assets/helpers/utils';
import getProperty from '~/assets/libs/getProperty';
import NewsletterSubscribeItem from '~/components/Newsletter/NewsletterSubscribeItem';
import { newsletterSubscriptions } from '~/components/Newsletter/subsciptions';
import NewsletterSubscriptionPopup from '~/components/Newsletter/NewsletterSubscriptionPopup';
import { fetchPriceIndexPageMeta } from '~/api/modules/priceIndexes';
import { getNewsletterPageMeta } from '~/assets/helpers/meta';

export default {
  name: 'InnovationCirclePage',
  components: { NewsletterSubscriptionPopup, NewsletterSubscribeItem },
  validate: pathValidator,
  async asyncData({ store, app, route }) {
    const { state } = store;
    const { meta } = await fetchPriceIndexPageMeta({
      pathname: route.path,
      languageShort: state.currentLanguage.short,
      apolloTransport: app.$apolloTransport,
    });
    return { meta };
  },
  data() {
    return {
      alternates: [],
      checkedNewsletters: [],
      pending: false,
      hasError: false,
      isSuccess: false,
      allSelected: false,
      newsletterSubscriptions,
    };
  },
  computed: {
    ...mapState({
      currentLanguage: ({ currentLanguage }) => currentLanguage,
      languages: ({ languages }) => languages,
      i18n: ({ i18n }) => i18n,
    }),
    ...mapState('viewport', {
      isMobile: ({ userDeviceType: { any } }) => any,
    }),
    ...mapGetters({
      isAsia: ROOT.IS_ASIA,
      isRtl: ROOT.IS_RTL,
    }),
    ...mapGetters('viewport', {
      isMobileBreakpoint: VIEWPORT.IS_MOBILE_BREAKPOINT,
    }),
    selectAllButtonTitle() {
      return this.allSelected && this.checkedNewsletters.length === 10 ? 'Deselect all' : 'Select all';
    },
  },
  watch: {
    checkedNewsletters() {
      if (this.checkedNewsletters.length === 10) {
        this.allSelected = true;
      }
    },
  },
  mounted() {
    this.setAlternates({
      alternates: this.alternates,
      url: getProperty(this.meta, 'url', ''),
    });
    this.pushVirtualPageView();
    this.checkedNewsletters = [];
  },
  methods: {
    ...mapActions({
      setAlternates: ROOT.SET_ALTERNATES,
    }),
    selectAllSubscriptions() {
      this.allSelected = !this.allSelected;
    },
    pushDataToCheckedNewsletterList(val) {
      if (this.checkedNewsletters.indexOf(val) > -1) {
        this.checkedNewsletters = this.checkedNewsletters.filter((n) => n !== val);
      } else {
        this.checkedNewsletters.push(val);
      }
    },
    pushVirtualPageView() {
      const { url: domain } = this.currentLanguage;
      return pushVirtualPageView({
        url: `${domain}/newsletter-subscriptions`,
        title: '',
        category: '',
        tags: [],
      });
    },
  },
  head() {
    const { currentLanguage, languages, meta, $route, alternates } = this;
    return getNewsletterPageMeta({
      currentLanguage,
      languages,
      meta,
      alternates,
      routeName: $route.name,
    });
  },
};
</script>

<style scoped lang="scss">
@import '@/assets/styles/_vars.scss';

.newsletter-page {
  margin-bottom: 40px;
}
.newsletter-page__title {
  position: relative;
  margin: 24px 0 0 0;
  padding-bottom: 12px;
  font-size: 44px;
  line-height: 1.1;
  color: #35434a;
  font-weight: 600;
}
.newsletter-page__tagline {
  max-width: 65%;
  text-align: center;
  color: #4e5d65;
  margin: 16px 0;
}
.newsletter-page__items {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  justify-content: space-between;
  align-items: stretch;
}
.newsletter-page__select-all {
  margin-bottom: 50px;
  font-size: 18px;
  line-height: 24px;
  color: $color-darkgold;
  text-decoration: underline dotted $color-darkgold;
}
.newsletter-page_asia {
  margin-top: 20px;
}
.newsletter-page_rtl {
  direction: rtl;
}
.newsletter-page_rtl .newsletter-page__title {
  margin-right: 0;
  margin-left: 16px;
}
.newsletter-page_rtl .newsletter-page__title::after {
  right: 0;
}
.newsletter-page__title-wrap,
.newsletter-page__select-all {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
@media only screen and (max-width: $sm) {
  .newsletter-page__title {
    font-style: normal;
    font-weight: 600;
    font-size: 30px;
    line-height: 40px;
    text-align: center;
  }
}
</style>
