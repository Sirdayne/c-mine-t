<script setup lang="ts">
import { useFeatureManager } from '~/lib/feature-manager';
import { useStore } from '~/lib/framework';
import { computed } from 'vue';
import FooterNavigation from './FooterNavigation.vue';
import { MenuParentItem } from '~/features/app-footer/MenuItem';
import FooterJoinUs from '~/components/Footer/FooterJoinUs.vue';
import FooterSocialLinks from '~/components/Footer/FooterSocialLinks.vue';
import FooterBottomZone from '~/components/Footer/FooterBottomZone.vue';

const featureManager = useFeatureManager();
const store = useStore();
const i18n: Record<string, string> = store.state.i18n;

const isRtl = featureManager.isEnabled('rtl');
const menuList: MenuParentItem[] = store.state.footer.menu.filter((item: MenuParentItem) => item.children.length);
const hasJoinAsI18n = computed(() => {
  const { journalistJoinUs, journalistJoinUs2, journalistJoinUsEmail } = i18n;
  return (
    journalistJoinUs !== 'footer.journalist_join_us' &&
    journalistJoinUs2 !== 'footer.journalist_join_us2' &&
    journalistJoinUsEmail !== 'footer.journalist_join_us_email'
  );
});
</script>

<template>
  <footer
    :class="[isRtl && 'footer_rtl']"
    class="bg-bg-inverted"
  >
    <div class="py-8 md:max-w-[972px] lg:max-w-[1192px] m-auto">
      <FooterNavigation
        :list="menuList"
        class="hidden md:flex"
      />
      <FooterJoinUs
        v-if="hasJoinAsI18n"
        class="max-w-fit m-auto mt-0 md:mt-6"
      />
      <div class="block md:hidden mt-5">
        <FooterSocialLinks />
      </div>
    </div>
    <FooterBottomZone />
  </footer>
</template>

<style scoped lang="scss">
.footer_rtl {
  direction: rtl;
}
</style>
