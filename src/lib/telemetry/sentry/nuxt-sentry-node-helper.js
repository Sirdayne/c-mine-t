// injects tracing methods to global sentry hub
import '@sentry/tracing';
import { AsyncLocalStorage } from 'async_hooks';
import consola from 'consola';
import { addGlobalEventProcessor, getHubFromCarrier, getMainCarrier, Hub } from '@sentry/core';
import { init as nodeInit, close as nodeClose, Handlers } from '@sentry/node';
import { getTracingHeaders } from '../tracing';
import { globalEventProcessor } from './global-event-processor';

export class NuxtSentryNodeHelper {
  /**
   * @type {AsyncLocalStorage<import("@sentry/core").Hub>}
   * @private
   */
  _hubAls = new AsyncLocalStorage();

  _rootCarrier = getMainCarrier();
  _rootHub = getHubFromCarrier(this._rootCarrier);

  /**
   * Install patch to make "getCurrentHub" bound to ALS
   */
  _installPatch() {
    Object.defineProperty(this._rootCarrier.__SENTRY__, 'hub', {
      enumerable: true,
      configurable: false,
      get: () => this._hubAls.getStore() || this._rootHub,
    });
  }

  setupMiddlewareHook = (app) => {
    /** @type {import('@nuxt/types').ServerMiddleware} */
    const middleware = (req, res, next) => {
      const hub = new Hub(this._rootHub.getClient());
      const requestHandler = Handlers.requestHandler({
        include: {
          ip: true,
          request: true,
          user: true,
        },
      });
      const tracingHandler = Handlers.tracingHandler();

      res.setHeader('Timing-Allow-Origin', '*');

      this._hubAls.run(hub, () => {
        requestHandler(req, res, (error) => {
          if (error) return next(error);

          tracingHandler(req, res, (error) => {
            if (error) return next(error);

            next();
          });
        });
      });
    };

    return app.use(middleware);
  };

  errorMiddlewareHook = (app) => {
    return app.use(Handlers.errorHandler());
  };

  initHook = () => {
    if (globalThis['_sentry_nuxt_initialized']) return;

    nodeInit({
      initialScope: {
        tags: {
          platform: 'node',
        },
      },
      tracesSampleRate: 0,
      beforeSendTransaction(event) {
        if (event.sdkProcessingMetadata.handledByNuxt !== true) return null;

        return event;
      },
    });

    addGlobalEventProcessor(globalEventProcessor);

    this._installPatch();
    globalThis['_sentry_nuxt_initialized'] = true;

    if (process.env.SENTRY_DSN) {
      consola.info('Sentry Node.js SDK initialized');
    } else {
      consola.info('Sentry disabled because no DSN');
    }
  };

  closeHook = async () => {
    await nodeClose(2000);
  };

  templateParamsHook = (templateParams) => {
    const headers = getTracingHeaders();

    for (const header of ['sentry-trace', 'baggage']) {
      const content = headers[header];

      if (content) {
        templateParams.HEAD += `<meta name="${header}" content="${content}" />`;
      }
    }
  };
}
