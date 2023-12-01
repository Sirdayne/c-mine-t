import '~/assets/polyfills/requestIdleCallback';

const polyfillIntl = async () => {
  const imports = [];

  if (!('formatToParts' in Intl.NumberFormat.prototype)) {
    imports.push(
      import(/* webpackChunkName: "intl-polyfill-format-to-parts" */ '~/assets/polyfills/format-to-parts/index')
    );
  }

  if (!('PluralRules' in Intl)) {
    imports.push(import(/* webpackChunkName: "intl-polyfill-pluralrules" */ 'intl-pluralrules'));
  }

  await Promise.all(imports);
};

// async to wrap throw context
const polyfillElementClosest = async () => {
  if (!Element.prototype.closest) {
    Element.prototype.closest = function (css) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let node = this;
      while (node) {
        if (node.matches(css)) {
          return node;
        }
        node = node.parentElement;
      }
      return null;
    };
  }
};

export default async function polyfillsPlugin() {
  if (!process.client) return;

  await Promise.all([
    polyfillElementClosest(),
    polyfillIntl(),
    import('abortcontroller-polyfill/dist/polyfill-patch-fetch'),
  ]);
}
