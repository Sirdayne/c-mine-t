<template functional>
  <img
    class="banner-blocked"
    :class="[data.class, data.staticClass]"
    src="https://images.cointelegraph.com/images/373_aHR0cHM6Ly9zMy5jb2ludGVsZWdyYXBoLmNvbS9zdG9yYWdlL3VwbG9hZHMvdmlldy9hNGFkNDk1ZmMwNGJkOTdmNzE2NDlhNDhkNjAwM2QwMC5wbmc=.png"
    srcset="
      https://images.cointelegraph.com/images/746_aHR0cHM6Ly9zMy5jb2ludGVsZWdyYXBoLmNvbS9zdG9yYWdlL3VwbG9hZHMvdmlldy9hNGFkNDk1ZmMwNGJkOTdmNzE2NDlhNDhkNjAwM2QwMC5wbmc=.png
    "
    alt="Banner was blocked"
  />
</template>

<script>
export default {
  name: 'BannerBlocked',
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.banner-blocked {
  object-fit: contain;
}
</style>
