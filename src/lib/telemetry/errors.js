import { captureException as sentryCaptureError } from '@sentry/core';
import { markDoNotReport } from './sentry/global-event-processor';

const isObject = (value) => typeof value === 'object' && value !== null;

export const doNoReport = (error) => {
  if (isObject(error)) markDoNotReport(error);
};

export const createErrorWithExtra = (message, extra) => {
  return Object.assign(new Error(message), extra);
};

export const captureError = (error, extra) => {
  if (isObject(error)) Object.assign(error, extra);

  sentryCaptureError(error);
};

export { setTags } from './sentry/global-event-processor';
