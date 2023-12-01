# newer versions of Debian
# causes segfault on environments
FROM node:20-bullseye-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
  curl \
  ca-certificates \
  nginx-light \
  && rm -rf /var/lib/apt/lists/* \
  && rm -rf /var/lib/{apt,dpkg,cache,log}/

ARG WITH_NGINX_CACHING_PROXY=0
ENV WITH_NGINX_CACHING_PROXY=$WITH_NGINX_CACHING_PROXY

COPY deploy/caching-proxy/nginx.conf /etc/nginx/nginx.conf
RUN nginx -t
# RUN ln -sf /dev/stdout /var/log/nginx/access.log && ln -sf /dev/stderr /var/log/nginx/error.log

RUN npm install --global "pm2@5.3.0"

COPY package.json package-lock.json /app/

RUN npm ci --no-audit --no-fund \
  && rm -rf ~/.npm ~/.node-gyp /tmp/*

COPY .env /app/
COPY src/ /app/src
COPY nuxt.config.js tailwind.config.js base.tailwind.js /app/

ENV SENTRY_LOG_LEVEL debug

RUN npm run build

COPY . /app/

EXPOSE 3000 8080

ENV NODE_ENV production

CMD [ "npm", "run", "start:cluster" ]
