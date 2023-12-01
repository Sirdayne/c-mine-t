export enum UrlHandlingStrategy {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
  EXTERNAL_NEW_TAB = 'externalNewTab',
}

export interface URLLike {
  pathname: string;
  origin: string;
}

export interface RouteMatchLike {
  name?: string | null;
}

export interface RouteMatcherLike {
  match(pathname: string): RouteMatchLike;
}

export interface ResolveUrlHandlingStrategyArgs {
  /**
   * url to navigate
   */
  toUrl: URLLike;

  /**
   * referer
   *
   * optional, "window.location" would be used as default
   */
  fromUrl?: URLLike;

  /**
   * internal routing matcher
   *
   * interoperable with vue-router
   */
  matcher: RouteMatcherLike;
}

// TODO: hotfix for static pages. decouple from route name
const isCatchAllMatch = (match: RouteMatchLike): boolean => match.name === 'all' || match.name === 'slug';

const isSameOrInternalOrigin = (toUrl: URLLike, fromUrl: URLLike): boolean =>
  toUrl.origin === fromUrl.origin || toUrl.origin === 'https://cointelegraph.com';

/**
 * Detect strategy for URL h
 */
export const resolveUrlHandlingStrategy = ({
  toUrl,
  fromUrl,
  matcher,
}: ResolveUrlHandlingStrategyArgs): UrlHandlingStrategy => {
  if (!fromUrl) fromUrl = globalThis.location;

  if (!fromUrl) throw new Error('currentUrl should be provided in non-browser environments');

  const matchedRoute = matcher.match(toUrl.pathname);

  if (!isSameOrInternalOrigin(toUrl, fromUrl)) return UrlHandlingStrategy.EXTERNAL_NEW_TAB;

  if (isCatchAllMatch(matchedRoute)) return UrlHandlingStrategy.EXTERNAL;

  return UrlHandlingStrategy.INTERNAL;
};
