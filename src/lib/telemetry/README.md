# telemetry

Application telemetry:

- tracing (WIP)
- errors
- analytics (TBD)

based on Sentry:

- https://docs.sentry.io/product/sentry-basics/tracing/

## Usage

1. do not use Sentry SDK directly in client code
2. always capture error before finishing span
3. propagate tracing headers to APIs using "getTracingHeaders"

## Limitations

## Transaction name

Using "route.name" for transaction name

This strategy used both on SSR & CSR

To distinguish SSR & CSR transactions check "op"

CSR op is "pageload" or "navigation" (client side navigation)

SSR op is "http.server"

Examples:

- "index" for "/index.vue"
- "news-slug" for "/news/\_slug.vue"

## Node.js domains and AsyncLocalStorage

Sentry developers promised to add AsyncLocalStorage in SDK 8

So current implementation in helper code is temporary

### Fetch and XHR

Sentry creates Fetch and XHR spans from current scopes span

So there is helper "createFetchWithSpan" that returns "fetch" function wrapped with scoped span

## How it works

1. On server start Nuxt module inits Node.js Sentry SDK and installs middlewares
2. On each request Sentry middlewares creates new transaction with op "http.server"
3. Nuxt plugin on server renames transaction to route name
4. After app rendered, another hook from this module propagates tracing headers to `<meta>` tags
5. Then browser tabs starts handling SSRed HTML
6. during Nuxt app initialization client plugin starts Sentry's Vue SDK
7. SDK automatically reads `<meta>` tags with propagated traceparent to create distributed trace
8. On both page load and navigation, new transaction created

## TODO:

- [ ] cover ticker-api & artisan
- [ ] better adbutler coverage
  - "http.client" op on fetch
  - time spent on adblock detection
- [ ] Logging infrastructure
- [ ] error boundary component
- [ ] better wrappers for client code
  - `withTelemetry<T>(context: SpanContext, callback: (span: Span) => T): T`
- [ ] instrument Node.js
  - CPU and memory profile
  - time spent on Vue rendering
- [ ] instrument Nuxt
  - check out https://github.com/danielroe/nuxt-timings-module
  - "asyncData" tracing
- [ ] push source maps to Sentry
- [ ] sentry bundle size
- [ ] research OpenTelemetry
  - maybe switch to OTEL SDK and their collectors
  - is it okay for error tracking?
- [ ] integrate analytics
  - chartbeat
  - GTM & google analytics
  - refine current analytics
