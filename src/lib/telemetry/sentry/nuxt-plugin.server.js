import { getCurrentHub, configureScope } from '@sentry/core';
import { defineNuxtPlugin } from '~/lib/framework';
import { finishSpan, startSpan } from '~/lib/telemetry';

/**
 * @returns sentry client options for transfer to client
 */
const getSharedSentryOptions = () => {
  const clientOptions = getCurrentHub().getClient()?.getOptions();
  const sharedOptions = {};

  for (const key of ['dsn', 'release', 'environment', 'tracesSampleRate']) {
    const value = clientOptions?.[key];

    if (typeof value !== 'undefined') sharedOptions[key] = value;
  }

  return sharedOptions;
};

export default defineNuxtPlugin(({ store, route, beforeNuxtRender, beforeSerialize }) => {
  let span;

  beforeNuxtRender(() => {
    span = startSpan({
      op: 'nuxt.ssr-render',
      description: 'Nuxt SSR render',
    });
  });

  beforeSerialize((nuxtState) => {
    configureScope((scope) => {
      const transaction = scope.getTransaction();
      const routeName = route.name || route.matched[0]?.name || 'vue-router-miss';

      if (transaction) transaction.name = routeName;

      scope.setTransactionName(routeName);

      scope.setSDKProcessingMetadata({
        handledByNuxt: true,
      });

      scope.setTags({
        language_short: store.state.currentLanguage.short,
        route_path: route.path,
        route_name: routeName,
      });
    });

    finishSpan(span);

    nuxtState['sentryOptions'] = getSharedSentryOptions();
  });
});
