# Code style guide

## Strict requirements

- Composition API (`setup()` instead of computed, data, mounted, etc)
- TypeScript (`<script lang=”ts”>`)
- Semantic tags in template (`<ul>`, `<li>` , `<section>` instead of only `<div>`)
- Tailwind or SCSS Modules for styles (`<style module lang=”scss>`)
- Components must be accessible (RTL, WAI-ARIA)
- Storybook stories (for shared/generic components like Button, Tab, etc)
- Split dumb and container components
- KISS [https://people.apache.org/~fhanik/kiss.html](https://people.apache.org/~fhanik/kiss.html)
- Fail-fast [https://www.martinfowler.com/ieeeSoftware/failFast.pdf](https://www.martinfowler.com/ieeeSoftware/failFast.pdf)
- Clean code (adapted for TypeScript) [https://github.com/labs42io/clean-code-typescript](https://github.com/labs42io/clean-code-typescript)
- Code should describe itself, in some cases write documentation, so other members of team can understand implementation
- Parse, do not validate [https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/)
- Code only when you have designed feature (or can imagine and describe how it expected to work)
- One issue = one branch = one component in JIRA
- Less code = less bugs
- Name things properly
- Do not forget to mark things deprecated with link to newer implementation

## Useful links:

[https://refactoring.guru/](https://refactoring.guru/)

[https://www.typescriptlang.org/](https://www.typescriptlang.org/)

[https://github.com/labs42io/clean-code-typescript](https://github.com/labs42io/clean-code-typescript)

[https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)

[https://vuejs.org/](https://vuejs.org/)

## Example of best component

```vue
<script setup lang="ts">
import { defineComponent } from '~/lib/framework';
import { useDeviceType } from '~/lib/device-detector';
import { OptimizedImage } from '~/lib/image';
import { useFeatureManager } from '~/lib/feature-manager';
import { CtButton } from '~/lib/ui';
import { AdSlot } from '~/features/ads';

// constants always on top of setup after imports
const MAX_ITEMS_PER_COLUMN = 3;

// then comes type definitions
interface MenuEntry {
  label: string;
  href: string;
}

// then helper functions
const isLink = (entry: MenuEntry): boolean => entry.href !== '';

// then define props
const props = defineProps<{
  entries: MenuEntry[];
}>();

// and some emits
const emit = defineEmits<{
  (e: 'click', entry: MenuEntry): void;
}>();

// some injections
const deviceType = useDeviceType();
const featureManager = useFeatureManager();

// and only then refs, computeds, event handlers and other stuff
</script>

<template>
  <div
    class="p-10"
    :class="$style['wrapper']"
  >
    <AdSlot
      v-if="featureManager.isEnabled('leaderboard')"
      :place="deviceType.mobile ? 'leaderboard_mobile' : 'leaderboard'"
    />

    <OptimizedImage
      width="300"
      height="300"
      src="https://example.com/smth.png"
    />

    <CtButton label="Hello, world!" />

    <p :class="$style['label']">Label</p>

    <div class="flex">
      <CtButton
        v-for="(entry, index) of entries"
        :key="index"
        :label="entry.label"
        :href="entry.href"
        @click="emit('click', entry)"
      />
    </div>
  </div>
</template>
<style module lang="scss">
.wrapper {
  /**
   * style rules that much easier
   * to implement in SCSS
   * than tickling tailwind
   */

  &__label {
  }

  &--green {
  }
}
</style>
```

## More on Git:

- Prefer rebase over merge for better history
- Branch like a pro
  - Always branch from _development_
  - Keep in sync with _development_ using `git rebase`
  - Name branches like _feature-CDT-0000-very-useful_
    - _CDT-0000_ is Jira issue id
    - _-very-useful_ is name to distinguish branch from others
  - Rebase pending branch after merges to development to prevent Merge conflicts
  - Keep branches small for faster code reviews
  - Start commit with Jira issue id
  - Name commits properly for, e.g. _CDT-000 fix header height_

## More on project structure:

- _deploy/_ some devopsy stuff like ansible playbooks, etc
- _vault/_ secrets for deployment on different envs
- _docs/_ contains markdowns and diagrams that explain project at all
- Source code goes to _src/_
  - Nuxt stuff like _serverMiddleware_, _pages_, _layouts_, _plugins_ and _modules_
  - _lib/_ is reusable libraries
    - they may contain SCSS, Vue, JSON or TS code
    - they should have tests and/or stories (for Vue components)
    - they should have _readme.md_
    - they should have _index.ts_ that exports public API of lib
    - code outside of concrete lib should not import internal stuff. rely only on public api
    - think about it like infrastructure layer in DDD
  - _graphql/_ all the stuff for graphql layer
    - _graphql/quries/_ documents that generated to TS code. Do not import them.
  - _app/_ is application layer
  - Legacy paths that should be avoided:
    - _store/_ Vuex modules. Vuex is shit. Do not use Vuex
    - _api/_ Crazy "Transport layer". Forget about it
    - _components/_ trash bin for all vue components
    - _assets/_ contains lot of shit. Put only SVGs and other assets that imported in code
- Stuff to be served as-is in _static_
- E2E, load and other kind of tests are in _tests/_, but unit-tests co-located to code
- All files should be in lower-case and dash-case. example: "my-super-duper-component.vue"

## More on CSS:

- Prefer CSS Grids
- Use “rem” as relative unit
- Prefer Tailwind
- Prefer Tailwind tokens over our design system
- Fallback only to SCSS with modules
- Extract reusable parts as mixins
- Do not inline assets. Put them all in “static” folder
- no "!important"

## More on GraphQL:

- Write queries in separate queries
- Use codegen to generate proper types
- Do not include fields which not used

## More on TypeScript:

- Structures must be declared via `interface`, but type aliases with `type`
- Prefer `unknown` over `any`
- Types also should be SOLID and DRY
- Narrow types using type-guards and type-assetions
- Write Unit tests as much as you can
  - Learn [Jest](https://jestjs.io/)
  - [Import globals from "jest"](https://jestjs.io/docs/api)
- Any async action must be abortable (google: AbortController)

## More on Vue:

- Only Composition API
  - Reuse and abstract things by composables. You can extract absolutly anything - GraphQL queries, head tags, etc
  - Also check out composables from _vueuse_ lib
  - Do not forget bout directives. Sometimes they may be helpful
  - You can use composables even in directives _mounted_ hook or options API _mounted_
- Prefer [_src/lib/framework_](../src/lib/framework/readme.md) for core imports
  - There is composables replacing asyncData, head, etc.
  - "defineComponent" always should be imported from there
- Split dumb and container components
- Define storybook stories for reusable components
- Page components should just build page. Make them thin. Think that page is like controller in MVC
- Use "useState" composable from "lib/framework" for transferred state from SSR
- Inline constants for <AdSlot place /> and e2e locators allowed

## Common notes

- Feel balance, mostly for DRY and WET.
- Remember - Less code => easier maintenance
- Always keep in touch with performance of app. e.g. images size, bundle size, performance of rendering and updates

## On patterns

MVVM is main design pattern applied to this pattern

Store (Vuex or any other store), GraphQL is Model

Our components and custom ViewModel objects relates to ViewModel

Pure components or templates - View
