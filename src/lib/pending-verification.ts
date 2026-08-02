/**
 * Remembers which address is awaiting verification.
 *
 * Signup is interrupted by design — the user leaves for their inbox and may not
 * come back in the same tab, or the same hour. Persisting the address means the
 * "check your inbox" screen can be restored instead of stranding them on a
 * login form that will keep rejecting them.
 */

const KEY = "swaply_pending_verification";

interface PendingVerification {
  email: string;
  /** Epoch ms of the last send, used to drive the resend cooldown. */
  lastSentAt: number;
}

export function setPendingVerification(email: string): void {
  if (typeof window === "undefined") return;
  const payload: PendingVerification = { email, lastSentAt: Date.now() };
  localStorage.setItem(KEY, JSON.stringify(payload));
}

export function getPendingVerification(): PendingVerification | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingVerification;
    return parsed?.email ? parsed : null;
  } catch {
    return null;
  }
}

/** Called once the address is confirmed, so the prompt stops reappearing. */
export function clearPendingVerification(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function markVerificationSent(email: string): void {
  setPendingVerification(email);
}

/**
 * Seconds still to wait before another send is allowed.
 *
 * The API limits these to 5 per 15 minutes, so a client-side cooldown keeps
 * users from burning that allowance and hitting an opaque 429.
 */
export function resendCooldownRemaining(cooldownSeconds = 60): number {
  const pending = getPendingVerification();
  if (!pending) return 0;
  const elapsed = (Date.now() - pending.lastSentAt) / 1000;
  return Math.max(0, Math.ceil(cooldownSeconds - elapsed));
}
