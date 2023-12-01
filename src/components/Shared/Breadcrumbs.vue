<script setup lang="ts">
import { computed } from 'vue';
import LinkResolver from '~/components/Shared/LinkResolver.vue';
import { useStore } from '~/lib/framework';

export interface Breadcrumb {
  name: string;
  path: string | null;
}

const props = defineProps<{
  linkColor?: 'white';
  breadcrumbs: Breadcrumb[];
  dataTestId: string;
}>();

const store = useStore();

const homeTitle = computed(() =>
  store.state.i18n?.breadcrumbsHome && store.state.i18n?.breadcrumbsHome !== ''
    ? store.state.i18n?.breadcrumbsHome
    : 'home'
);

const crumbs = computed(() => {
  const homePageCrumb = {
    name: homeTitle.value,
    path: '/',
  };

  return [homePageCrumb, ...props.breadcrumbs];
});
</script>

<template>
  <div class="text-[#171A1C] mb-8 mt-0 pt-2">
    <template v-for="(crumb, index) in crumbs">
      <div
        :key="index"
        class="inline-block"
        :class="{ inline: index === crumbs.length - 1 }"
        :data-testid="`${dataTestId}-${index}`"
      >
        <LinkResolver
          :href="crumb.path"
          class="text-xs md:text-sm text-[#171A1C] font-normal no-underline"
          :class="{
            'opacity-70 hover:opacity-100 hover:text-[#FABC2C] hover:underline': index !== crumbs.length - 1,
            'opacity-100 font-semibold ': index === crumbs.length - 1,
            'text-white': linkColor === 'white',
          }"
        >
          <span
            v-if="crumb.name"
            class="capitalize"
          >
            {{ crumb.name }}
          </span>
        </LinkResolver>
        <img
          v-if="index !== crumbs.length - 1"
          src="/assets/img/dropdown-arrow.svg"
          alt="Arrow"
          class="mr-1 ml-2 -rotate-90 w-4 h-4 opacity-80 inline-flex items-center rtl:rotate-90"
        />
      </div>
    </template>
  </div>
</template>
