<template>
  <a
    :href="href || to"
    @click="onClick"
  >
    <slot />
  </a>
</template>

<script setup lang="ts">
import { useRouter } from '~/lib/framework';
import { resolveUrlHandlingStrategy, UrlHandlingStrategy } from '~/lib/external-urls';

type QueryParams = Record<string, string | string[]>;

const props = defineProps({
  href: {
    type: String,
    default: '',
  },

  /**
   * @deprecated pass href as for native anchor
   */
  to: {
    type: String,
    default: '',
  },
  /**
   * @deprecated not needed
   */
  languageShort: {
    type: String,
    default: null,
  },
  stopClientSideNavigation: {
    type: Boolean,
    default: false,
  },
  stopPropagation: {
    type: Boolean,
    default: false,
  },
  preserveQueryParams: {
    type: Boolean,
    default: false,
  },
});

const router = useRouter();

const parseQueryParams = (location: URL | Location): QueryParams => {
  const searchParams = new URLSearchParams(location.search);

  const params: QueryParams = {};

  for (const [key, value] of searchParams) {
    const prevValue = params[key];

    if (typeof prevValue === 'undefined') {
      params[key] = value;
    } else if (typeof prevValue === 'string') {
      params[key] = [prevValue, value];
    } else if (Array.isArray(prevValue)) {
      prevValue.push(value);
    }
  }

  return params;
};

const onClick = (event: PointerEvent): void => {
  const anchorEl = event.currentTarget as HTMLAnchorElement;

  const targetBlank = anchorEl.getAttribute('target') === '_blank';
  const middleButtonClicked = event.button === 1;
  const ctrlOrCmdPressed = event.ctrlKey || event.metaKey;
  const shouldOpenInNewTabAnyway = targetBlank || middleButtonClicked || ctrlOrCmdPressed;

  if (props.stopPropagation) event.stopPropagation();

  if (shouldOpenInNewTabAnyway || props.stopClientSideNavigation) {
    return;
  }

  const handlingStrategy = resolveUrlHandlingStrategy({
    toUrl: anchorEl,
    matcher: router,
  });

  if (handlingStrategy === UrlHandlingStrategy.INTERNAL) {
    const queryParams = props.preserveQueryParams ? parseQueryParams(window.location) : null;

    event.preventDefault();
    router.push({ path: anchorEl.pathname, query: { ...queryParams } });
  }
};
</script>
