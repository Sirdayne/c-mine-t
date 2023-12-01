<template>
  <div
    v-if="hasI18n"
    class="post-disclaimer"
    :class="[isRtl && 'post-disclaimer_rtl']"
  >
    <div class="post-disclaimer__body">
      <p>
        <b v-if="title">{{ title }}</b> {{ description }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { ROOT } from '~/store/types';

export default {
  name: 'PostDisclaimer',
  props: {
    /**
     * values: "pressRelease", "marketRelease"
     */
    variant: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState({
      i18n: ({ i18n }) => i18n,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
    hasI18n() {
      return this.title || this.description;
    },

    titleKey() {
      return this.variant === 'marketRelease' ? 'articleDisclaimerPaidMarketRelease' : 'articleDisclaimerPaid';
    },
    descriptionKey() {
      return this.variant === 'marketRelease' ? 'articleDisclaimerDescMarketRelease' : 'articleDisclaimerDesc';
    },

    title() {
      return this.i18n[this.titleKey];
    },

    description() {
      return this.i18n[this.descriptionKey];
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.post-disclaimer {
  font-size: 0.75rem;
  color: #999;
  font-weight: 600;
}
.post-disclaimer__body:not(:first-child) {
  margin-top: 8px;
}
.post-disclaimer p {
  color: inherit;
  font-size: inherit;
}
.post-disclaimer p {
  font-size: inherit;
  line-height: 18px;
  margin: 0;
}
.post-disclaimer p:not(:first-child) {
  margin-top: 12px;
}

@media (min-width: $md) {
  .post-disclaimer {
    margin-left: 74px;
  }
  .post-disclaimer_rtl {
    margin-left: 0;
    margin-right: 74px;
  }
}
</style>
