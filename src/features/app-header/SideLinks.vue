<script setup lang="ts">
import CtHeaderDropdown from '~/lib/ui/ct-header-dropdown/CtHeaderDropdown.vue';
import { useStore } from '~/lib/framework';
import { computed, nextTick, onMounted, ref } from 'vue';
import { ROOT } from '~/store/types';
import sleep from '~/assets/libs/sleep';
import LanguageOffer from '~/components/Shared/LanguageOffer.vue';
import LanguageSelector from '~/components/Shared/LanguageSelector.vue';
import LinkResolver from '~/components/Shared/LinkResolver.vue';

const isLanguageSelectorReady = ref(false);
const isLanguageSelectorInTransition = ref(false);
const isLanguageSelectorShown = ref(false);
const languageSelectorButton = ref<HTMLButtonElement | null>(null);
const store = useStore();
const languageShort = computed(() => store.state.currentLanguage.short);
const currentLanguage = computed(() => store.state.currentLanguage.name);
const i18n = computed<Record<string, string>>(() => store.state.i18n);
const isLanguageOfferHidden = computed(() => store.state.settings.isLanguageOfferHidden);
const preferredLanguage = computed(() => store.getters[ROOT.PREFERRED_LANGUAGE]);

const isLanguageOfferShown = computed(
  () =>
    !isLanguageOfferHidden.value &&
    preferredLanguage &&
    i18n &&
    i18n.value.languageOfferTitle &&
    i18n.value.languageOfferDescription &&
    i18n.value.languageOfferYes &&
    i18n.value.languageOfferNo &&
    isLanguageSelectorReady.value
);

onMounted(async () => {
  await sleep(500);
  isLanguageSelectorReady.value = true;
});

const handleLanguageSelectorShow = (): void => {
  if (isLanguageSelectorInTransition.value) {
    return;
  }
  isLanguageSelectorShown.value = true;
};
const handleLanguageSelectorHide = (): void => {
  isLanguageSelectorShown.value = false;
  nextTick(() => {
    languageSelectorButton.value?.focus();
  });
};
</script>

<template>
  <div>
    <ul>
      <li class="h-4">
        <div
          v-if="currentLanguage"
          class="text-fg-inverted relative"
        >
          <button
            ref="languageSelectorButton"
            type="button"
            data-gtm-locator="header_cliсkon_language_arrow"
            data-testid="language-button"
            @click="handleLanguageSelectorShow"
          >
            <CtHeaderDropdown
              :label="currentLanguage"
              arrow-size="sm"
            />
          </button>

          <Transition name="header-side-links-language-offer">
            <LanguageOffer
              v-if="isLanguageOfferShown"
              class="z-10 absolute top-[26px] w-[298px] origin-[center_0_0] ltr:lg:right-[-74px] ltr:right-0 rtl:lg:left-[-60px] rtl:left-0"
              theme="over"
            />
          </Transition>

          <Transition
            name="drop"
            @before-enter="isLanguageSelectorInTransition = true"
            @before-leave="isLanguageSelectorInTransition = true"
            @after-enter="isLanguageSelectorInTransition = false"
            @after-leave="isLanguageSelectorInTransition = false"
          >
            <LanguageSelector
              v-if="isLanguageSelectorShown"
              class="absolute top-6 w-40 origin-[center_0_0] ltr:-left-1/2 rtl:-right-1/2 z-10"
              @on-hide="handleLanguageSelectorHide"
            />
          </Transition>
        </div>
      </li>
      <li
        v-if="i18n.advertiseCap"
        class="text-fg-primaryDefault uppercase text-uiXsWeak ltr:ml-[26px] rtl:mr-[26px] mt-2"
      >
        <LinkResolver
          class="header-side-links__link hover:underline"
          :to="i18n.advertiseUrl"
          :language-short="languageShort"
          stop-client-side-navigation
          data-testid="advertise-link"
          data-gtm-locator="header_cliсkon_advertise"
        >
          {{ i18n.advertiseCap }}
        </LinkResolver>
      </li>
      <li
        v-if="i18n.careersCap"
        class="text-fg-primaryDefault uppercase text-uiXsWeak ltr:ml-[26px] rtl:mr-[26px] mt-2"
      >
        <LinkResolver
          class="hover:underline"
          :to="i18n.careersUrl"
          :language-short="languageShort"
          :stop-client-side-navigation="true"
          data-testid="careers-link"
          data-gtm-locator="header_cliсkon_career"
        >
          {{ i18n.careersCap }}
        </LinkResolver>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@keyframes header-side-links-language-offer {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.header-side-links-language-offer-enter-active {
  animation: header-side-links-language-offer 0.3s ease;
}
.header-side-links-language-offer-leave-active {
  animation: header-side-links-language-offer 0.15s reverse;
}
</style>
