<template>
  <LinkResolver
    v-if="i18n.advertiseLinkUrl && i18n.advertiseLinkLabel"
    :class="$style['link']"
    :language-short="languageShort"
    :to="i18n.advertiseLinkUrl"
    rel="noopener"
    target="_blank"
  >
    {{ i18n.advertiseLinkLabel }}
  </LinkResolver>

  <span v-else />
</template>

<script lang="ts" setup>
import LinkResolver from '~/components/Shared/LinkResolver';
import { useStore } from '~/lib/framework';
import { computed } from 'vue';

const store = useStore();
const i18n = computed(() => store.state.i18n);
const languageShort = computed(() => store.state.currentLanguage.languageShort);
</script>

<style lang="scss" module>
.link {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #b4b4b4;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>
