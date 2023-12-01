# refactoring-plan

Large TODO list of things that we should refactor in near future

### Generic stuff

- [ ] Define site configuration entity
  - Attributes:
    - Locale
    - Domain/host
    - User fingerprint
    - Feature flags
    - User-agent
    - Cookies settings
  - Should be built on SSR and transferred to client by "useState"
  - Can be accessed everywhere in application layer
- [ ] Create composable for pretty date/time formatting with current locale
- [ ] Auto-provide locale to GraphQL requests
- [ ] Define reactive viewport entity
  - Sync with Vuex

### Ads and banners

- [ ] Join all promo buttons to single configurable component
- [ ] Define generic component for banners that renders absolutely anything - HTML, img+link or native widgets - just by given configuration
- [ ] Abstract from Dashboard banners and Adbutler
- [ ] Move rotation logic to GraphQL backend. Frontend should just render consumed setup of advertisement
- [ ] Setup dynamic keywords for better targeting
- [ ] Fix naming. App code should be like `<AdSlot place="..." priority="..." index="..." />`
- [ ] Create banner mixer, so it can be applied on main page

### Images and optimization of them

- [ ] Build component that always loads renders optimized version of image
- [ ] Apply this component everywhere with strict width & height

### Sentry & tracing

- [ ] Get rid of shitty Nuxt plugin and shitty helpers like _report(...)_
- [ ] All errors should be enriched with useful payload for debugging
- [ ] Setup tracing with SSR
- [ ] Handled errors should be rethrown in global scope with lower severity. Unhandled errors that break app should be marked critical

### Routing & linking

- [ ] Define component that handles any URLs, internal, external, legacy, etc
- [ ] Apply it everywhere. Should be just one component that handles all linking stuff

### i18n and l10n

- [ ] Create "lib" that handles all stuff related to i18n - date/time format, RTL, etc
- [ ] Setup queue of translation keys, so each page would request only that messages, that it needs with deduplication

### Tickers and price indexes

- [ ] Rewrite all price indexes pages from scratch
- [ ] Replace amstock lib with another solution for charts
- [ ] Refactor tickers in headers
- [ ] All data should be consumed from GraphQL

### News

- [ ] Move all business logic to GraphQL backend. GraphQL should return much simpler structure of articles. Frontend should just render it as-is without crazy "if/else"
- [ ] Rewrite article page from scratch
- [ ] Sanitize article HTML. drop script tags
- [ ] Refactor and abstract code that enriches article with embeds and widgets. It should be well-structured and documented
- [ ] Make sure news rendered very fast
- [ ] Abstract article render from news page, so it can be reused on mobile platform (for example mobile app)
