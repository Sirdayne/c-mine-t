# image

[Using browser-level lazy loading](https://web.dev/lazy-loading-images/#images-inline-browser-level)
[Cloudflare Image Resizing](https://developers.cloudflare.com/images/image-resizing/)

Optimized images component and composable based on Cloudflare

⚠️ Only use for images from "s3.cointelegraph.com"

⚠️ include "loading=lazy" for lazy loaded images

## Width and height

- must be the number of pixels. CSS style like "160px" accepted too
- must be an integer. digits after the floating point will be discarded

## API

- `<OptimizedImage />`

  Vue component that wraps `<img>` tag, while "src" always passed trough optimizer

  All attributes passed to `<img>` as-is

- `useOptimizedImageUrl`

  Composable that builds optimized image URL

- `buildOptimizedImageUrl`

  Helper to generate optimized image URL

## Usage

```vue
<template>
  <OptimizedImage
    :src="originalImageUrl"
    :height="300"
    :width="400"
  />
</template>

<script setup lang="ts">
import { OptimizedImage } from '~/lib/image';

const originalImageUrl = 'https://s3.cointelegraph.com/bla-blah';
</script>
```
