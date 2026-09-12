"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { MailCheck, ArrowLeft } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { EmailIcon } from "@/components/ui/Icons";
import { authAPI } from "@/lib/api";
import { normalizeError, toToastMessage } from "@/lib/errors";

/**
 * Step one of recovery: ask where to send the link.
 *
 * The confirmation is shown for any well-formed address, matching the API's
 * deliberately neutral response. Saying "no account with that email" would
 * turn this form into a way to enumerate customers.
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Enter the email address on your account");
      return;
    }

    setSending(true);
    try {
      await authAPI.requestPasswordReset({ email: email.trim() });
      setSent(true);
    } catch (error: unknown) {
      const appError = normalizeError(error, { resource: "reset email" });
      // A 429 is the throttle doing its job, not a bad address.
      toast.error(toToastMessage(appError));
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <Card className="w-full">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <MailCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Check your inbox
          </h1>
          <p className="text-muted-foreground mb-6">
            If an account exists for{" "}
            <span className="text-foreground font-medium break-all">
              {email.trim()}
            </span>
            , we&apos;ve sent a link to reset your password. It expires in one
            hour.
          </p>

          <div className="glass rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nothing yet? Check your spam folder. You can request another link
              in a few minutes.
            </p>
          </div>

          <Link href="/login">
            <Button variant="outline" className="w-full">
              Back to sign in
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Forgot your password?
        </h1>
        <p className="text-muted-foreground">
          Enter your email and we&apos;ll send you a link to set a new one.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email Address"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<EmailIcon size={20} />}
        />
        <Button type="submit" className="w-full" isLoading={sending}>
          Send reset link
        </Button>
      </form>

      <Link
        href="/login"
        className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to sign in
      </Link>
    </Card>
  );
}
