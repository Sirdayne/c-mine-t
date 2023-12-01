<script setup lang="ts">
import { computed, unref } from 'vue';
import { useStore } from '~/lib/framework';
import { translatePropsOrExclude } from './translatePropsOrExclude';

const store = useStore();
const i18n = computed(() => store.state.i18n);

interface BrandResource {
  url: string;
  icon: string;
  label: string;
}

const brandResources = computed(() =>
  translatePropsOrExclude(unref(i18n), ['url', 'label'], [
    {
      url: 'about.brand-resources.link.guidelines.url',
      label: 'about.brand-resources.link.guidelines.label',
      icon: 'pdf',
    },
    {
      url: 'about.brand-resources.link.brand-assets.url',
      label: 'about.brand-resources.link.brand-assets.label',
      icon: 'zip',
    },
  ] satisfies BrandResource[])
);
</script>

<template>
  <div
    data-testid="about-page-brand-resources"
    class="p-4 rounded-lg border border-slate-500 border-opacity-30 h-full"
  >
    <h2
      data-testid="about-page-brand-resources-title"
      class="mb-4 text-[#111619] text-lg font-semibold leading-snug"
      v-html="i18n['about.brand-resources.title']"
    />

    <a
      v-for="(brandResource, index) of brandResources"
      :key="index"
      :href="brandResource.url"
      data-testid="about-page-brand-resources-link"
      target="_blank"
      class="mb-2 block text-[#273036] underline leading-7"
    >
      <img
        class="inline mr-2"
        :alt="brandResource.icon"
        :src="`/icons/about/${brandResource.icon}.svg`"
      />
      <span>{{ brandResource.label }}</span>
    </a>
  </div>
</template>

<style scoped lang="scss"></style>
