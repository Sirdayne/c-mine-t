import Vue from 'vue';
import { init as vueInit, vueRouterInstrumentation } from '@sentry/vue';
import { BrowserTracing } from '@sentry/tracing';
import { configureScope } from '@sentry/core';
import { defineNuxtPlugin } from '~/lib/framework';
import { globalEventProcessor } from '~/lib/telemetry/sentry/global-event-processor';

export default defineNuxtPlugin(({ store, app, nuxtState }) => {
  const { router } = app;
  const { sentryOptions } = nuxtState;
  nuxtState[sentryOptions] = null;

  vueInit({
    Vue,
    ...nuxtState['sentryOptions'],
    initialScope: {
      tags: {
        platform: 'browser',
        language_short: store.state.currentLanguage.short,
      },
    },
    logErrors: true,
    trackComponents: false,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: vueRouterInstrumentation(router),
        // traces should be propagated manually
        tracePropagationTargets: [],
      }),
    ],
  });

  configureScope((scope) => {
    scope.addEventProcessor(globalEventProcessor);
  });
});
