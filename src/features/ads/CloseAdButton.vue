<script setup lang="ts">
/**
 * Add close button to most of the ad https://jira.cointelegraph.com/browse/CDT-3072
 * **/
import { useDeviceInfo } from '~/lib/device-detector';
import LinkResolver from '~/components/Shared/LinkResolver.vue';

defineProps<{
  labelHidden?: boolean;
}>();

const emit = defineEmits<{
  (event: 'close'): void;
}>();

const deviceInfo = useDeviceInfo();
</script>

<template>
  <button
    class="flex absolute right-1 items-center cursor-pointer close-ad mix-blend-luminosity text-[#888888]"
    :class="{
      [$style['close-ad']]: true,
      'top-5': labelHidden,
      'top-1': !labelHidden,
    }"
    @click.prevent.stop="emit('close')"
  >
    <template v-if="!labelHidden">
      <LinkResolver
        v-if="deviceInfo.desktop"
        to="/advertise"
        target="_blank"
        stop-propagation
        stop-client-side-navigation
        class="text-inherit text-xs font-semibold !border-b-0"
      >
        Ad
      </LinkResolver>

      <span
        v-else
        class="text-inherit text-xs font-semibold"
      >
        Ad
      </span>
    </template>

    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="ml-1"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14 6.99998C14 10.866 10.866 14 6.99998 14C3.13398 14 -3.05176e-05 10.866 -3.05176e-05 6.99998C-3.05176e-05 3.134 3.13398 0 6.99998 0C10.866 0 14 3.134 14 6.99998ZM3.32319 9.61611L5.93931 7L3.32319 4.38388C3.12793 4.18862 3.12793 3.87203 3.32319 3.67677L3.67675 3.32322C3.87201 3.12796 4.18859 3.12796 4.38385 3.32322L6.99997 5.93934L9.61609 3.32322C9.81135 3.12796 10.1279 3.12796 10.3232 3.32322L10.6767 3.67677C10.872 3.87203 10.872 4.18862 10.6767 4.38388L8.06063 7L10.6767 9.61611C10.872 9.81137 10.872 10.128 10.6767 10.3232L10.3232 10.6768C10.1279 10.872 9.81135 10.872 9.61609 10.6768L6.99997 8.06066L4.38386 10.6768C4.18859 10.872 3.87201 10.872 3.67675 10.6768L3.32319 10.3232C3.12793 10.128 3.12793 9.81137 3.32319 9.61611Z"
        fill="currentColor"
      />
    </svg>
  </button>
</template>

<style module lang="scss">
// No direction property in tailwind, only rtl:/ltr but we dont set direction everywhere
.close-ad {
  direction: ltr;
}
</style>
