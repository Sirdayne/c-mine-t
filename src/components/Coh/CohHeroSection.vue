<script setup lang="ts">
import { useDeviceInfo } from '~/lib/device-detector';
import { computed } from 'vue';
import { useStore } from '~/lib/framework';

const store = useStore();
const deviceInfo = useDeviceInfo();
const desktopBgImage = "bg-[url('/assets/img/coh/hero-bg.png')]";

const description = computed(() => store.state.i18n.cohFooterSectionDescription);
const title = computed(() => store.state.i18n.cohFooterSectionTitle);
</script>

<template>
  <div
    :class="{
      [desktopBgImage]: !deviceInfo.mobile,
      'bg-[#252B31]': deviceInfo.mobile,
    }"
    class="bg-cover relative bg-no-repeat bg-center min-h-[1032px] md:min-h-[760px] flex flex-col justify-between"
  >
    <div
      class="container lg:max-w-[1140px] items-center text-center flex flex-col justify-between h-inherit pt-8 md:pt-5 text-white"
    >
      <h3 class="leading-[26px] text-[24px] sm:text-[32px] sm:leading-[36px] font-bold">{{ title }}</h3>
      <p class="text-[18px] leading-[27px] sm:leading-[30px] sm:text-[20px] pt-5 font-normal max-w-[80ch]">
        {{ description }}
      </p>

      <p class="leading-[30px] text-[20px] pt-4 md:pt-10">
        <a
          href="https://twitter.com/search?q=%23CryptoForUkrainianChildren"
          target="_blank"
        >
          <span class="text-[#1F88C9]">#CryptoFor</span><span class="text-[#FFE205]">UkrainianChildren</span>
        </a>
      </p>
      <div class="flex flex-col md:flex-row pt-8">
        <a
          target="_blank"
          class="p-2 relative max-w-[140px]"
          href="https://twitter.com/intent/tweet?text=Join me in donating to Children of Heroes and help support Ukrainian children who have lost parents to the war — powered by @Cointelegraph %23CryptoForUkrainianChildren https://cointelegraph.com/donate-with-crypto-ukraine-children-of-heroes"
        >
          <img
            src="/assets/img/coh/coh-twitter.svg"
            alt="Twitter"
          />
          <img
            src="/assets/img/coh/yellow-man.svg"
            alt=""
            class="absolute top-[-18px] left-8"
          />
        </a>
        <a
          class="p-2 relative max-w-[140px] mt-2 md:mt-0"
          href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fcointelegraph.com%2Fdonate-with-crypto-ukraine-children-of-heroes#_=_"
          target="_blank"
        >
          <img
            src="/assets/img/coh/coh-facebook.svg"
            alt="Facebook"
          />
          <img
            src="/assets/img/coh/flower.svg"
            alt=""
            class="absolute bottom-6 left-0"
          />
        </a>
        <a
          class="p-2 relative max-w-[140px] mt-2 md:mt-0"
          target="_blank"
          href="https://t.me/share/url?url=https://cointelegraph.com/donate-with-crypto-ukraine-children-of-heroes&text=Join me in donating to Children of Heroes and help support Ukrainian children who have lost parents to the war — powered by @Cointelegraph %23CryptoForUkrainianChildren https://cointelegraph.com/donate-with-crypto-ukraine-children-of-heroes"
        >
          <img
            src="/assets/img/coh/coh-tg.svg"
            alt="Telegram"
          />
          <img
            src="/assets/img/coh/yellow-heart.svg"
            alt=""
            class="absolute -top-2 right-5"
          />
        </a>
        <a
          class="p-2 relative max-w-[140px] mt-2 md:mt-0"
          target="_blank"
          href="https://api.whatsapp.com/send?text=Join me in donating to Children of Heroes and help support Ukrainian children who have lost parents to the war — powered by @Cointelegraph %23CryptoForUkrainianChildren https://cointelegraph.com/donate-with-crypto-ukraine-children-of-heroes"
        >
          <img
            src="/assets/img/coh/coh-whatsapp.svg"
            alt="WhatsApp"
          />
          <img
            src="/assets/img/coh/girl.svg"
            alt=""
            class="absolute right-2 -top-4"
          />
        </a>
      </div>
    </div>
    <div
      v-if="deviceInfo.mobile"
      class="h-[556px] bg-[url('/assets/img/coh/hero-bg.png')] bg-no-repeat mobile-image"
    />
    <div
      class="text-white absolute sm:static bottom-7 flex self-center sm:mb-12 flex-col sm:flex-row text-s text-center sm:text-left sm:text-base text-base font-semibold"
    >
      <a
        href="https://cointelegraph.com/terms-and-privacy"
        target="_blank"
        class="mr-1"
      >
        Cointelegraph Terms of Service/Privacy Policy
      </a>
      <span v-if="!deviceInfo.mobile">|</span>
      <a
        href="https://cointelegraph.com/donate-to-children-of-heroes-disclaimer"
        target="_blank"
        class="mt-2 sm:mt-0 sm:ml-1"
      >
        Disclaimer
      </a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mobile-image {
  background-position: 50% 80%;
}
</style>
