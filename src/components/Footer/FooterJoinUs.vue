<script setup lang="ts">
import LinkResolver from '~/components/Shared/LinkResolver';
import CtButton from '~/lib/ui/ct-button/CtButton.vue';
import { useStore } from '~/lib/framework';

const store = useStore();
const i18n: Record<string, string> = store.state.i18n;
const languageShort: string = store.state.currentLanguage.short;
</script>

<template>
  <div
    v-if="i18n.journalistJoinUs"
    class="py-2 ltr:pr-2 ltr:pl-8 rtl:pl-2 rtl:pr-8 flex flex-row items-center gap-x-8 rounded-containerPill bg-bg-invertedStrong"
  >
    <span class="text-fg-inverted text-headlineMl">
      {{ i18n.journalistJoinUs }}
    </span>
    <CtButton
      round="pill"
      size="xl"
    >
      <LinkResolver
        to="/careers"
        :language-shot="languageShort"
        class="whitespace-nowrap"
      >
        {{ i18n.journalistJoinUs2 }}
      </LinkResolver>
    </CtButton>
  </div>
</template>
