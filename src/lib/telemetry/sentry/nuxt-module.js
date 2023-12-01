import * as path from 'node:path';
import { DefinePlugin } from 'webpack';
import { NuxtSentryNodeHelper } from './nuxt-sentry-node-helper';
import consola from 'consola';

/**
 * Based on NPM "@nuxtjs/sentry"
 *
 * check out {@link https://github.com/nuxt-community/sentry-module}
 *
 * @type {import('@nuxt/types').Module}
 */
const sentryNuxtModule = async function () {
  const helper = new NuxtSentryNodeHelper();

  this.nuxt.hook('render:setupMiddleware', helper.setupMiddlewareHook);
  this.nuxt.hook('render:errorMiddleware', helper.errorMiddlewareHook);

  const initHook = this.options._build ? 'build:compile' : 'ready';
  this.nuxt.hook(initHook, helper.initHook);
  this.nuxt.hook('vue-renderer:ssr:templateParams', helper.templateParamsHook);
  this.nuxt.hook('close', helper.closeHook);

  const appendWebpackPlugin = (config, plugin) => {
    if (!config.plugins) config.plugins = [];

    config.plugins.push(plugin);
  };

  let definePluginInstalled = false;
  this.nuxt.hook('build:before', () => {
    if (definePluginInstalled) return;

    appendWebpackPlugin(
      this.options.build,
      new DefinePlugin({
        __SENTRY_DEBUG__: 'false',
      })
    );

    definePluginInstalled = true;
  });

  this.nuxt.hook('webpack:config', async (webpackConfigs) => {
    const authToken = process.env.SENTRY_AUTH_TOKEN;

    if (!authToken) return;

    consola.info('Sentry detected auth token, source maps being uploaded');

    const SentryWebpackPlugin = await import('@sentry/webpack-plugin').then((m) => m.default || m);
    const { buildDir } = this.options;
    let lastConfig;

    for (const config of webpackConfigs) {
      config.devtool = 'hidden-source-map';
      lastConfig = config;
    }

    if (lastConfig && authToken) {
      appendWebpackPlugin(
        lastConfig,
        new SentryWebpackPlugin({
          authToken,
          deploy: {
            env: process.env.SENTRY_ENVIRONMENT,
          },
          include: [`${buildDir}/dist/server`, `${buildDir}/dist/client`],
          ignore: ['node_modules', '.nuxt/dist/client/img'],
        })
      );
    }
  });

  this.nuxt.moduleContainer.addPlugin({
    src: path.resolve(__dirname, './nuxt-plugin.server.js'),
    mode: 'server',
    fileName: 'sentry.server.js',
  });

  this.nuxt.moduleContainer.addPlugin({
    src: path.resolve(__dirname, './nuxt-plugin.client.js'),
    mode: 'client',
    fileName: 'sentry.client.js',
  });

  for (const sentryPkg of ['core', 'vue', 'browser', 'integrations', 'tracing', 'utils']) {
    const _s = `@sentry/${sentryPkg}`;
    this.options.alias[_s] = `${_s}/esm`;
  }
};

export default sentryNuxtModule;
