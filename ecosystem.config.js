require('dotenv/config');

const HEAP_MB_LIMIT_PER_WORKER = process.env.HEAP_MB_LIMIT_PER_WORKER || 400;
const CPU_LIMIT = process.env.CPU_LIMIT || 3;

let instances = parseInt(CPU_LIMIT, 10);

if (Number.isNaN(instances)) {
  instances = -1;
}

/**
 * nginx caching proxy mode - simulates cache on edge (like Cloudflare)
 * @type {boolean}
 */
const nginxCachingProxyEnabled = !!process.env.WITH_NGINX_CACHING_PROXY && process.env.WITH_NGINX_CACHING_PROXY !== '0';

const config = {
  apps: [
    {
      instances,
      name: 'nuxt-prod',
      // automation: false,
      script: 'bin/nuxt-prod.js',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: `${HEAP_MB_LIMIT_PER_WORKER}M`,
      vizion: false,
      autorestart: true,
      wait_ready: true,
      // log_type: 'raw',
      // merge_logs: true,
      env: {
        NODE_ENV: 'production',
        HOST: '0.0.0.0',
        PORT: '3000',
      },
    },
  ],
};

if (nginxCachingProxyEnabled) {
  Object.assign(config.apps[0].env, {
    PORT: '3001',
  });

  config.apps.push({
    instances: 1,
    name: 'nginx',
    script: 'deploy/caching-proxy/start-nginx.sh',
    interpreter: '/bin/sh',
    watch: false,
    vizion: false,
    autorestart: true,
  });
}

module.exports = config;
