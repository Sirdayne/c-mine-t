<script setup lang="ts">
import Breadcrumbs from '~/components/Shared/Breadcrumbs.vue';
import Sidebar from '~/components/Sidebar/Sidebar.vue'
import { OptimizedImage } from '~/lib/image';
import TagDescription from '~/features/tags/TagDescription.vue';
import { AdSlot } from '~/features/ads';
import { useRoute, useStore } from '~/lib/framework';
import { VIEWPORT } from '~/store/types';
import { computed } from 'vue';

const store = useStore();
const isMobileBreakpoint = computed(() => store.getters[`viewport/${VIEWPORT.IS_MOBILE_BREAKPOINT}`]);

const route = useRoute();
const breadCrumbs = computed(() => {
  return [
    {
      name: route.value.params.slug,
      path: '/tags' + route.value.params.slug,
    },
  ];
});

interface TagCategoryEntity {
  title: string;
  description: string;
  imgUrl: string;
}

defineProps<{
  entity: TagCategoryEntity,
}>();
</script>

<template>
  <div class="container">
    <Breadcrumbs
      :breadcrumbs="breadCrumbs"
      data-test-id="tag-breadcrumb-link"
    />

    <div class="flex justify-between mb-8">
      <div>
        <div class="flex items-center justify-between">
          <h1 class="font-semibold md:text-[41px] text-[29px] text-fg-strong break-words">
            {{ entity.title }}
          </h1>
          <AdSlot
              v-if="!isMobileBreakpoint"
              place="promo_button_tag_desktop"
          />
        </div>
        <TagDescription :description="entity.description" />

        <div v-if="isMobileBreakpoint && entity && entity.imgUrl" class="flex justify-center my-6">
          <OptimizedImage
            :src="entity.imgUrl"
            :width="240"
            :height="240"
          />
        </div>

        <AdSlot
          v-if="isMobileBreakpoint"
          place="promo_button_stack_tag_mobile"
        />

        <slot />
      </div>
      <div v-if="!isMobileBreakpoint" class="w-[360px] ltr:ml-6 rtl:mr-6">
        <div v-if="entity && entity.imgUrl" class="flex justify-center">
          <OptimizedImage
            :src="entity.imgUrl"
            :width="240"
            :height="240"
          />
        </div>
        <div
            class="mt-8"
        >
          <Sidebar />
        </div>
      </div>
    </div>
  </div>
</template>
