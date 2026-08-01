import axios from "axios";

/**
 * Central error handling for the app.
 *
 * Three rules this exists to enforce, in order of how much money they save:
 *
 * 1. An empty result is NOT an error. "No transactions" and "we could not load
 *    your transactions" are different states and must never share a code path.
 *    Callers get `isEmpty` semantics from their own data, never from here.
 *
 * 2. A write that we cannot prove failed must NEVER be reported as failed.
 *    If a payment request times out or 5xxs, the debit may well have gone
 *    through. Telling the user "payment failed" invites them to retry and pay
 *    twice. Those cases return `outcomeUnknown: true` and copy that tells them
 *    to check history before retrying.
 *
 * 3. Server internals never reach the user. 5xx bodies are replaced wholesale;
 *    only deliberate 4xx messages (validation, business rules) pass through.
 */

export type ErrorKind =
  | "offline"      // no network at all
  | "timeout"      // request sent, no response in time
  | "auth"         // 401 — session gone
  | "forbidden"    // 403 — authenticated but not allowed
  | "notFound"     // 404
  | "validation"   // 400/422 — user input
  | "conflict"     // 409 — duplicate/already-processed
  | "rateLimit"    // 429
  | "server"       // 5xx
  | "unknown";

export interface AppError {
  kind: ErrorKind;
  /** Short heading, safe to render. */
  title: string;
  /** Actionable sentence, safe to render. Never contains server internals. */
  message: string;
  /** Whether offering a "Try again" affordance makes sense. */
  retryable: boolean;
  /**
   * True when a state-changing request may have succeeded despite the error.
   * The UI must not claim failure — tell the user to check before retrying.
   */
  outcomeUnknown: boolean;
  /** Support reference from the API's X-Correlation-Id. Show it on 5xx. */
  correlationId?: string;
  /** Per-field messages from class-validator, when the API supplied them. */
  fieldErrors?: Record<string, string>;
  /** Original HTTP status, for logging. Never render this raw. */
  status?: number;
}

/** 5xx bodies can contain stack traces and query fragments — never shown. */
const GENERIC_SERVER_MESSAGE =
  "Something went wrong on our end. Your account has not been affected.";

interface ApiErrorBody {
  message?: string | string[];
  error?: string;
  correlationId?: string;
  statusCode?: number;
}

/**
 * class-validator returns `message` as a string[] like
 * ["amount must not be less than 100"]. Map them to field names where we can.
 */
function extractFieldErrors(
  message: string | string[] | undefined,
): Record<string, string> | undefined {
  if (!Array.isArray(message) || message.length === 0) return undefined;

  const fields: Record<string, string> = {};
  for (const entry of message) {
    if (typeof entry !== "string") continue;
    const field = entry.trim().split(/\s+/)[0];
    // Only treat it as a field error if it looks like `field must ...`
    if (field && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(field) && !fields[field]) {
      fields[field] = entry.charAt(0).toUpperCase() + entry.slice(1);
    }
  }
  return Object.keys(fields).length > 0 ? fields : undefined;
}

function firstMessage(message: string | string[] | undefined): string | undefined {
  if (typeof message === "string" && message.trim()) return message.trim();
  if (Array.isArray(message)) {
    const first = message.find((m) => typeof m === "string" && m.trim());
    if (first) return first.trim();
  }
  return undefined;
}

/**
 * Normalize anything thrown by an API call into a renderable AppError.
 *
 * @param error     the caught value
 * @param options.isWrite  true for state-changing calls (payments, transfers).
 *                         Controls whether ambiguous failures are reported as
 *                         "unknown outcome" rather than "failed".
 * @param options.resource human-readable noun for fallback copy, e.g. "transactions"
 */
export function normalizeError(
  error: unknown,
  options: { isWrite?: boolean; resource?: string } = {},
): AppError {
  const { isWrite = false, resource } = options;
  const subject = resource ? `your ${resource}` : "this request";

  if (!axios.isAxiosError(error)) {
    return {
      kind: "unknown",
      title: "Something went wrong",
      message: `We could not complete ${subject}. Please try again.`,
      retryable: true,
      outcomeUnknown: isWrite,
    };
  }

  // No response at all — request never completed, or never left the device.
  if (!error.response) {
    const timedOut = error.code === "ECONNABORTED" || error.code === "ETIMEDOUT";

    if (timedOut) {
      return {
        kind: "timeout",
        title: "This is taking longer than expected",
        message: isWrite
          ? "We did not get a response in time, so we cannot confirm whether this went through. Check your transaction history before trying again."
          : `We could not load ${subject} in time. Please try again.`,
        retryable: true,
        // A timed-out write may still be processing server-side.
        outcomeUnknown: isWrite,
      };
    }

    return {
      kind: "offline",
      title: "You appear to be offline",
      message: isWrite
        ? "We could not reach Swaply, so this may not have been submitted. Check your connection, then check your transaction history before trying again."
        : "Check your internet connection and try again.",
      retryable: true,
      // The request may have reached the server before the connection dropped.
      outcomeUnknown: isWrite,
    };
  }

  const status = error.response.status;
  const body = (error.response.data ?? {}) as ApiErrorBody;
  const correlationId = body.correlationId;
  const serverMessage = firstMessage(body.message);

  switch (true) {
    case status === 401:
      return {
        kind: "auth",
        title: "Your session has expired",
        message: "Please sign in again to continue.",
        retryable: false,
        outcomeUnknown: false,
        correlationId,
        status,
      };

    case status === 403:
      return {
        kind: "forbidden",
        title: "You do not have access to this",
        message:
          serverMessage ??
          "Your account is not permitted to perform this action. Contact support if you believe this is a mistake.",
        retryable: false,
        outcomeUnknown: false,
        correlationId,
        status,
      };

    case status === 404:
      return {
        kind: "notFound",
        title: "Not available",
        message: `We could not find ${subject}. If this keeps happening, please contact support.`,
        retryable: false,
        outcomeUnknown: false,
        correlationId,
        status,
      };

    case status === 409:
      return {
        kind: "conflict",
        title: "Already processed",
        message:
          serverMessage ??
          "This request has already been handled. Check your transaction history rather than trying again.",
        retryable: false,
        // A 409 usually means the original DID succeed.
        outcomeUnknown: false,
        correlationId,
        status,
      };

    case status === 400 || status === 422:
      return {
        kind: "validation",
        title: "Check your details",
        // 4xx validation copy is written for users, so it is safe to surface.
        message: serverMessage ?? "Some of the information provided is not valid.",
        retryable: false,
        outcomeUnknown: false,
        fieldErrors: extractFieldErrors(body.message),
        correlationId,
        status,
      };

    case status === 429:
      return {
        kind: "rateLimit",
        title: "Too many attempts",
        message:
          "For your security we have paused this temporarily. Please wait a few minutes and try again.",
        retryable: true,
        outcomeUnknown: false,
        correlationId,
        status,
      };

    case status >= 500:
      return {
        kind: "server",
        title: "We are having trouble",
        message: isWrite
          ? "We could not confirm whether this went through. Check your transaction history before trying again."
          : GENERIC_SERVER_MESSAGE,
        retryable: true,
        // The write may have been committed before the response failed.
        outcomeUnknown: isWrite,
        correlationId,
        status,
      };

    default:
      return {
        kind: "unknown",
        title: "Something went wrong",
        message: `We could not complete ${subject}. Please try again.`,
        retryable: true,
        outcomeUnknown: isWrite,
        correlationId,
        status,
      };
  }
}

/**
 * One-line string for toasts. Appends the support reference on server faults,
 * which is what turns "it's broken" into a ticket we can actually trace.
 */
export function toToastMessage(error: AppError): string {
  if (error.kind === "server" && error.correlationId) {
    return `${error.message} (ref: ${error.correlationId.slice(0, 8)})`;
  }
  return error.message;
}
