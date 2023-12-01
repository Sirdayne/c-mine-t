import { nextTick } from 'vue';

const CHARTBEAT_ASYNC_CONFIG_KEY = '_sf_async_config';

class ChartbeatClient {
  initConfig() {
    if (globalThis[CHARTBEAT_ASYNC_CONFIG_KEY]) return;

    globalThis[CHARTBEAT_ASYNC_CONFIG_KEY] = {
      domain: 'cointelegraph.com',
      uid: 66060,
      flickerControl: false,
      useCanonical: true,
      useCanonicalDomain: true,
    };
  }

  /**
   * Send page view
   *
   * @param {string} title
   * @param {string} authors
   * @param {string} sections
   * @param {string} path
   * @return {Promise<void>}
   */
  async sendPageView({ title = '', authors = '', sections = '', path = '' } = {}) {
    await nextTick();

    const event = {
      sections,
      authors,
      path: path || this._getPageUrl(),
      title: title || this._getPageTitle(),
    };

    const installed = typeof globalThis.pSUPERFLY?.virtualPage === 'function';

    let mode;

    if (installed) {
      mode = 'virtualPage';
      globalThis.pSUPERFLY.virtualPage({
        sections,
        authors,
      });
    } else {
      mode = 'asyncConfig';
      this._updateAsyncConfig(event);
    }
  }

  _updateAsyncConfig(config) {
    this.initConfig();

    Object.assign(globalThis[CHARTBEAT_ASYNC_CONFIG_KEY], {
      ...config,
    });
  }

  _getPageTitle() {
    return globalThis.document?.title || '';
  }

  _getPageUrl() {
    return globalThis.location?.href || '';
  }
}

class NoopChartbeatClient {
  initConfig() {}

  async sendPageView() {}
}

export default function (ctx, inject) {
  const clientCtor = ctx.$config.trackingScriptsDisabled ? NoopChartbeatClient : ChartbeatClient;
  const chartbeatClient = new clientCtor();

  chartbeatClient.initConfig();

  inject('chartBeat', chartbeatClient);
}
