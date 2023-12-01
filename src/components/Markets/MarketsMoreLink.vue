<template>
  <div
    class="markets-more"
    :class="isRtl && 'markets-more_rtl'"
  >
    <LinkResolver
      class="markets-more__link"
      :to="link"
      :language-short="languageShort"
    >
      <span class="markets-more__text">
        {{ i18n.viewMore }}
      </span>
      <span class="markets-more__icon" />
    </LinkResolver>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { ROOT } from '~/store/types';
import LinkResolver from '~/components/Shared/LinkResolver';

export default {
  name: 'MarketMoreLink',
  components: {
    LinkResolver,
  },
  props: {
    i18n: {
      type: Object,
      default: () => ({}),
    },
    link: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
    ...mapState({
      languageShort: ({ currentLanguage: { short } }) => short,
    }),
  },
};
</script>

<style scoped lang="scss">
@use '~/assets/styles/_icons-markets.scss' as icons;
@import '~/assets/styles/_vars.scss';

.markets-more {
  text-align: right;
  margin-bottom: 25px;
}
.markets-more_rtl .markets-more__icon {
  transform: scale(-1, -1);
}
.markets-more__link {
  display: inline-block;
  position: relative;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  text-transform: uppercase;
  text-decoration: none;
  color: #253137;
}
.markets-more__text {
  border-bottom: 1px solid #fabf2c;
}
.markets-more__link:hover .markets-more__text {
  border-color: #253137;
}
.markets-more__icon {
  width: 5px;
  height: 8px;
  display: inline-block;
  margin-left: 4px;
  @include icons.arrow(#333333);
}
</style>
