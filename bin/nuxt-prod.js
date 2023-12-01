/**
 * Nuxt.js production server with cluster support
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { loadNuxt } = require('nuxt');

async function main() {
  const nuxt = await loadNuxt('start');
  const listener = await nuxt.listen();

  console.log(`> Nuxt listening on ${listener.url}`);

  /**
   * Report that application is listening
   * when started as PM2 cluster instance
   */
  process.send?.('ready');
}

main();
