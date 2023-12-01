[![Quality Gate Status](https://sonar.ctgroup.io/api/project_badges/measure?project=duke&metric=alert_status)](https://sonar.ctgroup.io/dashboard?id=duke)

# Duke, the future of Herzog

## Getting started

Node.js version >= 16 and NPM >= 8

## Dev setup

```bash
# install dependencies
$ npm i

# copy or update `.env` file
$ cp .env.example .env

# launch app
$ npm run dev

# At your own risk: in some cases might be usefull pachage.json >> scripts >>
"dev": "export NODE_TLS_REJECT_UNAUTHORIZED=0;nuxt dev",
```

## Build setup

```bash
# build for production and launch server
$ npm i
$ npm run build
$ npm start:cluster
```

## Build production locally

```bash
NODE_ENV=production ENV_SLUG=stage npm run build && NODE_ENV=production ENV_SLUG=stage npm start
```

## Environment variables

check .env.example

## Attention

Make sure that files and dirs inside `~/static` will NOT conflict with files inside
CTMAIN `/public`

## nginx configuration

e.g. for testing regional subdomains

```
server {
    listen 80;

    server_name ~^(www\.)?(?<domain>(\w\w\.)?duke\.local\.cointelegraph\.com)$;

    return 301 https://$domain$request_uri;
}

server {
    listen 443;

    # or clone server block for every subdomain
    server_name ~^(www\.)?(?<domain>(\w\w\.)?duke\.local\.cointelegraph\.com)$;

    # if you want certificates - just ask @al4str
    # ssl on;
    # ssl_certificate /etc/nginx/ssl/.local.cointelegraph.com.crt;
    # ssl_certificate_key /etc/nginx/ssl/.local.cointelegraph.com.key;
    # ssl_protocols TLSv1 TLSv1.1 TLSv1.2;

    location / {
      # or add your host ip
      proxy_pass http://host.docker.internal:3000;
      # or $server_name
      proxy_set_header Host $domain;
      # for user ip address
      proxy_set_header X-Real-IP $remote_addr;
    }
}
```

then update `/etc/hosts`

```
127.0.0.1 duke.local.cointelegraph.com
127.0.0.1 ar.duke.local.cointelegraph.com
127.0.0.1 es.duke.local.cointelegraph.com
127.0.0.1 it.duke.local.cointelegraph.com
127.0.0.1 br.duke.local.cointelegraph.com
127.0.0.1 de.duke.local.cointelegraph.com
127.0.0.1 jp.duke.local.cointelegraph.com
127.0.0.1 rs.duke.local.cointelegraph.com
127.0.0.1 cn.duke.local.cointelegraph.com
127.0.0.1 kr.duke.local.cointelegraph.com
```

## To edit vault envs

```
env EDITOR=nano ansible-vault edit --vault-password-file ~/.vaultpass vault/ENV_SLUG.vault
```

## NPM scripts

- `dev` and `start` - Nuxt dev and prod

- `test:load`

  Load test using [K6](https://k6.io) for homepage on localhost:3000

  Test report located in _tests/k6/reports/_

- `start:cluster`

  Start production Nuxt server using [PM2](https://pm2.keymetrics.io/) in cluster mode

## Playwright tests

```bash
# Go to playwright test folder
$ cd tests/e2e

# Install dependencies
$ npm install

# Install supported browsers
$ npx playwright install

# Run tests
$ npx playwright test
```
