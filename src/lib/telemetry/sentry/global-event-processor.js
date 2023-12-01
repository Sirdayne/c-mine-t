const TAGS = Symbol('sentry tags');
const DO_NOT_REPORT_FLAG = Symbol('do not report');

export const markDoNotReport = (error) => {
  error[DO_NOT_REPORT_FLAG] = true;
};

export const setTags = (error, tags) => {
  error[TAGS] = { ...error[TAGS], ...tags };
};

const isAbortion = (error) => error?.code === globalThis.DOMException?.ABORT_ERR;

const hasDoNotReportMark = (error) => error?.[DO_NOT_REPORT_FLAG] === true;

const shouldSkip = (error) => isAbortion(error) || hasDoNotReportMark(error);

/**
 * @type {import('@sentry/types').EventProcessor}
 */
export const globalEventProcessor = (event, hint) => {
  // do not report aborted requests
  if (shouldSkip(hint.originalException) || shouldSkip(hint.syntheticException)) return null;

  const tags = hint.originalException?.[TAGS];

  // add tags from error to event
  Object.assign(event.tags, tags);

  return event;
};
