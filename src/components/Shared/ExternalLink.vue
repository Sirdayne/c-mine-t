<template>
  <a
    :href="fullHref"
    :target="target"
  >
    <slot />
  </a>
</template>

<script>
import { mapState } from 'vuex';
import { rootUrlResolver } from '~/assets/helpers/utils';

export default {
  name: 'ExternalLink',
  props: {
    href: {
      type: String,
      default: '/',
    },
    isExternal: {
      type: Boolean,
      default: false,
    },
    newTab: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState({
      domain: ({ currentLanguage: { domain } }) => domain,
    }),
    fullHref() {
      const { domain, href, isExternal } = this;
      const rootUrl = rootUrlResolver({
        domain,
        isDuke: false,
      });
      return isExternal ? href : rootUrl + href;
    },
    target() {
      const { newTab } = this;
      return newTab ? '_blank' : '_self';
    },
  },
};
</script>
