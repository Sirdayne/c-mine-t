<script setup lang="ts">
import LinkResolver from '~/components/Shared/LinkResolver.vue';
import { useRoute, useStore } from '~/lib/framework';
import { computed } from 'vue';
import { useDeviceInfo } from '~/lib/device-detector';

const store = useStore();
const languageShort = computed(() => store.state.currentLanguage.short);
const i18n = computed(() => store.state.i18n);
const iconName = computed(() => {
  return `icon-logo-${languageShort.value.toLowerCase()}`;
});
const deviceInfo = useDeviceInfo();
const route = useRoute();
const isMainPage = computed(() => route.value.name === 'index');
</script>

<template>
  <LinkResolver
    :data-testid="deviceInfo.desktop ? 'logo' : 'mobile-logo'"
    data-gtm-locator="clickon_logo"
    to="/"
    :title="i18n.headerLogoTitle"
    :language-short="languageShort"
    :stop-client-side-navigation="isMainPage"
    class="flex items-center"
  >
    <span
      class="bg-center bg-no-repeat bg-contain w-[150px] h-[24px] sm:w-[200px] sm:h-[32px] md:w-[238px] md:h-[56px]"
      :class="iconName"
    />
  </LinkResolver>
</template>

<style scoped lang="scss">
@use '~/assets/styles/_icons-logos.scss' as logo-icons;
@import '~/assets/styles/_vars.scss';

.icon-logo-ar {
  @include logo-icons.mobile-ar;
}
.icon-logo-br {
  @include logo-icons.mobile-br;
}
.icon-logo-cn {
  @include logo-icons.mobile-cn;
}
.icon-logo-de {
  @include logo-icons.mobile-de;
}
.icon-logo-en {
  @include logo-icons.mobile-en;
}
.icon-logo-es {
  @include logo-icons.mobile-es;
}
.icon-logo-it {
  @include logo-icons.mobile-it;
}
.icon-logo-jp {
  @include logo-icons.mobile-jp;
}
.icon-logo-kr {
  @include logo-icons.mobile-kr;
}
.icon-logo-tr {
  @include logo-icons.mobile-tr;
}
.icon-logo-fr {
  @include logo-icons.mobile-fr;
}
.icon-logo-my {
  @include logo-icons.mobile-my;
}

@media (min-width: $md) {
  .icon-logo-ar {
    @include logo-icons.desktop-ar;
  }
  .icon-logo-br {
    @include logo-icons.desktop-br;
  }
  .icon-logo-cn {
    @include logo-icons.desktop-cn;
  }
  .icon-logo-de {
    @include logo-icons.desktop-de;
  }
  .icon-logo-en {
    @include logo-icons.desktop-en;
  }
  .icon-logo-es {
    @include logo-icons.desktop-es;
  }
  .icon-logo-it {
    @include logo-icons.desktop-it;
  }
  .icon-logo-jp {
    @include logo-icons.desktop-jp;
  }
  .icon-logo-kr {
    @include logo-icons.desktop-kr;
  }
  .icon-logo-tr {
    @include logo-icons.desktop-tr;
  }
  .icon-logo-fr {
    @include logo-icons.desktop-fr;
  }
  .icon-logo-my {
    @include logo-icons.desktop-my;
  }
}
</style>
