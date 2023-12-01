import { DEFAULT_LANGUAGE } from '../app.config';

/**
 * Express.js hostname parser impl
 *
 * @param {import('http').IncommingMessage} req
 * @returns {string|undefined}
 *
 * @see {@link https://github.com/expressjs/express/blob/2c47827053233e707536019a15499ccf5496dc9d/lib/request.js#L427 Express impl}
 */
function extractHostname(req) {
  let host = req.headers['x-forwarded-host'];

  if (!host) {
    host = req.headers['host'];
  } else if (host.includes(',')) {
    // Note: X-Forwarded-Host is normally only ever a
    //       single value, but this is to be safe.
    host = host.substring(0, host.indexOf(',')).trimEnd();
  }

  if (!host) return undefined;

  // IPv6 literal support
  const offset = host[0] === '[' ? host.indexOf(']') + 1 : 0;

  const index = host.indexOf(':', offset);

  return index !== -1 ? host.substring(0, index) : host;
}

export default function acceptLanguageMiddleware(req, res, next) {
  const hostname = extractHostname(req) || '';
  const matches = hostname.match(/^(\w\w)\./);

  req.languageShort = matches?.[1]?.toLowerCase() || DEFAULT_LANGUAGE.short;

  next();
}
