<template>
  <div
    id="tv-medium-widget"
    ref="container"
    class="tradingview-widget-container"
  />
</template>

<script>
/* eslint-disable */
const WIDGET_OPTIONS = {
  container_id: 'tv-medium-widget',
  symbols: [
    ['BTC', 'HITBTC:BTCUSDT|12m'],
    ['ETH', 'HITBTC:ETHUSDT|12m'],
    ['XRP', 'HITBTC:XRPUSDT|12m'],
    ['BCH', 'HITBTC:BCHUSDT|12m'],
    ['LTC', 'HITBTC:LTCUSDT|12m'],
  ],
  greyText: 'Quotes by',
  gridLineColor: '#e9e9ea',
  fontColor: '#83888D',
  underLineColor: '#dbeffb',
  trendLineColor: '#4bafe9',
  width: '100%',
  height: '360',
  locale: 'en',
};

export default {
  name: 'TradingViewWidget',
  mounted() {
    this.addTradingView();
    this.$nextTick(() => {
      this.initWidget();
    });
  },
  methods: {
    addTradingView() {
      const TradingView = {
        host:
          window.location.host.match(/tradingview\.com|pyrrosinvestment\.com/i) == null
            ? 'https://s.tradingview.com'
            : 'https://www.tradingview.com',
        ideasHost: 'https://www.tradingview.com',
        chatHost: 'https://www.tradingview.com',
        embedStylesForFullHeight(height, hasCopyright, container_id) {
          const containerHeight = hasCopyright ? `calc(${height} - 32px)` : height;
          const containerElemChild = document.querySelector(`#${container_id}`);
          const containerElem = containerElemChild.parentElement;
          containerElem.style.height = containerHeight;
          containerElemChild.style.height = '100%';
        },
        gId() {
          return `tradingview_${(((1 + Math.random()) * 1048576) | 0).toString(16).substring(1)}`;
        },
        isPersentHeight(suffix) {
          return suffix === '%';
        },
        getSuffix(value) {
          const match = value.toString().match(/(\%|px|em|ex)/);
          return match ? match[0] : 'px';
        },
        hasCopyright(container_id) {
          const widgetContainerElement = document.getElementById(container_id);
          const embedContainerElement = widgetContainerElement && widgetContainerElement.parentElement;
          if (embedContainerElement) {
            return !!embedContainerElement.querySelector('.tradingview-widget-copyright');
          }
          return false;
        },
        calculateWidgetHeight(widgetHeight, container_id) {
          const newWidgetHeight = parseInt(widgetHeight);
          const suffix = this.getSuffix(widgetHeight);
          const isPersentHeight = this.isPersentHeight(suffix);
          const hasCopyright = container_id && this.hasCopyright(container_id);
          if (isPersentHeight && container_id) {
            this.embedStylesForFullHeight(newWidgetHeight + suffix, hasCopyright, container_id);
            if (hasCopyright) {
              return 100 + suffix;
            }
          }
          if (hasCopyright) {
            return `calc(${newWidgetHeight}${suffix} - 32px)`;
          }
          return newWidgetHeight + suffix;
        },
        css(css_content) {
          const head = document.getElementsByTagName('head')[0];
          const style = document.createElement('style');
          let rules;
          style.type = 'text/css';
          if (style.styleSheet) {
            style.styleSheet.cssText = css_content;
          } else {
            rules = document.createTextNode(css_content);
            style.appendChild(rules);
          }
          head.appendChild(style);
        },
        isArray(obj) {
          return Object.prototype.toString.call(obj) === '[object Array]';
        },
        isMobileDevice: (function () {
          const ret = {
            Android: /Android/i.test(navigator.userAgent),
            BlackBerry: /BlackBerry/i.test(navigator.userAgent),
            iOS: /iPhone|iPad|iPod/i.test(navigator.userAgent),
            Opera: /Opera Mini/i.test(navigator.userAgent),
          };
          ret.any = ret.Android || ret.BlackBerry || ret.iOS || ret.Opera;
          return ret;
        })(),
        generateUtmForUrlParams(options) {
          return `utm_source=${encodeURI(window.location.hostname)}&utm_medium=${
            TradingView.hasCopyright(options.container) ? 'widget_new' : 'widget'
          }${options.type ? `&utm_campaign=${options.type}` : ''}${
            options.type && options.type === 'chart' ? `&utm_term=${encodeURIComponent(options.symbol)}` : ''
          }`;
        },
        WidgetAbstract() {},
        MediumWidget(options) {
          this.id = TradingView.gId();
          const widgetHeight = TradingView.calculateWidgetHeight(options.height || 400, options.container_id);
          this.options = {
            container: options.container_id || '',
            width: TradingView.WidgetAbstract.prototype.fixSize(options.width) || '',
            height: TradingView.WidgetAbstract.prototype.fixSize(widgetHeight) || '',
            symbols: options.symbols,
            greyText: options.greyText || '',
            symbols_description: options.symbols_description || '',
            large_chart_url: options.large_chart_url || '',
            customer: options.customer || '',
            gridLineColor: options.gridLineColor || '',
            fontColor: options.fontColor || '',
            underLineColor: options.underLineColor || '',
            trendLineColor: options.trendLineColor || '',
            timeAxisBackgroundColor: options.timeAxisBackgroundColor || '',
            chartOnly: !!options.chartOnly,
            locale: options.locale,
            whitelabel: !!options.whitelabel || '',
            colorTheme: options.colorTheme,
            isTransparent: options.isTransparent,
          };
          this.createWidget();
        },
      };
      TradingView.DependenciesManager = function () {};
      TradingView.DependenciesManager.prototype.scripts = {};
      TradingView.DependenciesManager.prototype._loaded = function (script) {
        for (const i in this.scripts[script].callbacks) {
          this.scripts[script].callbacks[i]();
        }
        this.scripts[script].status = true;
        this.scripts[script].callbacks = {};
      };
      TradingView.DependenciesManager.prototype.depends = function (scripts, cbid, cb) {
        for (let i = 0; i < scripts.length; i++) {
          if (this.scripts[scripts[i]] && this.scripts[scripts[i]].status === true) {
            cb();
          } else if (this.scripts[scripts[i]] && this.scripts[scripts[i]].status === false) {
            this.scripts[scripts[i]].callbacks[cbid] = cb;
          } else {
            this.scripts[scripts[i]] = {
              status: false,
              script: document.createElement('script'),
              callbacks: {},
            };
            this.scripts[scripts[i]].callbacks[cbid] = cb;
            this.scripts[scripts[i]].script.onload = this._loaded.bind(this, scripts[i]);
            this.scripts[scripts[i]].script.src = TradingView.host + scripts[i];
            document.body.appendChild(this.scripts[scripts[i]].script);
          }
        }
      };
      TradingView.т = new TradingView.DependenciesManager();
      TradingView.WidgetAbstract.prototype = {
        fixSize(size) {
          return /^[0-9]+(\.|,[0-9])*$/.test(size) ? `${size}px` : size;
        },
        width() {
          if (this.options.autosize) {
            return '100%';
          }
          return TradingView.WidgetAbstract.prototype.fixSize(this.options.width);
        },
        height() {
          if (this.options.autosize) {
            return '100%';
          }
          return TradingView.WidgetAbstract.prototype.fixSize(this.options.height);
        },
        addWrapperFrame(widgetCode, logoCode, widgetBgColor) {
          const height = TradingView.WidgetAbstract.prototype.height.call(this);
          const width = TradingView.WidgetAbstract.prototype.width.call(this);
          widgetBgColor = widgetBgColor || 'transparent';
          return (
            `<div id="${this.id}-wrapper" style="` +
            'position: relative;' +
            'box-sizing: content-box;' +
            `width: ${width};` +
            `height: ${height};` +
            'margin: 0 auto !important;' +
            'padding: 0 !important;' +
            'font-family:Arial,sans-serif;' +
            '">' +
            '<div style="' +
            `width: ${width};` +
            `height: ${height};` +
            `background: ${widgetBgColor};` +
            'padding: 0 !important;' +
            `">${widgetCode}</div>${logoCode || ''}</div>`
          );
        },
        addFooterLogo(widgetCode, options) {
          const greyText = (options || {}).greyText || 'powered by';
          const linkText = (options || {}).linkText || 'tradingview.com';
          const href = (options || {}).href || 'https://www.tradingview.com/';
          return TradingView.WidgetAbstract.prototype.addWrapperFrame.call(
            this,
            widgetCode,
            `${
              '<div style="' +
              'position:absolute;' +
              'display: block;' +
              'box-sizing: content-box;' +
              'height: 24px;' +
              'width: '
            }${TradingView.WidgetAbstract.prototype.width.call(this)};` +
              'bottom: 0;' +
              'left: 0;' +
              'margin: 0;' +
              'padding: 0;' +
              'font-family: Arial,sans-serif;' +
              '">' +
              '<div style="' +
              'display: block;' +
              'margin: 0 1px 1px 1px;' +
              'line-height: 7px;' +
              'box-sizing: content-box;' +
              'height: 11px;' +
              'padding: 6px 10px;' +
              'text-align: right;' +
              'background: #fff;' +
              '">' +
              '<a' +
              ` href="${href}?${TradingView.generateUtmForUrlParams(this.options)}"` +
              ' target="_blank"' +
              ' style="' +
              'color: #0099d4;' +
              'text-decoration: none;' +
              'font-size: 11px;' +
              '"' +
              '>' +
              '<span style="' +
              'color: #b4b4b4;' +
              'font-size: 11px;' +
              `">${greyText}</span> ${linkText}</a>` +
              '</div>' +
              '</div>',
            '#fff'
          );
        },
      };
      TradingView.MediumWidget.prototype = {
        createWidget() {
          const widget_code = this.widgetCode();
          addWidget(widget_code, this.options.container);
        },
        widgetCode() {
          let symbols_description = '';
          const symbols = `symbols=${prepareSymbols(this.options.symbols)}`;
          const width = `&width=${encodeURIComponent(this.options.width)}`;
          const height = `&height=${encodeURIComponent(this.options.height)}`;
          const colorTheme = `&colorTheme=${encodeURIComponent(this.options.colorTheme)}`;
          this.options.type = 'symbol-overview';
          const utm = `&${TradingView.generateUtmForUrlParams(this.options)}`;

          function prepareSymbols(symbols) {
            const _symbols = [];
            for (let i = 0; i < symbols.length; i++) {
              const _s = symbols[i];
              if (TradingView.isArray(_s)) {
                const customSymbolName = encodeURIComponent(_s[0]);
                const trueSymbolName = encodeURIComponent(_s[1]);
                _symbols.push(customSymbolName);
                if (_s.length === 2) {
                  symbols_description += `&${customSymbolName}=${trueSymbolName}`;
                }
              } else if (typeof _s === 'string') {
                _symbols.push(encodeURIComponent(_s));
              }
            }
            return _symbols.join(',');
          }

          const plain_params_list = [
            'gridLineColor',
            'fontColor',
            'underLineColor',
            'trendLineColor',
            'activeTickerBackgroundColor',
            'timeAxisBackgroundColor',
            'locale',
          ];
          let plain_params = '';
          for (let i = plain_params_list.length - 1; i >= 0; i--) {
            const param_name = plain_params_list[i];
            const param_value = this.options[param_name];
            plain_params += param_value ? `&${param_name}=${encodeURIComponent(param_value)}` : '';
          }
          const chart_only = this.options.chartOnly ? '&chartOnly=1' : '';
          const whitelabel = this.options.whitelabel ? '&whitelabel=1' : '';
          const isTransparent = this.options.isTransparent ? '&isTransparent=1' : '';
          let site_path = '/mediumwidgetembed/';
          if (this.options.customer) {
            site_path = `/${this.options.customer}${site_path}`;
          }
          const widget_url = `${
            TradingView.host + site_path
          }?${symbols}${symbols_description}${plain_params}${chart_only}${whitelabel}${width}${height}${colorTheme}${isTransparent}${utm}`;
          return (
            `<iframe id="${this.id}"` +
            ` src="${widget_url}"` +
            ' style="' +
            'margin: 0 !important; ' +
            `padding: 0 !important; ${this.options.width ? `width: ${this.options.width}; ` : ''}${
              this.options.height ? `height: ${this.options.height};` : ''
            }"` +
            ' frameborder="0" allowTransparency="true" scrolling="no"></iframe>'
          );
        },
        remove() {
          const widget = document.getElementById('tradingview_widget');
          widget.parentNode.removeChild(widget);
        },
      };
      TradingView.postMessageWrapper = (function () {
        const get_handlers = {};
        const on_handlers = {};
        const client_targets = {};
        let on_target;
        let call_id = 0;
        let post_id = 0;
        const provider_id = 'TradingView';
        if (window.addEventListener) {
          window.addEventListener('message', (e) => {
            let msg;
            try {
              msg = JSON.parse(e.data);
            } catch (error) {
              return;
            }
            if (!msg || !msg.provider || msg.provider !== provider_id) {
              return;
            }
            msg.source = e.source;
            if (msg.type === 'get') {
              if (!on_handlers[msg.name]) {
                return;
              }
              on_handlers[msg.name].forEach((on_handler) => {
                if (typeof on_handler === 'function') {
                  on_handler.call(msg, msg.data, (result) => {
                    const reply = {
                      id: msg.id,
                      type: 'on',
                      name: msg.name,
                      client_id: msg.client_id,
                      data: result,
                      provider: provider_id,
                    };
                    on_target.postMessage(JSON.stringify(reply), '*');
                  });
                }
              });
            } else if (msg.type === 'on') {
              if (get_handlers[msg.client_id] && get_handlers[msg.client_id][msg.id]) {
                get_handlers[msg.client_id][msg.id].call(msg, msg.data);
                delete get_handlers[msg.client_id][msg.id];
              }
            } else if (msg.type === 'post') {
              if (!on_handlers[msg.name]) {
                return;
              }
              on_handlers[msg.name].forEach((on_handler) => {
                if (typeof on_handler === 'function') {
                  on_handler.call(msg, msg.data, () => {});
                }
              });
            }
          });
        }
        return function (target, client_id) {
          get_handlers[client_id] = {};
          client_targets[client_id] = target;
          on_target = target;
          return {
            on(name, callback, keepPrevious) {
              if (!on_handlers[name] || !keepPrevious) {
                on_handlers[name] = [];
              }
              on_handlers[name].push(callback);
            },
            off(name, callback) {
              if (!on_handlers[name]) {
                return false;
              }
              const index = on_handlers[name].indexOf(callback);
              if (index > -1) {
                on_handlers[name].splice(index, 1);
              }
            },
            get(name, data, callback) {
              const msg = {
                id: call_id++,
                type: 'get',
                name,
                client_id,
                data,
                provider: provider_id,
              };
              get_handlers[client_id][msg.id] = callback;
              client_targets[client_id].postMessage(JSON.stringify(msg), '*');
            },
            post(target, name, data) {
              const msg = {
                id: post_id++,
                type: 'post',
                name,
                data,
                provider: provider_id,
              };
              if (target && typeof target.postMessage === 'function') {
                target.postMessage(JSON.stringify(msg), '*');
              }
            },
          };
        };
      })();
      TradingView.getUrlParams = function () {
        const pl = /\+/g;
        const search = /([^&=]+)=?([^&]*)/g;
        const query = window.location.search.substring(1);
        let match = search.exec(query);
        const decode = function (s) {
          return decodeURIComponent(s.replace(pl, ' '));
        };
        const result = {};
        while (match) {
          result[decode(match[1])] = decode(match[2]);
          match = search.exec(query);
        }
        return result;
      };
      TradingView.createUrlParams = function (data) {
        const result = [];
        for (const d in data) {
          if (data.hasOwnProperty(d) && data[d] != null) {
            result.push(`${encodeURIComponent(d)}=${encodeURIComponent(data[d])}`);
          }
        }
        return result.join('&');
      };
      const addWidget = function (widgetHtml, containerId) {
        const container = document.getElementById(containerId);
        if (container) {
          container.innerHTML = widgetHtml;
          const copyrightElement =
            container.parentElement && container.parentElement.querySelector('.tradingview-widget-copyright');
          if (copyrightElement) {
            copyrightElement.style.width = container.querySelector('iframe').style.width;
          }
        } else {
          document.write(widgetHtml);
        }
      };
      const merge = function (obj1, obj2) {
        for (const i in obj2) {
          if (typeof obj2[i] !== 'object' || !obj1.hasOwnProperty(i)) {
            obj1[i] = obj2[i];
          } else {
            merge(obj1[i], obj2[i]);
          }
        }
        return obj1;
      };
      if (this.TradingView) {
        merge(this.TradingView, TradingView);
      } else {
        this.TradingView = TradingView;
      }
    },
    initWidget() {
      if (!this.$refs.container) {
        return;
      }
      new this.TradingView.MediumWidget(WIDGET_OPTIONS);
    },
    getWidgetStyles() {
      const COLORS = {};
      COLORS['color-brand'] = '#2196f3';
      COLORS['color-gull-gray'] = '#9db2bd';
      COLORS['color-scooter'] = '#38acdb';
      COLORS['color-curious-blue'] = '#299dcd';
      const style = {
        type: 'text/css',
        hid: 'trading-view-css',
      };
      style.cssText = `.tradingview-widget-copyright {font-size: 13px !important; line-height: 32px !important; text-align: center !important; vertical-align: middle !important; font-family: 'Trebuchet MS', Arial, sans-serif !important; color: ${COLORS['color-gull-gray']} !important;} .tradingview-widget-copyright .blue-text {color: ${COLORS['color-brand']} !important;} .tradingview-widget-copyright a {text-decoration: none !important; color: ${COLORS['color-gull-gray']} !important;} .tradingview-widget-copyright a:visited {color: ${COLORS['color-gull-gray']} !important;} .tradingview-widget-copyright a:hover .blue-text {color: ${COLORS['color-scooter']} !important;} .tradingview-widget-copyright a:active .blue-text {color: ${COLORS['color-curious-blue']} !important;} .tradingview-widget-copyright a:visited .blue-text {color: ${COLORS['color-brand']} !important;}`;
      return style;
    },
  },
  head() {
    return {
      style: [this.getWidgetStyles()],
    };
  },
};
</script>

<style lang="scss">
.tradingview-widget-container {
  position: relative;
  border-bottom: 1px solid #dde1e6;
  z-index: 1;
}
.tradingview-widget-container:not(:first-child)::before {
  content: '';
  display: block;
  height: 2px;
  background-color: #eceff1;
}
.tradingview-widget-container iframe {
  display: block;
}
</style>
