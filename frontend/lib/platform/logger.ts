/**
 * logger.ts — Structured JSON logger (P14-T318..T360).
 * Emits one JSON object per line on server. PII-free by contract: callers pass
 * only primitives and already-redacted context. Never logs request bodies,
 * tokens, or Authorization headers.
 */

import type { LogEvent, LogLevel } from "./platform-types";

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const MIN_LEVEL: LogLevel =
  (process.env.LOG_LEVEL as LogLevel | undefined) ?? "info";

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[MIN_LEVEL];
}

function emit(event: LogEvent): void {
  if (!shouldLog(event.level)) return;
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    level: event.level,
    msg: event.message,
    ...event.context,
    ...(event.traceId ? { traceId: event.traceId } : {}),
  });
  // eslint-disable-next-line no-console
  if (event.level === "error") console.error(line);
  else if (event.level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  debug: (message: string, context?: LogEvent["context"], traceId?: string) =>
    emit({ level: "debug", message, context, traceId }),
  info: (message: string, context?: LogEvent["context"], traceId?: string) =>
    emit({ level: "info", message, context, traceId }),
  warn: (message: string, context?: LogEvent["context"], traceId?: string) =>
    emit({ level: "warn", message, context, traceId }),
  error: (message: string, context?: LogEvent["context"], traceId?: string) =>
    emit({ level: "error", message, context, traceId }),
};
