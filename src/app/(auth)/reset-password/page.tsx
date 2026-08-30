"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { LockIcon } from "@/components/ui/Icons";
import { authAPI } from "@/lib/api";
import { normalizeError, toToastMessage } from "@/lib/errors";
import { clearPendingVerification } from "@/lib/pending-verification";

/** Mirrors the API's MinLength(8) so the user is corrected before a round trip. */
const MIN_LENGTH = 8;

function strengthOf(password: string): { score: number; label: string } {
  let score = 0;
  if (password.length >= MIN_LENGTH) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong", "Strong"];
  return { score, label: labels[score] };
}

function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const strength = useMemo(() => strengthOf(password), [password]);
  const tooShort = password.length > 0 && password.length < MIN_LENGTH;
  const mismatch = confirm.length > 0 && confirm !== password;
  const canSubmit =
    password.length >= MIN_LENGTH && confirm === password && !submitting;

  // A reset link and a half-finished signup should not both be pending.
  useEffect(() => {
    if (done) clearPendingVerification();
  }, [done]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      await authAPI.resetPasswordByToken({ token, newPassword: password });
      setDone(true);
    } catch (error: unknown) {
      const appError = normalizeError(error, {
        isWrite: true,
        resource: "password reset",
      });
      toast.error(toToastMessage(appError));
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <Card className="w-full">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-5">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            This link is incomplete
          </h1>
          <p className="text-muted-foreground mb-6">
            Open the reset link from your email again, or request a new one.
          </p>
          <Link href="/forgot-password">
            <Button className="w-full">Request a new link</Button>
          </Link>
        </div>
      </Card>
    );
  }

  if (done) {
    return (
      <Card className="w-full">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Password updated
          </h1>
          <p className="text-muted-foreground mb-6">
            For your security, you&apos;ve been signed out everywhere else. Sign
            in with your new password to continue.
          </p>
          <Button className="w-full" onClick={() => router.push("/login")}>
            Sign in
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Choose a new password
        </h1>
        <p className="text-muted-foreground">
          Make it something you don&apos;t use anywhere else.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Input
            label="New password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<LockIcon size={20} />}
            error={tooShort ? `Use at least ${MIN_LENGTH} characters` : undefined}
          />
          {password.length > 0 && !tooShort && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${(strength.score / 5) * 100}%`,
                    backgroundColor:
                      strength.score <= 2
                        ? "#DC2626"
                        : strength.score <= 3
                          ? "#E8B430"
                          : "#16A34A",
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-16 text-right">
                {strength.label}
              </span>
            </div>
          )}
        </div>

        <Input
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          placeholder="Type it again"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          leftIcon={<LockIcon size={20} />}
          error={mismatch ? "Passwords do not match" : undefined}
        />

        <Button
          type="submit"
          className="w-full"
          isLoading={submitting}
          disabled={!canSubmit}
        >
          Update password
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Link expired?{" "}
        <Link
          href="/forgot-password"
          className="text-primary hover:underline font-medium"
        >
          Request a new one
        </Link>
      </p>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordInner />
    </Suspense>
  );
}
