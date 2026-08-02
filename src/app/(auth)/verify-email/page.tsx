"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { MailCheck, RefreshCw } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { authAPI } from "@/lib/api";
import { normalizeError, toToastMessage } from "@/lib/errors";
import {
  clearPendingVerification,
  getPendingVerification,
  markVerificationSent,
  resendCooldownRemaining,
} from "@/lib/pending-verification";

const COOLDOWN_SECONDS = 60;

/**
 * The waiting room between signing up and confirming an address.
 *
 * Signup is deliberately interrupted here — the user leaves for their inbox.
 * This page exists so returning lands them somewhere that explains the state
 * and offers a way forward, rather than on a login form that keeps rejecting
 * them with no explanation.
 */
function VerifyEmailInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);

  // Prefer the address in the URL; fall back to whatever signup stored, so a
  // cold open in a new tab still works.
  useEffect(() => {
    const fromQuery = searchParams.get("email");
    const stored = getPendingVerification();
    const resolved = fromQuery || stored?.email || "";
    setEmail(resolved);
    if (!resolved) {
      // Nothing to verify — send them somewhere useful.
      router.replace("/login");
      return;
    }
    setCooldown(resendCooldownRemaining(COOLDOWN_SECONDS));
  }, [searchParams, router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = useCallback(async () => {
    if (!email || cooldown > 0 || sending) return;
    setSending(true);
    try {
      await authAPI.resendOtp({ email });
      markVerificationSent(email);
      setCooldown(COOLDOWN_SECONDS);
      toast.success("Sent. Check your inbox.");
    } catch (error: unknown) {
      const appError = normalizeError(error, { resource: "verification email" });
      // A 429 here means the server-side limit was reached; hold the button
      // for longer rather than letting them hammer it.
      if (appError.kind === "rateLimit") setCooldown(COOLDOWN_SECONDS * 5);
      toast.error(toToastMessage(appError));
    } finally {
      setSending(false);
    }
  }, [email, cooldown, sending]);

  const maskedEmail = email.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) =>
    `${a}${"•".repeat(Math.min(b.length, 6))}${c}`
  );

  return (
    <Card className="w-full">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
          <MailCheck className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Check your inbox
        </h1>
        <p className="text-muted-foreground">
          We sent a verification link to
        </p>
        <p className="text-foreground font-semibold mt-1 break-all">
          {maskedEmail}
        </p>
      </div>

      <div className="glass rounded-xl p-4 mb-6">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Open the email and tap <strong className="text-foreground">Verify my email</strong>.
          You can close this page — the link works from any device. It expires in 24 hours.
        </p>
      </div>

      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleResend}
          isLoading={sending}
          disabled={cooldown > 0 || sending}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend email"}
        </Button>

        <Button className="w-full" onClick={() => router.push("/login")}>
          I&apos;ve verified — sign in
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Nothing arrived? Check spam, or{" "}
        <Link
          href="/register"
          onClick={clearPendingVerification}
          className="text-primary hover:underline font-medium"
        >
          use a different address
        </Link>
        .
      </p>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <VerifyEmailInner />
    </Suspense>
  );
}
