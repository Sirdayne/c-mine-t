/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  root: true,
  env: {
    node: false,
    browser: true,
    es2022: true,
  },
  extends: ['eslint:recommended', 'plugin:vue/recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  globals: {
    process: true,
    window: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  rules: {
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
    'vue/no-v-html': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/order-in-components': [
      'warn',
      {
        order: [
          'el',
          'name',
          'key',
          'parent',
          'functional',
          ['delimiters', 'comments'],
          ['components', 'directives', 'filters'],
          'extends',
          'mixins',
          ['provide', 'inject'],
          'ROUTER_GUARDS',
          'layout',
          'middleware',
          'validate',
          'scrollToTop',
          'transition',
          'loading',
          'inheritAttrs',
          'model',
          ['props', 'propsData'],
          'emits',
          'setup',
          'asyncData',
          'data',
          'fetch',
          'computed',
          'watch',
          'watchQuery',
          'LIFECYCLE_HOOKS',
          'methods',
          ['template', 'render'],
          'renderError',
          'head',
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        indent: 'off',
      },
    },
    {
      files: ['store/*.js'],
      rules: {
        'no-shadow': 'off',
      },
    },
    {
      files: [
        'src/serverMiddleware/**/*',
        'webpack/**/*',
        '*.config.js',
        '*.config.cjs',
        '.eslintrc.js',
        'src/lib/telemetry/**/*',
        'src/assets/libs/base64.js',
        'bin/*',
      ],
      env: {
        node: true,
        browser: false,
      },
    },
    {
      files: ['src/**/*.stories.js', 'src/**/*.stories.ts'],
      extends: ['plugin:storybook/recommended'],
    },
  ],
};
