FROM mcr.microsoft.com/playwright:v1.26.0-focal

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Bundle app source
COPY tests ./tests
COPY playwright.config.ts ./

RUN npm install && \
    npm install -D @playwright/test && \
    npx playwright install-deps
