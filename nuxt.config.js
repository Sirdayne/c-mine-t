import 'cross-fetch/polyfill';
import console from 'consola';
import path from 'node:path';
import serveStatic from 'serve-static';
import { ContextReplacementPlugin } from 'webpack';
import { INTL_TAG_BY_LANGUAGE_SHORT } from './src/app.config';

process.env.SENTRY_ENVIRONMENT = process.env.ENV_SLUG || process.env.SENTRY_ENVIRONMENT;

const serveStaticHtmls = serveStatic(path.resolve(__dirname, './static/htmls'), {
  extensions: ['html', 'html'],
  maxAge: '1 hour',
});

const isProduction = process.env.NODE_ENV === 'production';
const deBoogieMode = process.env.DEBUG === 'true';
const trackingScriptsDisabled = process.env.TRACKING_SCRIPTS_DISABLED === '1';

if (deBoogieMode) console.log('!!! DEBUG MODE !!!\n');

/**
 * @type {import('@nuxt/types').NuxtConfig}
 */
export default {
  telemetry: false,
  dev: !isProduction,
  srcDir: path.resolve(__dirname, './src'),
  // disable auto-restart nuxt on changes out of bundler
  watch: [],

  dir: {
    static: path.resolve(__dirname, './static'),
  },

  render: {
    asyncScripts: true,
    resourceHints: false,
  },

  router: {
    prefetchLinks: false,
    middleware: ['redirect'],

    extendRoutes(routes, resolve) {
      const categorySlugRoute = routes.find((route) => route.name === 'category-slug');

      if (categorySlugRoute) {
        Object.assign(categorySlugRoute, {
          components: {
            default: categorySlugRoute.component,
            flashNews: resolve(__dirname, 'src/components/RouterViews/Category/FlashNews.vue'),
          },
          chunkNames: {
            flashNews: 'components/RouterViews/Category/flashNews',
          },
        });
      }
    },
  },

  build: {
    babel: {
      compact: true,
    },
    cssSourceMap: !isProduction || deBoogieMode,
    optimizeCSS: true,
    aggressiveCodeRemoval: true,
    transpile: ['@vueuse/shared', '@vueuse/core', '@urql/core', '@swc/helpers', '@urql/vue', 'date-fns'],

    loaders: {
      vue: {
        hotReload: false,
        compilerOptions: {
          whitespace: 'condense',
        },
      },
      scss: {
        sassOptions: {
          verbose: false,
          logger: {
            warn() {},
          },
        },
      },
    },

    postcss: {
      plugins: {
        'tailwindcss/nesting': 'postcss-nesting',
        tailwindcss: {},
        autoprefixer: {},
      },
    },

    extend(config, { isDev, isClient }) {
      config.output.hashFunction = 'sha512';

      if (isDev && isClient) {
        config.devtool = 'inline-source-map';
      }

      Object.assign(config.resolve.alias, {
        lodash: 'lodash-es',
        'date-fns': 'date-fns/esm',
        '@vueuse/core': '@vueuse/core/index.mjs',
        '@vueuse/shared': '@vueuse/shared/index.mjs',
      });

      config.module.rules.push({
        test: /\.graphql$/,
        loader: 'graphql-tag/loader',
        exclude: /node_modules/,
      });

      config.plugins.push(
        new ContextReplacementPlugin(
          /intl-relative-time-format[/\\]locale-data$/,
          new RegExp(
            Object.values(INTL_TAG_BY_LANGUAGE_SHORT)
              .map((item) => `${item}.js`)
              .join('|')
          )
        )
      );

      const svgRule = config.module.rules.find((rule) => rule.test.test('.svg'));
      svgRule.test = /\.(png|jpe?g|gif|webp)$/;
      config.module.rules.push({
        test: /\.svg$/,
        use: [
          'babel-loader',
          {
            loader: 'vue-svg-loader',
            options: {
              svgo: {
                plugins: [{ removeViewBox: false }],
              },
            },
          },
        ],
      });
    },
  },

  buildModules: ['@nuxtjs/composition-api/module', './src/modules/nuxt-swc', '@nuxtjs/tailwindcss'],

  modules: [
    [
      '@nuxtjs/dotenv',
      {
        path: path.resolve(__dirname),
      },
    ],

    '~/lib/telemetry/sentry/nuxt-module.js',

    [
      'cookie-universal-nuxt',
      {
        parseJSON: false,
      },
    ],
  ],

  plugins: [
    {
      src: '~/plugins/polyfills.both.js',
    },
    {
      src: '~/graphql/nuxt-plugin.ts',
    },
    {
      src: '~/init-plugin.ts',
    },
    {
      src: '~/plugins/scroll-restoration.client.js',
      mode: 'client',
    },
    {
      src: '~/plugins/chartbeat.client.js',
    },
    {
      src: '~/plugins/link-hash.client.js',
      mode: 'client',
    },
    {
      src: '~/plugins/vue-plugins.client.js',
      mode: 'client',
    },
  ],

  serverMiddleware: [
    {
      path: '/',
      handler: serveStaticHtmls,
    },
    {
      path: '/',
      handler: '~/serverMiddleware/detect-is-mobile.js',
    },
    {
      path: '/',
      handler: '~/serverMiddleware/detect-language-short.js',
    },
    {
      path: '/healthcheck',
      handler: '~/serverMiddleware/healthcheck.js',
    },
  ],

  vue: {
    config: {
      productionTip: true,
      devtools: !isProduction,
      silent: isProduction,
      performance: !isProduction,
    },
  },

  loading: '~/components/Shared/TheLoading.vue',

  css: [
    {
      src: '~/assets/styles/global.scss',
      lang: 'scss',
    },
  ],

  publicRuntimeConfig() {
    return {
      trackingScriptsDisabled,
      graphqlUrl:
        process.env.GRAPHQL_URL ||
        process.env.GATEWAY_URL ||
        process.env.DUKE_URL ||
        'https://conpletus.cointelegraph.com/v1/',
      adbutlerProxyUrl: process.env.ADBUTLER_PROXY_URL || process.env.BANNERS_URL,
      adbutlerUrl: 'https://servedbyadbutler.com/adserve',
      artisanUrl: process.env.ARTISAN_URL,
    };
  },

  privateRuntimeConfig() {
    return {
      serverGraphqlUrl: process.env.GRAPHQL_SSR_URL || process.env.DUKE_DOCKER_URL,
    };
  },
};
