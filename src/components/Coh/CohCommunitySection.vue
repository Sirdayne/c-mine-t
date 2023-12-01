<script setup lang="ts">
import { useStore } from '~/lib/framework';
import { computed } from 'vue';

const store = useStore();
const leadDescription = computed(() => store.state.i18n.cohCommunityDescription);
</script>
<template>
  <div class="bg-[#0D121A] pt-32">
    <div
      class="items-center text-center flex flex-col justify-between"
      :class="$style['community']"
    >
      <div
        :class="$style['community__heart']"
        class="bg-[url('/assets/img/coh/heart.svg')] flex-col bg-cover bg-no-repeat bg-center justify-center content-center flex align-middle flex-wrap max-w-[924px] w-full min-h-[558px]"
      >
        <div class="max-w-[595px]">
          <p class="mb-4 sm:mb-6 mt-4 md:mt-0 text-ml sm:text-l">
            {{ leadDescription }}
          </p>
          <div
            class="bg-white p-4 mx-2 sm:py-3 sm:px-12 flex flex-col items-center justify-center sm:flex-row sm:justify-around rounded-xl mb-4 sm:mb-6"
          >
            <img
              src="/assets/img/coh/coh-logo-dark.svg"
              alt="CoH logo"
              class="max-w-[126px] mb-5 sm:mb-0"
              :class="$style['community__logo']"
            />
            <p class="text-center md:text-left">
              All donations will go to the
              <br />
              <b>Children of Heroes Charity Fund</b>
            </p>
          </div>
          <button>
            <a
              href="#XXJYPQUS"
              style="display: none"
            />
          </button>
        </div>
      </div>
      <img
        src="https://s3.cointelegraph.com/storage/uploads/view/f7964ff41a6b6fcad2dd5c78364b57d5.svg"
        alt="Community"
        class="-mt-12"
      />
    </div>
  </div>
</template>

<style module lang="scss">
.community {
  padding-right: 0;
  padding-left: 0;
}
</style>
