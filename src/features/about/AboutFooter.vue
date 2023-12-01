<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '~/lib/framework';

const store = useStore();
const i18n = computed(() => store.state.i18n);
</script>

<template>
  <div
    data-testid="about-page-footer"
    class="text-center text-white px-3 pt-16 pb-8 bg-gradient-to-b from-black to-slate-700"
  >
    <div class="md:w-[736px] md:mx-auto">
      <h2
        class="mb-4 text-[26px] font-semibold leading-loose"
        v-html="i18n['about.footer.title']"
      />
      <p class="text-lg leading-[28.80px]">
        {{ i18n['about.footer.description'] }}
        <a
          href="mailto:career@cointelegraph.com"
          class="border-b border-amber-400 text-lg leading-[28.80px]"
        >
          career@cointelegraph.com
        </a>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
