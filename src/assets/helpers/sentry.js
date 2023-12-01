import { ERROR_MESSAGE } from '../../app.config';

export const report = (options) => {
  const { tag = 'untagged', error = { message: ERROR_MESSAGE }, withScope = Function.prototype } = options || {};
  let { Sentry = null, where = 'unknown', severity = null } = options || {};
  const { message } = error;
  if (process.server) {
    Sentry = process.sentry;
    where = 'server';
  }
  if (process.client) {
    Sentry = window.sentry;
    where = 'client';
  }
  if (!Sentry) {
    return;
  }
  if (!severity) {
    severity = Sentry.Severity.Error;
  }
  Sentry.withScope((scope) => {
    if (typeof withScope === 'function') {
      withScope(scope);
    }
    scope.setExtra('error', error);
    scope.setTag('request-type', tag);
    Sentry.captureMessage(`[${where}][${tag}]: ${message}`, severity);
  });
};
