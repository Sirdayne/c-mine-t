import { type SpanStatusType } from '@sentry/tracing';

export interface SpanContext {
  op: string;
  description: string;
  tags?: Record<string, unknown>;
  /**
   * Data of the Span.
   */
  data?: Record<string, unknown>;
  status?: SpanStatusType;
}

export interface TracingHeaders {
  'sentry-trace': string;
  baggage: string;
}

export interface Span {
  readonly _opaque: unique symbol;
}

/**
 * Start child span from active span/
 * @param context
 */
export declare function startSpan(context: SpanContext): Span;

/**
 * Merges data to span
 */
export declare function updateSpan(span: Span, overrides: Partial<SpanContext>): void;

/**
 * Marks span as cancelled
 */
export declare function discardSpan(span: Span): void;

/**
 * Finishes span with given overrides
 */
export declare function finishSpan(span: Span | null | undefined, overrides?: Partial<SpanContext>): void;

/**
 * Runs callback with span context
 */
export declare function withSpan<T>(context: SpanContext, callback: (span: Span) => Promise<T>): Promise<T>;

/**
 * Runs callbacks with new Sentry scope,
 * with given span as current
 * @param span
 * @param callback
 */
export declare function withSpanInScope(span: Span | null | undefined, callback: VoidFunction): void;

export declare function getTracingHeaders(): TracingHeaders;
