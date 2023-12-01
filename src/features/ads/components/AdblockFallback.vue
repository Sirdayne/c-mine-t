<!-- fallback for adblocked slots -->
<template>
  <img
    :class="$style['image']"
    src="https://images.cointelegraph.com/images/373_aHR0cHM6Ly9zMy5jb2ludGVsZWdyYXBoLmNvbS9zdG9yYWdlL3VwbG9hZHMvdmlldy9hNGFkNDk1ZmMwNGJkOTdmNzE2NDlhNDhkNjAwM2QwMC5wbmc=.png"
  />
</template>

<style module lang="scss">
.image {
  object-fit: contain;
  display: block;
  height: 100%;
  left: 0;
  padding-top: 0;
  position: absolute;
  top: 0;
  width: 100%;
}
</style>
