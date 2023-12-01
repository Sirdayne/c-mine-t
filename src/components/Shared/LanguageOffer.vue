<script setup lang="ts">
import { computed } from 'vue';

import { ROOT, SETTINGS } from '~/store/types';
import { DEFAULT_LANGUAGE } from '~/app.config';
import { useStore } from '~/lib/framework';

withDefaults(
  defineProps<{
    theme: 'top' | 'over';
  }>(),
  {
    theme: 'top',
  }
);

const store = useStore();
const i18n = computed<Record<string, string>>(() => store.state.i18n);
const preferredLanguage = computed(() => store.getters[ROOT.PREFERRED_LANGUAGE]);
const languages = computed(() => store.getters[ROOT.LANGUAGES_FOR_LANG_SELECTOR]);
const handleClose = () => store.dispatch(`settings/${SETTINGS.SET_LANGUAGE_OFFER_HIDDEN}`);

const preferredLanguageId = computed(() => preferredLanguage.value.id ?? DEFAULT_LANGUAGE.id);
const isPreferredLanguageRTL = computed(() => preferredLanguage.value.isRTL ?? false);
const preferredLanguageUrl = computed(() => {
  const preferredLanguage = languages.value.find(({ id }: { id: number }) => id === preferredLanguageId.value);
  return preferredLanguage.url ?? DEFAULT_LANGUAGE.url;
});
</script>

<template>
  <div
    class="language-offer"
    :class="[`language-offer_${theme}`, isPreferredLanguageRTL && 'language-offer_rtl']"
  >
    <button
      class="btn language-offer__close-btn"
      type="button"
      @click="handleClose"
    >
      <span class="btn__wrp">
        <span class="btn__icon language-offer__close-icon" />
      </span>
    </button>
    <div class="language-offer__wrp">
      <p class="language-offer__statement">
        {{ i18n.languageOfferTitle }}
      </p>
      <p class="language-offer__advice">
        {{ i18n.languageOfferDescription }}
      </p>
      <div class="language-offer__actions">
        <button
          class="btn language-offer__btn language-offer__decision-btn"
          type="button"
          @click="handleClose"
        >
          <span class="btn__wrp">
            <span class="btn__cap">
              {{ i18n.languageOfferNo }}
            </span>
          </span>
        </button>
        <a
          v-if="preferredLanguageUrl"
          class="btn language-offer__btn language-offer__decision-btn !bg-fg-primaryDefault !border-0 !text-black"
          :href="preferredLanguageUrl"
        >
          <span class="btn__wrp">
            <span class="btn__cap">
              {{ i18n.languageOfferYes }}
            </span>
          </span>
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/styles/_icons-common.scss' as icons;
@import '~/assets/styles/_vars.scss';

.language-offer {
  direction: ltr;
  text-transform: none;
}
.language-offer__statement,
.language-offer__advice {
  text-align: center;
  line-height: 14px;
}
.language-offer__statement {
  font-size: 16px;
  font-weight: 600;
  line-height: 19px;
  letter-spacing: -0.01em;
  margin-bottom: 4px;
}
.language-offer__advice {
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
}
.language-offer__actions {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  @media screen and (min-width: $md) {
    margin-top: 16px;
  }
}
.language-offer__btn {
  display: block;
  margin: 0;
  padding: 4px 12px;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: -0.01em;
  text-align: left;

  border: 1px solid transparent;
  border-radius: 4px;
  transition: color 0.15s, background-color 0.15s, border-color 0.15s;
}
.language-offer__btn:hover {
  text-decoration: none;
}
.language-offer__close-btn {
  position: absolute;
  right: 0;
  top: 0;
  width: 30px;
  height: 30px;
}
.language-offer__close-icon {
  @include icons.cross;
  width: 14px;
  height: 14px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  transition: background 0.15s;
}
.language-offer__decision-btn {
  width: calc((100% - 10px) / 2);
}
.language-offer_top {
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  color: #111619;
  background-color: #ffffff;
}
.language-offer_top .language-offer__wrp {
  max-width: 250px;
  margin: auto;
}
.language-offer_top .language-offer__actions {
  max-width: 150px;
  margin-left: auto;
  margin-right: auto;
}
.language-offer_top .language-offer__btn {
  color: #273036;
  background-color: transparent;
  border-color: #627f8c59;
}
.language-offer_top .language-offer__btn:hover {
  background-color: #536e7b;
  color: #ffffff;
  border-color: transparent;
}
.language-offer_top .language-offer__close-icon {
  @include icons.cross(#84949c);
}
.language-offer_over {
  position: absolute;
  padding: 24px 48px;
  box-sizing: border-box;
  color: #253137;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 20px rgba(37, 49, 55, 0.6);
  transform-origin: center 0 0;
}

.language-offer_over:before {
  @media (min-width: $lg) {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 7px 6px 7px;
    border-color: transparent transparent #ffffff transparent;
    transform: translateX(-7px);
  }
}
.language-offer_over .language-offer__btn {
  color: #273036;
  background-color: #ffffff;
  border-color: #627f8c59;
}
.language-offer_over .language-offer__btn:hover {
  color: #ffffff;
  background-color: #374852;
}
.language-offer_over .language-offer__close-icon {
  @include icons.cross(#84949c);
}
.language-offer_rtl {
  direction: rtl;
}
.language-offer_rtl .language-offer__close-btn {
  right: auto;
  left: 0;
}
</style>
