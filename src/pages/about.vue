<script setup lang="ts">
import { SeoMeta } from '~/features/meta/SeoMeta';
import { AboutHero, AboutTeam, AboutFooter } from '~/features/about';
</script>

<template>
  <div>
    <SeoMeta />
    <div class="container mt-8 mb-12 sm:mt-12 sm:mb-16">
      <AboutHero />
      <AboutTeam />
    </div>

    <AboutFooter />
  </div>
</template>
