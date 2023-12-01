const path = require('path');

module.exports = {
  stories: ['../src/lib/**/*.stories.@(js|ts)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: '@storybook/vue',
  staticDirs: ['../static', '../src/assets/'],
  webpackFinal: async (config, { configType }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '~': path.resolve(__dirname, '../src'),
    };

    let rule = config.module.rules.find(
      (r) =>
        // it can be another rule with file loader
        // we should get only svg related
        r.test &&
        r.test.toString().includes('svg') &&
        // file-loader might be resolved to js file path so "endsWith" is not reliable enough
        r.loader &&
        r.loader.includes('file-loader')
    );
    rule.test = /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)(\?.*)?$/;

    config.module.rules.push({
      test: /\.svg$/,
      use: ['babel-loader', 'vue-svg-loader'],
    });
    return config;
  },
};
