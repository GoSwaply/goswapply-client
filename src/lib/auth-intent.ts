import Cookies from "js-cookie";

/**
 * Routing for "I want to do X" actions taken before signing in.
 *
 * A visitor who taps Buy Airtime should land on airtime, not on a generic
 * home page. Three cases, and they need different destinations:
 *
 *   signed in        -> straight to the action
 *   has an account   -> sign in, then the action
 *   never been here  -> sign up, then the action
 *
 * Sending a first-time visitor to a login form they cannot complete is the
 * main thing this avoids.
 */

/** Set once a user has successfully registered or signed in on this device. */
const RETURNING_VISITOR_KEY = "swaply_returning_visitor";

export function isSignedIn(): boolean {
  return Boolean(Cookies.get("access_token"));
}

/** True when this device has completed a sign-in or registration before. */
export function isReturningVisitor(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(RETURNING_VISITOR_KEY) === "1";
}

/** Call after any successful login or registration. */
export function markReturningVisitor(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(RETURNING_VISITOR_KEY, "1");
}

/**
 * Only same-origin absolute paths are allowed through as a post-auth
 * destination — an attacker-supplied `next` must not be able to bounce a
 * freshly authenticated user to another site.
 */
export function sanitizeNext(next: string | null | undefined): string | null {
  if (!next) return null;
  if (!next.startsWith("/")) return null;
  // "//evil.com" and "/\evil.com" are protocol-relative URLs, not local paths.
  if (next.startsWith("//") || next.startsWith("/\\")) return null;
  return next;
}

/**
 * Where a visitor should go when they trigger an action that needs an account.
 * The intended destination rides along as `next` so it survives the detour.
 */
export function resolveActionHref(destination: string): string {
  if (isSignedIn()) return destination;

  const encoded = encodeURIComponent(destination);
  return isReturningVisitor()
    ? `/login?next=${encoded}`
    : `/register?next=${encoded}`;
}

/** Post-auth destination, falling back to the dashboard. */
export function postAuthDestination(next: string | null | undefined): string {
  return sanitizeNext(next) ?? "/dashboard";
}
