<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '~/lib/framework';
import LinkResolver from '~/components/Shared/LinkResolver.vue';
import CtFooterBadge from '~/lib/ui/ct-footer-link/CtFooterBadge.vue';
import { ListItem } from '~/features/app-header/ListItem';

defineProps<{
  list: ListItem[];
}>();

const store = useStore();
const i18n = computed<Record<string, string>>(() => store.state.i18n);
const languageShort = computed(() => store.state.currentLanguage.short);
</script>

<template>
  <nav class="items-stretch justify-between lg:mx-1">
    <div
      v-for="item in list"
      :key="item.id"
      class="max-w-[154px] lg:max-w-[192px] px-4"
    >
      <div class="uppercase text-fg-muted text-bodySStrong mb-3">
        {{ item.title }}
      </div>
      <ul
        v-if="item.children && item.children.length"
        class="flex flex-col gap-y-2"
      >
        <li
          v-for="subItem in item.children"
          :key="subItem.id"
          class="text-bg-subtle bodyS"
        >
          <LinkResolver
            v-if="subItem.url"
            class="relative footer-item hover:text-fg-primaryDefault"
            :rel="subItem.isExternal ? 'noopener' : ''"
            :to="subItem.url"
            :language-short="languageShort"
            data-testid="footer-link"
          >
            <span class="text-bodyS">
              {{ subItem.title }}
            </span>
            <CtFooterBadge
              v-if="subItem.badgeType"
              :label="i18n[subItem.badgeI18nKey]"
            />
          </LinkResolver>
          <span
            v-else
            class="footer-navigation__mock hover:text-fg-primaryDefault"
          >
            <span class="footer-navigation__link-cap">
              {{ subItem.title }}
            </span>
            <span
              v-if="subItem.badgeType"
              class="footer-navigation__link-badge"
              :class="`footer-navigation__link-badge_${subItem.badgeType}`"
            >
              {{ i18n[subItem.badgeI18nKey] }}
            </span>
          </span>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style lang="scss">
.footer-item:hover .badge {
  transform: translate(12px, -50%) translateZ(0);
}
</style>
