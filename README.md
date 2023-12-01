# Duke, ex Herzog; aka "cointelegraph.com"

Crazy names given by ex developers of this monster

Server-side rendered "cointelegraph.com" website, based on Vue components

### Stack:

- Vue 2.7
- Nuxt 2 with "@nuxtjs/composition-api"
  - TypeScript in strict mode
  - SCSS with modules
  - Bundled by Webpack and SWC
- [GraphQL with Urql](./docs/graphql.md)
- Sentry by _@nuxtjs/sentry_
- [Histoire as Storybook replacement](https://histoire.dev/)
- Prettier and ESLint with pre-commit hook
- Playwright for E2E tests
- Jest for unit tests

### Deploy

1. Check out required Node.js and NPM version in "engines" section of [package.json](./package.json)
2. Fill ".env" (check out [example](./.env.example))
3. `npm ci`
4. Run app:
   - dev server by `npm run dev`
   - otherwise `npm run build` then `npm run start` or `npm run start:cluster` for PM2 clustering (requires "pm2" in "PATH")

Also, you can use Docker with [Dockerfile](./Dockerfile)

### Simulating cache on environments

[Check out caching proxy doc](./deploy/caching-proxy/README.md)

### Setup and Run Playwright autotests

- Playwright installation:

  1. Pull Duke project
  2. `cd tests/e2e`
  3. `npm i -D @playwright/test`
  4. `npx playwright install`

- Run tests:

`ENV='production' npx playwright test -g "\[en\]" --project='chromium'`

1. `ENV` - environment (production, qa, stage)
2. `-g` - search by title ("\[en\]" - run all test for EN version only)
3. `--project` - browser option (‘chromium’ or 'Mobile Chrome')

- Run tests on localhost:

1. `URL='duke.local' npx playwright test -g "post audio file link" --project='chromium'`
2. `URL` - any custom domain can be passed here

- Run only Smoke tests:

1. `npx playwright test --grep 'smoke' --project="Chromium"` - for Desktop
2. `npx playwright test --grep 'smoke' --project="Mobile Chrome"` - for Mobile
