# meta

Components for `<head>` management

Fetches generic SEO metadata from GraphQL
and generates proper `<meta>` tags like title, keywords

Also produces OpenGraph and Twitter card metadata

## Usage

! Should be first component in template to prevent cascade clashing

! Use once per page because this component produces GraphQL requests

```vue
<script setup lang="ts">
import { SeoMeta } from '~/features/meta';
</script>

<template>
  <div>
    <SeoMeta />
    <!-- the content -->
  </div>
</template>
```

## TODO:

- [ ] add meta overrides for publications like News, Learn
- [ ] JSON-LD
- [ ] are Twitter cards really required? seems like OG is enough
- [ ] get rid of `getThumbnail`
- [ ] cover with unit tests
