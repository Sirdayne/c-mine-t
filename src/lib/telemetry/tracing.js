import { getCurrentHub, withScope } from '@sentry/core';
import { dynamicSamplingContextToSentryBaggageHeader } from '@sentry/utils';

const SENTRY_SPAN_KEY = Symbol('sentry span');

const getCurrentSentrySpan = () => getCurrentHub()?.getScope()?.getSpan();

/**
 * @returns {import('@sentry/tracing').Span|undefined}
 */
const unwrap = (span) => span?.[SENTRY_SPAN_KEY];

export const startSpan = (context) => {
  const sentrySpan = getCurrentSentrySpan()?.startChild(context);

  return { [SENTRY_SPAN_KEY]: sentrySpan };
};

export const updateSpan = (span, context) => {
  const _span = unwrap(span);

  if (!_span) return;

  const originalContext = _span.toContext();

  _span.updateWithContext({
    ...originalContext,
    tags: {
      ...originalContext.tags,
      ...context?.tags,
    },
    data: {
      ...originalContext.data,
      ...context?.data,
    },
  });
};

export const discardSpan = (span) =>
  updateSpan(span, {
    status: 'cancelled',
  });

export const finishSpan = (span, context) => {
  if (!span) return;

  updateSpan(span, context);
  unwrap(span)?.finish();
};

export const withSpan = async (context, callback) => {
  const span = startSpan(context);

  try {
    const result = await callback(span);
    finishSpan(span, {
      status: 'ok',
    });

    return result;
  } catch (error) {
    finishSpan(span, {
      status: 'internal_error',
    });

    throw error;
  }
};

export const withSpanInScope = (span, callback) => {
  withScope((scope) => {
    const sentrySpan = unwrap(span);
    if (sentrySpan) scope.setSpan(sentrySpan);
    callback();
  });
};

export const getTracingHeaders = () => {
  const span = getCurrentSentrySpan();

  let baggage = '';
  let traceparent = '';

  if (span) {
    baggage = dynamicSamplingContextToSentryBaggageHeader(span.getDynamicSamplingContext());
    traceparent = span.toTraceparent();
  }

  return {
    baggage,
    'sentry-trace': traceparent,
  };
};
