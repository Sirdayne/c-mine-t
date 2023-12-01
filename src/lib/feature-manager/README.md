# featureManager

Service for managing feature flags.

It helps for check feature flags which can be described in 'features.ts' file.

## Usage

```ts
const features = {
  round_post_cards: ['en', 'es', 'fr'],
};
```

```
<template>
  <!-- set post card variant based on feature state -->
  <PostCard :variant="featureManager.isEnabled('round_post_cards') ? 'round' : 'box'" />
</template>

<script setup lang="ts">
import { useFeatureManager } from './featureManager';
const featureManager = useFeatureManager();
</script>
```
