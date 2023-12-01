<script setup lang="ts">
import { useStore } from '~/lib/framework';
import FooterSubscriptionForm from '~/components/Footer/FooterSubscriptionForm.vue';
import LinkResolver from '~/components/Shared/LinkResolver.vue';
import FooterSocialLinks from '~/components/Footer/FooterSocialLinks.vue';
import FooterApps from '~/components/Footer/FooterApps.vue';

const store = useStore();
const i18n: Record<string, string> = store.state.i18n;
const languageShort: string = store.state.currentLanguage.short;
const currentYear = new Date().getFullYear();
</script>

<template>
  <div class="text-fg-muted bg-bg-invertedStrong">
    <div class="md:max-w-[972px] lg:max-w-[1192px] m-auto">
      <div class="py-4 lg:py-8 lg:px-5 md:px-4 flex flex-col gap-y-5 gap-x-2 md:flex-row-reverse md:justify-between">
        <div class="flex-none">
          <h3 class="text-center md:text-start text-bodySStrong mb-3">
            {{ i18n.footerMobileApp }}
          </h3>
          <FooterApps />
        </div>

        <div class="flex flex-col max-w-[27rem] md:max-w-none md:basis-1/2 self-center md:self-auto">
          <h3 class="text-center md:text-start text-bodySStrong mb-3">
            {{ i18n.footerNewsletter }}
          </h3>
          <FooterSubscriptionForm class="mb-6 md:mb-8 mx-5 tablet:mx-0" />
          <div
            v-if="i18n.aboutUsText"
            class="text-center md:text-start text-bodyS mx-5 tablet:mx-0"
          >
            {{ i18n.aboutUsText }}
          </div>
        </div>

        <div class="flex flex-col md:flex-none text-center md:text-start text-bodyS">
          <div class="hidden md:block md:mb-8">
            <h3 class="text-bodySStrong mb-3">
              {{ i18n.footerFollowUs }}
            </h3>
            <FooterSocialLinks class="py-2" />
          </div>

          <div>
            <LinkResolver
              v-if="i18n.termsOfServicesText"
              to="/terms-and-privacy"
              :language-short="languageShort"
              class="text-bg-subtle"
            >
              {{ i18n.termsOfServicesText }}
            </LinkResolver>
            <div>
              {{ `© Cointelegraph 2013 -  ${currentYear}` }}
            </div>
            <div
              v-if="i18n.footerIcpText"
              class="footer__icp"
              v-html="i18n.footerIcpText"
            />
          </div>
        </div>
      </div>
      <div
        v-if="i18n.companyDetails !== 'about.us.operator'"
        class="text-center md:text-start text-uiXsWeak lg:px-5 pb-4 lg:pb-8 mx-5 md:mx-0"
      >
        {{ i18n.companyDetails }}
      </div>
    </div>
  </div>
</template>
