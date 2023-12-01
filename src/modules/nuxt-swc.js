/**
 * only with this targets SWC transforms to code,
 * that can be parsed by webpack
 */
const targets = {
  server: { node: 10 },
  client: {
    edge: 17,
    firefox: 56,
    chrome: 33,
    safari: 10,
    opera: 67,
    ios: 10,
    samsung: 7,
  },
  modern: {
    ie: 11,
    safari: 10,
  },
};

/**
 * @param {boolean} typescript TS or JS loader
 * @param {"client"|"server"|"modern"} configName "config.name" from nuxt's webpack config
 * @param {any} nuxt "this.nuxt" from module context
 * @returns {import("webpack").RuleSetLoader} webpack "use"
 *
 * @see JSON schema {@link https://json.schemastore.org/swcrc}
 */
const buildSwcLoader = ({ typescript, nuxt, configName }) => {
  /** @type {import("@swc/core").Config}} */
  const swcLoaderOptions = {
    minify: false, // nuxt.options.build.optimization?.minimize ?? (!nuxt.options.dev && configName !== 'server'),
    env: {
      mode: 'usage',
      targets: targets[configName],
    },
    jsc: {
      externalHelpers: true,
      loose: false,
      keepClassNames: !nuxt.options.dev,
      parser: typescript
        ? {
            syntax: 'typescript',
            dynamicImport: true,
            tsx: true,
            importAssertions: true,
          }
        : {
            syntax: 'ecmascript',
            dynamicImport: true,
            jsx: true,
            privateMethod: true,
            functionBind: true,
            classPrivateProperty: true,
            exportDefaultFrom: true,
            exportNamespaceFrom: true,
            importMeta: true,
          },
    },
    module: {
      type: 'es6',
      strict: true,
      strictMode: false,
      lazy: true,
      ignoreDynamic: true,
      preserveImportMeta: true,
    },
  };

  return {
    // eslint-disable-next-line no-undef
    loader: require.resolve('swc-loader'),
    options: swcLoaderOptions,
  };
};

/**
 * Replaces "babel" webpack loader with "swc"
 *
 * Should be installed as latest module
 *
 * Should be deleted after migration to Nuxt 3 or Bridge with Vite,
 * because Vite much faster with ESBuild
 *
 * @type {import("@nuxt/types").Module}
 *
 * @see SWC docs {@link https://swc.rs/}
 */
const nuxtSwcModule = function () {
  const { nuxt } = this;
  nuxt.options.extensions.push('ts', 'tsx');
  nuxt.options.build.additionalExtensions = ['ts', 'tsx'];

  nuxt.hook('webpack:config', (configs) => {
    for (const config of configs) {
      const configName = config.name;

      const vueRules = [];
      const jsRules = [];
      const otherRules = [];

      for (const rule of config.module.rules) {
        if ('.js'.match(rule.test)) {
          jsRules.push(rule);

          // compile node_modules using babel,
          // because SWC cant detect source type automatically
          Object.assign(rule, {
            type: 'javascript/auto',
            include: /node_modules/,
          });
        } else if ('.vue'.match(rule.test)) {
          vueRules.push(rule);
        } else {
          otherRules.push(rule);
        }
      }

      config.resolve?.extensions?.push('.ts', '.tsx');
      config.module.rules = [
        ...vueRules,
        {
          test: /\.[cm]?jsx?$/i,
          type: 'javascript/auto',
          // swc fails on node_modules
          exclude: /node_modules/,
          use: buildSwcLoader({ nuxt, configName, typescript: false }),
        },
        {
          test: /\.[cm]?tsx?$/i,
          type: 'javascript/auto',
          use: buildSwcLoader({ nuxt, configName, typescript: true }),
        },
        ...jsRules,
        ...otherRules,
      ];
    }
  });
};

export default nuxtSwcModule;
